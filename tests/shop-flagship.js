const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const errors = [];

const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const exists = (relative) => fs.existsSync(path.join(root, relative));

const shop = read('shop/index.html');
const page = read('shop/ai-small-business-playbook/index.html');
const playbook = read('shop/ai-small-business-playbook/PLAYBOOK.md');
const sitemap = read('sitemap.xml');

if (!exists('shop/ai-small-business-playbook/index.html')) errors.push('missing flagship product page');
if (!shop.includes('/shop/ai-small-business-playbook/')) errors.push('shop page does not link to flagship product');
if (!sitemap.includes('https://toolviking.com/shop/ai-small-business-playbook/')) errors.push('sitemap missing flagship product URL');
if (!page.includes('<link rel="canonical" href="https://toolviking.com/shop/ai-small-business-playbook/">')) errors.push('flagship canonical missing or wrong');
if (!page.includes('Planned price $14.99')) errors.push('planned price CTA missing');
if (!page.includes('Checkout and secure delivery are not connected yet')) errors.push('checkout disclosure missing');
if (/\b(Buy now|Add to cart|Checkout now|Secure checkout|Download instantly)\b/i.test(page)) errors.push('page implies a working purchase flow');

const recipeCount = (playbook.match(/^### \d+\. /gm) || []).length;
if (recipeCount !== 50) errors.push(`expected 50 recipes, found ${recipeCount}`);

const requiredRecipeFields = [
  'Real business problem',
  'Desired outcome',
  'Plain-English explanation',
  'Step-by-step workflow',
  'Copy/paste AI prompt',
  'Placeholders to customize',
  'Practical example',
  'Template/checklist/worksheet',
  'Relevant ToolViking tool',
  'Direct ToolViking tool link',
  'Verification/review step',
  'Recommended next action',
];
for (const field of requiredRecipeFields) {
  const count = (playbook.match(new RegExp(`\\*\\*${field}:`, 'g')) || []).length;
  if (count !== 50) errors.push(`${field} appears ${count} times, expected 50`);
}

const toolLinks = [...playbook.matchAll(/https:\/\/toolviking\.com\/tools\/([^/]+)\//g)].map((match) => match[1]);
const uniqueToolLinks = new Set(toolLinks);
if (uniqueToolLinks.size < 25) errors.push(`expected at least 25 unique integrated tools, found ${uniqueToolLinks.size}`);
for (const slug of uniqueToolLinks) {
  if (!exists(`tools/${slug}/index.html`)) errors.push(`playbook links to missing tool: ${slug}`);
}

const ctaPages = [...fs.readdirSync(path.join(root, 'tools'))]
  .filter((name) => exists(`tools/${name}/index.html`))
  .filter((name) => read(`tools/${name}/index.html`).includes('data-shop-cta'));
if (ctaPages.length < 20 || ctaPages.length > 30) errors.push(`expected restrained contextual CTAs on 20-30 tools, found ${ctaPages.length}`);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(JSON.stringify({
  status: 'PASS',
  recipes: recipeCount,
  integratedTools: uniqueToolLinks.size,
  contextualCtas: ctaPages.length,
}, null, 2));
