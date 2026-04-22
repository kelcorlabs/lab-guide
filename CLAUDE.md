# Project: Claude Certified Architect – Foundations Lab Guide

## Build
```bash
npm run build    # Generates lab-guide.html + index.html from markdown
npm test         # Runs all validation (Python scripts, answers, links, HTML)
```

## Architecture
- **Source of truth:** `Hands on Lab` (markdown, ~4.7K lines) — all content edits go here
- **Build script:** `build.js` converts markdown → self-contained HTML with embedded CSS/JS
- **Build outputs:** `lab-guide.html` and `index.html` are generated — never edit directly
- **Test suite:** `tests/` directory — pure Node.js validation plus Playwright e2e

## Key conventions
- Lab numbering: `LAB X.Y` where X = module (1-5), Y = lab within module
- Each lab follows a 5-section pattern: What the exam tests, concept + code inline, Anti-pattern blocks, Check your understanding, Exam tips
- Practice question format: `**Correct: X.**` followed by explanation with `**Why not Y:**` markers
- Answer distribution target: ~equal A/B/C/D across each question section
- Python reference code is embedded inline in fenced code blocks alongside the concept it demonstrates
- **ASCII-safe only** in Python scripts — no Unicode arrows/checkmarks (breaks Windows cp1252)

## Content structure
- Modules 1-5 → Labs covering all 30 official exam task statements
- Final Scenario → Integrated capstone lab
- Scenario walkthroughs → Narrative framing for additional exam scenarios
- Anti-patterns cheat sheet → Consolidated reference with priority tags
- FAQ → Exam logistics and course-usage questions
- Practice Exam (60 questions) — full assessment section
