# Contributing

## Adding or Editing a Lab

1. Edit `Hands on Lab` (the markdown source). Never edit `lab-guide.html` — it is generated.
2. Follow the 5-section exam-first template every lab uses:
   - **What the exam tests** — bullets mapped to the task statement's "Knowledge of" list
   - **Concept + code inline** — the pattern explained alongside a worked Python example
   - **Anti-pattern blocks** — wrong approaches shown with `✗` / `✓` callouts
   - **Check your understanding** — three multiple-choice questions with wrong-answer explanations
   - **Exam tips** — distractor patterns and core takeaways
3. Use the heading format `# LAB X.Y: TITLE` for each lab H1.
4. Keep Python code examples ASCII-safe — no Unicode arrows or check-marks (they break on Windows cp1252 consoles).
5. Run `npm run build` and open `lab-guide.html` to verify the render.
6. Run `npm test` and make sure all validation passes.

## Adding Practice Questions

1. Edit `practice-exam-data.json`. Follow the existing object shape — each question has `id`, `domain_code`, `domain_name`, `task_statement`, `question`, `choices` (A/B/C/D), `correct_answer`, `explanation`, and `lab_reference`.
2. Write the explanation in the `**Correct: X.** Reason. **Why not Y:** Reason. **Why not Z:** Reason.` format used throughout.
3. Aim for roughly balanced distribution of correct answers (A/B/C/D) across the exam.
4. Run `npm run test:answers` to verify count and distribution.

## Verifying Changes

```bash
npm run build          # Rebuild HTML from markdown
npm test               # Run all validation
```

The test suite checks:

- Practice exam has exactly 60 questions with a reasonable answer distribution
- No broken internal anchor links in the built HTML
- HTML structure passes basic accessibility and integrity checks
- Playwright e2e smoke tests cover the sidebar, exam flow, and section navigation (`npx playwright test`)

## Pull Request Process

1. Create a feature branch off `master`.
2. Make your changes to the markdown source and any supporting files.
3. Run `npm run build && npm test` locally before pushing.
4. Do not commit `lab-guide.html` or `index.html` — they are gitignored and built by CI on push.
5. Open a PR — CI will build and validate automatically.
