const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'data', 'catalog.json'), 'utf8'));
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const errors = [];
const titles = new Map();
const descriptions = new Map();

const decode = (value) => String(value)
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const strip = (value) => decode(String(value).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
const match = (html, pattern) => (html.match(pattern) || [])[1] || '';

for (const tool of catalog.tools) {
  const route = `/tools/${tool.slug}/`;
  const url = `https://toolviking.com${route}`;
  const file = path.join(root, 'tools', tool.slug, 'index.html');
  const html = fs.readFileSync(file, 'utf8');
  const title = decode(match(html, /<title>([\s\S]*?)<\/title>/i));
  const description = decode(match(html, /<meta\s+name="description"\s+content="([^"]+)"/i));
  const canonical = match(html, /<link\s+rel="canonical"\s+href="([^"]+)"/i);
  const h1Count = (html.match(/<h1(?:\s|>)/gi) || []).length;

  if (!title || title.length < 25 || title.length > 70) errors.push(`${tool.slug}: title length ${title.length}`);
  if (!description || description.length < 80 || description.length > 170) errors.push(`${tool.slug}: description length ${description.length}`);
  if (titles.has(title)) errors.push(`${tool.slug}: duplicate title with ${titles.get(title)}`); else titles.set(title, tool.slug);
  if (descriptions.has(description)) errors.push(`${tool.slug}: duplicate description with ${descriptions.get(description)}`); else descriptions.set(description, tool.slug);
  if (canonical !== url) errors.push(`${tool.slug}: bad canonical ${canonical}`);
  if (h1Count !== 1) errors.push(`${tool.slug}: expected one H1, found ${h1Count}`);
  if (/noindex/i.test(html)) errors.push(`${tool.slug}: contains noindex`);
  if (!sitemap.includes(`<loc>${url}</loc>`)) errors.push(`${tool.slug}: missing from sitemap`);

  const social = {
    'og:title': /<meta\s+property="og:title"\s+content="([^"]+)"/i,
    'og:description': /<meta\s+property="og:description"\s+content="([^"]+)"/i,
    'og:url': /<meta\s+property="og:url"\s+content="([^"]+)"/i,
    'twitter:card': /<meta\s+name="twitter:card"\s+content="([^"]+)"/i,
    'twitter:title': /<meta\s+name="twitter:title"\s+content="([^"]+)"/i,
    'twitter:description': /<meta\s+name="twitter:description"\s+content="([^"]+)"/i,
  };
  for (const [name, pattern] of Object.entries(social)) if (!match(html, pattern)) errors.push(`${tool.slug}: missing ${name}`);
  if (match(html, social['og:url']) !== url) errors.push(`${tool.slug}: bad og:url`);

  const rawSchema = match(html, /<script[^>]*data-tool-schema[^>]*>([\s\S]*?)<\/script>/i);
  let graph = [];
  try {
    const schema = JSON.parse(rawSchema);
    graph = schema['@graph'] || [];
  } catch (error) {
    errors.push(`${tool.slug}: invalid JSON-LD (${error.message})`);
  }
  if (!graph.some((item) => item['@type'] === 'WebApplication' && item.url === url && item.isAccessibleForFree === true)) errors.push(`${tool.slug}: missing complete WebApplication schema`);
  const breadcrumbs = graph.find((item) => item['@type'] === 'BreadcrumbList');
  if (!breadcrumbs || breadcrumbs.itemListElement?.length !== 3) errors.push(`${tool.slug}: missing complete BreadcrumbList schema`);

  const visibleQuestions = [...html.matchAll(/<details><summary>([\s\S]*?)<\/summary><p>([\s\S]*?)<\/p><\/details>/gi)]
    .map((item) => ({ question: strip(item[1]), answer: strip(item[2]) }));
  if (visibleQuestions.length) {
    const faq = graph.find((item) => item['@type'] === 'FAQPage');
    if (!faq || faq.mainEntity?.length !== visibleQuestions.length) errors.push(`${tool.slug}: FAQ schema count does not match visible FAQ`);
    else visibleQuestions.forEach((visible, index) => {
      const entity = faq.mainEntity[index];
      if (entity.name !== visible.question || entity.acceptedAnswer?.text !== visible.answer) errors.push(`${tool.slug}: FAQ schema text mismatch at question ${index + 1}`);
    });
  }
}

const priority = ['word-counter', 'reading-time-calculator', 'mrr-calculator', 'employee-cost-calculator', 'lead-conversion-calculator', 'contractor-estimate-calculator', 'freelance-project-rate-calculator', 'conversion-rate-calculator', 'cpc-calculator', 'utm-builder', 'automation-roi-calculator'];
for (const slug of priority) {
  const html = fs.readFileSync(path.join(root, 'tools', slug, 'index.html'), 'utf8');
  for (const heading of ['How to use', 'Formula or calculation method', 'What the result means', 'Worked example', 'Common mistakes', 'When to use it']) {
    if (!html.includes(heading)) errors.push(`${slug}: missing guide section ${heading}`);
  }
  const related = match(html, /<section><div class="wrap"><h2>Related tools<\/h2>([\s\S]*?)<\/section>/i);
  if ((related.match(/href="\/tools\//g) || []).length < 2) errors.push(`${slug}: fewer than two related tools`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`PASS: audited metadata, schema, crawlability, guides, and related links on ${catalog.tools.length} tool pages.`);
