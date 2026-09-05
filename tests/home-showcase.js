const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const script = fs.readFileSync('assets/app.js', 'utf8');
const styles = fs.readFileSync('assets/style.css', 'utf8');
const errors = [];
const expectedLinks = [
  '/tools/word-counter/',
  '/tools/mrr-calculator/',
  '/tools/automation-roi-calculator/',
  '/tools/contractor-estimate-calculator/',
];

if ((html.match(/data-demo-tab=/g) || []).length !== 4) errors.push('expected four showcase tabs');
if ((html.match(/data-demo-slide=/g) || []).length !== 4) errors.push('expected four showcase slides');
if ((html.match(/role="tabpanel"/g) || []).length !== 4) errors.push('all slides must be tab panels');
if (!html.includes('Example data')) errors.push('showcase must label example data');
if (!html.includes('Runs locally in your browser')) errors.push('showcase must preserve the privacy reassurance');
for (const href of expectedLinks) if (!html.includes(`href="${href}"`)) errors.push(`missing showcase link ${href}`);
if (!script.includes('function initToolShowcase()')) errors.push('showcase initialization is missing');
if (!script.includes("prefers-reduced-motion: reduce")) errors.push('reduced-motion behavior is missing');
if (!script.includes("event.key==='ArrowRight'")) errors.push('keyboard tab navigation is missing');
if (!styles.includes('.hero-showcase')) errors.push('showcase styles are missing');
if (!styles.includes('@media(prefers-reduced-motion:reduce)')) errors.push('reduced-motion styles are missing');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('PASS: homepage tool showcase contains four accessible, linked, reduced-motion-aware previews.');
