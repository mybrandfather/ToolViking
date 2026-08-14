const fs = require('fs');
const vm = require('vm');

const catalog = JSON.parse(fs.readFileSync('data/catalog.json', 'utf8'));
const source = fs.readFileSync('assets/app.js', 'utf8');
const context = vm.createContext({
  Intl,
  URL,
  console,
  window: {},
  document: {
    querySelector() { return null; },
    querySelectorAll() { return []; },
    addEventListener() {},
  },
});

vm.runInContext(source, context);
const failures = [];

for (const tool of catalog.tools) {
  try {
    const fields = vm.runInContext(`fields(${JSON.stringify(tool.slug)})`, context);
    const values = fields.map((field) => String(field[1]));
    const output = vm.runInContext(
      `compute(${JSON.stringify(tool.slug)}, ${JSON.stringify(values)})`,
      context,
    );
    if (!Array.isArray(fields) || fields.length === 0) throw new Error('no fields');
    if (!output.includes('<strong>')) throw new Error('no primary result');
    if (/NaN|Infinity|undefined/.test(output)) throw new Error(`invalid output: ${output}`);
  } catch (error) {
    failures.push(`${tool.slug}: ${error.message}`);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`PASS: ${catalog.tools.length} calculator routes produced valid default results.`);
