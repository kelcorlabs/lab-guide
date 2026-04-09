#!/usr/bin/env node
/**
 * Master test runner — executes all validation scripts sequentially.
 * This is what `npm test` calls.
 */
const { execSync } = require('child_process');
const path = require('path');

const tests = [
  { name: 'Answer Verification', script: 'verify-answers.js' },
  { name: 'Python Scripts', script: 'run-python-labs.js' },
  { name: 'Internal Links', script: 'check-links.js' },
  { name: 'HTML Quality', script: 'check-html.js' },
];

console.log('=== Lab Guide Validation Suite ===\n');

let passed = 0;
let failed = 0;

for (const test of tests) {
  const scriptPath = path.join(__dirname, test.script);
  console.log(`--- ${test.name} ---`);

  try {
    const output = execSync(`node "${scriptPath}"`, {
      stdio: 'pipe',
      timeout: 120000,
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
    });
    console.log(output.toString());
    passed++;
  } catch (err) {
    if (err.stdout) console.log(err.stdout.toString());
    if (err.stderr) console.error(err.stderr.toString());
    console.error(`FAILED: ${test.name}\n`);
    failed++;
  }
}

console.log('=== Summary ===');
console.log(`Passed: ${passed}/${tests.length}`);
console.log(`Failed: ${failed}/${tests.length}`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('\nAll validation passed.');
}
