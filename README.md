# Claude Certified Architect – Foundations: Hands-On Lab Guide

A complete hands-on study guide for the **Claude Certified Architect – Foundations** certification exam. Covers all 30 task statements across 5 domains with 31 interactive labs, 28 runnable Python scripts, and a 78-question practice exam.

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
| Practice Exam | All | 78 questions | — |

**Total:** 31 labs + 78-question practice exam (~10 hours of study)

## Prerequisites

- **Python 3.8+** — for running reference code scripts
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
npm run test:python    # Run all 28 Python reference scripts
npm run test:answers   # Verify practice exam answer count + distribution
npm run test:links     # Check for broken internal links in HTML
npm run test:html      # Validate HTML structure and accessibility basics
```

## How Each Lab Works

Every lab follows the same 9-section structure:

1. **Learning objectives** — what you'll be able to do
2. **Recall** — warm-up from prior labs
3. **Overview** — the problem and why it matters
4. **Try it** — hands-on Claude Code prompt
5. **Reference code** — runnable Python script (no API key needed)
6. **Run it** — instructions to execute the script
7. **Check your understanding** — comprehension exercises
8. **Exam tips** — how this appears on the exam
9. **Key takeaways** — essential patterns to remember

## Repository Structure

```
Hands on Lab          # Markdown source (all content)
build.js              # Converts markdown → HTML
lab-guide.html        # Generated output (open in browser)
index.html            # Copy of lab-guide.html (for GitHub Pages)
OG Exam Guide         # Official certification exam guide (reference)
tests/                # Automated validation scripts
docs/                 # QA reports and reference materials
CLAUDE.md             # Claude Code configuration for this repo
CONTRIBUTING.md       # How to contribute
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add labs, update content, and run validation.

## License

[MIT](LICENSE)
