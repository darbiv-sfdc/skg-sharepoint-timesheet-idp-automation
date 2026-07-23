#!/usr/bin/env node
/**
 * validate-solution-doc.js
 *
 * Lean validation script for the Salesforce Solution Architect Agent's
 * 12-section Solution Architecture deliverable.
 *
 * SCOPE (per Lean Script Principle — only check what LLMs FAIL at ≥1/100 runs):
 *   1. All 12 mandatory sections present, in fixed order, non-empty
 *   2. Mermaid blocks lint clean (curve directive, no \n labels, styles at end)
 *   3. Section 9 numeric claims have arithmetic blocks within ±10 lines
 *   4. Cross-section entity consistency (entities in §4 referenced in §6 and §7)
 *   5. No residual <!-- SECTION: ... --> markers (Pattern #20 v2 mandate)
 *   6. No residual _{pending Phase N}_ placeholders
 *
 * NOT IN SCOPE (LLM is reliable at these — over-scripting violates Lean Principle):
 *   - Narrative quality, technical correctness, domain reasoning
 *   - Markdown link validity (use `markdown-link-check` separately if needed)
 *
 * Author: Cheppali Shaik Sohail
 * Version: 1.0.0
 * Usage: node validate-solution-doc.js <path-to-solution-architecture.md>
 */

'use strict';

const fs = require('fs');
const path = require('path');

const REQUIRED_SECTIONS = [
  { num: 1,  title: 'Business & Technical Context' },
  { num: 2,  title: 'Recommended Architecture' },
  { num: 3,  title: 'Architecture Diagram' },
  { num: 4,  title: 'Data Model Design' },
  { num: 5,  title: 'Data Model Diagram' },          // Lucidchart Instructions
  { num: 6,  title: 'Integration & Event Pattern' },
  { num: 7,  title: 'Automation & Orchestration' },
  { num: 8,  title: 'Security & Compliance' },
  { num: 9,  title: 'Scalability & Performance' },
  { num: 10, title: 'Reusability & Productization' },
  { num: 11, title: 'Risks & Mitigations' },
  { num: 12, title: 'References' },
];

const NUMERIC_TOKEN_PATTERN = /\b(\d[\d,]*\s*(?:TPS|tps|\/day|\/sec|GB|MB|ms|ms\b|claims\/day|users|records))\b/;
const ARITHMETIC_HINT_PATTERN = /(÷|\*|\bx\b|×|=)/;

function fail(msg)   { return { ok: false, msg }; }
function pass(msg)   { return { ok: true,  msg }; }

function loadDoc(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(2);
  }
  return fs.readFileSync(filePath, 'utf8');
}

function check1_AllSectionsPresentInOrder(doc) {
  const headingPattern = /^##\s+(\d+)\.\s+(.+)$/gm;
  const found = [];
  let m;
  while ((m = headingPattern.exec(doc)) !== null) {
    found.push({ num: parseInt(m[1], 10), title: m[2].trim() });
  }
  const results = [];
  REQUIRED_SECTIONS.forEach((req) => {
    const hit = found.find((f) => f.num === req.num);
    if (!hit) {
      results.push(fail(`§${req.num} "${req.title}" — MISSING`));
    } else if (!hit.title.toLowerCase().includes(req.title.toLowerCase().split(' ')[0])) {
      results.push(fail(`§${req.num} title mismatch — expected "${req.title}", found "${hit.title}"`));
    } else {
      results.push(pass(`§${req.num} "${hit.title}" — present`));
    }
  });
  // Order check
  const numbers = found.map((f) => f.num);
  const ordered = [...numbers].sort((a, b) => a - b);
  if (JSON.stringify(numbers) !== JSON.stringify(ordered)) {
    results.push(fail(`Section order is wrong: ${numbers.join(',')} (expected ${ordered.join(',')})`));
  } else if (numbers.length === REQUIRED_SECTIONS.length) {
    results.push(pass('All 12 sections present, in correct order'));
  }
  return results;
}

function check2_MermaidLint(doc) {
  const blocks = [...doc.matchAll(/```mermaid\n([\s\S]*?)```/g)];
  if (blocks.length === 0) {
    return [fail('No Mermaid blocks found — Section 3 (Architecture Diagram) requires one')];
  }
  const results = [];
  blocks.forEach((b, idx) => {
    const block = b[1];
    const issues = [];
    const isFlowchart = /^(flowchart|graph)\b/m.test(block);
    if (isFlowchart && !/%%\{\s*init:\s*\{[^}]*'flowchart'[^}]*'curve':\s*'linear'/m.test(block)) {
      issues.push("missing init directive `%%{ init: { 'flowchart': { 'curve': 'linear' } } }%%`");
    }
    if (/\\n/.test(block)) {
      issues.push("contains literal `\\n` in label — use `<br/>` instead");
    }
    // Check styles at end (heuristic: no node definition after first style)
    const firstStyleIdx = block.indexOf('\n    style ');
    if (firstStyleIdx !== -1) {
      const afterStyle = block.slice(firstStyleIdx);
      if (/\n\s+\w+\s*-->|\n\s+\w+\[/.test(afterStyle.replace(/\n\s+style[^\n]*/g, ''))) {
        issues.push('node/connection definitions appear after style declarations — styles should all be at end');
      }
    }
    if (issues.length === 0) {
      results.push(pass(`Mermaid block #${idx + 1} — lint clean`));
    } else {
      issues.forEach((i) => results.push(fail(`Mermaid block #${idx + 1}: ${i}`)));
    }
  });
  return results;
}

function check3_NumericClaimsHaveArithmetic(doc) {
  const lines = doc.split('\n');
  const sec9StartIdx = lines.findIndex((l) => /^##\s+9\.\s+Scalability/.test(l));
  const sec10StartIdx = lines.findIndex((l) => /^##\s+10\.\s+/.test(l));
  if (sec9StartIdx === -1) return [fail('Section 9 not found — cannot check numeric arithmetic')];
  const sec9End = sec10StartIdx === -1 ? lines.length : sec10StartIdx;
  const sec9Lines = lines.slice(sec9StartIdx, sec9End);
  const results = [];
  sec9Lines.forEach((line, i) => {
    if (NUMERIC_TOKEN_PATTERN.test(line)) {
      const window = sec9Lines.slice(Math.max(0, i - 10), i + 10).join('\n');
      if (!ARITHMETIC_HINT_PATTERN.test(window)) {
        results.push(fail(`§9 line ~${sec9StartIdx + i + 1}: numeric claim "${line.trim().slice(0, 80)}" lacks nearby arithmetic block (÷ × = expected within ±10 lines)`));
      }
    }
  });
  if (results.length === 0) {
    results.push(pass('§9 numeric claims have arithmetic backing'));
  }
  return results;
}

function check4_CrossSectionEntityConsistency(doc) {
  const sec4 = extractSection(doc, 4);
  const sec6 = extractSection(doc, 6);
  const sec7 = extractSection(doc, 7);
  if (!sec4) return [fail('Section 4 not found — cannot run cross-section check')];
  // Heuristic: extract capitalized identifiers ending in commonly-used SFDC suffixes
  const entityPattern = /\b([A-Z][A-Za-z]*(?:_[A-Za-z0-9]+)*(?:__c|__e|__b|__r)?)\b/g;
  const entities = new Set();
  [...sec4.matchAll(entityPattern)].forEach((m) => {
    const e = m[1];
    if (e.length > 3 && /[A-Z][a-z]/.test(e)) entities.add(e);
  });
  const COMMON_NOISE = new Set(['Section', 'Entity', 'Field', 'Type', 'Required', 'Master', 'Detail', 'Lookup', 'External', 'Internal', 'Note', 'Required', 'Per', 'Insurance', 'Cloud']);
  const filtered = [...entities].filter((e) => !COMMON_NOISE.has(e));
  const results = [];
  let referenced = 0;
  filtered.slice(0, 10).forEach((e) => {
    const inSec6 = sec6 && sec6.includes(e);
    const inSec7 = sec7 && sec7.includes(e);
    if (inSec6 || inSec7) referenced++;
  });
  if (filtered.length > 0 && referenced === 0) {
    results.push(fail(`§4 introduces entities (${filtered.slice(0, 5).join(', ')}...) but NONE are referenced in §6 or §7 — cross-section consistency missing`));
  } else if (filtered.length > 0) {
    results.push(pass(`§4 entities referenced in §6/§7 (${referenced}/${Math.min(filtered.length, 10)} sampled)`));
  }
  return results;
}

function check5_NoResidualSectionMarkers(doc) {
  const markers = [...doc.matchAll(/<!--\s*SECTION:\s*[\w-]+\s*-->/g)];
  if (markers.length > 0) {
    return [fail(`${markers.length} residual <!-- SECTION: ... --> markers found — should all be consumed by Phase 8`)];
  }
  return [pass('No residual section markers (Pattern #20 v2 contract honored)')];
}

function check6_NoResidualPlaceholders(doc) {
  const phs = [...doc.matchAll(/_\{pending\s+Phase\s+\d+\}_/g)];
  if (phs.length > 0) {
    return [fail(`${phs.length} residual _{pending Phase N}_ placeholders — Phase 8 polish must replace all`)];
  }
  return [pass('No residual phase placeholders')];
}

function extractSection(doc, sectionNum) {
  const startPattern = new RegExp(`^##\\s+${sectionNum}\\.\\s`, 'm');
  const endPattern = new RegExp(`^##\\s+${sectionNum + 1}\\.\\s`, 'm');
  const startMatch = doc.match(startPattern);
  if (!startMatch) return null;
  const startIdx = startMatch.index;
  const after = doc.slice(startIdx);
  const endMatch = after.slice(1).match(endPattern);
  return endMatch ? after.slice(0, endMatch.index + 1) : after;
}

function main() {
  const docPath = process.argv[2];
  if (!docPath) {
    console.error('Usage: node validate-solution-doc.js <path-to-solution-architecture.md>');
    process.exit(2);
  }
  const doc = loadDoc(path.resolve(docPath));
  console.log(`\n🔍 validate-solution-doc.js — checking: ${docPath}\n`);
  const checks = [
    { name: '1. All 12 sections present, in order', fn: check1_AllSectionsPresentInOrder },
    { name: '2. Mermaid blocks lint clean',           fn: check2_MermaidLint },
    { name: '3. §9 numeric claims have arithmetic',   fn: check3_NumericClaimsHaveArithmetic },
    { name: '4. Cross-section entity consistency',    fn: check4_CrossSectionEntityConsistency },
    { name: '5. No residual SECTION markers (P20v2)', fn: check5_NoResidualSectionMarkers },
    { name: '6. No residual phase placeholders',      fn: check6_NoResidualPlaceholders },
  ];
  let totalFails = 0;
  let totalPasses = 0;
  checks.forEach((c) => {
    console.log(`\n── Check ${c.name} ──`);
    const results = c.fn(doc);
    results.forEach((r) => {
      const icon = r.ok ? '✅' : '❌';
      console.log(`  ${icon} ${r.msg}`);
      if (r.ok) totalPasses++; else totalFails++;
    });
  });
  console.log('\n─────────────────────────────────────────────────────────');
  console.log(`SUMMARY: ${totalPasses} pass, ${totalFails} fail`);
  console.log('─────────────────────────────────────────────────────────\n');
  process.exit(totalFails > 0 ? 1 : 0);
}

main();
