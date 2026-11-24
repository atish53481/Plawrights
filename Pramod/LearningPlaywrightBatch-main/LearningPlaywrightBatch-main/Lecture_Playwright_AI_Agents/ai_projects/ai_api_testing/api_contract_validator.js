#!/usr/bin/env node
/**
 * API Contract Validator
 * Validates live API responses against defined contracts
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { validateResponse } = require('./schema_analyzer');

const GREEN = '\x1b[32m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

const BASE_URL = 'https://the-internet.herokuapp.com';

async function validateContracts() {
  console.log(`\n${CYAN}╔═══════════════════════════════════════════════════════════════╗${RESET}`);
  console.log(`${CYAN}║          ${BOLD}AI API Contract Validator${RESET}${CYAN}                           ║${RESET}`);
  console.log(`${CYAN}║          Validating Against Live Endpoints                     ║${RESET}`);
  console.log(`${CYAN}╚═══════════════════════════════════════════════════════════════╝${RESET}\n`);

  const contractsPath = path.join(__dirname, 'contracts', 'api_contracts.json');
  const { contracts } = JSON.parse(fs.readFileSync(contractsPath, 'utf-8'));

  console.log(`${DIM}Loaded ${contracts.length} contracts${RESET}`);
  console.log(`${DIM}Base URL: ${BASE_URL}${RESET}\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const results = [];

  for (const contract of contracts) {
    const url = `${BASE_URL}${contract.endpoint}`;
    console.log(`${CYAN}  Validating:${RESET} ${BOLD}${contract.name}${RESET} ${DIM}(${contract.method} ${contract.endpoint})${RESET}`);

    try {
      let status, headers, body;

      if (contract.method === 'POST' && contract.formData) {
        // Use page to submit form (since the-internet uses form-based auth)
        await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
        await page.fill('#username', contract.formData.username);
        await page.fill('#password', contract.formData.password);

        const [response] = await Promise.all([
          page.waitForNavigation(),
          page.click('button[type="submit"]'),
        ]);

        status = response?.status() || 200;
        body = await page.content();
        headers = { 'content-type': 'text/html' };
      } else {
        const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
        status = response?.status() || 0;
        headers = response?.headers() || {};
        body = await page.content();
      }

      const result = validateResponse(status, headers, body, contract);
      results.push(result);

      const icon = result.compliant ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`;
      console.log(`    ${icon} ${result.passed}/${result.total} checks passed\n`);

    } catch (err) {
      console.log(`    ${RED}✗ Error: ${err.message.substring(0, 60)}${RESET}\n`);
      results.push({
        contract: contract.name,
        endpoint: contract.endpoint,
        method: contract.method,
        checks: [],
        passed: 0,
        failed: 1,
        total: 1,
        compliant: false,
        error: err.message,
      });
    }
  }

  await browser.close();

  // Generate report
  const reportsDir = path.join(__dirname, 'reports');
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

  const html = generateReport(results);
  const reportPath = path.join(reportsDir, 'contract_compliance_report.html');
  fs.writeFileSync(reportPath, html);

  // Save JSON
  fs.writeFileSync(path.join(reportsDir, 'validation_results.json'), JSON.stringify(results, null, 2));

  // Summary
  const compliant = results.filter(r => r.compliant).length;
  const totalChecks = results.reduce((sum, r) => sum + r.total, 0);
  const passedChecks = results.reduce((sum, r) => sum + r.passed, 0);
  const compliance = Math.round((passedChecks / Math.max(totalChecks, 1)) * 100);

  console.log(`${CYAN}${'═'.repeat(63)}${RESET}`);
  console.log(`${BOLD}  CONTRACT VALIDATION SUMMARY${RESET}`);
  console.log(`${CYAN}${'═'.repeat(63)}${RESET}`);
  console.log(`  Contracts:    ${contracts.length}`);
  console.log(`  Compliant:    ${GREEN}${compliant}${RESET}`);
  console.log(`  Non-compliant:${results.length - compliant > 0 ? RED : GREEN} ${results.length - compliant}${RESET}`);
  console.log(`  Compliance:   ${compliance >= 80 ? GREEN : YELLOW}${compliance}%${RESET}`);
  console.log(`  ${CYAN}📄 Report: ${reportPath}${RESET}`);
  console.log(`${CYAN}${'═'.repeat(63)}${RESET}\n`);
}

function generateReport(results) {
  const totalChecks = results.reduce((sum, r) => sum + r.total, 0);
  const passedChecks = results.reduce((sum, r) => sum + r.passed, 0);
  const compliance = Math.round((passedChecks / Math.max(totalChecks, 1)) * 100);
  const compliant = results.filter(r => r.compliant).length;

  const rows = results.map(r => {
    const checkDetails = r.checks.map(c => {
      const icon = c.pass ? '<span style="color: #4CAF50;">&#10003;</span>' : '<span style="color: #f44336;">&#10007;</span>';
      return `<div style="font-size: 13px; margin: 2px 0;">${icon} ${c.name}: expected <code>${c.expected}</code>, got <code>${c.actual}</code></div>`;
    }).join('');

    return `
    <div style="background: #16213e; border-radius: 12px; padding: 20px; margin-bottom: 12px; border-left: 4px solid ${r.compliant ? '#4CAF50' : '#f44336'};">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div>
          <strong style="font-size: 16px;">${r.contract}</strong>
          <div style="color: #888; font-size: 13px; margin-top: 4px;">${r.method} ${r.endpoint}</div>
        </div>
        <span style="background: ${r.compliant ? '#4CAF50' : '#f44336'}; color: white; padding: 4px 16px; border-radius: 16px; font-size: 13px;">
          ${r.compliant ? 'PASS' : 'FAIL'} (${r.passed}/${r.total})
        </span>
      </div>
      ${checkDetails}
    </div>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>API Contract Compliance Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f0f23; color: #e0e0e0; padding: 24px; }
    .container { max-width: 1100px; margin: 0 auto; }
    h1 { text-align: center; font-size: 28px; margin-bottom: 4px; }
    .subtitle { text-align: center; color: #888; margin-bottom: 32px; font-size: 14px; }
    .dashboard { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
    .card { background: #16213e; border-radius: 12px; padding: 20px; text-align: center; }
    .card .value { font-size: 32px; font-weight: bold; }
    .card .label { font-size: 12px; color: #888; margin-top: 4px; }
    code { background: #0f0f23; padding: 2px 6px; border-radius: 4px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>API Contract Compliance Report</h1>
    <p class="subtitle">Target: ${results[0]?.endpoint ? 'the-internet.herokuapp.com' : 'N/A'} | ${new Date().toISOString()}</p>

    <div class="dashboard">
      <div class="card"><div class="value" style="color: #64B5F6;">${results.length}</div><div class="label">Contracts</div></div>
      <div class="card"><div class="value" style="color: #4CAF50;">${compliant}</div><div class="label">Compliant</div></div>
      <div class="card"><div class="value" style="color: ${results.length - compliant > 0 ? '#f44336' : '#4CAF50'};">${results.length - compliant}</div><div class="label">Non-Compliant</div></div>
      <div class="card"><div class="value" style="color: ${compliance >= 80 ? '#4CAF50' : '#FF9800'};">${compliance}%</div><div class="label">Compliance</div></div>
    </div>

    ${rows}

    <div style="text-align: center; margin-top: 24px; color: #555; font-size: 12px;">
      AI API Contract Validator — TheTestingAcademy
    </div>
  </div>
</body>
</html>`;
}

validateContracts().catch(console.error);
