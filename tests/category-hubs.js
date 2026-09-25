const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'data', 'catalog.json'), 'utf8'));
const categories = {
  Finance: 'finance-calculators',
  Marketing: 'marketing-calculators',
  Ecommerce: 'ecommerce-calculators',
  Freelancer: 'freelancer-pricing-tools',
  Content: 'writing-tools',
  Operations: 'business-operations-tools',
  Contractor: 'contractor-calculators',
  'Lead & Automation': 'lead-automation-calculators',
};
const failures = [];
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const toolsIndex = fs.readFileSync(path.join(root, 'tools', 'index.html'), 'utf8');

for (const [category, slug] of Object.entries(categories)) {
  const route = `/tools/${slug}/`;
  const url = `https://toolviking.com${route}`;
  const file = path.join(root, 'tools', slug, 'index.html');
  if (!fs.existsSync(file)) { failures.push(`${slug}: page missing`); continue; }
  const html = fs.readFileSync(file, 'utf8');
  if (!html.includes(`<link rel="canonical" href="${url}">`)) failures.push(`${slug}: canonical missing`);
  if (!sitemap.includes(`<loc>${url}</loc>`)) failures.push(`${slug}: sitemap entry missing`);
  if (!toolsIndex.includes(`href="${route}"`)) failures.push(`${slug}: not linked from tools index`);
  if ((html.match(/<h1(?:\s|>)/g) || []).length !== 1) failures.push(`${slug}: expected one H1`);
  try {
    const raw = (html.match(/<script type="application\/ld\+json" data-category-schema>([\s\S]*?)<\/script>/) || [])[1];
    const graph = JSON.parse(raw)['@graph'];
    if (!graph.some((item) => item['@type'] === 'CollectionPage')) failures.push(`${slug}: CollectionPage schema missing`);
    if (!graph.some((item) => item['@type'] === 'ItemList')) failures.push(`${slug}: ItemList schema missing`);
  } catch (error) { failures.push(`${slug}: invalid category schema`); }
  const members = catalog.tools.filter((tool) => tool.category === category);
  for (const tool of members) {
    if (!html.includes(`href="/tools/${tool.slug}/"`)) failures.push(`${slug}: missing ${tool.slug}`);
    const toolHtml = fs.readFileSync(path.join(root, 'tools', tool.slug, 'index.html'), 'utf8');
    if (!toolHtml.includes(`href="${route}"`)) failures.push(`${tool.slug}: missing category link`);
  }
}

if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log(`PASS: 8 category hubs cover all ${catalog.tools.length} tools with reciprocal links, canonicals, sitemap entries, and schema.`);
