const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
const urlSet = new Set(urls);
const errors = [];
const inbound = new Map(urls.map((url) => [url, new Set()]));

const toFile = (url) => {
  const pathname = new URL(url).pathname;
  return pathname === '/'
    ? path.join(root, 'index.html')
    : path.join(root, pathname.replace(/^\//, ''), 'index.html');
};

if (!/^User-agent:\s*\*$/mi.test(robots)) errors.push('robots.txt has no wildcard user-agent group');
if (!/^Allow:\s*\/$/mi.test(robots)) errors.push('robots.txt does not explicitly allow the public site');
if (/^Disallow:\s*\S+/mi.test(robots)) errors.push('robots.txt contains a non-empty Disallow rule');
if (!robots.includes('Sitemap: https://toolviking.com/sitemap.xml')) errors.push('robots.txt does not declare the canonical sitemap');
if (urlSet.size !== urls.length) errors.push('sitemap contains duplicate URLs');

for (const url of urls) {
  const file = toFile(url);
  if (!fs.existsSync(file)) {
    errors.push(`${url}: sitemap URL has no local index.html`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  const canonical = (html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i) || [])[1] || '';
  const robotsMeta = (html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i) || [])[1] || '';
  if (canonical !== url) errors.push(`${url}: canonical is ${canonical || 'missing'}`);
  if (/noindex/i.test(robotsMeta)) errors.push(`${url}: contains noindex`);

  for (const match of html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)) {
    const href = match[1];
    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('/downloads/')) continue;
    let target;
    try { target = new URL(href, url); } catch { continue; }
    if (target.origin !== 'https://toolviking.com') continue;
    target.hash = '';
    target.search = '';
    const targetUrl = target.href;
    if (urlSet.has(targetUrl) && targetUrl !== url) inbound.get(targetUrl).add(url);
    if (!urlSet.has(targetUrl) && !target.pathname.startsWith('/downloads/')) errors.push(`${url}: internal page link is not a canonical sitemap URL: ${href}`);
  }
}

for (const url of urls) {
  if (url === 'https://toolviking.com/') continue;
  if ((inbound.get(url)?.size || 0) === 0) errors.push(`${url}: orphaned from all other indexable pages`);
}

const priorities = [
  '/tools/word-counter/', '/tools/mrr-calculator/', '/tools/employee-cost-calculator/',
  '/tools/lead-conversion-calculator/', '/tools/contractor-estimate-calculator/',
  '/tools/freelance-project-rate-calculator/', '/tools/conversion-rate-calculator/',
  '/tools/cpc-calculator/', '/tools/utm-builder/', '/tools/automation-roi-calculator/',
].map((pathname) => `https://toolviking.com${pathname}`);

const priorityInbound = Object.fromEntries(priorities.map((url) => [new URL(url).pathname, inbound.get(url)?.size || 0]));
for (const url of priorities) if ((inbound.get(url)?.size || 0) < 2) errors.push(`${url}: priority page has fewer than two distinct internal-link sources`);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(JSON.stringify({
  status: 'PASS',
  sitemapUrls: urls.length,
  orphanedUrls: 0,
  nonCanonicalInternalLinks: 0,
  priorityInbound,
}, null, 2));
