# Project: Claude Certified Architect – Foundations Lab Guide

## Build
```bash
npm run build    # Generates lab-guide.html + index.html from markdown
npm test         # Runs all validation (Python scripts, answers, links, HTML)
```

## Architecture
- **Source of truth:** `Hands on Lab` (markdown, ~11K lines) — all content edits go here
- **Build script:** `build.js` converts markdown → self-contained HTML with embedded CSS/JS
- **Build outputs:** `lab-guide.html` and `index.html` are generated — never edit directly
- **Test suite:** `tests/` directory — pure Node.js, no external test frameworks

## Key conventions
- Lab numbering: `LAB X.Y` where X = module (1-5), Y = lab within module
- Each lab has 9 sections: Learning objectives, Recall, Overview, Try it, Reference code, Run it, Check your understanding, Exam tips, Key takeaways
- Practice question format: `**Correct: X.**` followed by explanation with `**Why not Y:**` markers
- Answer distribution target: ~equal A/B/C/D across each question section
- Python scripts: embedded in markdown code fences under `## Reference code` headings
- **ASCII-safe only** in Python scripts — no Unicode arrows/checkmarks (breaks Windows cp1252)

## Content structure
- Modules 1-5 → Labs covering all 30 OG Exam Guide task statements
- Final Scenario → Integrated capstone lab
- Self-Test (12 questions) + Scenarios (6 questions) + Full Practice Exam (60 questions) = 78 total
- QA reports in `docs/qa-reports/`
