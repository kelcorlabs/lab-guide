#!/usr/bin/env node
/**
 * Verify practice exam answer count and distribution.
 * Expects 60 questions in the Practice Exam with balanced A/B/C/D distribution.
 */
const fs = require('fs');
const path = require('path');

const source = fs.readFileSync(path.join(__dirname, '..', 'Hands on Lab'), 'utf-8');

const EXAM_START = 'PRACTICE EXAM — FULL ASSESSMENT';

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

// Practice Exam: expect 60
const examStart = source.indexOf(EXAM_START);
if (examStart === -1) {
  console.error('FAIL: could not find PRACTICE EXAM section');
  process.exit(1);
}
const ex = countAnswers(source.slice(examStart));
console.log(`Exam: ${ex.total} questions — A:${ex.dist.A} B:${ex.dist.B} C:${ex.dist.C} D:${ex.dist.D}`);
if (ex.total !== 60) { console.error(`  FAIL: expected 60, got ${ex.total}`); errors++; }

// Check exam distribution — no letter should have more than 20
for (const [letter, count] of Object.entries(ex.dist)) {
  if (count > 20) {
    console.error(`  FAIL: exam has ${count} "${letter}" answers (max 20 for balanced distribution)`);
    errors++;
  }
}

console.log(`\nTotal: ${ex.total} questions`);

if (errors > 0) {
  console.error(`\nFAILED: ${errors} error(s)`);
  process.exit(1);
} else {
  console.log('\nPASS: All answer counts and distribution OK');
}
