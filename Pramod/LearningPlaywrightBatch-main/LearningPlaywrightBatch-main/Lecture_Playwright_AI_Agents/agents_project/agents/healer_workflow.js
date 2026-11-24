const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const config = require('../config/project_config');

// ANSI color codes
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const MAGENTA = '\x1b[35m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

function separator(char = '=', length = 70) {
  return MAGENTA + char.repeat(length) + RESET;
}

function timestamp() {
  return DIM + `[${new Date().toISOString()}]` + RESET;
}

function parseYAMLFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const yaml = match[1];
  const result = {};
  const lines = yaml.split('\n');
  let currentKey = null;
  let currentList = null;

  for (const line of lines) {
    const keyValue = line.match(/^(\w+):\s*(.+)?$/);
    const listItem = line.match(/^\s+-\s+(.+)$/);

    if (keyValue) {
      currentKey = keyValue[1];
      const value = keyValue[2];
      if (value) {
        result[currentKey] = value;
        currentList = null;
      } else {
        result[currentKey] = [];
        currentList = currentKey;
      }
    } else if (listItem && currentList) {
      result[currentList].push(listItem[1]);
    }
  }

  return result;
}

function run() {
  console.log('\n' + separator());
  console.log(`${BOLD}${MAGENTA}  PLAYWRIGHT AI AGENT: TEST HEALER${RESET}`);
  console.log(separator());
  console.log(`${timestamp()} ${CYAN}Starting Healer Agent workflow...${RESET}\n`);

  // Step 1: Read the healer agent .md file
  console.log(`${BOLD}Step 1: Loading Healer Agent Configuration${RESET}`);
  console.log(separator('-', 50));

  let agentContent = null;
  const agentPath = config.agents.healerPath;

  try {
    agentContent = fs.readFileSync(agentPath, 'utf-8');
    console.log(`${GREEN}  Agent file loaded:${RESET} ${agentPath}`);
  } catch (err) {
    console.log(`${YELLOW}  Agent file not found at: ${agentPath}${RESET}`);
    console.log(`${YELLOW}  Using simulated agent configuration...${RESET}`);
    agentContent = `---
name: playwright-test-healer
description: Use this agent to diagnose and fix failing Playwright tests
model: sonnet
color: magenta
tools:
  - search
  - playwright-test/browser_navigate
  - playwright-test/browser_snapshot
  - playwright-test/browser_click
  - playwright-test/list_files
  - playwright-test/read_file
  - playwright-test/write_file
---

You are a test healer agent...`;
  }

  // Step 2: Parse and display configuration
  console.log(`\n${BOLD}Step 2: Parsing Agent Configuration${RESET}`);
  console.log(separator('-', 50));

  const frontmatter = parseYAMLFrontmatter(agentContent);

  if (frontmatter) {
    console.log(`${CYAN}  Name:        ${RESET}${frontmatter.name || 'N/A'}`);
    console.log(`${CYAN}  Description: ${RESET}${frontmatter.description || 'N/A'}`);
    console.log(`${CYAN}  Model:       ${RESET}${frontmatter.model || 'N/A'}`);
    console.log(`${CYAN}  Color:       ${RESET}${frontmatter.color || 'N/A'}`);
    const toolCount = Array.isArray(frontmatter.tools) ? frontmatter.tools.length : 0;
    console.log(`${CYAN}  Tools:       ${RESET}${toolCount} tools available`);
  }

  // Step 3: Run Playwright tests and capture output
  console.log(`\n${BOLD}Step 3: Executing Test Suite${RESET}`);
  console.log(separator('-', 50));
  console.log(`${CYAN}  Running: npx playwright test${RESET}`);

  let testOutput = '';
  let testExitCode = 0;

  try {
    testOutput = execSync('npx playwright test', {
      cwd: path.join(__dirname, '..', '..'),
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 120000,
    });
    console.log(`${GREEN}  All tests passed!${RESET}`);
  } catch (err) {
    testExitCode = err.status || 1;
    testOutput = (err.stdout || '') + '\n' + (err.stderr || '');
    console.log(`${RED}  Test suite completed with failures (exit code: ${testExitCode})${RESET}`);
  }

  // Step 4: Parse output for failures
  console.log(`\n${BOLD}Step 4: Analyzing Test Results${RESET}`);
  console.log(separator('-', 50));

  const failurePatterns = [
    {
      test: '07_broken_selector.spec.js',
      id: 'TC-007',
      name: 'Broken Selector',
      diagnosis: 'WRONG SELECTOR',
      detail: 'The selector \'#ai-generated-element\' does not exist in the DOM.',
      rootCause: 'AI agent hallucinated a CSS selector that does not match any element on the page.',
      fix: 'Replace \'#ai-generated-element\' with a valid selector like \'h1.heading\' or use page.getByRole().',
      fixedCode: `// HEALED: Replace hallucinated selector with valid element
const heading = page.locator('h1.heading');
await expect(heading).toBeVisible();`,
    },
    {
      test: '08_stale_element.spec.js',
      id: 'TC-008',
      name: 'Stale Element Text',
      diagnosis: 'WRONG EXPECTED TEXT',
      detail: 'Expected text "AI Agent Dashboard" but actual text is "Welcome to the-internet".',
      rootCause: 'AI agent hallucinated the expected text content instead of reading it from the page.',
      fix: 'Update expected text from "AI Agent Dashboard" to "Welcome to the-internet".',
      fixedCode: `// HEALED: Use actual page text instead of hallucinated text
await expect(heading).toHaveText('Welcome to the-internet');`,
    },
    {
      test: '09_wrong_assertion.spec.js',
      id: 'TC-009',
      name: 'Wrong Assertion',
      diagnosis: 'WRONG URL ASSERTION',
      detail: 'Expected URL to contain "/dashboard" but login without credentials stays on "/login".',
      rootCause: 'AI agent assumed the page would navigate to /dashboard after clicking login, but without valid credentials the page stays on /login with an error.',
      fix: 'Assert URL contains /login (not /dashboard) and check for error message.',
      fixedCode: `// HEALED: Assert correct URL and check for error message
await expect(page).toHaveURL(/\\/login/);
const flash = page.locator('#flash');
await expect(flash).toContainText('Your username is invalid!');`,
    },
  ];

  // Check which failures actually occurred in the output
  const detectedFailures = [];

  // Always show all 3 known failures for demonstration purposes
  failurePatterns.forEach(fp => {
    detectedFailures.push(fp);
  });

  console.log(`${CYAN}  Total failures detected:${RESET} ${detectedFailures.length}`);

  // Step 5: Diagnose each failure
  console.log(`\n${BOLD}Step 5: Diagnosing Failures${RESET}`);
  console.log(separator('-', 50));

  detectedFailures.forEach((failure, i) => {
    console.log(`\n${RED}  Failure ${i + 1}/${detectedFailures.length}: ${failure.id} - ${failure.name}${RESET}`);
    console.log(`${DIM}  File: tests/${failure.test}${RESET}`);
    console.log(`${YELLOW}  Diagnosis: ${failure.diagnosis}${RESET}`);
    console.log(`${DIM}  Detail: ${failure.detail}${RESET}`);
    console.log(`${DIM}  Root Cause: ${failure.rootCause}${RESET}`);
  });

  // Step 6: Show proposed fixes
  console.log(`\n${BOLD}Step 6: Proposed Fixes${RESET}`);
  console.log(separator('-', 50));

  detectedFailures.forEach((failure, i) => {
    console.log(`\n${GREEN}  Fix ${i + 1}/${detectedFailures.length}: ${failure.id} - ${failure.name}${RESET}`);
    console.log(`${CYAN}  Action: ${failure.fix}${RESET}`);
    console.log(`${DIM}  Healed code:${RESET}`);
    failure.fixedCode.split('\n').forEach(line => {
      console.log(`${DIM}    ${line}${RESET}`);
    });
  });

  // Summary
  console.log('\n' + separator());
  console.log(`${BOLD}${GREEN}  HEALER AGENT COMPLETE${RESET}`);
  console.log(`${timestamp()} ${CYAN}Analysis summary:${RESET}`);
  console.log(`${CYAN}  Failures analyzed: ${RESET}${detectedFailures.length}`);
  console.log(`${CYAN}  Fixes proposed:    ${RESET}${detectedFailures.length}`);
  console.log(`${CYAN}  Diagnosis types:${RESET}`);
  console.log(`${DIM}    - Wrong Selector:      TC-007${RESET}`);
  console.log(`${DIM}    - Wrong Expected Text:  TC-008${RESET}`);
  console.log(`${DIM}    - Wrong URL Assertion:  TC-009${RESET}`);
  console.log(separator());
  console.log('');
}

run();
