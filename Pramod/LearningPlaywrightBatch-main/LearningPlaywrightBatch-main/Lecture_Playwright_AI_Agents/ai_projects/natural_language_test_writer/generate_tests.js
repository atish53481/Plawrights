#!/usr/bin/env node
/**
 * Natural Language Test Writer
 * Converts plain English test descriptions into Playwright spec files
 *
 * Usage: node generate_tests.js
 */

const fs = require('fs');
const path = require('path');
const { getTemplate, listTemplateTypes } = require('./prompt_templates');

// Colors
const GREEN = '\x1b[32m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';
const MAGENTA = '\x1b[35m';

function banner() {
  console.log(`
${CYAN}╔═══════════════════════════════════════════════════════════════╗
║          ${BOLD}AI Natural Language Test Writer${RESET}${CYAN}                      ║
║          Converts English → Playwright Specs                  ║
╚═══════════════════════════════════════════════════════════════╝${RESET}
`);
}

function timestamp() {
  return DIM + `[${new Date().toISOString()}]` + RESET;
}

function main() {
  banner();

  // Load test descriptions
  const descriptionsPath = path.join(__dirname, 'test_descriptions.json');
  const descriptions = JSON.parse(fs.readFileSync(descriptionsPath, 'utf-8'));

  console.log(`${timestamp()} ${CYAN}Loaded ${descriptions.length} test descriptions${RESET}`);
  console.log(`${timestamp()} ${CYAN}Available templates: ${listTemplateTypes().join(', ')}${RESET}\n`);

  const generatedDir = path.join(__dirname, 'generated');
  if (!fs.existsSync(generatedDir)) {
    fs.mkdirSync(generatedDir, { recursive: true });
  }

  let successCount = 0;
  let failCount = 0;

  for (const desc of descriptions) {
    const template = getTemplate(desc.type);

    if (!template) {
      console.log(`${RED}  ✗ No template for type: ${desc.type} (test #${desc.id})${RESET}`);
      failCount++;
      continue;
    }

    try {
      const testCode = template(desc);
      const fileName = `test_${String(desc.id).padStart(2, '0')}_${desc.type}.spec.js`;
      const filePath = path.join(generatedDir, fileName);

      fs.writeFileSync(filePath, testCode);
      successCount++;

      console.log(`${GREEN}  ✓${RESET} ${BOLD}Test #${desc.id}${RESET}`);
      console.log(`    ${DIM}Description:${RESET} ${desc.description}`);
      console.log(`    ${DIM}Type:${RESET}        ${YELLOW}${desc.type}${RESET}`);
      console.log(`    ${DIM}Page:${RESET}        ${desc.page}`);
      console.log(`    ${DIM}Output:${RESET}      ${CYAN}${fileName}${RESET}`);
      console.log();
    } catch (err) {
      console.log(`${RED}  ✗ Failed to generate test #${desc.id}: ${err.message}${RESET}`);
      failCount++;
    }
  }

  // Summary
  console.log(`${CYAN}${'═'.repeat(63)}${RESET}`);
  console.log(`${BOLD}${MAGENTA}  GENERATION SUMMARY${RESET}`);
  console.log(`${CYAN}${'═'.repeat(63)}${RESET}`);
  console.log(`  ${GREEN}✓ Generated:${RESET} ${successCount} test files`);
  if (failCount > 0) {
    console.log(`  ${RED}✗ Failed:${RESET}    ${failCount} tests`);
  }
  console.log(`  ${CYAN}📁 Output:${RESET}   ${generatedDir}`);
  console.log(`${CYAN}${'═'.repeat(63)}${RESET}\n`);

  console.log(`${DIM}Run generated tests with:${RESET}`);
  console.log(`${YELLOW}  npx playwright test generated/ --config=../../playwright.config.js${RESET}\n`);
}

main();
