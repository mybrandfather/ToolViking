const base = (process.argv[2] || 'https://toolviking.com').replace(/\/$/, '');
const priorityPaths = [
  '/tools/word-counter/',
  '/tools/mrr-calculator/',
  '/tools/employee-cost-calculator/',
  '/tools/lead-conversion-calculator/',
  '/tools/contractor-estimate-calculator/',
  '/tools/freelance-project-rate-calculator/',
  '/tools/conversion-rate-calculator/',
  '/tools/cpc-calculator/',
  '/tools/utm-builder/',
  '/tools/automation-roi-calculator/',
];

const normalize = (value) => value.replace(/\/$/, '') || '/';
const htmlDecode = (value) => String(value).replace(/&amp;/g, '&');

async function get(url, redirect = 'follow') {
  const response = await fetch(url, {
    redirect,
    headers: { 'user-agent': 'ToolVikingIndexAudit/1.0' },
  });
  return { response, body: await response.text() };
}

function robotRules(text) {
  let applies = false;
  const disallow = [];
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*/, '').trim();
    if (!line) continue;
    const [rawName, ...rawValue] = line.split(':');
    const name = rawName.toLowerCase();
    const value = rawValue.join(':').trim();
    if (name === 'user-agent') applies = value === '*';
    if (applies && name === 'disallow' && value) disallow.push(value);
  }
  return disallow;
}

function isBlocked(pathname, disallow) {
  return disallow.some((rule) => pathname.startsWith(rule.replace(/\*.*$/, '')));
}

async function inspectUrl(url, disallow) {
  const { response, body } = await get(url, 'manual');
  const contentType = response.headers.get('content-type') || '';
  const isHtml = contentType.includes('text/html');
  const canonical = isHtml
    ? htmlDecode((body.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i) || [])[1] || '')
    : '';
  const robotsMeta = isHtml
    ? (body.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i) || [])[1] || ''
    : '';
  const xRobots = response.headers.get('x-robots-tag') || '';
  const pathname = new URL(url).pathname;
  return {
    url,
    pathname,
    status: response.status,
    redirect: response.headers.get('location') || '',
    blockedByRobots: isBlocked(pathname, disallow),
    noindex: /noindex/i.test(`${robotsMeta} ${xRobots}`),
    canonical,
    canonicalMatches: !isHtml || normalize(canonical) === normalize(url),
    contentBytes: Buffer.byteLength(body),
  };
}

async function mapLimited(items, limit, callback) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const index = next++;
      results[index] = await callback(items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

async function main() {
  const [{ response: robotsResponse, body: robots }, { response: sitemapResponse, body: sitemap }] = await Promise.all([
    get(`${base}/robots.txt`),
    get(`${base}/sitemap.xml`),
  ]);
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => htmlDecode(match[1].trim()));
  const duplicateUrls = urls.filter((url, index) => urls.indexOf(url) !== index);
  const disallow = robotRules(robots);
  const pages = await mapLimited(urls, 8, (url) => inspectUrl(url, disallow));
  const failures = pages.filter((page) => page.status !== 200 || page.redirect || page.blockedByRobots || page.noindex || !page.canonicalMatches);
  const priority = priorityPaths.map((pathname) => pages.find((page) => page.pathname === pathname) || { pathname, missingFromSitemap: true });
  const report = {
    base,
    robots: { status: robotsResponse.status, disallow, sitemapDeclared: robots.includes(`${base}/sitemap.xml`) },
    sitemap: { status: sitemapResponse.status, urlCount: urls.length, duplicateUrls },
    totals: {
      http200: pages.filter((page) => page.status === 200).length,
      redirects: pages.filter((page) => page.redirect || (page.status >= 300 && page.status < 400)).length,
      blockedByRobots: pages.filter((page) => page.blockedByRobots).length,
      noindex: pages.filter((page) => page.noindex).length,
      badCanonical: pages.filter((page) => !page.canonicalMatches).length,
    },
    priority,
    failures,
  };
  console.log(JSON.stringify(report, null, 2));
  if (robotsResponse.status !== 200 || sitemapResponse.status !== 200 || duplicateUrls.length || failures.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
