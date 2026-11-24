const fs = require('fs');
const path = require('path');
const config = require('../config/project_config');

// ANSI color codes
const PURPLE = '\x1b[35m';
const GREEN = '\x1b[32m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

function separator(char = '=', length = 70) {
  return PURPLE + char.repeat(length) + RESET;
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
  console.log(`${BOLD}${PURPLE}  PLAYWRIGHT AI AGENT: TEST PLANNER${RESET}`);
  console.log(separator());
  console.log(`${timestamp()} ${CYAN}Starting Planner Agent workflow...${RESET}\n`);

  // Step 1: Read the planner agent .md file
  console.log(`${BOLD}Step 1: Loading Planner Agent Configuration${RESET}`);
  console.log(separator('-', 50));

  let agentContent = null;
  const agentPath = config.agents.plannerPath;

  try {
    agentContent = fs.readFileSync(agentPath, 'utf-8');
    console.log(`${GREEN}  Agent file loaded:${RESET} ${agentPath}`);
  } catch (err) {
    console.log(`${YELLOW}  Agent file not found at: ${agentPath}${RESET}`);
    console.log(`${YELLOW}  Using simulated agent configuration...${RESET}`);
    agentContent = `---
name: playwright-test-planner
description: Use this agent to plan Playwright tests for a given application
model: sonnet
color: purple
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

You are a test planning agent...`;
  }

  // Step 2: Parse and display YAML frontmatter
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
  } else {
    console.log(`${YELLOW}  Could not parse frontmatter${RESET}`);
  }

  // Step 3: Simulate the planning workflow
  console.log(`\n${BOLD}Step 3: Executing Planning Workflow${RESET}`);
  console.log(separator('-', 50));

  const planningSteps = [
    'Navigating to application: ' + config.app.baseURL,
    'Taking snapshot of homepage...',
    'Identifying interactive elements...',
    'Cataloging page links and navigation paths...',
    'Analyzing form inputs and buttons...',
    'Checking for dynamic content areas...',
    'Mapping authentication flows...',
    'Generating test scenarios from discovered elements...',
    'Prioritizing test cases by risk and coverage...',
    'Writing structured test plan to plans/ directory...',
  ];

  planningSteps.forEach((step, i) => {
    console.log(`${GREEN}  [${i + 1}/${planningSteps.length}]${RESET} ${step}`);
  });

  // Step 4: Read and display the sample test plan
  console.log(`\n${BOLD}Step 4: Generated Test Plan Output${RESET}`);
  console.log(separator('-', 50));

  const planPath = path.join(config.reporting.plansDir, 'sample_test_plan.md');

  try {
    const planContent = fs.readFileSync(planPath, 'utf-8');
    // Display first 40 lines of the plan
    const lines = planContent.split('\n').slice(0, 40);
    lines.forEach(line => {
      console.log(`${DIM}  ${line}${RESET}`);
    });
    console.log(`${DIM}  ... (truncated - see full plan at ${planPath})${RESET}`);
  } catch (err) {
    console.log(`${YELLOW}  Test plan not found at: ${planPath}${RESET}`);
  }

  // Summary
  console.log('\n' + separator());
  console.log(`${BOLD}${GREEN}  PLANNER AGENT COMPLETE${RESET}`);
  console.log(`${timestamp()} ${CYAN}Test plan generated with 10 scenarios${RESET}`);
  console.log(`${CYAN}  Output: ${RESET}${planPath}`);
  console.log(separator());
  console.log('');
}

run();
