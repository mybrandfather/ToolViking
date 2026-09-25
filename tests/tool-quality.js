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
const scenarios = [
  (fields) => fields.map((field) => String(field[1])),
  (fields) => fields.map((field) => typeof field[1] === 'number' ? '0' : ''),
  (fields) => fields.map((field) => typeof field[1] === 'number' ? '1.25' : '<b>safe text</b>'),
  (fields) => fields.map((field) => typeof field[1] === 'number' ? '-5' : 'A short test.'),
  (fields) => fields.map((field) => typeof field[1] === 'number' ? 'not-a-number' : 'Test & verify.'),
];

for (const tool of catalog.tools) {
  try {
    const fields = vm.runInContext(`fields(${JSON.stringify(tool.slug)})`, context);
    for (const scenario of scenarios) {
      const output = vm.runInContext(`compute(${JSON.stringify(tool.slug)}, ${JSON.stringify(scenario(fields))})`, context);
      if (!output.includes('<strong>')) throw new Error('missing primary result');
      if (/NaN|Infinity|undefined/.test(output)) throw new Error(`invalid output: ${output}`);
    }
  } catch (error) {
    failures.push(`${tool.slug}: ${error.message}`);
  }
}

const fields = vm.runInContext(`fields('mrr-calculator')`, context);
const validError = vm.runInContext(`validateToolValues(${JSON.stringify(fields)}, ['100', '49'])`, context);
const blankError = vm.runInContext(`validateToolValues(${JSON.stringify(fields)}, ['', '49'])`, context);
const negativeError = vm.runInContext(`validateToolValues(${JSON.stringify(fields)}, ['-1', '49'])`, context);
if (validError) failures.push('validation: rejected valid numeric values');
if (!/required/i.test(blankError)) failures.push('validation: blank value did not produce a required error');
if (!/negative/i.test(negativeError)) failures.push('validation: negative value did not produce a negative-value error');

const sample = vm.runInContext(`analyzeText('Hello world. Hello ToolViking!\\n\\nSecond paragraph.')`, context);
if (sample.words !== 6) failures.push(`word counter: expected 6 words, got ${sample.words}`);
if (sample.sentences !== 3) failures.push(`word counter: expected 3 sentences, got ${sample.sentences}`);
if (sample.paragraphs !== 2) failures.push(`word counter: expected 2 paragraphs, got ${sample.paragraphs}`);
if (sample.keywords[0]?.word !== 'hello' || sample.keywords[0]?.count !== 2) failures.push('word counter: keyword density ordering is incorrect');

const wordOutput = vm.runInContext(`compute('word-counter', ['Hello world.'])`, context);
for (const label of ['Characters', 'Without spaces', 'Sentences', 'Paragraphs', 'Reading time', 'Speaking time', 'Top keyword density']) {
  if (!wordOutput.includes(label)) failures.push(`word counter: missing ${label}`);
}
const emptyOutput = vm.runInContext(`compute('word-counter', [''])`, context);
if (!emptyOutput.includes('0 words')) failures.push('word counter: empty text did not return 0 words');
if (wordOutput.includes('<script>')) failures.push('word counter: user text was not escaped');

const cpmFields = vm.runInContext(`fields('cpm-calculator')`, context);
if (vm.runInContext(`validateToolValues(${JSON.stringify(cpmFields)}, ['2500', '400000', ''], 'cpm-calculator')`, context)) failures.push('CPM: rejected two valid inputs');
if (!/exactly two/i.test(vm.runInContext(`validateToolValues(${JSON.stringify(cpmFields)}, ['2500', '400000', '6.25'], 'cpm-calculator')`, context))) failures.push('CPM: did not reject three inputs');
if (!/exactly two/i.test(vm.runInContext(`validateToolValues(${JSON.stringify(cpmFields)}, ['2500', '', ''], 'cpm-calculator')`, context))) failures.push('CPM: did not reject one input');
for (const [values, expected] of [
  [['2500', '400000', ''], '$6.25'],
  [['2500', '', '6.25'], '400,000'],
  [['', '400000', '6.25'], '$2,500.00'],
]) {
  const output = vm.runInContext(`compute('cpm-calculator', ${JSON.stringify(values)})`, context);
  if (!output.includes(expected)) failures.push(`CPM: expected ${expected} for ${values.join('|')}`);
}

const jobOutput = vm.runInContext(`compute('job-profit-calculator', ['18000', '6200', '4800', '900', '350'])`, context);
for (const expected of ['$5,750.00', '31.94%', '46.94%', 'Overhead allocation']) if (!jobOutput.includes(expected)) failures.push(`job profit: missing ${expected}`);

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`PASS: ${catalog.tools.length} tools handled default and edge-case inputs; enhanced Word Counter checks passed.`);
