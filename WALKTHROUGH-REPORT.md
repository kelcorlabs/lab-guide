# Lab Guide Walkthrough Report
> Going through every page as a student would, testing everything.
> Restarted fresh: April 7, 2026

---

## Page 1: COURSE OVERVIEW
**Status: FIXED**

What I see as a student:
- Clear title, learning path table with time estimates — good
- 9-step lab structure explained — accurate, matches actual labs
- Prerequisites listed — clear

Issues found:
- Learning path table said "72 questions" but the practice exam actually has 60 questions (there are 18 more in the Practice Questions and Scenario-Based sections = 78 total)
- Fixed: table now says "60 questions" for the Practice Exam row
- Stats bar updated to say "78 practice questions" (total across all sections)

---

## Page 2: SETUP — Do This First
**Status: FIXED (2 issues)**

Reading as a student:
- Step 1 (Install): Clear, two options, subscription note in blockquote — GOOD
- Step 2 (Verify): Simple one-liner test — GOOD
- Step 3 (Create workspace): Clear directory structure

Issues found:
1. Step 3 said "Open Claude Code in your terminal and run:" — confusing because `mkdir` is a terminal command, not a Claude Code prompt. A student might wonder whether to type this INTO Claude Code or into a regular terminal.
   - Fixed: Changed to "Open a terminal (not Claude Code)" + added second step to start Claude Code from that directory
2. Troubleshooting item 1 said `claude /doctor` — this would be interpreted as a prompt, not a command. The correct usage is `/doctor` typed inside an active Claude Code session.
   - Fixed: "Inside Claude Code, type `/doctor` to run diagnostics"

No issues with: items 2-6 in troubleshooting, "How labs work" summary

---

## Page 3: MODULE 1 — Key Terms
**Status: GOOD — no issues**

- 14 key terms, all clearly defined with practical one-line explanations
- Definitions tell you what each thing DOES, not just what it IS
- Includes actual values (e.g., stop_reason: `"tool_use"`, `"end_turn"`)
- Covers Labs 1.1 through 1.7 comprehensively

---

## Page 4: LAB 1.1 — Build a Real Agentic Loop
**Status: FIXED (1 issue)**

Section-by-section as a student:
- **Learning objectives**: 3 items with action verbs — clear, tells me what I'll learn. GOOD
- **Recall**: 3 terms from Key Terms page — quick refresher. GOOD
- **Overview**: Short paragraphs, "27% of exam" grabs attention, "How it works" subsection has clear 5-step flow. GOOD
- **Try it**: FIXED — was "Find all Python files" but workspace is empty at this point (first lab). Changed to "List directories, create a file, run it" which always works.
- **Challenge Mode**: Optional build-it-yourself prompt — great pedagogy, specific enough to produce working code. GOOD
- **Reference code**: ~100 lines of well-commented Python, customer support scenario. GOOD
- **Run it**: Clear instruction + expected output. GOOD
- **Check your understanding**: 3 exercises with inline answers, references specific code lines. GOOD
- **Exam tips**: 4 bullets with "Wrong answer trap" format. GOOD
- **Key takeaways**: 4 bullet summary. GOOD

---

## Page 5: LAB 1.2 — Multi-Agent Coordinator
**Status: FIXED (1 more dangling list)**

- **Learning objectives**: 4 items — GOOD
- **Recall**: 2 questions from Lab 1.1 — GOOD
- **Overview**: Clear problem → solution flow, references Sample Q7 — GOOD
- Found: Another dangling bullet list between Overview and Try it (missed in earlier pass)
- Fixed: Added `### Key concepts in this lab` header
- **Try it**: "Find Python files, read each, write ANALYSIS.md" — works now because Lab 1.1 creates files. GOOD
- **Reference code**: Simulated subagents (search, analysis, synthesis) — comprehensive. GOOD
- **Run it**: Clear expected output. GOOD
- **Check your understanding**: 3 exercises — GOOD
- **Exam tips**: 4 bullets — GOOD
- **Key takeaways**: 4 bullets — GOOD

Also found and fixed 2 more dangling bullet lists in Labs 2.1 and 2.4.
**Total dangling lists fixed across entire guide: 12**

---

## Page 6: LAB 1.3 — Subagent Context Passing
**Testing...**
