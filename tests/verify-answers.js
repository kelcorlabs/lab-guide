#!/usr/bin/env node
/**
 * Verify practice exam data from practice-exam-data.json.
 * Expects 60 questions with balanced A/B/C/D distribution.
 */
const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'practice-exam-data.json');

if (!fs.existsSync(jsonPath)) {
  console.error('FAIL: practice-exam-data.json not found');
  process.exit(1);
}

const questions = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
let errors = 0;

const dist = { A: 0, B: 0, C: 0, D: 0 };
let missing = 0;

questions.forEach(function(q) {
  if (!q.correct_answer || ['A','B','C','D'].indexOf(q.correct_answer) < 0) {
    console.error('  FAIL: Q' + q.id + ' has invalid correct_answer: ' + q.correct_answer);
    missing++;
  } else {
    dist[q.correct_answer]++;
  }
  if (!q.choices || Object.keys(q.choices).length !== 4) {
    console.error('  FAIL: Q' + q.id + ' does not have exactly 4 choices');
    errors++;
  }
  if (!q.explanation || q.explanation.length < 10) {
    console.error('  FAIL: Q' + q.id + ' has missing or short explanation');
    errors++;
  }
});

console.log('Exam: ' + questions.length + ' questions — A:' + dist.A + ' B:' + dist.B + ' C:' + dist.C + ' D:' + dist.D);

if (questions.length !== 60) {
  console.error('  FAIL: expected 60 questions, got ' + questions.length);
  errors++;
}

if (missing > 0) {
  console.error('  FAIL: ' + missing + ' question(s) with invalid correct_answer');
  errors++;
}

for (var letter in dist) {
  if (dist[letter] > 20) {
    console.error('  FAIL: ' + dist[letter] + ' "' + letter + '" answers (max 20)');
    errors++;
  }
}

console.log('\nTotal: ' + questions.length + ' questions');

if (errors > 0) {
  console.error('\nFAILED: ' + errors + ' error(s)');
  process.exit(1);
} else {
  console.log('\nPASS: All answer counts and distribution OK');
}
