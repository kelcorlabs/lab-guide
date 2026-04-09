# Contributing

## Adding a New Lab

1. Edit `Hands on Lab` (the markdown source file)
2. Follow the 9-section structure used by every existing lab:
   - Learning objectives, Recall, Overview, Try it, Reference code, Run it, Check your understanding, Exam tips, Key takeaways
3. Use the heading format: `# LAB X.Y: TITLE`
4. Python reference code must be ASCII-safe (no Unicode symbols — breaks on Windows)
5. Run `npm run build` and verify the HTML renders correctly
6. Run `npm test` to validate everything still passes

## Adding Practice Questions

1. Follow the existing format:
   ```
   **Q# (Task X.Y).** Question text

   A) Choice A
   B) Choice B
   C) Choice C
   D) Choice D

   <details><summary>Show Answer</summary>

   **Correct: X.** Explanation. **Why not Y:** Reason. **Why not Z:** Reason.

   </details>
   ```
2. Target roughly equal distribution of correct answers (A/B/C/D) across each section
3. Run `npm run test:answers` to verify count and distribution

## Verifying Changes

```bash
npm run build          # Rebuild HTML from markdown
npm test               # Run all validation
```

The test suite checks:
- All Python reference scripts execute without errors
- Practice exam answer count is correct (78 total)
- Answer distribution is balanced
- No broken internal links in HTML output
- HTML structure passes basic quality checks

## Pull Request Process

1. Create a feature branch
2. Make your changes to `Hands on Lab`
3. Run `npm run build && npm test`
4. Commit the markdown source (HTML is generated in CI)
5. Open a PR — CI will validate automatically
