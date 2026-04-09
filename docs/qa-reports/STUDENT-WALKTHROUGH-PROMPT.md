# Student Walkthrough Prompt — Teach-Quality Deep Test

> **Purpose:** Walk through the lab guide one lab at a time as a real student. Run every script, do every live exercise, answer every question — then rate how well each lab teaches and prepares you for the exam based on the official OG Exam Guide.
>
> **Run this as a single conversation in Claude Code from `~/claude-architect-labs/`**

---

## Who you are

You are a solution architect with 6 months of Claude experience — the OG Exam Guide's target candidate. You've used Claude Code and the API but never studied for this specific exam. You're going through the lab guide to prepare, and you're evaluating whether the labs actually teach you what the exam tests.

## Source files

- **Lab guide:** `"c:/Projects/Claude Certified Architect – Foundations HANDS-ON LAB GUIDE/Hands on Lab"`
- **OG Exam Guide:** `"c:/Projects/Claude Certified Architect – Foundations HANDS-ON LAB GUIDE/OG Exam Guide"`

## Python

```bash
export PATH="/c/Users/v-joneskelly/AppData/Local/Programs/Python/Python312:$PATH" && python <file>
```

## How to work through each lab

Work through ONE lab at a time, in order: Setup, then 1.1, 1.2, ... through Final, then the practice exams. For each lab, do ALL of the following:

### 1. Read the lab

Read the full lab section from the guide. Do NOT read ahead.

### 2. Do the Recall questions

Answer each Recall question from what you learned in prior labs. If you can't answer one, that's a **teaching gap** — the prior lab didn't teach it well enough. Flag it.

### 3. Do the Try It / Live Exercise

- If the lab has a **Live Exercise (required)** — you MUST do it for real in Claude Code. Create config files, run `/memory`, test commands, etc.
- If the lab has a **"Try it"** with Claude Code prompts — run them for real when possible. Note what the student would observe.
- If the lab has a **Live Exercise (optional, requires API key)** — note what it teaches and whether it adds value beyond the simulation.

### 4. Study the Reference Code

Read the simulated Python script. For each function, summarize what it does in one line. Verify:
- All imports are standard library (no pip needed for simulated scripts)
- Code matches what the Overview described
- The simulation accurately represents the real API pattern

### 5. Run the script

Create and run the Python file exactly as the guide says. Capture the full output.

### 6. Compare output

Compare actual output to "What you should see" in the guide. Note ANY differences.

### 7. Answer Check Your Understanding

Answer each exercise yourself by tracing the code. Then read the guide's answer. Rate:
- Is the answer correct?
- Is it specific enough to build exam judgment?
- Does it reference the code?

### 8. Read the Exam Tips

Cross-reference each tip against the OG Exam Guide's "Knowledge of" and "Skills in" bullets for this task statement. Flag any gaps.

### 9. Write the lab report

After each lab, append to `"c:/Projects/Claude Certified Architect – Foundations HANDS-ON LAB GUIDE/STUDENT-WALKTHROUGH-REPORT.md"`:

```
## Lab X.Y: [Title] — STATUS: PASS / FAIL / ISSUES

### Execution
- File created: [path]
- Script runs: YES / NO
- Output matches guide: YES / NO / PARTIAL (differences: ...)
- Live exercise completed: YES / NO / N/A (what happened: ...)

### Teaching Quality (rate each 1-5)
- **Concept clarity:** Does the Overview clearly explain the problem and solution? (1=confusing, 5=crystal clear)
- **Code quality:** Does the reference code demonstrate the pattern well? (1=misleading, 5=production-ready example)
- **Exercise depth:** Do the exercises build real understanding or just check memorization? (1=trivial, 5=forces deep thinking)
- **Exam alignment:** Do the Exam Tips match the OG Exam Guide task statement? (1=misaligned, 5=exact match)
- **Practical readiness:** After this lab, could the student make the right architectural decision on the exam? (1=no, 5=definitely)

### OG Exam Guide Alignment
- Task Statement X.Y: [title from OG guide]
- "Knowledge of" bullets covered: [list which ones, with YES/PARTIAL/NO each]
- "Skills in" bullets covered: [list which ones, with YES/PARTIAL/NO each]
- Gaps: [any OG bullets NOT addressed by this lab]

### What the OG Guide Recommends vs What This Lab Does
- OG Preparation Exercise match: [which exercise, which steps]
- Does this lab use real tools (API, Claude Code, MCP) or only simulation?
- What would a student STILL need to do after this lab to match the OG Guide's expectations?

### Issues Found
- [list any problems: bugs, unclear instructions, wrong output, missing content]

### Verdict
- [One sentence: Does this lab prepare a student for the exam on this task statement?]
```

---

## After every 3 labs — BUILD CHECKPOINT

```bash
cd "c:/Projects/Claude Certified Architect – Foundations HANDS-ON LAB GUIDE" && node build.js && cp lab-guide.html index.html
```

Report: Build succeeded? File size?

---

## Module summaries

After completing each module (1.1-1.7, 2.1-2.5, 3.1-3.6, 4.1-4.6, 5.1-5.6), write:

```
## MODULE X SUMMARY

### Scores
- Labs completed: X/Y
- Scripts that run: X/Y
- Output matches guide: X/Y
- Live exercises completed: X/Y
- Average teaching quality: X/5
- Average exam alignment: X/5

### OG Exam Guide Coverage
- Task statements fully covered: X/Y
- Partially covered: X/Y (list which + what's missing)
- Not covered: X/Y

### OG Preparation Exercise Coverage
- Exercise N: [which steps are covered by this module's labs]
- Still missing: [which steps need more work]

### Module Teaching Assessment
- Strongest lab: [which and why]
- Weakest lab: [which and why]
- Biggest gap vs OG Guide: [what the guide expects that the labs don't teach]
```

---

## Practice Exam

For each of the 18 self-test questions AND the 60 full exam questions:

1. Read question + choices ONLY (hide the answer)
2. Select your answer based on what the labs taught you
3. Check the answer
4. Rate: Could you answer this from the labs alone? (YES / NEEDED-OUTSIDE-KNOWLEDGE / NO)
5. If wrong: Was it a lab gap, question issue, or your misunderstanding?

```
## PRACTICE EXAM REPORT

- Self-test score: X/18
- Full exam score: X/60
- Answerable from labs alone: X/78
- Questions requiring outside knowledge: [list Q numbers + what knowledge]
- Questions with issues: [list Q numbers + what's wrong]
- Estimated pass rate for lab-only student: X%
```

---

## Final Alignment Matrix

After everything, read the ENTIRE OG Exam Guide. For every "Knowledge of" and "Skills in" bullet across all 30 task statements, check:

| Task Statement | Bullet | Lab | Question | Teaching Quality (1-5) | Status |
|---|---|---|---|---|---|
| 1.1 | agentic loop lifecycle | 1.1 | Q1, Q16 | 5 | COVERED |
| ... | ... | ... | ... | ... | ... |

---

## Final Verdict

```
## FINAL ASSESSMENT

### Numbers
- Total labs: X/31
- Scripts pass: X/28
- Live exercises done: X/Y
- Self-test: X/18
- Full exam: X/60
- OG bullets covered: X/total

### Teaching Quality
- Average concept clarity: X/5
- Average exam alignment: X/5
- Average practical readiness: X/5

### Real-Tools Assessment
- Labs using real Claude Code features: X/31
- Labs using real API calls: X/31
- Labs using real MCP: X/31
- Labs that are simulation-only: X/31

### OG Preparation Exercise Coverage
- Exercise 1 (Multi-Tool Agent): X% covered
- Exercise 2 (Claude Code Config): X% covered
- Exercise 3 (Extraction Pipeline): X% covered
- Exercise 4 (Multi-Agent Research): X% covered

### Gap Summary
- Critical gaps (OG tests it, labs don't teach it): [list]
- Minor gaps (OG mentions it, labs touch on it lightly): [list]
- Bonus content (labs teach it, OG doesn't test it): [list]

### Verdict
[READY FOR STUDENTS / NEEDS IMPROVEMENTS / MAJOR GAPS]
[One paragraph: Would a student who ONLY completed these labs pass the exam with 720+?
What would they still need to do on their own?]
```
