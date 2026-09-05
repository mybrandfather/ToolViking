const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'data', 'catalog.json'), 'utf8'));

const titleOverrides = {
  'word-counter': 'Word Counter - Count Words, Characters & Reading Time | ToolViking',
  'mrr-calculator': 'MRR Calculator - Calculate Monthly Recurring Revenue | ToolViking',
  'employee-cost-calculator': 'Employee Cost Calculator - Estimate True Employment Cost | ToolViking',
  'lead-conversion-calculator': 'Lead Conversion Calculator - Lead-to-Customer Rate | ToolViking',
  'contractor-estimate-calculator': 'Contractor Estimate Calculator - Labor & Margin | ToolViking',
  'freelance-project-rate-calculator': 'Freelance Project Rate Calculator - Price Client Work | ToolViking',
  'conversion-rate-calculator': 'Conversion Rate Calculator - Marketing Results | ToolViking',
  'cpc-calculator': 'CPC Calculator - Calculate Cost Per Click | ToolViking',
  'utm-builder': 'UTM Builder - Create Campaign Tracking URLs | ToolViking',
  'automation-roi-calculator': 'Automation ROI Calculator - Estimate Savings & Payback | ToolViking',
  'reading-time-calculator': 'Reading Time Calculator - Estimate Article Reading Time | ToolViking',
};

const descriptionOverrides = {
  'word-counter': 'Free word counter to count words, characters, sentences, paragraphs, reading time, speaking time, and keyword density. Your text stays in your browser.',
  'mrr-calculator': 'Calculate monthly recurring revenue from active customers and average monthly revenue. Get MRR and annualized recurring revenue instantly.',
  'employee-cost-calculator': 'Estimate the true annual and monthly cost of an employee using salary, payroll taxes, benefits, equipment, and overhead.',
  'lead-conversion-calculator': 'Calculate lead-to-customer conversion rate, understand what the percentage means, and compare sales performance using consistent cohorts.',
  'contractor-estimate-calculator': 'Build a contractor estimate from labor hours, hourly rate, materials, overhead, and profit markup. Results are calculated in your browser.',
  'freelance-project-rate-calculator': 'Price freelance projects using estimated hours, target rate, direct costs, and a contingency allowance for project risk.',
  'conversion-rate-calculator': 'Calculate conversion rate from visitors or opportunities and completed conversions. See the formula, example, and interpretation.',
  'cpc-calculator': 'Calculate average cost per click from advertising spend and clicks, then use the result alongside conversion rate and campaign tracking.',
  'utm-builder': 'Create a campaign URL with utm_source, utm_medium, and utm_campaign parameters. The URL is built locally in your browser.',
  'automation-roi-calculator': 'Estimate monthly savings, first-year net benefit, setup payback, and ROI for a proposed business automation project.',
  'reading-time-calculator': 'Estimate article reading time from word count and reading speed. Paste text and calculate privately in your browser.',
};

const content = {
  'word-counter': {
    hero: 'Count words, characters, sentences, paragraphs, reading time, speaking time, and keyword density without uploading your text.',
    notice: 'Privacy: your text is processed only in this browser. ToolViking does not upload or store what you enter.',
    intro: 'Paste or type text into the editor. The results update as you type, so you can check length and pacing without repeatedly pressing Calculate.',
    steps: ['Paste or type your text in the editor.', 'Review the live word, character, sentence, paragraph, reading, and speaking metrics.', 'Use Copy result to save the summary, or Reset to clear the editor.'],
    method: 'Words are detected as letter or number sequences, including common apostrophes and hyphens. Characters are counted both with and without whitespace. Sentence estimates use ending punctuation, while paragraphs are separated by blank lines.',
    meaning: 'Use the counts to meet submission limits, compare drafts, estimate content length, and plan how long written or spoken material may take.',
    example: 'A 900-word article is about a 4-minute read at 225 words per minute and roughly a 7-minute presentation at 130 words per minute.',
    mistakes: 'Pasted menus, footnotes, URLs, and captions all count as text. Abbreviations and unusual punctuation can also affect estimated sentence totals.',
    when: 'Useful for articles, essays, reports, product descriptions, social posts, scripts, speeches, and any writing with a length or timing requirement.',
    faq: [
      ['What is a word counter?', 'A word counter measures the number of words in a text. This tool also reports characters, sentences, paragraphs, estimated reading time, speaking time, and simple keyword density.'],
      ['How do I count words online?', 'Paste or type your text into the editor. The totals update immediately, and you can copy the result summary when you are finished.'],
      ['Does this count characters with spaces?', 'Yes. The result shows separate character counts with whitespace and without whitespace.'],
      ['How is reading time calculated?', 'Estimated reading time divides the word count by 225 words per minute. Speaking time uses 130 words per minute. Both are planning estimates.'],
      ['Is my text uploaded or stored?', 'No. The counting runs locally in your browser. ToolViking does not upload or store the text you enter.'],
    ],
  },
  'reading-time-calculator': {
    hero: 'Estimate how long written content takes to read using your text and a configurable reading speed.',
    notice: 'Privacy: your text and reading-speed input stay in this browser and are not uploaded by ToolViking.',
    intro: 'Paste the complete text, choose a realistic reading speed, and calculate. Use a slower speed for technical material and a faster speed for simple prose.',
    steps: ['Paste the text you want to measure.', 'Adjust words per minute if your audience or material requires it.', 'Calculate, compare drafts, and copy the result if needed.'],
    method: 'Reading time equals total words divided by words per minute. The displayed result rounds up to a whole minute so short remaining fractions are not ignored.',
    meaning: 'The estimate helps set expectations for articles, documentation, newsletters, lessons, and other long-form content.',
    example: 'A 1,125-word article at 225 words per minute has an estimated reading time of 5 minutes.',
    mistakes: 'Do not assume every audience reads at the same speed. Technical language, tables, code, and unfamiliar subjects usually take longer.',
    when: 'Use it when publishing articles, designing lessons, planning newsletters, or deciding whether a draft needs a shorter version.',
    faq: [
      ['What reading speed should I use?', '225 words per minute is a practical general-purpose baseline. Use a lower value for technical or unfamiliar content.'],
      ['Does formatting affect reading time?', 'The calculator uses word count, so images, tables, diagrams, and pauses are not included automatically. Add extra time when those elements matter.'],
      ['Is the estimate exact?', 'No. Reading speed varies by reader and subject. Treat the result as a planning estimate.'],
    ],
  },
  'mrr-calculator': {
    hero: 'Calculate monthly recurring revenue from active customers and average recurring revenue per customer.',
    notice: 'This MRR result is a planning metric, not accounting, tax, investment, or legal advice. Reconcile reporting definitions with your financial records.',
    intro: 'Enter the number of active recurring customers and their average monthly recurring revenue. Use the same point-in-time or period definition each month.',
    steps: ['Count active recurring customers for the measurement date.', 'Enter average recurring monthly revenue per active customer.', 'Calculate MRR and review the annualized run-rate estimate.'],
    method: 'MRR = active recurring customers × average monthly recurring revenue per customer. Annualized recurring revenue is MRR × 12.',
    meaning: 'MRR normalizes recurring subscription revenue into a monthly baseline. It is not the same as cash collected, bookings, or recognized accounting revenue.',
    example: '250 customers paying an average of $49 per month produce $12,250 in MRR and a $147,000 annualized run rate.',
    mistakes: 'Exclude one-time setup fees, services, taxes, refunds, and the full value of annual contracts unless you normalize them to a monthly amount.',
    when: 'Use MRR for recurring-revenue trend reporting, pricing scenarios, hiring plans, and comparisons between subscription periods.',
    faq: [
      ['What is MRR?', 'Monthly recurring revenue is the normalized recurring subscription revenue a business expects in one month from active customers.'],
      ['What revenue should be excluded from MRR?', 'Normally exclude one-time fees, professional services, hardware, taxes, and other non-recurring revenue. Keep your definition consistent.'],
      ['How is MRR different from ARR?', 'MRR is a monthly recurring-revenue measure. ARR annualizes that run rate, commonly by multiplying MRR by 12.'],
    ],
  },
  'employee-cost-calculator': {
    hero: 'Estimate loaded employee cost beyond salary by including taxes, benefits, equipment, and overhead.',
    notice: 'This is a budgeting estimate, not payroll, tax, legal, or benefits advice. Employer costs vary by location, worker classification, and plan design.',
    intro: 'Enter annual base salary, a combined percentage for payroll taxes and benefits, and annual equipment or overhead allocated to the role.',
    steps: ['Enter annual base salary.', 'Estimate employer payroll taxes and benefits as a percentage of salary.', 'Add annual equipment and overhead, then calculate.'],
    method: 'Loaded annual cost = salary × (1 + payroll taxes and benefits percentage) + annual equipment and overhead.',
    meaning: 'The result estimates the annual and monthly budget needed for the role. It is broader than salary but may not include every recruiting or management cost.',
    example: 'A $70,000 salary, 25% taxes and benefits, and $8,000 overhead produces an estimated annual cost of $95,500, or about $7,958 per month.',
    mistakes: 'Common omissions include payroll tax, insurance, retirement contributions, paid leave, equipment, software, recruiting, workspace, and management time.',
    when: 'Use it for hiring budgets, employee-versus-contractor comparisons, pricing capacity, and headcount planning.',
    faq: [
      ['What is fully loaded employee cost?', 'It is salary plus employer-paid taxes, benefits, equipment, workspace, software, and other costs allocated to employing that person.'],
      ['What costs should be added to salary?', 'Include the costs that apply to your organization, such as payroll tax, insurance, retirement benefits, paid leave, equipment, and overhead.'],
      ['Is this the same as an employee hourly rate?', 'No. Loaded annual cost is a budget total. To estimate an hourly cost, divide by realistic productive hours rather than every paid hour.'],
    ],
  },
  'lead-conversion-calculator': {
    hero: 'Calculate the percentage of leads that become customers using a consistent lead cohort and measurement period.',
    notice: 'This conversion result is descriptive, not a forecast. Verify lead and customer definitions before comparing channels or teams.',
    intro: 'Enter total leads and customers won from the same cohort. Keep the date range, channel definition, and conversion event consistent.',
    steps: ['Choose one lead cohort or reporting period.', 'Count leads and customers won using consistent definitions.', 'Calculate the rate and compare like-for-like segments.'],
    method: 'Lead conversion rate = customers won ÷ total leads × 100.',
    meaning: 'The percentage shows how efficiently a lead cohort became customers. It does not explain lead quality, deal size, sales-cycle length, or profitability by itself.',
    example: '30 customers won from 200 leads equals a 15% lead conversion rate.',
    mistakes: 'Avoid mixing different periods, counting duplicate leads, comparing raw inquiries with sales-qualified leads, or counting customers outside the chosen cohort.',
    when: 'Use it to compare acquisition channels, sales stages, campaigns, territories, or process changes over consistent periods.',
    faq: [
      ['How do I calculate lead conversion rate?', 'Divide customers won by total leads from the same cohort, then multiply by 100.'],
      ['What counts as a converted lead?', 'Define the conversion before measuring. For this calculator, the default interpretation is a lead that became a paying customer.'],
      ['Can I compare conversion rates by channel?', 'Yes, if each channel uses the same date range, lead definition, conversion event, and attribution method.'],
    ],
  },
  'contractor-estimate-calculator': {
    hero: 'Build a planning estimate from labor hours, labor rate, material cost, and an overhead-and-profit markup.',
    notice: 'This estimate is for planning only. Confirm taxes, permits, insurance, material pricing, contract terms, and local requirements before quoting work.',
    intro: 'Estimate labor hours and rate, add direct materials, then apply a combined overhead-and-profit percentage to the direct-cost subtotal.',
    steps: ['Estimate labor hours and hourly labor rate.', 'Add current material costs.', 'Choose an overhead-and-profit markup and calculate the estimate.'],
    method: 'Direct cost = labor hours × labor rate + materials. Estimate = direct cost × (1 + overhead-and-profit percentage).',
    meaning: 'The result is a proposed estimate before project-specific taxes, permits, subcontractors, unusual risk, or contract adjustments.',
    example: '80 hours at $75 plus $4,200 of materials equals $10,200 direct cost. Adding 25% produces a $12,750 estimate.',
    mistakes: 'Do not confuse markup with margin. Also account for travel, disposal, subcontractors, permits, change-order risk, and non-billable project time when applicable.',
    when: 'Use it for early job pricing, scope discussions, quote review, and testing how labor or material changes affect a project estimate.',
    faq: [
      ['What should a contractor estimate include?', 'Include labor, materials, subcontractors, equipment, permits, travel, disposal, overhead, profit, and applicable taxes or allowances.'],
      ['Should overhead be included?', 'Yes. Overhead covers business costs that are not assigned directly to one task but still support delivery of the job.'],
      ['Is markup the same as profit margin?', 'No. Markup is added to cost, while margin is profit divided by selling price. The percentage input in this calculator is a markup on direct cost.'],
    ],
  },
  'freelance-project-rate-calculator': {
    hero: 'Price freelance work using project hours, target hourly rate, direct costs, and a contingency allowance.',
    notice: 'This is a pricing estimate, not tax, legal, or contract advice. Confirm scope, payment terms, taxes, and currency before sending a proposal.',
    intro: 'Estimate all delivery hours, choose a sustainable target rate, add direct project expenses, and include a contingency for uncertainty.',
    steps: ['Estimate research, meetings, production, revisions, and handoff time.', 'Enter your target hourly rate and direct project costs.', 'Add a contingency percentage and calculate the project price.'],
    method: 'Project price = (estimated hours × target hourly rate + direct costs) × (1 + contingency percentage).',
    meaning: 'The result is a pricing baseline. It does not automatically include sales time, late-payment risk, taxes, or value-based pricing adjustments.',
    example: '60 hours at $95 plus $500 direct costs equals $6,200. A 15% contingency produces a $7,130 project price.',
    mistakes: 'Underestimating meetings, revisions, project management, feedback delays, software, contractors, and non-billable communication can make a project unprofitable.',
    when: 'Use it for fixed-price proposals, scope changes, minimum project pricing, and comparing project work with hourly engagements.',
    faq: [
      ['How should freelancers price a project?', 'Start with realistic hours and a sustainable rate, add direct costs, and include a contingency for uncertainty or revision risk.'],
      ['What should project hours include?', 'Include discovery, meetings, research, production, revisions, project management, communication, quality checks, and handoff.'],
      ['How much contingency should I add?', 'Use a percentage that reflects scope clarity and risk. A well-defined repeat project may need less than a new or uncertain engagement.'],
    ],
  },
  'conversion-rate-calculator': {
    hero: 'Calculate conversion rate from visitors or opportunities and completed conversions.',
    notice: 'This rate is a descriptive estimate. Use consistent analytics definitions and attribution windows before comparing campaigns.',
    intro: 'Enter the total eligible visitors or opportunities and the completed conversions from the same period and funnel step.',
    steps: ['Choose the funnel step and reporting period.', 'Enter eligible opportunities and completed conversions.', 'Calculate and compare the result with the same definition over time.'],
    method: 'Conversion rate = conversions ÷ visitors or opportunities × 100.',
    meaning: 'The result shows the share of eligible opportunities that completed the chosen action. It should be paired with volume, value, cost, and data quality.',
    example: '525 conversions from 15,000 visitors equals a 3.5% conversion rate.',
    mistakes: 'Do not mix users with sessions, compare different conversion events, include bot traffic, or combine mismatched attribution periods.',
    when: 'Use it for landing pages, ecommerce checkout, signup flows, email campaigns, sales stages, or any measurable funnel action.',
    faq: [
      ['What is conversion rate?', 'Conversion rate is the percentage of eligible visitors or opportunities that complete a defined action.'],
      ['What should count as a conversion?', 'Use the action that matches your decision, such as a purchase, qualified lead, signup, booking, or completed sales stage.'],
      ['Why can conversion rates differ between tools?', 'Analytics tools may use different users, sessions, attribution windows, time zones, filters, or event definitions.'],
    ],
  },
  'cpc-calculator': {
    hero: 'Calculate average advertising cost per click from campaign spend and recorded clicks.',
    notice: 'CPC is a campaign metric, not a profitability measure. Check attribution, conversion quality, revenue, and platform billing data before changing spend.',
    intro: 'Enter advertising spend and clicks from the same campaign, date range, currency, and reporting source.',
    steps: ['Choose one campaign and reporting period.', 'Enter total advertising spend and recorded clicks.', 'Calculate CPC and evaluate it with conversion and revenue metrics.'],
    method: 'Cost per click = advertising spend ÷ clicks.',
    meaning: 'Average CPC shows how much you paid for each recorded click. A lower CPC is not necessarily better if traffic quality or conversion value is lower.',
    example: '$2,500 in spend divided by 4,200 clicks equals an average CPC of about $0.60.',
    mistakes: 'Avoid mixing currencies, date ranges, billed spend with estimated spend, all clicks with link clicks, or campaigns with different objectives.',
    when: 'Use it to review paid-search or paid-social efficiency, compare campaigns, and connect click cost with conversion rate and cost per acquisition.',
    faq: [
      ['How do I calculate CPC?', 'Divide total advertising spend by the number of clicks recorded for the same campaign and period.'],
      ['Is a lower CPC always better?', 'No. Click quality, conversion rate, customer value, and profit determine whether traffic is worthwhile.'],
      ['Should I use all clicks or link clicks?', 'Use the click definition tied to your objective and keep it consistent. Platform-reported all-click and link-click totals can differ.'],
    ],
  },
  'utm-builder': {
    hero: 'Create a tagged campaign URL with source, medium, and campaign parameters without sending the destination URL anywhere.',
    notice: 'The URL is built locally in your browser. Do not place personal, confidential, or sensitive information in UTM parameters.',
    intro: 'Enter a complete destination URL, then add consistent source, medium, and campaign values that your analytics reports can group reliably.',
    steps: ['Enter the full destination URL, including https://.', 'Add campaign source, medium, and campaign name.', 'Build the URL, test it, and copy it into the correct campaign placement.'],
    method: 'The builder adds URL-encoded utm_source, utm_medium, and utm_campaign query parameters while preserving valid existing parameters.',
    meaning: 'The result is a shareable tracking URL. Your analytics platform must be installed and configured separately to report visits or conversions.',
    example: 'A newsletter link might use source “newsletter”, medium “email”, and campaign “spring-launch” so traffic can be grouped consistently.',
    mistakes: 'Avoid inconsistent capitalization, spaces and naming conventions, duplicate parameters, broken destination URLs, and personal information in tags.',
    when: 'Use it for email, social, partner, QR, display, and other campaign links where you need consistent traffic attribution.',
    faq: [
      ['What are UTM parameters?', 'UTM parameters are query-string labels commonly used by analytics tools to group campaign traffic by source, medium, and campaign.'],
      ['Will a UTM link track visitors by itself?', 'No. The URL carries labels, but an analytics platform must be installed and configured to collect and report the visit.'],
      ['Can I use spaces in UTM values?', 'The builder can encode spaces, but a consistent lowercase naming convention with hyphens is usually easier to report and maintain.'],
    ],
  },
  'automation-roi-calculator': {
    hero: 'Estimate labor savings, monthly net savings, setup payback, first-year benefit, and ROI for a proposed automation.',
    notice: 'This is a planning estimate, not a guaranteed savings or investment result. Validate time savings, adoption, maintenance, error rates, and implementation costs.',
    intro: 'Estimate monthly hours saved and loaded labor cost, then enter recurring automation cost and one-time setup cost.',
    steps: ['Estimate realistic monthly hours eliminated or reassigned.', 'Use a loaded hourly labor cost rather than wage alone when appropriate.', 'Add recurring and setup costs, calculate, and test conservative scenarios.'],
    method: 'Monthly labor savings = hours saved × hourly labor cost. First-year net benefit = (monthly labor savings − monthly automation cost) × 12 − setup cost. ROI divides that benefit by first-year automation cost.',
    meaning: 'The output compares measurable labor value with stated automation costs. It does not automatically value quality, faster response, risk, adoption, or new revenue.',
    example: '40 hours saved at $35 equals $1,400 monthly labor value. After $250 monthly cost and $1,000 setup, first-year net benefit is $12,800 and estimated ROI is 320%.',
    mistakes: 'Do not count theoretical time nobody can reuse, omit maintenance and training, assume perfect adoption, or use wage alone when benefits and overhead matter.',
    when: 'Use it to screen workflow ideas, compare vendors, build a pilot business case, and test whether conservative savings still justify implementation.',
    faq: [
      ['How do I calculate automation ROI?', 'Subtract first-year recurring and setup costs from first-year measurable benefit, then divide the net benefit by first-year automation cost and multiply by 100.'],
      ['What costs should I include?', 'Include setup, subscriptions, implementation labor, training, maintenance, monitoring, and other costs required to keep the workflow reliable.'],
      ['How should I value hours saved?', 'Use hours that can realistically be reassigned or avoided and multiply by an appropriate loaded labor cost. Test a conservative case when savings are uncertain.'],
    ],
  },
};

const clusters = [
  ['word-counter', 'reading-time-calculator', 'email-subject-checker'],
  ['mrr-calculator', 'arr-calculator', 'churn-rate-calculator', 'customer-lifetime-value-calculator', 'break-even-calculator'],
  ['conversion-rate-calculator', 'cpc-calculator', 'utm-builder', 'lead-conversion-calculator', 'roas-calculator'],
  ['employee-cost-calculator', 'contractor-estimate-calculator', 'automation-roi-calculator', 'job-profit-calculator', 'meeting-cost-calculator'],
  ['freelance-project-rate-calculator', 'hourly-rate-calculator', 'contractor-estimate-calculator', 'job-profit-calculator'],
];

const bySlug = new Map(catalog.tools.map((tool) => [tool.slug, tool]));
const related = new Map();
for (const cluster of clusters) {
  for (const slug of cluster) {
    const current = related.get(slug) || [];
    const additions = cluster.filter((candidate) => candidate !== slug && !current.includes(candidate));
    related.set(slug, [...current, ...additions].slice(0, 4));
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function decodeHtml(value) {
  return String(value)
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function plainText(value) {
  return decodeHtml(String(value).replace(/<[^>]+>/g, ' '));
}

function defaultDescription(tool) {
  return `${tool.description.replace(/\.$/, '')}. Use this free tool for an instant result calculated locally in your browser.`;
}

function renderGuide(tool, details) {
  return `<section class="tool-guide"><div class="wrap"><div class="section-head"><div><span class="eyebrow">How to use this tool</span><h2>How to use the ${escapeHtml(tool.name)}</h2></div><p>${escapeHtml(details.intro)}</p></div><ol class="guide-steps">${details.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol><div class="guide-grid"><article class="guide-card"><span class="tag">Method</span><h3>Formula or calculation method</h3><p>${escapeHtml(details.method)}</p></article><article class="guide-card"><span class="tag">Interpretation</span><h3>What the result means</h3><p>${escapeHtml(details.meaning)}</p></article><article class="guide-card"><span class="tag">Example</span><h3>Worked example</h3><p>${escapeHtml(details.example)}</p></article></div><div class="guide-split"><article class="guide-card"><span class="tag">Avoid</span><h3>Common mistakes</h3><p>${escapeHtml(details.mistakes)}</p></article><article class="guide-card"><span class="tag">Best use</span><h3>When to use it</h3><p>${escapeHtml(details.when)}</p></article></div><div class="faq"><span class="eyebrow">Common questions</span><h2>${escapeHtml(tool.name)} FAQ</h2>${details.faq.map(([question, answer]) => `<details><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join('')}</div></div></section>`;
}

function renderRelated(slug) {
  const slugs = related.get(slug);
  if (!slugs || !slugs.length) return null;
  const cards = slugs.map((relatedSlug) => bySlug.get(relatedSlug)).filter(Boolean).map((tool) => `<a class="card" href="/tools/${tool.slug}/"><span class="tag">${escapeHtml(tool.category)}</span><h3>${escapeHtml(tool.name)}</h3><p class="muted">${escapeHtml(tool.description)}</p></a>`).join('');
  return `<section><div class="wrap"><h2>Related tools</h2><p class="muted">Continue with tools that answer the next question in this workflow.</p><div class="grid">${cards}</div></div></section>`;
}

function extractFaq(html) {
  return [...html.matchAll(/<details><summary>([\s\S]*?)<\/summary><p>([\s\S]*?)<\/p><\/details>/g)].map((match) => ({
    '@type': 'Question',
    name: plainText(match[1]),
    acceptedAnswer: { '@type': 'Answer', text: plainText(match[2]) },
  }));
}

function renderSchema(tool, description, html) {
  const url = `https://toolviking.com/tools/${tool.slug}/`;
  const graph = [
    {
      '@type': 'WebApplication',
      '@id': `${url}#application`,
      name: tool.name,
      description,
      url,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript',
      isAccessibleForFree: true,
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://toolviking.com/' },
        { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://toolviking.com/tools/' },
        { '@type': 'ListItem', position: 3, name: tool.name, item: url },
      ],
    },
  ];
  const faq = extractFaq(html);
  if (faq.length) graph.push({ '@type': 'FAQPage', '@id': `${url}#faq`, mainEntity: faq });
  return `<script type="application/ld+json" data-tool-schema>${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>`;
}

for (const tool of catalog.tools) {
  const file = path.join(root, 'tools', tool.slug, 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  const details = content[tool.slug];
  const title = titleOverrides[tool.slug] || `${tool.name} - Free Online Tool | ToolViking`;
  const description = descriptionOverrides[tool.slug] || defaultDescription(tool);
  const url = `https://toolviking.com/tools/${tool.slug}/`;

  if (details) {
    html = html.replace(/(<h1>[^<]+<\/h1>)<p>[\s\S]*?<\/p>/, `$1<p>${escapeHtml(details.hero)}</p>`);
    html = html.replace(/<p class="notice">[\s\S]*?<\/p>/, `<p class="notice">${escapeHtml(details.notice)}</p>`);
    const guide = renderGuide(tool, details);
    if (/<section class="tool-guide">/.test(html)) {
      html = html.replace(/<section class="tool-guide">[\s\S]*?<\/section>(?=<section><div class="wrap"><h2>Related tools<\/h2>)/, guide);
    } else {
      html = html.replace(/(?=<section><div class="wrap"><h2>Related tools<\/h2>)/, guide);
    }
  }

  const relatedSection = renderRelated(tool.slug);
  if (relatedSection) {
    html = html.replace(/<section><div class="wrap"><h2>Related tools<\/h2>[\s\S]*?<\/section>/, relatedSection);
  }

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escapeHtml(description)}">`);
  html = html.replace(/<!-- tool-social-meta:start -->[\s\S]*?<!-- tool-social-meta:end -->/g, '');
  const social = `<!-- tool-social-meta:start --><meta property="og:type" content="website"><meta property="og:site_name" content="ToolViking"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${url}"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="${escapeHtml(title)}"><meta name="twitter:description" content="${escapeHtml(description)}"><!-- tool-social-meta:end -->`;
  html = html.replace(/(<meta name="description" content="[^"]*">)/, `$1${social}`);
  html = html.replace(/<script type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g, '');
  html = html.replace('</head>', `${renderSchema(tool, description, html)}</head>`);
  fs.writeFileSync(file, html);
}

console.log(`Enriched ${catalog.tools.length} tool pages.`);
