# User Walkthrough Prompt — Lab-by-Lab Deep Test

> **Purpose:** Execute every step of the lab guide exactly as a first-time student would. Create every file, run every script, answer every question, and verify alignment with the official exam guide.
>
> **Run this as a single conversation in Claude Code from `~/claude-architect-labs/`**

---

## Instructions for the agent

You are a first-time student working through the "Claude Certified Architect – Foundations HANDS-ON LAB GUIDE." You have never seen this material before. You will work through the entire guide sequentially — SETUP first, then every lab in order, then the practice exam.

### Rules

1. **Read the guide section by section.** The source is at `"c:/Projects/Claude Certified Architect – Foundations HANDS-ON LAB GUIDE/Hands on Lab"`. Read ONLY the current section before acting on it. Do not read ahead.

2. **Do exactly what the guide says.** If it says "create a file," create it. If it says "run it," run it. If it says "ask Claude Code," simulate what a user would do by running the command directly.

3. **Use this Python:** `export PATH="/c/Users/v-joneskelly/AppData/Local/Programs/Python/Python312:$PATH" && python <file>`

4. **After EVERY section, write a status report** in this format:
   ```
   ## [Section Name] — STATUS: PASS / FAIL / ISSUES
   - What I did:
   - What worked:
   - What didn't work:
   - Output match: YES / NO / PARTIAL (vs "What you should see")
   - Alignment with OG Exam Guide: [which task statements are covered]
   ```

5. **After every 3 labs**, run the build:
   ```bash
   cd "c:/Projects/Claude Certified Architect – Foundations HANDS-ON LAB GUIDE" && node build.js && cp lab-guide.html index.html
   ```

6. **For the practice exam**, answer each question yourself FIRST (without looking at the answer), then check. Report your score per domain.

7. **Cross-reference with the OG Exam Guide** at `"c:/Projects/Claude Certified Architect – Foundations HANDS-ON LAB GUIDE/OG Exam Guide"`. After each lab, verify that the lab's content covers the matching task statement's "Knowledge of" and "Skills in" bullets.

8. **Write all findings** to `"c:/Projects/Claude Certified Architect – Foundations HANDS-ON LAB GUIDE/USER-WALKTHROUGH-REPORT.md"` as you go. Append after each section. This is a living document.

---

## PHASE 1: SETUP (lines 47–151 of "Hands on Lab")

### Step 1: Read the SETUP section
Read lines 47–151 of the guide.

### Step 2: Execute setup
- Verify Python is installed: `python --version`
- Create the workspace directories exactly as the guide says
- Verify all 6 directories exist: `ls ~/claude-architect-labs/`
- Start from the workspace: `cd ~/claude-architect-labs`

### Step 3: Read the Module 1 Key Terms (lines 124–151)
- Read all 16 key terms
- For each term, write a one-sentence definition in your own words to confirm you understand it
- If any term is unclear from the guide text alone, flag it

### Step 4: Write setup report
```
## SETUP — STATUS: ___
- Python version:
- Directories created:
- Key terms clear: YES / NO (list any unclear ones)
```

---

## PHASE 2: MODULE 1 — Labs 1.1 through 1.7

For EACH lab (1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7), do ALL of the following steps IN ORDER:

### Step A: Read the lab section
Read the lab's full section from the markdown. Note the line range for reference.

### Step B: Answer the Recall questions
- Answer each Recall question from memory (based on what you learned in the prior lab)
- If you can't answer a Recall question, that's a teaching gap — flag it

### Step C: Read the Overview
- Summarize in one sentence what problem this lab solves
- Note the exam connection mentioned

### Step D: Try It section
- Read the "Try it" prompt
- If it says to run a Claude Code command, note what a student would do
- If it's an interactive exercise, describe what the student should observe

### Step E: Study the Reference Code
- Read the complete reference code from the guide
- For each function/class, write a one-line summary of what it does
- Note any imports — verify they are ALL standard library (no pip installs needed)
- Check: does the code match what was described in the Overview?

### Step F: Create and Run the file
- Create the Python file at the EXACT path the guide specifies
- Write the code EXACTLY as shown in the guide's code block (copy from the markdown source)
- Run it: `export PATH="/c/Users/v-joneskelly/AppData/Local/Programs/Python/Python312:$PATH" && cd ~/claude-architect-labs && python <path>`
- Capture the FULL output

### Step G: Compare output to "What you should see"
- Read the "What you should see" section from the guide
- Compare the actual output LINE BY LINE against the guide's description
- Note ANY differences — even minor ones (wrong numbers, different text, missing sections)
- If the guide shows bullet points instead of actual output, note whether the bullets accurately describe what you saw

### Step H: Answer the "Check your understanding" exercises
- For each exercise, answer it yourself by tracing through the code
- Then read the guide's answer
- Verify: Is the guide's answer correct? Is it specific enough? Does it reference the code?
- If an exercise says "what happens if you remove X" — actually trace what would happen

### Step I: Read the Exam Tips
- Note each exam tip
- Cross-reference: does this match the "Knowledge of" and "Skills in" bullets in the OG Exam Guide for this task statement?
- Flag any gaps: topics in the OG guide that this lab doesn't cover

### Step J: Write the lab report
```
## Lab X.Y: [Title] — STATUS: PASS / FAIL / ISSUES

**File created:** [path]
**Script runs:** YES / NO
**Output matches guide:** YES / NO / PARTIAL
  - Differences: [list any]

**Recall answers verified:** YES / NO
**Exercise answers verified:** [count] of [total] correct

**OG Exam Guide alignment:**
  - Task Statement X.Y covered: YES / PARTIAL / NO
  - "Knowledge of" bullets covered: [list which ones]
  - "Skills in" bullets covered: [list which ones]
  - Gaps: [any topics in OG guide not addressed by this lab]

**Issues found:**
  - [list any problems]

**Transition to next lab:** EXISTS / MISSING
```

### After Labs 1.1, 1.2, 1.3 — BUILD CHECKPOINT
```bash
cd "c:/Projects/Claude Certified Architect – Foundations HANDS-ON LAB GUIDE" && node build.js && cp lab-guide.html index.html
```
Report: Build succeeded? File size?

### After Labs 1.4, 1.5, 1.6 — BUILD CHECKPOINT
Same build command. Report results.

### After Lab 1.7 — MODULE 1 SUMMARY
Write a module summary:
```
## MODULE 1 SUMMARY — STATUS: ___
- Labs completed: X/7
- Scripts that run: X/7
- Output matches: X/7
- Exercise answers correct: X/X
- OG Exam Guide coverage: X/7 task statements fully covered
- Gaps found: [list]
```

---

## PHASE 3: MODULE 2 — Labs 2.1 through 2.5

Follow the SAME Step A through Step J process for each lab.

**Special notes for Module 2:**
- Lab 2.4 (verify_mcp_config.py) checks for files that may not exist — that's expected. Report what [BLOCKED] items appear.
- Lab 2.5 (tool_selection_quiz.py) is interactive — pipe answers: `echo -e "Grep\nGlob\nRead\nEdit\nBash\nGlob\nGrep\nRead+Write\nBash\nGrep\nGlob\nWrite" | python lab-d2-tool-design/tool_selection_quiz.py`
- After Lab 2.5, do a BUILD CHECKPOINT

**OG Exam Guide cross-reference:** Task Statements 2.1–2.5 (lines 253–380 of OG guide)

---

## PHASE 4: MODULE 3 — Labs 3.1 through 3.6

**Special notes for Module 3:**
- Labs 3.1, 3.2, 3.3 are CONFIG labs — they create files, not Python scripts. Follow the guide's instructions to create CLAUDE.md, .claude/rules/, .claude/commands/, .claude/skills/ files.
- Lab 3.1 has a verification script (verify_config.py) — run it after creating all config files
- Lab 3.4 (plan_vs_direct_quiz.py) is interactive — pipe: `echo -e "direct\nplan\ndirect\nplan\nplan" | python lab-d3-claude-code/plan_vs_direct_quiz.py`
- Lab 3.6 is YAML/bash — no Python script. Read the CI/CD examples and verify they make sense.
- BUILD CHECKPOINT after Labs 3.3 and 3.6

**OG Exam Guide cross-reference:** Task Statements 3.1–3.6 (lines 380–490 of OG guide)

---

## PHASE 5: MODULE 4 — Labs 4.1 through 4.6

**Special notes for Module 4:**
- Lab 4.4 (retry_loop.py) has FOUR code blocks in the guide that must all be in one file — verify the deployed file contains: extraction_tool, validate_extraction, extract_with_retry, test cases, AND dismissal pattern analysis
- Lab 4.4 also has a Pydantic section that gracefully skips if pydantic isn't installed
- BUILD CHECKPOINT after Labs 4.3 and 4.6

**OG Exam Guide cross-reference:** Task Statements 4.1–4.6 (lines 490–600 of OG guide)

---

## PHASE 6: MODULE 5 — Labs 5.1 through 5.6

**Special notes for Module 5:**
- Lab 5.5 (human_review.py) uses `random.seed(42)` — output should be deterministic
- BUILD CHECKPOINT after Labs 5.3 and 5.6

**OG Exam Guide cross-reference:** Task Statements 5.1–5.6 (lines 600–710 of OG guide)

---

## PHASE 7: LAB FINAL — Complete Integrated Scenario

- Read the full Lab Final section
- Create and run `lab-final-scenario/complete_agent.py`
- This lab should exercise ALL 5 domains in one script
- Verify: does the output demonstrate agentic loops, tool selection, gates, error handling, and context management?
- Cross-reference: does it cover the customer support scenario from the OG Exam Guide?
- BUILD CHECKPOINT

---

## PHASE 8: PRACTICE EXAM — Self-Test Questions (Q1–Q12 + Scenarios A1–B3)

For EACH of the 18 self-test questions:

### Step 1: Read the question
Read ONLY the question stem and the four answer choices. Do NOT read the answer yet.

### Step 2: Select your answer
Choose A, B, C, or D based on what you learned in the labs. Write your reasoning (2-3 sentences).

### Step 3: Check the answer
Read the guide's answer. Compare:
- Did you get it right?
- If wrong, was it because:
  a. The question was poorly worded?
  b. The lab didn't teach this well enough?
  c. You misunderstood the concept?
- Is the "Why not X" explanation convincing for each wrong answer?

### Step 4: Verify multiple choice format
Confirm each question has:
- [ ] A clear question stem
- [ ] Exactly 4 answer choices (A, B, C, D)
- [ ] One clearly correct answer
- [ ] Three plausible but wrong distractors
- [ ] An explanation for the correct answer
- [ ] "Why not" explanations for each distractor
- [ ] A lab reference

### Write self-test report:
```
## SELF-TEST — STATUS: ___
- Score: X/18
- Domain 1: X/3
- Domain 2: X/2
- Domain 3: X/2
- Domain 4: X/2
- Domain 5: X/3
- Scenarios: X/6
- Questions with format issues: [list]
- Questions answerable from labs alone: X/18
```

---

## PHASE 9: PRACTICE EXAM — Full 60-Question Assessment (Q1–Q60)

For EACH of the 60 questions, follow the SAME process as the self-test:

1. Read question + choices only
2. Select your answer with reasoning
3. Check against the guide
4. Verify format

**Additional checks for the full exam:**
- Are questions distributed across all 5 domains proportionally?
- Does each scenario (1, 3, 5, 6) have roughly equal questions?
- Are there any duplicate questions (same concept tested twice with different wording)?
- Could a student who ONLY completed the labs (no outside knowledge) pass with 720+?

### Write exam report:
```
## PRACTICE EXAM — STATUS: ___
- Total score: X/60
- Domain 1 (Agentic): X/Y
- Domain 2 (Tools): X/Y
- Domain 3 (Config): X/Y
- Domain 4 (Prompts): X/Y
- Domain 5 (Context): X/Y

- Scenario 1 (Customer Support): X/Y
- Scenario 3 (Research): X/Y
- Scenario 5 (CI/CD): X/Y
- Scenario 6 (Extraction): X/Y

- Questions with format issues: [list Q numbers]
- Questions NOT answerable from labs alone: [list Q numbers]
- Questions with incorrect/debatable answers: [list Q numbers]
- Estimated pass rate for a lab-only student: ___
```

---

## PHASE 10: FINAL ALIGNMENT CHECK

### Step 1: OG Exam Guide full coverage matrix
Read the ENTIRE OG Exam Guide. For EVERY "Knowledge of" and "Skills in" bullet across all 30 task statements, check:
- Is it covered by a lab? Which lab?
- Is it covered by a practice question? Which question?
- Is there a gap where neither labs nor questions address the topic?

Write this as a coverage matrix:
```
| Task Statement | Knowledge/Skill | Lab | Question | Status |
|----------------|-----------------|-----|----------|--------|
| 1.1 | agentic loop lifecycle | 1.1 | Q1, Q16 | COVERED |
| 1.1 | tool results appended | 1.1 | Q2 | COVERED |
| ... | ... | ... | ... | ... |
```

### Step 2: Gap report
For any uncovered items:
- Where should this be taught?
- Suggest a specific addition (exercise, code example, or question)

### Step 3: Final summary
```
## FINAL WALKTHROUGH SUMMARY

**Total labs completed:** X/31
**Total scripts run:** X/28
**Scripts that pass:** X/28
**Output matches guide:** X/28

**Self-test score:** X/18
**Exam score:** X/60
**Estimated student pass rate:** ___%

**OG Exam Guide coverage:**
- Task statements fully covered: X/30
- Task statements partially covered: X/30
- Task statements not covered: X/30
- Total knowledge/skill bullets: X
- Bullets covered: X
- Bullets missing: X

**Critical issues found:** X
**Issues fixed during walkthrough:** X
**Issues remaining:** X

**Verdict:** READY FOR STUDENTS / NEEDS FIXES / MAJOR REWORK
```

---

## APPENDIX: Build schedule

| After... | Build? |
|----------|--------|
| Labs 1.1–1.3 | YES |
| Labs 1.4–1.6 | YES |
| Lab 1.7 | YES (module complete) |
| Labs 2.1–2.3 | YES |
| Labs 2.4–2.5 | YES (module complete) |
| Labs 3.1–3.3 | YES |
| Labs 3.4–3.6 | YES (module complete) |
| Labs 4.1–4.3 | YES |
| Labs 4.4–4.6 | YES (module complete) |
| Labs 5.1–5.3 | YES |
| Labs 5.4–5.6 | YES (module complete) |
| Lab Final | YES |
| Practice Exam | YES (final build) |
