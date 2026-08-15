# Codex Setup for ToolViking

This repository now contains a private Codex operating layer.

## Already included in this repository
- `AGENTS.md` — ToolViking-specific rules Codex reads automatically from the project root.
- `.agents/skills/toolviking-product-strategy/SKILL.md`
- `.agents/skills/toolviking-production-qa/SKILL.md`
- `.agents/skills/toolviking-seo-pages/SKILL.md`
- `.agents/skills/toolviking-dashboard-products/SKILL.md`

When ToolViking is the primary folder/project in Codex, these repository instructions and skills can be discovered automatically.

## Recommended personal/global Codex instructions
The file `CODEX-GLOBAL-AGENTS.example.md` is a personal working-style template. Copy its contents to your Codex home `AGENTS.md` if you want the same behavior across your other repositories too.

Typical location:
- Windows: your Codex home folder under your user profile (Codex uses `~/.codex/AGENTS.md` conceptually).
- macOS/Linux: `~/.codex/AGENTS.md`.

Keep project-specific details in each repository's root `AGENTS.md`; keep only your reusable working preferences in the global file.

## Suggested first prompt in Codex
`Read AGENTS.md and the available ToolViking repository skills. Inspect the current project before making changes. Tell me the current architecture, what tests must pass before handoff, and the difference between public downloadable ToolViking skills and private Codex workflow skills.`
