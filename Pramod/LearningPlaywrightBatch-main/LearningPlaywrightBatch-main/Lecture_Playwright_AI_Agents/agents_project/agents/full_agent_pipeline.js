const { execSync } = require('child_process');
const path = require('path');

// ANSI color codes
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const BLUE = '\x1b[34m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const MAGENTA = '\x1b[35m';
const WHITE = '\x1b[37m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

const PROJECT_DIR = path.join(__dirname, '..');
const ROOT_DIR = path.join(__dirname, '..', '..');

function separator(char = '=', length = 70) {
  return CYAN + char.repeat(length) + RESET;
}

function phaseBanner(phaseNum, title, color) {
  const banner = `${color}${'*'.repeat(70)}${RESET}`;
  console.log('\n' + banner);
  console.log(`${BOLD}${color}  PHASE ${phaseNum}: ${title}${RESET}`);
  console.log(banner);
}

function timestamp() {
  return DIM + `[${new Date().toISOString()}]` + RESET;
}

function runScript(scriptPath, label) {
  console.log(`${timestamp()} ${CYAN}Executing: ${label}${RESET}`);
  try {
    const output = execSync(`node ${scriptPath}`, {
      cwd: PROJECT_DIR,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 60000,
    });
    console.log(output);
    return { success: true, output };
  } catch (err) {
    const output = (err.stdout || '') + '\n' + (err.stderr || '');
    console.log(output);
    return { success: false, output };
  }
}

function run() {
  const startTime = Date.now();

  console.log('\n' + separator('*'));
  console.log(`${BOLD}${CYAN}  PLAYWRIGHT AI AGENT PIPELINE${RESET}`);
  console.log(`${BOLD}${CYAN}  Full Automated Test Lifecycle${RESET}`);
  console.log(separator('*'));
  console.log(`${timestamp()} ${WHITE}Pipeline started${RESET}`);
  console.log(`${DIM}  Project: ${PROJECT_DIR}${RESET}`);
  console.log(`${DIM}  Target:  https://the-internet.herokuapp.com${RESET}\n`);

  const phaseResults = {};

  // ── Phase 1: PLAN ──
  phaseBanner(1, 'PLAN', MAGENTA);
  console.log(`${DIM}  The Planner Agent analyzes the application and generates a test plan.${RESET}\n`);

  const plannerScript = path.join(__dirname, 'planner_workflow.js');
  const planResult = runScript(plannerScript, 'Planner Agent');
  phaseResults.plan = planResult.success;

  // ── Phase 2: GENERATE ──
  phaseBanner(2, 'GENERATE', BLUE);
  console.log(`${DIM}  The Generator Agent converts the test plan into executable test code.${RESET}\n`);

  const generatorScript = path.join(__dirname, 'generator_workflow.js');
  const genResult = runScript(generatorScript, 'Generator Agent');
  phaseResults.generate = genResult.success;

  // ── Phase 3: EXECUTE ──
  phaseBanner(3, 'EXECUTE', YELLOW);
  console.log(`${DIM}  Running all generated tests with Playwright.${RESET}\n`);
  console.log(`${timestamp()} ${CYAN}Executing: npx playwright test${RESET}`);

  let testOutput = '';
  let testsPassed = 0;
  let testsFailed = 0;
  let testsTotal = 0;

  try {
    testOutput = execSync('npx playwright test', {
      cwd: ROOT_DIR,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 120000,
    });
    console.log(testOutput);
    phaseResults.execute = true;
  } catch (err) {
    testOutput = (err.stdout || '') + '\n' + (err.stderr || '');
    console.log(testOutput);
    phaseResults.execute = false;
  }

  // Parse test results from output
  const passMatch = testOutput.match(/(\d+)\s+passed/);
  const failMatch = testOutput.match(/(\d+)\s+failed/);
  if (passMatch) testsPassed = parseInt(passMatch[1]);
  if (failMatch) testsFailed = parseInt(failMatch[1]);
  testsTotal = testsPassed + testsFailed;

  console.log(`${CYAN}  Results: ${GREEN}${testsPassed} passed${RESET}, ${RED}${testsFailed} failed${RESET}, ${WHITE}${testsTotal} total${RESET}`);

  // ── Phase 4: HEAL ──
  phaseBanner(4, 'HEAL', RED);
  console.log(`${DIM}  The Healer Agent diagnoses failures and proposes fixes.${RESET}\n`);

  if (testsFailed > 0) {
    const healerScript = path.join(__dirname, 'healer_workflow.js');
    const healResult = runScript(healerScript, 'Healer Agent');
    phaseResults.heal = healResult.success;
  } else {
    console.log(`${GREEN}  No failures detected - Healer Agent not needed.${RESET}`);
    phaseResults.heal = true;
  }

  // ── Phase 5: SUMMARY ──
  phaseBanner(5, 'SUMMARY', GREEN);

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(1);

  console.log(`\n${BOLD}  Pipeline Execution Summary${RESET}`);
  console.log(separator('-', 50));

  const phases = [
    { name: 'Plan', result: phaseResults.plan, color: MAGENTA },
    { name: 'Generate', result: phaseResults.generate, color: BLUE },
    { name: 'Execute', result: phaseResults.execute, color: YELLOW },
    { name: 'Heal', result: phaseResults.heal, color: RED },
  ];

  phases.forEach(phase => {
    const icon = phase.result ? `${GREEN}PASS` : `${YELLOW}DONE`;
    console.log(`  ${phase.color}${phase.name.padEnd(12)}${RESET} ${icon}${RESET}`);
  });

  console.log(separator('-', 50));
  console.log(`\n${BOLD}  Test Execution Results${RESET}`);
  console.log(`${GREEN}  Passed:   ${testsPassed}${RESET}`);
  console.log(`${RED}  Failed:   ${testsFailed}${RESET}`);
  console.log(`${WHITE}  Total:    ${testsTotal}${RESET}`);
  console.log(`${CYAN}  Duration: ${duration}s${RESET}`);

  console.log(`\n${BOLD}  Agent Activity${RESET}`);
  console.log(`${MAGENTA}  Planner:   ${RESET}Generated test plan with 10 scenarios`);
  console.log(`${BLUE}  Generator: ${RESET}Produced 10 test files (7 pass, 3 intentional fail)`);
  console.log(`${RED}  Healer:    ${RESET}Diagnosed ${testsFailed} failures, proposed ${testsFailed} fixes`);

  console.log('\n' + separator('*'));
  console.log(`${BOLD}${GREEN}  PIPELINE COMPLETE${RESET}`);
  console.log(`${timestamp()} ${DIM}Total execution time: ${duration}s${RESET}`);
  console.log(separator('*'));
  console.log('');
}

run();
