const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const site = 'https://toolviking.com';
const productPath = '/shop/ai-small-business-playbook/';
const productUrl = `${site}${productPath}`;

const catalog = JSON.parse(fs.readFileSync(path.join(root, 'data/catalog.json'), 'utf8'));
const tools = new Map(catalog.tools.map((tool) => [tool.slug, tool]));

const esc = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const toolLink = (slug) => {
  if (!tools.has(slug)) throw new Error(`Unknown tool slug: ${slug}`);
  return `/tools/${slug}/`;
};

const product = {
  title: 'ToolViking AI Small Business Playbook',
  subtitle: '50 Practical Ways to Use AI to Save Time, Find Customers and Run Your Business',
  price: '$14.99',
};

const sections = [
  ['Part 1', 'Find & Win Customers', 'Turn unclear selling into practical customer-acquisition work.'],
  ['Part 2', 'Market Consistently', 'Create useful marketing, track campaigns, and review what worked.'],
  ['Part 3', 'Serve Customers Better', 'Reply faster, handle issues professionally, and improve support routines.'],
  ['Part 4', 'Protect Profit & Cash', 'Use AI with calculators to price, estimate, and review money decisions.'],
  ['Part 5', 'Save Time & Run Better', 'Document repeat work, plan capacity, and improve a little every week.'],
];

const recipes = [
  ['Part 1', 'Define your ideal customer', 'You are trying to sell to everyone, so your offer sounds vague.', 'A clear one-page ideal customer profile.', 'business-name-generator', '[BUSINESS TYPE], [BEST CUSTOMER], [LOCATION], [COMMON PROBLEM]', 'Create three customer profiles for a residential HVAC company in Hartford that wants emergency repair leads.', 'Ideal customer worksheet: niche, problem, trigger event, budget signal, decision maker, objections.'],
  ['Part 1', 'Clarify your offer in plain English', 'Customers do not instantly understand what you do or why it matters.', 'A simple offer statement you can use on a homepage, flyer, or email.', 'slogan-generator', '[SERVICE], [CUSTOMER], [PAIN], [RESULT]', 'Turn bookkeeping cleanup into: Get your books organized before tax season without losing a weekend.', 'Offer checklist: customer, painful problem, result, proof, next step.'],
  ['Part 1', 'Turn features into customer benefits', 'Your sales copy lists services but does not connect them to buyer outcomes.', 'A benefit map for service pages, proposals, and outreach.', 'word-counter', '[FEATURE LIST], [CUSTOMER TYPE], [BUYER WORRIES]', 'A garage-door company turns 24/7 service, stocked trucks, and licensed technicians into speed, safety, and fewer repeat visits.', 'Feature-to-benefit table: feature, customer pain, benefit, proof point, call to action.'],
  ['Part 1', 'Research customer pain-point questions', 'You need content and sales angles but are guessing what customers care about.', 'A list of real questions to answer in content and calls.', 'reading-time-calculator', '[CUSTOMER], [SERVICE], [SITUATION]', 'For pest control: questions about safety, pets, children, recurring visits, price, and preparation.', 'Question bank: urgent questions, price questions, trust questions, comparison questions, objections.'],
  ['Part 1', 'Build a simple lead magnet', 'Visitors leave without giving you a reason to follow up.', 'A useful checklist, mini-guide, or worksheet idea tied to your service.', 'word-counter', '[BUSINESS], [CUSTOMER PROBLEM], [DESIRED ACTION]', 'A roofing company creates a Storm Damage Photo Checklist homeowners can use before calling.', 'Lead magnet planner: promise, format, length, follow-up email, tool link.'],
  ['Part 1', 'Write a local outreach email', 'Cold outreach sounds generic and gets ignored.', 'A short, specific email with a relevant observation and one ask.', 'email-subject-checker', '[COMPANY], [OBSERVATION], [SERVICE], [OFFER]', 'A message to a plumbing company mentions after-hours emergency calls and offers a missed-call response idea.', 'Outreach template: subject, observation, problem, helpful idea, low-pressure CTA.'],
  ['Part 1', 'Create a follow-up sequence', 'Interested leads go quiet because nobody follows up consistently.', 'A respectful 4-message follow-up sequence.', 'lead-response-time-calculator', '[LEAD SOURCE], [OFFER], [TIME SINCE CONTACT], [NEXT STEP]', 'A quote request gets same-day, day-2, day-5, and day-10 follow-ups.', 'Follow-up tracker: date, message, response, next action, status.'],
  ['Part 1', 'Qualify leads consistently', 'You spend time on leads that are not a fit.', 'A lead qualification checklist and scoring prompt.', 'lead-value-calculator', '[SERVICE], [GOOD FIT SIGNALS], [BAD FIT SIGNALS], [AVERAGE JOB VALUE]', 'A cleaning company scores commercial leads by square footage, frequency, location, and urgency.', 'Lead scorecard: need, budget, timing, authority, fit, next action.'],
  ['Part 1', 'Decide what a lead is worth', 'You do not know what you can afford to pay for a lead.', 'A lead-value estimate connected to close rate and job value.', 'cost-per-lead-calculator', '[AVERAGE SALE], [CLOSE RATE], [GROSS MARGIN], [TARGET PROFIT]', 'If a $1,200 job closes at 20%, each raw lead is worth about $240 before cost and margin checks.', 'Lead economics sheet: sale value, close rate, margin, max CPL, notes.'],
  ['Part 1', 'Measure lead conversion', 'You have leads, but you do not know if sales are improving.', 'A simple lead-to-customer conversion review.', 'lead-conversion-calculator', '[LEADS], [CUSTOMERS WON], [CHANNEL], [DATE RANGE]', '42 Google Business Profile leads and 9 booked jobs becomes a conversion rate to review monthly.', 'Conversion review: channel, leads, won, rate, blocker, next test.'],

  ['Part 2', 'Create a 30-day content plan', 'You post randomly and then disappear.', 'A month of realistic content topics grouped by customer problem.', 'reading-time-calculator', '[BUSINESS], [CUSTOMER QUESTIONS], [SERVICES], [LOCAL AREA]', 'A contractor gets posts about emergency signs, maintenance, before/after jobs, and cost explanations.', 'Content calendar: theme, post idea, CTA, tool to use, publish date.'],
  ['Part 2', 'Turn one idea into five social posts', 'One good idea dies after one post.', 'Five post variations for different angles and formats.', 'word-counter', '[CORE IDEA], [AUDIENCE], [TONE], [PLATFORM]', 'One idea about missed calls becomes a story, checklist, myth, quick tip, and CTA post.', 'Repurpose sheet: idea, hook, format, CTA, character count.'],
  ['Part 2', 'Draft customer-focused website copy', 'Your page talks about the business instead of the buyer.', 'A clearer page section with problem, outcome, proof, and CTA.', 'word-counter', '[PAGE TYPE], [SERVICE], [CUSTOMER PAIN], [PROOF]', 'A landing page for same-day appliance repair leads with the customer emergency, not company history.', 'Website copy block: headline, problem, solution, proof, CTA.'],
  ['Part 2', 'Create better email subject lines', 'Emails are sent, but opens are weak.', 'A tested list of subject lines with risks flagged.', 'email-subject-checker', '[AUDIENCE], [EMAIL PURPOSE], [OFFER], [TONE]', 'A follow-up email becomes: Quick question about your roofing estimate.', 'Subject worksheet: angle, length, clarity, urgency, spam-risk words.'],
  ['Part 2', 'Build trackable campaign links', 'You cannot tell which post, email, or ad created traffic.', 'A clean UTM naming plan and campaign URL.', 'utm-builder', '[URL], [SOURCE], [MEDIUM], [CAMPAIGN], [CONTENT]', 'Create separate URLs for Facebook bio, email follow-up, and Google post campaigns.', 'UTM naming sheet: source, medium, campaign, content, owner.'],
  ['Part 2', 'Calculate campaign conversion', 'Traffic numbers look busy but do not show business results.', 'A conversion-rate review for one campaign.', 'conversion-rate-calculator', '[VISITS], [LEADS], [CAMPAIGN], [DATE RANGE]', '350 visits and 17 form fills shows whether the landing page is converting.', 'Campaign review: visits, conversions, rate, CTA, next test.'],
  ['Part 2', 'Calculate ad return', 'You spend on ads without knowing if revenue came back.', 'A simple ROAS check and interpretation.', 'roas-calculator', '[AD SPEND], [REVENUE], [PRODUCT/SERVICE], [TIME PERIOD]', 'Spend $400 to create $1,600 booked revenue and compare that against margin.', 'Ad review: spend, revenue, ROAS, margin note, decision.'],
  ['Part 2', 'Understand CPM and CPC', 'Ad reports show numbers, but you do not know what they mean.', 'A plain-English media-cost comparison.', 'cpm-calculator', '[SPEND], [IMPRESSIONS], [CLICKS], [CHANNEL]', 'Compare a Facebook awareness campaign by CPM and a search campaign by CPC.', 'Media worksheet: CPM, CPC, audience, intent, next metric.'],
  ['Part 2', 'Measure social engagement', 'Likes feel good, but you need a consistent engagement metric.', 'A simple engagement-rate review by post type.', 'social-engagement-rate-calculator', '[POSTS], [REACH OR FOLLOWERS], [ENGAGEMENTS]', 'Compare job photos, tips, and testimonials using the same engagement method.', 'Engagement review: post type, reach, engagement, rate, repeat/stop.'],
  ['Part 2', 'Create a monthly marketing review', 'You do marketing but never turn the results into decisions.', 'A one-page review with wins, losses, and next actions.', 'roas-calculator', '[MONTH], [CHANNELS], [SPEND], [LEADS], [SALES]', 'Review email, local SEO, Facebook posts, and paid ads at month end.', 'Monthly review: channel, input, output, lesson, next month action.'],

  ['Part 3', 'Draft faster customer replies', 'Routine replies take too long and vary by mood.', 'Reusable customer email drafts that still sound human.', 'word-counter', '[CUSTOMER MESSAGE], [BUSINESS POLICY], [DESIRED TONE]', 'Reply to a scheduling question with clear options and next steps.', 'Reply checklist: answer, empathy, action, deadline, contact path.'],
  ['Part 3', 'Respond to negative reviews calmly', 'A bad review triggers an emotional response.', 'A calm public reply and private follow-up plan.', 'word-counter', '[REVIEW TEXT], [FACTS], [POLICY], [DESIRED RESOLUTION]', 'Respond to a delayed appointment review without arguing or sharing private details.', 'Review response template: acknowledge, apologize if appropriate, fix path, offline contact.'],
  ['Part 3', 'Create an FAQ from repeated questions', 'Customers keep asking the same questions before buying.', 'A practical FAQ for your website, emails, or proposal.', 'reading-time-calculator', '[REPEATED QUESTIONS], [SERVICE], [POLICIES]', 'An electrician creates FAQs about estimates, permits, scheduling, and emergency calls.', 'FAQ worksheet: question, short answer, link, owner, update date.'],
  ['Part 3', 'Turn a complaint into an action plan', 'Complaints get handled case by case instead of improving the process.', 'A complaint summary with root cause and next step.', 'project-timeline-calculator', '[COMPLAINT], [TIMELINE], [TEAM NOTES], [DESIRED OUTCOME]', 'A missed appointment complaint becomes a scheduling-confirmation process fix.', 'Complaint triage: issue, impact, cause, owner, due date, follow-up.'],
  ['Part 3', 'Prepare appointment confirmations', 'Customers miss appointments or misunderstand what happens next.', 'A confirmation message with expectations and preparation steps.', 'word-counter', '[APPOINTMENT TYPE], [DATE/TIME], [PREP STEPS], [CONTACT METHOD]', 'A cleaning service sends prep instructions and arrival window reminders.', 'Confirmation template: time, location, prep, reschedule path, contact.'],
  ['Part 3', 'Handle delays professionally', 'Delays happen, but poor communication makes them worse.', 'A delay message that is honest, specific, and useful.', 'word-counter', '[DELAY REASON], [NEW ETA], [CUSTOMER IMPACT], [MAKE-GOOD IF ANY]', 'A contractor explains a material delay and gives a revised timeline.', 'Delay checklist: reason, ETA, options, apology, next update time.'],
  ['Part 3', 'Create a customer onboarding checklist', 'New customers are not sure what to send, expect, or do next.', 'A simple onboarding checklist for the first interaction.', 'project-timeline-calculator', '[SERVICE], [CLIENT INPUTS], [FIRST MILESTONE], [RISKS]', 'A web-design client gets asset, login, approval, and timeline steps.', 'Onboarding checklist: intake, assets, access, kickoff, milestone, approval.'],
  ['Part 3', 'Summarize customer conversations', 'Important details get lost after calls and messages.', 'A neutral conversation summary and action list.', 'word-counter', '[CALL NOTES], [CUSTOMER REQUEST], [COMMITMENTS]', 'Turn rough call notes into a follow-up summary before sending.', 'Conversation summary: request, facts, decisions, owner, due date.'],
  ['Part 3', 'Identify recurring customer issues', 'You keep fixing symptoms but not repeated problems.', 'A recurring-issue analysis from support notes.', 'support-staffing-calculator', '[SUPPORT NOTES], [DATE RANGE], [ISSUE TYPES]', 'A store finds shipping questions spike after promotions and updates its confirmation email.', 'Issue log: category, frequency, cause, fix, owner.'],
  ['Part 3', 'Plan support capacity', 'You guess staffing needs when volume changes.', 'A basic support capacity estimate with response expectations.', 'support-staffing-calculator', '[TICKETS], [HANDLE TIME], [TARGET RESPONSE], [AVAILABLE HOURS]', 'Estimate whether one admin can handle 160 weekly customer messages.', 'Capacity sheet: volume, handle time, hours, gap, plan.'],

  ['Part 4', 'Price a service for margin', 'You quote based on competitors instead of required profit.', 'A price check using cost, margin, and customer explanation.', 'profit-margin-calculator', '[SERVICE], [COSTS], [TARGET MARGIN], [VALUE DELIVERED]', 'A cleaning package is priced from labor, supplies, travel, and desired margin.', 'Pricing worksheet: cost, margin, price, value points, objection answer.'],
  ['Part 4', 'Set a sustainable hourly rate', 'Your hourly rate ignores admin time, taxes, and non-billable work.', 'A realistic hourly-rate floor.', 'hourly-rate-calculator', '[INCOME GOAL], [EXPENSES], [BILLABLE HOURS], [TAX BUFFER]', 'A freelancer sets a rate using realistic billable hours, not 40 hours/week.', 'Rate sheet: goal, expenses, billable hours, minimum, target.'],
  ['Part 4', 'Price a freelance project', 'Fixed projects expand but the price stays the same.', 'A project price with scope assumptions and buffer.', 'freelance-project-rate-calculator', '[PROJECT SCOPE], [HOURS], [COSTS], [RISK BUFFER]', 'A logo package includes discovery, concepts, revisions, files, and project management.', 'Project pricing: scope, hours, costs, buffer, exclusions.'],
  ['Part 4', 'Build a project estimate', 'Estimates miss labor, material waste, or overhead.', 'A clearer estimate with assumptions separated.', 'contractor-estimate-calculator', '[LABOR], [MATERIALS], [OVERHEAD], [PROFIT TARGET]', 'A painting estimate includes prep, materials, labor, overhead, and profit.', 'Estimate checklist: scope, quantities, labor, materials, overhead, exclusions.'],
  ['Part 4', 'Check job profitability', 'You know revenue but not what the job actually made.', 'A job-profit review and lesson for future estimates.', 'job-profit-calculator', '[REVENUE], [LABOR], [MATERIALS], [OVERHEAD], [OTHER COSTS]', 'A $7,500 job is reviewed after labor overruns and disposal fees.', 'Job review: estimate, actual, variance, cause, next estimating change.'],
  ['Part 4', 'Estimate startup costs', 'A new idea sounds cheap until setup costs appear.', 'A startup-cost list by one-time and monthly expenses.', 'startup-cost-calculator', '[BUSINESS IDEA], [TOOLS], [EQUIPMENT], [MONTHLY COSTS]', 'A mobile detailing business lists insurance, supplies, website, ads, and vehicle costs.', 'Startup worksheet: required, optional, one-time, monthly, defer/now.'],
  ['Part 4', 'Track monthly burn', 'Cash leaves the business faster than expected.', 'A monthly burn estimate and cost review.', 'burn-rate-calculator', '[CASH IN], [CASH OUT], [FIXED COSTS], [VARIABLE COSTS]', 'A small agency reviews software, contractors, ads, and subscriptions.', 'Burn review: income, expenses, net burn, cuts, owner.'],
  ['Part 4', 'Calculate cash runway', 'You do not know how long current cash will last.', 'A runway estimate with decisions to extend it.', 'cash-runway-calculator', '[CASH BALANCE], [MONTHLY BURN], [UPCOMING CHANGES]', 'A startup with $8,000 and $1,600 burn has about five months before changes.', 'Runway sheet: cash, burn, runway, risk, action.'],
  ['Part 4', 'Understand customer acquisition cost', 'You celebrate sales without checking acquisition cost.', 'A CAC calculation and channel decision.', 'customer-acquisition-cost-calculator', '[SALES/MARKETING COST], [NEW CUSTOMERS], [CHANNEL]', 'A $900 campaign that creates 12 customers has a $75 CAC before margin review.', 'CAC review: channel, spend, customers, CAC, keep/test/stop.'],
  ['Part 4', 'Estimate customer lifetime value', 'You treat every first sale as the whole customer value.', 'A simple LTV estimate to guide retention and acquisition.', 'customer-lifetime-value-calculator', '[AVERAGE REVENUE], [GROSS MARGIN], [RETENTION]', 'A monthly cleaning customer is worth more than the first appointment.', 'LTV worksheet: revenue, margin, repeat rate, retention action.'],

  ['Part 5', 'Find repetitive work worth automating', 'You want automation but do not know where it pays off.', 'A ranked list of automation opportunities.', 'automation-roi-calculator', '[TASKS], [TIME SPENT], [HOURLY VALUE], [TOOL COST]', 'Rank invoice reminders, intake forms, quote follow-ups, and report creation.', 'Automation scorecard: task, frequency, time, cost, ROI, risk.'],
  ['Part 5', 'Put a dollar value on saved time', 'Time savings sound nice but are hard to prioritize.', 'A savings estimate in hours and dollars.', 'employee-hours-saved-calculator', '[TASK], [MINUTES SAVED], [FREQUENCY], [HOURLY COST]', 'Saving 20 minutes per quote across 30 quotes/month becomes a dollar value.', 'Time-value sheet: task, saves, frequency, monthly value, next action.'],
  ['Part 5', 'Turn a repeated task into an SOP', 'Only one person knows how to do important work.', 'A step-by-step SOP draft with quality checks.', 'word-counter', '[TASK], [STEPS], [TOOLS USED], [QUALITY STANDARD]', 'Document how to respond to a new service inquiry from form submission to follow-up.', 'SOP template: purpose, trigger, steps, owner, QA, exceptions.'],
  ['Part 5', 'Prepare a delegation brief', 'Delegated work comes back wrong because expectations were unclear.', 'A brief someone else can execute.', 'employee-cost-calculator', '[TASK], [OUTCOME], [DEADLINE], [QUALITY STANDARD]', 'Delegate weekly social post scheduling with format, brand voice, and approval rules.', 'Delegation brief: outcome, scope, inputs, due date, done standard.'],
  ['Part 5', 'Create a weekly priority plan', 'Busy weeks happen without the most important work moving.', 'A five-priority weekly plan tied to revenue and operations.', 'project-timeline-calculator', '[GOALS], [DEADLINES], [BLOCKERS], [AVAILABLE HOURS]', 'A founder allocates five hours to outreach, one offer page, and follow-ups.', 'Weekly plan: goal, task, time block, owner, proof done.'],
  ['Part 5', 'Calculate the real cost of meetings', 'Meetings feel free because nobody sees the labor cost.', 'A meeting-cost review and decision rule.', 'meeting-cost-calculator', '[ATTENDEES], [DURATION], [HOURLY COSTS], [PURPOSE]', 'A 90-minute weekly meeting with five people becomes a visible monthly cost.', 'Meeting audit: purpose, cost, decision, owner, replacement.'],
  ['Part 5', 'Plan project timelines', 'Projects slip because tasks and dependencies are fuzzy.', 'A simple timeline with milestones and risk buffers.', 'project-timeline-calculator', '[PROJECT], [TASKS], [DEPENDENCIES], [DEADLINE]', 'A website project is split into content, design, build, review, and launch.', 'Timeline sheet: task, owner, duration, dependency, buffer.'],
  ['Part 5', 'Plan capacity before overcommitting', 'You say yes to work without knowing if the team can handle it.', 'A capacity check before accepting more work.', 'capacity-planner', '[TEAM], [HOURS AVAILABLE], [CURRENT WORK], [NEW REQUEST]', 'A small agency checks if it can accept two new client projects this month.', 'Capacity worksheet: available hours, committed hours, gap, decision.'],
  ['Part 5', 'Create a simple inventory reorder routine', 'Stockouts and overbuying happen because reorder points are guessed.', 'A reorder checklist using demand and lead time.', 'reorder-point-calculator', '[ITEM], [DAILY USAGE], [LEAD TIME], [SAFETY STOCK]', 'An ecommerce seller sets reorder points for packaging and top products.', 'Reorder sheet: SKU, usage, lead time, safety stock, reorder point.'],
  ['Part 5', 'Run a five-hour weekly AI improvement sprint', 'You keep learning AI but do not turn it into business improvements.', 'A weekly sprint that ships one small workflow improvement.', 'automation-roi-calculator', '[BUSINESS GOAL], [REPETITIVE TASK], [AVAILABLE HOURS], [SUCCESS METRIC]', 'Spend five hours improving quote follow-ups, then measure response time and booked jobs.', 'Sprint plan: choose, build, test, measure, document.'],
];

const recipesByPart = sections.map(([part, name]) => ({
  part,
  name,
  recipes: recipes.filter((recipe) => recipe[0] === part),
}));

const futureTools = [
  'Persona Builder',
  'Offer Builder',
  'Customer Question Planner',
  'Marketing Calendar',
  'Customer Reply Builder',
  'Review Response Builder',
  'FAQ Builder',
  'Complaint Triage Template',
  'Message Template Builder',
  'SOP Builder',
  'Delegation Brief Builder',
  'Weekly Business Planner',
];

const makePrompt = (recipe) => `You are helping a small-business owner complete this task: ${recipe[1]}.

Business problem to solve: ${recipe[2]}
Desired outcome: ${recipe[3]}
Use this practical example as the level of specificity to aim for: ${recipe[6]}

Business context:
- Business: [BUSINESS NAME AND TYPE]
- Customer: [CUSTOMER TYPE]
- Location/market: [LOCATION OR MARKET]
- Offer/service: [SERVICE OR PRODUCT]
- Constraints: [BUDGET, TIME, TEAM, POLICIES]
- Required placeholders to account for: ${recipe[5]}

Create:
1. A plain-English recommendation for this exact situation
2. The draft, table, checklist, or worksheet I can use immediately
3. A section labeled "Customize before using" with every placeholder I must replace
4. A review checklist based on this template: ${recipe[7]}
5. The next action I should take after reviewing the output

Important: do not invent facts, claims, testimonials, prices, legal terms, or guarantees. Ask me what is missing if the input is not enough.`;

const recipeMarkdown = (recipe, index) => {
  const tool = tools.get(recipe[4]);
  return `### ${index}. ${recipe[1]}

**Real business problem:** ${recipe[2]}

**Desired outcome:** ${recipe[3]}

**Plain-English explanation:** Use AI to organize the thinking and first draft, then use ToolViking to check the numbers, length, or operational detail before publishing or deciding.

**Step-by-step workflow:**
1. Fill in the placeholders before asking AI for help.
2. Generate the first draft, list, or worksheet.
3. Check the relevant number or constraint in ToolViking.
4. Edit for your real policy, tone, price, deadline, and customer situation.
5. Save the final version as a reusable template.

**Copy/paste AI prompt:**

\`\`\`text
${makePrompt(recipe)}
\`\`\`

**Placeholders to customize:** ${recipe[5]}

**Practical example:** ${recipe[6]}

**Template/checklist/worksheet:** ${recipe[7]}

**Relevant ToolViking tool:** ${tool.name}

**Direct ToolViking tool link:** ${site}${toolLink(recipe[4])}

**Verification/review step:** Check the AI output against your actual numbers, customer facts, policies, and ToolViking result before sending, publishing, quoting, or deciding.

**Recommended next action:** Open ${tool.name}, run the related calculation or check, then save the finished output in your business template folder.
`;
};

const fullPlaybook = `# ${product.title}

## ${product.subtitle}

Planned launch price: ${product.price}

This is an operational manual for entrepreneurs, freelancers, contractors, agencies, ecommerce sellers, and small-business owners. It is not a generic AI theory ebook. Each recipe is designed to help the reader complete one real business task and then connect back to a relevant ToolViking tool.

## Safety and privacy rules

- Do not paste confidential customer information, employee information, passwords, payment details, sensitive financial information, medical information, or proprietary business data into public AI systems.
- AI-generated material involving legal, financial, contractual, employment, safety, tax, or other consequential decisions should be reviewed by a qualified human where appropriate.
- Do not use AI output as proof, a guarantee, or a replacement for accurate business records.

## ToolViking workflow

Search -> free ToolViking tool -> relevant recipe -> prompt/template -> ToolViking calculation or check -> next product/tool discovery.

${recipesByPart.map((section) => `## ${section.part} - ${section.name}

${section.recipes.map((recipe, recipeIndex) => recipeMarkdown(recipe, recipes.indexOf(recipe) + 1)).join('\n')}`).join('\n')}

## Future ToolViking tool opportunities discovered

${futureTools.map((tool) => `- ${tool}`).join('\n')}

These are documented as future opportunities only. The flagship playbook intentionally uses existing ToolViking tools wherever possible before adding new public routes.
`;

const layout = ({ title, description, canonical, body, schema = '' }) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}"><link rel="icon" href="/assets/helmet.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/style.css">
${schema}
</head>
<body class="shop-page">
<a class="skip-link" href="#main">Skip to main content</a>
<header><nav class="wrap" aria-label="Primary navigation"><a class="brand" href="/" aria-label="ToolViking home"><span class="brand-mark">V</span><span class="brand-name">ToolViking</span></a><div class="links"><a href="/tools/">Tools</a><a href="/dashboards/">Dashboards</a><a href="/skills/">AI Skills</a><a href="/shop/" aria-current="page">Shop</a><a href="/about/">About</a></div></nav></header>
<main id="main">${body}</main>
<footer><div class="wrap"><a class="brand" href="/"><span class="brand-mark">V</span><span class="brand-name">ToolViking</span></a><p>Build • Launch • Grow</p><p>Practical business tools and problem-solving products.</p><a href="/methodology/">Methodology</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="/disclaimer/">Disclaimer</a><a href="/contact/">Contact</a></div></footer>
<script src="/assets/app.js"></script>
</body></html>`;

const productSchema = `<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${productUrl}#webpage`,
      name: `${product.title}: ${product.subtitle}`,
      description: 'A practical AI playbook for small-business owners with 50 workflows, prompts, templates, worksheets, and ToolViking tool links.',
      url: productUrl,
      isPartOf: { '@type': 'WebSite', name: 'ToolViking', url: site },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${productUrl}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` },
        { '@type': 'ListItem', position: 2, name: 'Shop', item: `${site}/shop/` },
        { '@type': 'ListItem', position: 3, name: product.title, item: productUrl },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${productUrl}#faq`,
      mainEntity: [
        { '@type': 'Question', name: 'Is this a generic AI ebook?', acceptedAnswer: { '@type': 'Answer', text: 'No. The playbook is structured as 50 practical business recipes with prompts, workflows, templates, review steps, and links to relevant ToolViking tools.' } },
        { '@type': 'Question', name: 'Can I buy it today?', acceptedAnswer: { '@type': 'Answer', text: 'Checkout and secure digital delivery are not connected yet. The product page shows the planned launch product and price without presenting a fake purchase flow.' } },
        { '@type': 'Question', name: 'What should I avoid putting into AI tools?', acceptedAnswer: { '@type': 'Answer', text: 'Do not paste passwords, payment details, confidential customer or employee data, sensitive financial information, medical information, or proprietary business data into public AI systems.' } },
      ],
    },
  ],
})}</script>`;

const productBody = `
<section class="hero shop-hero"><div class="wrap">
<nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>›</span><a href="/shop/">Shop</a><span>›</span><span aria-current="page">AI Small Business Playbook</span></nav>
<div class="eyebrow">Flagship product</div>
<h1>${product.title}<br><span class="accent">${product.subtitle}</span></h1>
<p>An operational manual for entrepreneurs, freelancers, contractors, agencies, ecommerce sellers, and small-business owners who want AI to help them finish real business work, not just read AI theory.</p>
<div class="actions"><a class="btn" href="#launch-status">Planned price ${product.price}</a><a class="btn secondary" href="#sample-recipe">See sample recipe</a></div>
<div class="trust-row"><span>50 practical recipes</span><span>Copy/paste prompts</span><span>ToolViking deep links</span></div>
</div></section>
<section class="shop-product-overview"><div class="wrap product-grid"><article class="product-main">
<span class="eyebrow">Problem solved</span><h2>Use AI like a practical business assistant, then verify the work with ToolViking tools.</h2>
<p class="muted">The playbook connects everyday business problems to prompts, worksheets, checklists, and calculators. The loop is simple: use a free ToolViking tool, apply the relevant recipe, then come back to the tool to check the number, link, length, capacity, or timeline.</p>
<div class="shop-includes"><span>50 workflows</span><span>50+ prompts</span><span>Editable placeholders</span><span>Worksheets</span><span>Review steps</span><span>Tool links</span></div>
</article><aside class="product-side"><div class="stat-card"><span class="tag">Launch price</span><strong>${product.price}</strong><p class="muted">Planned one-time digital product price. Checkout is not connected yet.</p></div><div class="stat-card"><span class="tag">Format</span><strong>50</strong><p class="muted">Recipes across customer acquisition, marketing, service, profit, and operations.</p></div></aside></div></section>
<section><div class="wrap"><div class="section-head"><div><span class="eyebrow">Inside the playbook</span><h2>Five sections built around real small-business work.</h2></div><p>No filler chapters. Each part maps to work a business owner actually needs to complete.</p></div><div class="shop-section-grid">
${sections.map(([part, name, desc]) => `<article class="shop-section-card"><span class="tag">${part}</span><h3>${name}</h3><p>${desc}</p></article>`).join('')}
</div></div></section>
<section class="product-band"><div class="wrap product-grid"><article class="product-main" id="sample-recipe"><span class="eyebrow">Sample recipe</span><h2>Write a local outreach email</h2><p class="muted"><strong>Problem:</strong> cold outreach sounds generic and gets ignored. <strong>Outcome:</strong> a short, specific email with a relevant observation and one clear ask.</p><pre class="prompt-sample"><code>You are helping a small-business owner write a local outreach email.

Business: [YOUR BUSINESS]
Prospect: [COMPANY NAME]
Observation: [REAL OBSERVATION FROM THEIR SITE]
Offer: [YOUR OFFER]
Tone: helpful, direct, not pushy

Write:
1. Three subject lines
2. One email under 120 words
3. One follow-up message
4. A checklist to verify before sending</code></pre></article><aside class="product-main"><span class="eyebrow">Worksheet sample</span><h2>Lead economics check</h2><ul class="check-list"><li>Average job value: [AMOUNT]</li><li>Estimated close rate: [PERCENT]</li><li>Maximum affordable cost per lead: [AMOUNT]</li><li>Tool to use: <a href="/tools/cost-per-lead-calculator/">Cost Per Lead Calculator</a></li><li>Review step: compare lead cost to margin before spending.</li></ul></aside></div></section>
<section><div class="wrap"><div class="section-head"><div><span class="eyebrow">Examples of recipes</span><h2>Built for tasks, not theory.</h2></div><p>Every recipe includes the problem, desired outcome, workflow, prompt, placeholders, example, worksheet, relevant ToolViking link, review step, and next action.</p></div><div class="grid">
${[recipes[5], recipes[14], recipes[34], recipes[40], recipes[49], recipes[21]].map((recipe) => `<a class="card" href="${toolLink(recipe[4])}"><span class="tag">${recipe[0]}</span><h3>${recipe[1]}</h3><p class="muted">${recipe[3]}</p><span class="card-link">${tools.get(recipe[4]).name} →</span></a>`).join('')}
</div></div></section>
<section><div class="wrap"><div class="section-head"><div><span class="eyebrow">ToolViking integration</span><h2>The product sends buyers back into the ecosystem.</h2></div><p>Relevant recipes point to existing calculators and utilities so the buyer can move from AI draft to measurable business decision.</p></div><div class="category-pills">
${['lead-value-calculator','cost-per-lead-calculator','lead-conversion-calculator','conversion-rate-calculator','roas-calculator','cpc-calculator','cpm-calculator','email-subject-checker','profit-margin-calculator','job-profit-calculator','automation-roi-calculator','employee-hours-saved-calculator'].map((slug) => `<a class="pill" href="${toolLink(slug)}">${tools.get(slug).name}</a>`).join('')}
</div></div></section>
<section id="launch-status"><div class="wrap"><div class="notice"><strong>Digital product disclosure:</strong> Checkout and secure delivery are not connected yet. This page describes the planned flagship product and planned $14.99 launch price without pretending a purchase flow is live. When checkout is added, Stripe and secure delivery must be tested before production launch.</div><div class="notice shop-safety"><strong>AI safety:</strong> Do not paste confidential customer data, employee data, passwords, payment details, sensitive financial records, medical information, or proprietary business data into public AI tools. Review AI output before using it for legal, financial, contractual, employment, safety, or customer-facing decisions.</div></div></section>
<section><div class="wrap"><div class="faq"><span class="eyebrow">Common questions</span><h2>AI Small Business Playbook FAQ</h2><details><summary>Is this a generic AI ebook?</summary><p>No. It is structured as 50 business recipes with prompts, workflows, placeholders, examples, worksheets, review steps, and links to relevant ToolViking tools.</p></details><details><summary>Who is it for?</summary><p>Entrepreneurs, freelancers, contractors, small agencies, ecommerce sellers, local service businesses, and owner-operators who need practical workflows more than AI theory.</p></details><details><summary>Can I buy it today?</summary><p>Not yet. Checkout and secure digital delivery are intentionally not connected until the product files, page, SEO, tests, and Stripe implementation plan are verified.</p></details><details><summary>Will the recipes guarantee results?</summary><p>No. They help organize work and improve execution, but results depend on the offer, market, pricing, follow-up, quality, and human review.</p></details></div></div></section>`;

const shopBody = `<section class="hero shop-hero"><div class="wrap">
<div class="breadcrumb"><a href="/">Home</a><span>›</span><span aria-current="page">Shop</span></div>
<div class="eyebrow">ToolViking Shop</div><h1>One excellent product first.<br><span class="accent">Not a generic ebook store.</span></h1>
<p>The ToolViking Shop is being built around a product-led loop: Google Search → free ToolViking tool → relevant paid playbook → deep links back to ToolViking tools → additional product discovery.</p>
<div class="trust-row"><span>Problem-led products</span><span>Free-tool-first experience</span><span>No fake checkout</span></div>
</div></section>
<section class="shop-intro"><div class="wrap"><article class="product-main flagship-product"><span class="eyebrow">Flagship launch product</span><h2>${product.title}</h2><p class="muted"><strong>${product.subtitle}.</strong> A practical operating manual with 50 recipes, copy/paste prompts, editable placeholders, worksheets, review steps, and direct links to existing ToolViking tools.</p><div class="shop-meta"><span>Planned launch price</span><strong>${product.price}</strong></div><div class="shop-includes"><span>50 recipes</span><span>50+ prompts</span><span>Templates</span><span>Worksheets</span><span>Tool deep links</span></div><div class="actions"><a class="btn" href="${productPath}">View flagship product</a><a class="btn secondary" href="/tools/">Start with free tools</a></div></article><div class="notice"><strong>Shop preview:</strong> Checkout and digital delivery are not connected yet. We are finishing one sellable flagship product before expanding the catalog.</div></div></section>
<section><div class="wrap"><div class="section-head"><div><span class="eyebrow">Future editions</span><h2>Roadmap products stay secondary until the flagship is complete.</h2></div><p>These are expansion opportunities, not finished purchasable products.</p></div><div class="shop-grid">
${[
  ['AI for Contractors Edition','Contractors','More jobs, clearer estimates, follow-ups, review replies, and admin workflows.'],
  ['AI for Realtors Edition','Real estate','Listing copy, client follow-up, showing prep, and local content workflows.'],
  ['AI for Ecommerce Sellers','Ecommerce','Listings, abandoned-cart messages, product FAQs, and conversion checks.'],
  ['AI for Freelancers','Freelancing','Client finding, pricing, proposals, onboarding, and delivery systems.'],
  ['AI Marketing Without an Agency','Marketing','Campaign planning, content, email, landing copy, and measurement.'],
  ['Client Onboarding System','Operations','Reusable onboarding, intake, timeline, and approval workflows.'],
  ['Email & Follow-Up Kit','Sales','Sequences for leads, quotes, invoices, no-shows, and stale opportunities.'],
  ['SOP Builder','Operations','Turn repeated work into documented steps, QA checks, and delegation briefs.'],
  ['Local Business SEO Kit','Local SEO','Practical local-page, review, and Google Business Profile workflows.'],
  ['AI Automation for Beginners','Automation','Find repetitive tasks, measure savings, and build safe first automations.'],
].map((item, index) => `<article class="shop-card future-card"><div class="shop-card-top"><span class="shop-number">${String(index + 1).padStart(2, '0')}</span><span class="shop-status">Future</span></div><span class="tag">${item[1]}</span><h3>${item[0]}</h3><p>${item[2]}</p><div class="shop-includes"><span>Roadmap</span><span>Not checkout-ready</span></div></article>`).join('')}
</div></div></section>
<section class="product-band"><div class="wrap product-grid"><div class="product-main"><span class="eyebrow">The ToolViking difference</span><h2>The guide teaches the system. The tools help users do the work.</h2><p class="muted">The first product is designed to send readers back into calculators, planners, and checkers instead of leaving them with a PDF they read once and forget.</p><div class="actions"><a class="btn" href="${productPath}">Open flagship page</a><a class="btn secondary" href="/tools/">Explore free tools</a></div></div><div class="product-side"><div class="stat-card"><span class="tag">Launch focus</span><strong>1</strong><p class="muted">One polished flagship before more products.</p></div><div class="stat-card"><span class="tag">Recipes</span><strong>50</strong><p class="muted">Mapped to existing ToolViking tools.</p></div></div></div></section>`;

const shopHtml = layout({
  title: 'ToolViking Shop - AI Small Business Playbook',
  description: 'The ToolViking Shop starts with one flagship product: an AI Small Business Playbook with 50 practical recipes, prompts, worksheets, and ToolViking tool links.',
  canonical: `${site}/shop/`,
  body: shopBody,
});

const productHtml = layout({
  title: 'AI Small Business Playbook - 50 Practical AI Workflows | ToolViking',
  description: 'A practical AI playbook for small-business owners with 50 workflows, prompts, templates, worksheets, and ToolViking tool links. Planned launch price $14.99.',
  canonical: productUrl,
  schema: productSchema,
  body: productBody,
});

const ensureDir = (filePath) => fs.mkdirSync(path.dirname(filePath), { recursive: true });
const write = (relative, content) => {
  const filePath = path.join(root, relative);
  ensureDir(filePath);
  fs.writeFileSync(filePath, content, 'utf8');
};

write('shop/index.html', shopHtml);
write('shop/ai-small-business-playbook/index.html', productHtml);
write('shop/ai-small-business-playbook/PLAYBOOK.md', fullPlaybook);

const sitemapPath = path.join(root, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapPath, 'utf8');
const productLoc = `<url><loc>${productUrl}</loc></url>`;
if (!sitemap.includes(productUrl)) {
  sitemap = sitemap.replace('</urlset>', `${productLoc}</urlset>`);
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
}

const ctaSlugs = [
  'lead-conversion-calculator',
  'cost-per-lead-calculator',
  'lead-value-calculator',
  'lead-response-time-calculator',
  'conversion-rate-calculator',
  'roas-calculator',
  'cpc-calculator',
  'cpm-calculator',
  'email-subject-checker',
  'profit-margin-calculator',
  'hourly-rate-calculator',
  'freelance-project-rate-calculator',
  'contractor-estimate-calculator',
  'job-profit-calculator',
  'startup-cost-calculator',
  'burn-rate-calculator',
  'cash-runway-calculator',
  'customer-acquisition-cost-calculator',
  'customer-lifetime-value-calculator',
  'automation-roi-calculator',
  'employee-hours-saved-calculator',
  'meeting-cost-calculator',
  'project-timeline-calculator',
  'capacity-planner',
  'reorder-point-calculator',
  'word-counter',
  'reading-time-calculator',
  'utm-builder',
];

const cta = `<section class="playbook-cta" data-shop-cta><div class="wrap"><div class="playbook-cta-box"><div><span class="eyebrow">Use this in a real workflow</span><h2>Want the complete AI small-business system?</h2><p class="muted">The ToolViking AI Small Business Playbook turns this kind of tool into 50 practical recipes with prompts, worksheets, review steps, and direct links back to ToolViking calculators.</p></div><a class="btn secondary" href="${productPath}">See the playbook →</a></div></div></section>`;

for (const slug of ctaSlugs) {
  const file = path.join(root, 'tools', slug, 'index.html');
  if (!fs.existsSync(file)) throw new Error(`CTA target page missing: ${slug}`);
  let html = fs.readFileSync(file, 'utf8').replace(/<section class="playbook-cta" data-shop-cta>[\s\S]*?<\/section>/, '');
  html = html.replace('<section class="category-return-section">', `${cta}<section class="category-return-section">`);
  fs.writeFileSync(file, html, 'utf8');
}

console.log(JSON.stringify({
  status: 'built',
  recipes: recipes.length,
  integratedTools: new Set(recipes.map((recipe) => recipe[4])).size,
  contextualCtas: ctaSlugs.length,
  futureTools,
}, null, 2));
