# Claude Certified Architect – Foundations: Hands-On Lab Guide

A complete hands-on study guide for the **Claude Certified Architect – Foundations** certification exam. Covers all 30 task statements across 5 domains with 31 interactive labs, runnable Python scripts, and a 60-question practice exam.

## Quick Start

```bash
git clone <repo-url>
cd claude-architect-lab-guide
npm install
npm run build
# Open lab-guide.html in your browser
```

## What's Inside

| Module | Domain | Labs | Weight |
|--------|--------|------|--------|
| 1. Agentic Architecture & Orchestration | Domain 1 | 1.1–1.7 | 27% |
| 2. Tool Design & MCP Integration | Domain 2 | 2.1–2.5 | 18% |
| 3. Claude Code Configuration & Workflows | Domain 3 | 3.1–3.6 | 20% |
| 4. Prompt Engineering & Structured Output | Domain 4 | 4.1–4.6 | 20% |
| 5. Context Management & Reliability | Domain 5 | 5.1–5.6 | 15% |
| Final Scenario | All | 1 lab | — |
| Practice Exam | All | 60 questions | — |

**Total:** 31 labs plus a 60-question practice exam.

## Prerequisites

- **Node.js 18+** — for building the HTML guide
- **Claude Code** (recommended) — CLI or IDE extension for interactive exercises

## Building

```bash
npm run build          # Build lab-guide.html from markdown source
```

The build reads `Hands on Lab` (markdown) and produces a self-contained `lab-guide.html` with syntax highlighting, responsive layout, and interactive navigation.

## Testing

```bash
npm test               # Run all validation
npm run test:answers   # Verify practice exam answer count + distribution
npm run test:links     # Check for broken internal links in HTML
npm run test:html      # Validate HTML structure and accessibility basics
```

## How Each Lab Works

Every lab follows a 5-section exam-first template:

1. **What the exam tests** — bullets mapped to the task statement's "Knowledge of" list
2. **Concept + code inline** — the pattern explained alongside a worked Python example
3. **Anti-pattern blocks** — wrong approaches shown with visual `✗` / `✓` callouts
4. **Check your understanding** — three multiple-choice questions with wrong-answer explanations
5. **Exam tips** — distractor patterns and core takeaways

## Repository Structure

```
Hands on Lab          # Markdown source (all content)
build.js              # Converts markdown → HTML
lab-guide.html        # Generated output (open in browser)
index.html            # Copy of lab-guide.html (for GitHub Pages)
tests/                # Automated validation scripts
CLAUDE.md             # Claude Code project configuration
CONTRIBUTING.md       # How to contribute
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add labs, update content, and run validation.

## License

[MIT](LICENSE)
