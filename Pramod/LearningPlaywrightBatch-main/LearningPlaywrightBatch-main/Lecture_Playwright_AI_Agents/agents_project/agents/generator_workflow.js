const fs = require('fs');
const path = require('path');
const config = require('../config/project_config');

// ANSI color codes
const BLUE = '\x1b[34m';
const GREEN = '\x1b[32m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

function separator(char = '=', length = 70) {
  return BLUE + char.repeat(length) + RESET;
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
  console.log(`${BOLD}${BLUE}  PLAYWRIGHT AI AGENT: TEST GENERATOR${RESET}`);
  console.log(separator());
  console.log(`${timestamp()} ${CYAN}Starting Generator Agent workflow...${RESET}\n`);

  // Step 1: Read the generator agent .md file
  console.log(`${BOLD}Step 1: Loading Generator Agent Configuration${RESET}`);
  console.log(separator('-', 50));

  let agentContent = null;
  const agentPath = config.agents.generatorPath;

  try {
    agentContent = fs.readFileSync(agentPath, 'utf-8');
    console.log(`${GREEN}  Agent file loaded:${RESET} ${agentPath}`);
  } catch (err) {
    console.log(`${YELLOW}  Agent file not found at: ${agentPath}${RESET}`);
    console.log(`${YELLOW}  Using simulated agent configuration...${RESET}`);
    agentContent = `---
name: playwright-test-generator
description: Use this agent to generate Playwright test code from a test plan
model: sonnet
color: blue
tools:
  - search
  - playwright-test/browser_navigate
  - playwright-test/browser_snapshot
  - playwright-test/browser_click
  - playwright-test/browser_fill
  - playwright-test/list_files
  - playwright-test/read_file
  - playwright-test/write_file
---

You are a test generator agent...`;
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
    if (Array.isArray(frontmatter.tools)) {
      frontmatter.tools.forEach(tool => {
        console.log(`${DIM}               - ${tool}${RESET}`);
      });
    }
  }

  // Step 3: Read the sample test plan
  console.log(`\n${BOLD}Step 3: Reading Test Plan${RESET}`);
  console.log(separator('-', 50));

  const planPath = path.join(config.reporting.plansDir, 'sample_test_plan.md');
  let planContent = '';

  try {
    planContent = fs.readFileSync(planPath, 'utf-8');
    console.log(`${GREEN}  Test plan loaded:${RESET} ${planPath}`);

    // Extract scenario count
    const scenarios = planContent.match(/### TC-\d+/g);
    const count = scenarios ? scenarios.length : 0;
    console.log(`${CYAN}  Scenarios found:${RESET} ${count}`);
  } catch (err) {
    console.log(`${YELLOW}  Test plan not found at: ${planPath}${RESET}`);
  }

  // Step 4: Simulate converting plan steps to test code
  console.log(`\n${BOLD}Step 4: Generating Test Code from Plan${RESET}`);
  console.log(separator('-', 50));

  const testFiles = [
    { id: 'TC-001', name: 'Homepage Load', file: '01_homepage_load.spec.js', status: 'PASS' },
    { id: 'TC-002', name: 'Login Form', file: '02_login_form.spec.js', status: 'PASS' },
    { id: 'TC-003', name: 'Dropdown Select', file: '03_dropdown_select.spec.js', status: 'PASS' },
    { id: 'TC-004', name: 'Checkbox Toggle', file: '04_checkbox_toggle.spec.js', status: 'PASS' },
    { id: 'TC-005', name: 'Dynamic Content', file: '05_dynamic_content.spec.js', status: 'PASS' },
    { id: 'TC-006', name: 'File Upload Page', file: '06_file_upload_page.spec.js', status: 'PASS' },
    { id: 'TC-007', name: 'Broken Selector', file: '07_broken_selector.spec.js', status: 'FAIL' },
    { id: 'TC-008', name: 'Stale Element', file: '08_stale_element.spec.js', status: 'FAIL' },
    { id: 'TC-009', name: 'Wrong Assertion', file: '09_wrong_assertion.spec.js', status: 'FAIL' },
    { id: 'TC-010', name: 'Drag and Drop', file: '10_drag_and_drop.spec.js', status: 'PASS' },
  ];

  testFiles.forEach((tf, i) => {
    const statusColor = tf.status === 'PASS' ? GREEN : YELLOW;
    console.log(`${GREEN}  [${i + 1}/${testFiles.length}]${RESET} Generating ${tf.id}: ${tf.name}`);
    console.log(`${DIM}        -> tests/${tf.file}${RESET} ${statusColor}[Expected: ${tf.status}]${RESET}`);
  });

  // Step 5: Show the generated sample test file
  console.log(`\n${BOLD}Step 5: Sample Generated Test Output${RESET}`);
  console.log(separator('-', 50));

  const generatedPath = path.join(config.reporting.generatedDir, 'sample_generated_test.spec.js');

  try {
    const generatedContent = fs.readFileSync(generatedPath, 'utf-8');
    const lines = generatedContent.split('\n');
    lines.forEach(line => {
      console.log(`${DIM}  ${line}${RESET}`);
    });
  } catch (err) {
    console.log(`${YELLOW}  Generated test not found at: ${generatedPath}${RESET}`);
  }

  // Summary
  console.log('\n' + separator());
  console.log(`${BOLD}${GREEN}  GENERATOR AGENT COMPLETE${RESET}`);
  console.log(`${timestamp()} ${CYAN}Generated ${testFiles.length} test files from plan${RESET}`);
  console.log(`${CYAN}  Pass tests:  ${RESET}${testFiles.filter(t => t.status === 'PASS').length}`);
  console.log(`${CYAN}  Fail tests:  ${RESET}${testFiles.filter(t => t.status === 'FAIL').length} (intentional)`);
  console.log(`${CYAN}  Output dir:  ${RESET}tests/`);
  console.log(separator());
  console.log('');
}

run();
