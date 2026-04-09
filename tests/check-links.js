#!/usr/bin/env node
/**
 * Check for broken internal links in the built HTML.
 * Extracts all href="#..." anchors and verifies each target id exists.
 */
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'lab-guide.html');

if (!fs.existsSync(htmlPath)) {
  console.error('FAIL: lab-guide.html not found. Run `npm run build` first.');
  process.exit(1);
}

const html = fs.readFileSync(htmlPath, 'utf-8');

// Extract all internal anchor references
const hrefPattern = /href="#([^"]+)"/g;
const anchors = new Set();
let match;
while ((match = hrefPattern.exec(html)) !== null) {
  anchors.add(match[1]);
}

// Extract all id attributes
const idPattern = /id="([^"]+)"/g;
const ids = new Set();
while ((match = idPattern.exec(html)) !== null) {
  ids.add(match[1]);
}

console.log(`Found ${anchors.size} internal link targets, ${ids.size} element IDs`);

// Check each anchor has a matching id
let broken = 0;
for (const anchor of anchors) {
  // Skip dynamic JavaScript template expressions (e.g., CSS.escape(prevId))
  if (anchor.includes("'") || anchor.includes('+') || anchor.includes('(')) continue;
  if (!ids.has(anchor)) {
    console.error(`  BROKEN: href="#${anchor}" — no matching id found`);
    broken++;
  }
}

if (broken > 0) {
  console.error(`\nFAILED: ${broken} broken internal link(s)`);
  process.exit(1);
} else {
  console.log('\nPASS: All internal links resolve to valid targets');
}
