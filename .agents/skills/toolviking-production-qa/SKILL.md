---
name: toolviking-production-qa
description: Use whenever changing ToolViking code, calculators, downloads, navigation, SEO files, dashboards, or public pages and especially before claiming a fix is complete or handing over a ZIP/commit.
---

# ToolViking Production QA

The goal is to prevent “looks fixed in code” from being mistaken for “works correctly.”

## Workflow
1. Inspect the relevant existing implementation first.
2. Reproduce or identify the failure condition when fixing a bug.
3. Make the smallest coherent change.
4. Run repository tests:
   - `python tests/site_structure.py`
   - `node tests/calculator-smoke.js`
5. Add task-specific validation.
6. Review the final diff.
7. Only then report completion.

## Task-specific checks
### Calculator changes
- Test normal values, zero, empty input, decimals, and a relevant edge case.
- Ensure no `NaN`, `Infinity`, or obviously misleading result.
- Verify labels, formula, units, and explanatory result text agree.

### New tool route
- Catalog entry exists.
- Page exists at the intended slug.
- `assets/app.js` supports the slug.
- Navigation/internal links are valid.
- Sitemap is updated when the route is public/indexable.
- Catalog count expectation in tests is updated deliberately.

### UI changes
- Verify desktop and narrow/mobile layout when browser tooling is available.
- Test buttons, links, forms, keyboard-relevant interactions, and visible states affected by the change.
- Preserve approved styling outside the requested scope.

### Download products
- Verify the ZIP opens.
- Verify expected root folder and files are present.
- Ensure no secrets, local junk, node_modules, caches, or unrelated source are included.

### SEO changes
- Inspect title, meta description, canonical, H1, content, links, and sitemap relationship.
- Avoid schema or copy that claims features not actually implemented.

## Completion language
Say a check “passed” only if it actually ran and passed. If browser testing, deployment, network access, or a production build was unavailable, say so explicitly and separate that from checks that did pass.
