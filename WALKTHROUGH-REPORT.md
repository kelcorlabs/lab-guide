# Lab Guide Walkthrough Report
> Testing every page and lab step-by-step as a student would.
> Started: April 7, 2026

---

## Page 1: Course Overview
**Status: FIXED**

- Found: "How each lab works" list was missing "Learning objectives" (the first section in every lab)
- Fixed: Added "Learning objectives" as item 1 in the list, renumbered to 9 items

---

## Page 2: SETUP — Do This First
**Status: FIXED**

- Found: "How labs work" sub-section said "See the Course Overview above" — but in section-based view, the student can't see Course Overview from the Setup page
- Fixed: Made it self-contained ("Each lab follows a consistent 9-section pattern...")
- Tested: Created workspace directories — all 6 created successfully
- Note: A student who ran the OLD setup (with `npm init -y`) would have a stale `package.json` in the workspace. Not a blocker for new students.

---

## Page 3: MODULE 1 Key Terms
**Status: GOOD** — clean, all 14 key terms are defined clearly. No issues.

---

## Lab 1.1: BUILD A REAL AGENTIC LOOP
**Status: FIXED**

- Found: **"Try it" section was broken.** The prompt said "I'm jane@email.com. Can you look up my customer record..." — but Claude Code doesn't have `get_customer` or `lookup_order` tools. A student pasting this into vanilla Claude Code would get a confused response.
- Fixed: Changed "Try it" to use Claude Code's built-in tools (Glob + Read) for a demo that actually works. The reference code section still uses the custom tools for studying.
- Learning objectives: Present, 3 items, match exam guide Task 1.1
- Recall: Present, 3 items referencing Module 1 key terms
- Overview: Clean, scannable, includes "How it works" as H3
- Reference code: 100-line Python script, well-commented
- Run it: Instructions to ask Claude Code to create and run the file
- Check your understanding: 3 exercises, all accurate
- Exam tips: 4 bullets with distractor traps — strong
- Key takeaways: 4 bullet summary — accurate

---

## Lab 1.2: MULTI-AGENT COORDINATOR
**Status: FIXED**

- Found: "Try it" prompt asked Claude Code to "Research EV adoption" — Claude Code can't do web research, would just answer from training data without demonstrating the multi-phase tool-use pattern
- Fixed: Changed to a real multi-step task (find files → read each → write summary) that actually uses multiple tools in sequence and demonstrates the coordinator pattern
- Learning objectives: 4 items, match exam guide Task 1.2 — GOOD
- Reference code: Well-structured with simulated subagents, clear comments — GOOD
- Run it: Clear instruction — GOOD
- Check your understanding: 3 exercises, all accurate and linked to exam patterns — GOOD
- Exam tips: Strong, references Sample Q7 directly — GOOD
- Key takeaways: 4 bullets, accurate — GOOD

---

## Lab 1.3: SUBAGENT CONTEXT PASSING AND SPAWNING
**Status: FIXED**

- Found: Dangling bullet list between Overview and fork_session subsection — 4 bullets with no header, looked like leftover "What You'll Learn" content
- Fixed: Added `### Key concepts in this lab` header above the bullets
- Try it: Uses real Claude Code task (find files, count lines, summarize) — WORKS
- Reference code: Shows structured handoff format, parallel spawning, goal-based prompts, AgentDefinition — comprehensive
- Run it: Clear instruction + fork_session preview section — GOOD
- Check your understanding: 3 exercises, accurate — GOOD
- Exam tips: 4 bullets with distractor traps — GOOD
- Key takeaways: Accurate — GOOD
- Note: fork_session subsection under Overview is a preview of Lab 1.7 — acceptable as context

---

## Lab 1.4: PREREQUISITE GATES AND HANDOFF PATTERNS
**Status: FIXED**

- Found: Same dangling bullet list issue as Lab 1.3 — 4 bullets between Overview and Try it with no header
- Fixed: Added `### Key concepts in this lab` header
- Try it: Uses `git status` as prerequisite check — WORKS in Claude Code, good analogy
- Reference code: Two code blocks — prerequisite gate demo + multi-concern decomposition. Both well-structured.
- Run it: Clear expected output (3 test cases showing gate behavior) — GOOD
- Check your understanding: 3 exercises, accurate and exam-linked — GOOD
- Exam tips: Strong — references Sample Q1, distractor traps clear — GOOD
- Key takeaways: Accurate — GOOD

---

## Lab 1.5: AGENT SDK HOOKS FOR TOOL INTERCEPTION
**Status: FIXED**

- Found: Same dangling bullet list pattern — 3 bullets between Overview and Reference code with no header
- Fixed: Added `### Key concepts in this lab` header
- Note: This lab has no "Try it" section (conceptual/pattern demo — Category B lab). Acceptable.
- Reference code: PostToolUse normalization + PreToolUse blocking demos — comprehensive
- Check your understanding: 3 exercises — GOOD
- Exam tips: Strong — GOOD
- Key takeaways: Accurate — GOOD

---

## SYSTEMATIC FIX: Dangling Bullet Lists
**Fixed 9 total instances across the guide:**

| Lab | Fix |
|-----|-----|
| 1.3 | Added `### Key concepts in this lab` |
| 1.4 | Added `### Key concepts in this lab` |
| 1.5 | Added `### Key concepts in this lab` |
| 1.6 | Added `### Key concepts in this lab` |
| 1.7 | Added `### Key concepts in this lab` |
| 2.2 | Added `### Key concepts in this lab` |
| 2.3 | Added `### Key concepts in this lab` |
| 5.1 | Added `### Key concepts in this lab` |
| 5.4 | Added `### Key concepts in this lab` |

This was a consistent formatting issue from the original conversion passes where "What You'll Learn" headers were removed but the bullet content was left orphaned.

---

## Continuing walkthrough from Lab 1.6...
**Pausing to commit fixes and rebuild.**

Labs verified so far: Course Overview, Setup, Module 1 Key Terms, Labs 1.1–1.5.
All have been fixed and are in good shape.

Labs remaining: 1.6, 1.7, all of Modules 2–5, Final Lab, Practice sections, Glossary, Practice Exam.
