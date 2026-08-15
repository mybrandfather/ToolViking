# ToolViking Codex Instructions

## Mission
ToolViking is a practical business-tool platform. Build useful, searchable tools, dashboards, and reusable agent-skill products that solve real business problems. Do not add features merely to increase page count.

## Current repository facts
- This repository is intentionally dependency-free and static: HTML, CSS, JavaScript, JSON, Python tests, and downloadable ZIP assets.
- The current catalog contains 58 browser tools, 25 public Agent Skill products, and 6 dashboard product pages.
- `data/catalog.json` is the source of truth for catalog entries.
- `assets/app.js` contains the browser-tool field definitions and calculation logic.
- `tests/site_structure.py` validates routes, catalog counts, archives, and internal static links.
- `tests/calculator-smoke.js` validates that every calculator can render a valid default result.
- No backend, authentication, database, checkout, protected delivery, email service, analytics integration, or paid AI/API is currently connected. Never imply that one is live unless it has been implemented and verified.

## How to work with the owner
- Inspect the existing code before proposing or making changes.
- Preserve approved design, layout, brand direction, interactions, and working features unless the task explicitly requests a redesign.
- Do not replace the current architecture, framework, or hosting model just because another stack is fashionable.
- Suggestions from Claude, Kimi, Gemini, DeepSeek, Perplexity, other AIs, articles, or competitors are candidates only. Evaluate them against ToolViking's strategy before implementing.
- Prefer completing the requested work over producing a long explanation.
- When requirements are incomplete but the intent is clear, make the safest reasonable choice and document it.
- Do not claim success because code merely looks correct. Verify behavior.

## Approved visual direction
- The approved ToolViking brand is premium, modern, clean, and utility-first — not a generic directory of cards.
- Use a midnight/navy foundation with steel/ice neutrals and restrained Viking-gold accents. Avoid cartoon Viking imagery, novelty medieval styling, and emoji logos.
- The experience should feel closer to polished modern software products such as premium developer/business tools: strong hierarchy, generous spacing, crisp typography, refined panels, and purposeful motion only when it improves usability.
- Tools are the primary homepage experience. Agent Skills and Dashboard products are secondary product layers, not equal-weight clutter above the fold.
- Preserve this design system unless the owner explicitly approves a redesign. Do not substitute a different theme because it is easier or more fashionable.

## Product strategy
- Prioritize real search intent and recurring business pain: finance, sales, marketing, freelancers, agencies, contractors, ecommerce, operations, SaaS, warehouse/operations, and AI-business economics.
- Prefer tools that can run locally in the browser: calculators, generators, planners, checklists, templates, localStorage workflows, CSV/PDF export, and copy/download functions.
- Avoid recurring paid APIs unless the feature has enough user value and monetization to justify operating cost.
- Each major tool should have a focused indexable page and useful internal links to related tools or category hubs.
- Do not create thin, near-duplicate pages purely for SEO.
- Free tools should be genuinely useful before any monetization prompt.
- Dashboard products should be useful commercial templates, not decorative mockups with fake claims about integrations.

## Public Agent Skills vs private Codex skills
- `downloads/skills/**` and `skills/**` are ToolViking products intended for site visitors.
- `.agents/skills/**` contains private repository workflows for Codex.
- Never expose, merge, rename, or treat the private Codex workflow skills as public ToolViking products unless explicitly requested.

## Coding rules
- Keep changes minimal and consistent with the existing dependency-free architecture unless the task explicitly calls for a migration.
- Reuse existing CSS classes, page structure, metadata patterns, and JavaScript helpers when possible.
- For a new calculator, update all required surfaces together: `data/catalog.json`, its route page, `assets/app.js`, sitemap/internal links where appropriate, and tests/count expectations if the catalog size changes.
- Validate user inputs and prevent `NaN`, `Infinity`, misleading negative values, unsafe HTML injection, or divide-by-zero behavior.
- Browser tools should keep user-entered data local unless a task explicitly introduces a backend and privacy disclosure.
- Do not add secrets, credentials, private keys, tokens, customer data, or real production identifiers to the repository.

## SEO and content rules
- Write for the user first, then search intent.
- Use one clear H1, descriptive title/meta description, canonical URL, useful explanatory content, worked examples where relevant, FAQs only when helpful, and contextual internal links.
- Avoid keyword stuffing, doorway pages, fabricated statistics, fabricated testimonials, fabricated customer counts, and unsupported claims such as “#1,” “best,” or “trusted by thousands.”
- Keep sitemap and robots behavior consistent with actual public routes.
- Do not mark nonexistent integrations or premium capabilities as live.

## Required verification before declaring completion
Run at minimum from the repository root:

```bash
python tests/site_structure.py
node tests/calculator-smoke.js
```

Then perform task-specific checks. For UI or interaction changes, inspect the actual rendered behavior in a browser when browser tooling is available. For downloadable ZIP changes, inspect the archive contents. For SEO changes, verify the generated/static page source, canonical, internal links, and sitemap entry where applicable.

If a required verification cannot be run, state exactly which check was unavailable. Do not replace a failed or unavailable build/test with a success claim.

## Handoff standard
Before handing work back:
1. Review the diff for unintended changes.
2. Run the required tests.
3. Confirm requested behavior, not just syntax.
4. Report what changed and what was actually verified.
5. Mention any genuine remaining limitation.

## Useful private Codex skills
Use the repository skills in `.agents/skills/` when the task matches them:
- `toolviking-product-strategy`
- `toolviking-production-qa`
- `toolviking-seo-pages`
- `toolviking-dashboard-products`
