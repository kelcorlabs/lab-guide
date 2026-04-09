#!/usr/bin/env node
/**
 * Extract and run all Python reference scripts from the lab guide.
 * Finds code blocks under "## Reference code" headings and executes them.
 * Skips blocks that require an API key (contain "anthropic" imports).
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

const source = fs.readFileSync(path.join(__dirname, '..', 'Hands on Lab'), 'utf-8');
const lines = source.split('\n');

// Detect Python command
let pythonCmd = 'python';
try {
  execSync('python --version', { stdio: 'pipe' });
} catch {
  try {
    execSync('python3 --version', { stdio: 'pipe' });
    pythonCmd = 'python3';
  } catch {
    console.error('FAIL: Python not found (tried python and python3)');
    process.exit(1);
  }
}
console.log(`Using: ${pythonCmd}`);

// Extract Python blocks that appear after "## Reference code" headings
const scripts = [];
let inRefSection = false;
let inCodeBlock = false;
let currentCode = [];
let currentLab = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Track which lab we're in
  if (line.startsWith('# LAB ')) {
    currentLab = line.replace(/^# /, '').split('\n')[0].trim();
    inRefSection = false;
  }

  // Detect "## Reference code" sections
  if (line.startsWith('## Reference code')) {
    inRefSection = true;
    continue;
  }

  // Any other H2 ends the reference code section
  if (line.startsWith('## ') && !line.startsWith('## Reference code')) {
    inRefSection = false;
  }

  if (inRefSection) {
    if (line.startsWith('```python') && !inCodeBlock) {
      inCodeBlock = true;
      currentCode = [];
      continue;
    }
    if (line.startsWith('```') && inCodeBlock) {
      inCodeBlock = false;
      if (currentCode.length > 0) {
        scripts.push({ lab: currentLab, code: currentCode.join('\n'), line: i });
      }
      continue;
    }
    if (inCodeBlock) {
      currentCode.push(line);
    }
  }
}

console.log(`Found ${scripts.length} reference scripts\n`);

let passed = 0;
let skipped = 0;
let failed = 0;

const tmpDir = os.tmpdir();

for (const script of scripts) {
  // Skip scripts that require API key
  if (script.code.includes('import anthropic') || script.code.includes('from anthropic')) {
    console.log(`  SKIP: ${script.lab} (requires API key)`);
    skipped++;
    continue;
  }

  // Only run blocks that are complete standalone scripts:
  // Must have __main__ guard AND at least one function/class definition
  // This skips: snippets, fragments, and continuation blocks
  const hasMain = script.code.includes('__main__');
  const hasDef = script.code.includes('\ndef ') || script.code.includes('\nclass ') || script.code.startsWith('def ');
  if (!hasMain || !hasDef) {
    console.log(`  SKIP: ${script.lab} (${!hasMain ? 'no __main__' : 'no function definitions'})`);
    skipped++;
    continue;
  }

  // Skip scripts requiring pip packages not in stdlib
  if (script.code.includes('from pydantic') || script.code.includes('import pydantic')) {
    console.log(`  SKIP: ${script.lab} (requires pydantic)`);
    skipped++;
    continue;
  }

  const tmpFile = path.join(tmpDir, `lab_test_${Date.now()}.py`);

  try {
    fs.writeFileSync(tmpFile, script.code);
    execSync(`${pythonCmd} "${tmpFile}"`, {
      stdio: 'pipe',
      timeout: 30000,
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
    });
    console.log(`  PASS: ${script.lab}`);
    passed++;
  } catch (err) {
    console.error(`  FAIL: ${script.lab}`);
    if (err.stderr) console.error(`    ${err.stderr.toString().split('\n').slice(-3).join('\n    ')}`);
    failed++;
  } finally {
    try { fs.unlinkSync(tmpFile); } catch {}
  }
}

console.log(`\nResults: ${passed} passed, ${skipped} skipped, ${failed} failed (${scripts.length} total)`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('PASS: All runnable Python scripts executed successfully');
}
