#!/usr/bin/env node
/**
 * Verify practice exam answer count and distribution.
 * Expects 78 total questions with balanced A/B/C/D distribution.
 */
const fs = require('fs');
const path = require('path');

const source = fs.readFileSync(path.join(__dirname, '..', 'Hands on Lab'), 'utf-8');

const SELFTEST_START = 'PRACTICE QUESTIONS — SELF-TEST';
const SCENARIO_START = 'SCENARIO-BASED PRACTICE — EXAM FORMAT';
const EXAM_START = 'PRACTICE EXAM — FULL ASSESSMENT';
const CHEATSHEET_START = 'EXAM ANSWER PATTERNS — CHEAT SHEET';

function getSection(content, startMarker, endMarker) {
  const s = content.indexOf(startMarker);
  const e = content.indexOf(endMarker);
  if (s === -1 || e === -1) return '';
  return content.slice(s, e);
}

function countAnswers(text) {
  const matches = text.match(/\*\*Correct: ([A-D])\.\*\*/g) || [];
  const dist = { A: 0, B: 0, C: 0, D: 0 };
  matches.forEach(m => {
    const letter = m.match(/Correct: ([A-D])/)[1];
    dist[letter]++;
  });
  return { total: matches.length, dist };
}

let errors = 0;

// Self-test: expect 12
const st = countAnswers(getSection(source, SELFTEST_START, SCENARIO_START));
console.log(`Self-test: ${st.total} questions — A:${st.dist.A} B:${st.dist.B} C:${st.dist.C} D:${st.dist.D}`);
if (st.total !== 12) { console.error(`  FAIL: expected 12, got ${st.total}`); errors++; }

// Scenarios: expect 6
const sc = countAnswers(getSection(source, SCENARIO_START, EXAM_START));
console.log(`Scenarios: ${sc.total} questions — A:${sc.dist.A} B:${sc.dist.B} C:${sc.dist.C} D:${sc.dist.D}`);
if (sc.total !== 6) { console.error(`  FAIL: expected 6, got ${sc.total}`); errors++; }

// Exam: expect 60
const ex = countAnswers(getSection(source, EXAM_START, CHEATSHEET_START));
console.log(`Exam:      ${ex.total} questions — A:${ex.dist.A} B:${ex.dist.B} C:${ex.dist.C} D:${ex.dist.D}`);
if (ex.total !== 60) { console.error(`  FAIL: expected 60, got ${ex.total}`); errors++; }

// Check exam distribution — no letter should have more than 20
for (const [letter, count] of Object.entries(ex.dist)) {
  if (count > 20) {
    console.error(`  FAIL: exam has ${count} "${letter}" answers (max 20 for balanced distribution)`);
    errors++;
  }
}

// Total
const total = st.total + sc.total + ex.total;
console.log(`\nTotal: ${total} questions`);
if (total !== 78) { console.error(`  FAIL: expected 78 total, got ${total}`); errors++; }

if (errors > 0) {
  console.error(`\nFAILED: ${errors} error(s)`);
  process.exit(1);
} else {
  console.log('\nPASS: All answer counts and distribution OK');
}
