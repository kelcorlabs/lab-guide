#!/usr/bin/env node
/**
 * Validate HTML structure and basic quality of the built lab guide.
 */
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'lab-guide.html');

if (!fs.existsSync(htmlPath)) {
  console.error('FAIL: lab-guide.html not found. Run `npm run build` first.');
  process.exit(1);
}

const html = fs.readFileSync(htmlPath, 'utf-8');
const size = fs.statSync(htmlPath).size;
let errors = 0;

function check(condition, pass, fail) {
  if (condition) {
    console.log(`  PASS: ${pass}`);
  } else {
    console.error(`  FAIL: ${fail}`);
    errors++;
  }
}

console.log('HTML Quality Checks:\n');

// Structure
check(html.includes('<!DOCTYPE html>'), 'Has DOCTYPE', 'Missing DOCTYPE');
check(html.includes('<html lang="en"') || html.includes('<html lang='), 'Has lang attribute', 'Missing lang attribute on <html>');
check(html.includes('charset') || html.includes('UTF-8'), 'Has charset declaration', 'Missing charset');
check(html.includes('<meta name="viewport"'), 'Has viewport meta', 'Missing viewport meta tag');
check(/<title>.+<\/title>/.test(html), 'Has non-empty title', 'Missing or empty <title>');

// Size
const sizeKB = Math.round(size / 1024);
check(size > 500000 && size < 1500000, `File size OK (${sizeKB} KB)`, `Unexpected file size: ${sizeKB} KB (expected 500-1500 KB)`);

// Content integrity
const h1Count = (html.match(/<h1/g) || []).length;
const h2Count = (html.match(/<h2/g) || []).length;
check(h1Count > 0, `Has ${h1Count} h1 headings`, 'No h1 headings found');
check(h2Count > 20, `Has ${h2Count} h2 headings (expected 20+)`, `Only ${h2Count} h2 headings (expected 20+)`);

// No empty hrefs
const emptyHrefs = (html.match(/href=""/g) || []).length;
check(emptyHrefs === 0, 'No empty href attributes', `Found ${emptyHrefs} empty href="" attributes`);

// Code blocks present
const codeBlocks = (html.match(/<pre/g) || []).length;
check(codeBlocks > 50, `Has ${codeBlocks} code blocks (expected 50+)`, `Only ${codeBlocks} code blocks (expected 50+)`);

// Details/summary (practice exam answers)
const detailsCount = (html.match(/<details/g) || []).length;
check(detailsCount > 30, `Has ${detailsCount} <details> elements (exam answers)`, `Only ${detailsCount} <details> elements (expected 30+)`);

console.log('');
if (errors > 0) {
  console.error(`FAILED: ${errors} error(s)`);
  process.exit(1);
} else {
  console.log('PASS: All HTML quality checks passed');
}
