---
name: toolviking-dashboard-products
description: Use when designing, building, reviewing, packaging, or pricing ToolViking dashboard templates such as SaaS, CRM, agency, ecommerce, finance, AI SaaS, or future premium dashboard products.
---

# ToolViking Dashboard Products

Treat dashboards as products buyers can actually use, not screenshot collections.

## Product principle
A paid dashboard should solve a coherent job for a defined buyer and include realistic states, tables, filters, navigation, settings, empty states, responsive behavior, and reusable components appropriate to the chosen stack.

## Honesty boundary
UI can demonstrate integrations, billing, authentication, analytics, or APIs only when clearly presented as template/demo UI unless those systems are genuinely connected. Never label simulated data or disconnected controls as live production functionality.

## Packaging strategy
Where appropriate, preserve a tiered model:
- Free starter: useful limited sample.
- Pro UI: complete commercial interface/template.
- Full-stack edition: only after authentication, database, billing, authorization, secrets handling, and delivery have actually been implemented and tested.

## Build decisions
- Follow the requested product stack when a dashboard product is intentionally being built in Next.js/React/etc.
- Do not migrate the main static ToolViking marketing/tool site merely because dashboard products use a modern application framework.
- Prefer reusable foundations so later niche dashboards share components without becoming clones.

## Buyer-value checks
Before adding a dashboard module, ask whether a real buyer would use it. Favor meaningful SaaS/business workflows over ornamental charts.
