#!/usr/bin/env node
/**
 * Smart Test Reporter - Executive Summary Generator
 * Generates beautiful HTML reports from Playwright test results
 */

const fs = require('fs');
const path = require('path');
const { analyzeResults } = require('./analyze_results');

const GREEN = '\x1b[32m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

function main() {
  console.log(`\n${CYAN}╔═══════════════════════════════════════════════════════════════╗${RESET}`);
  console.log(`${CYAN}║          ${BOLD}AI Smart Test Reporter${RESET}${CYAN}                              ║${RESET}`);
  console.log(`${CYAN}║          Executive Summary Generator                          ║${RESET}`);
  console.log(`${CYAN}╚═══════════════════════════════════════════════════════════════╝${RESET}\n`);

  const resultsPath = path.join(__dirname, 'sample_results.json');
  const analysis = analyzeResults(resultsPath);

  // Console summary
  const riskColor = analysis.risk.level === 'LOW' ? GREEN : analysis.risk.level === 'MEDIUM' ? YELLOW : RED;

  console.log(`${BOLD}  TEST EXECUTION SUMMARY${RESET}`);
  console.log(`${'─'.repeat(50)}`);
  console.log(`  Total Tests:    ${BOLD}${analysis.summary.total}${RESET}`);
  console.log(`  ${GREEN}Passed:${RESET}         ${analysis.summary.passed}`);
  console.log(`  ${RED}Failed:${RESET}         ${analysis.summary.failed}`);
  console.log(`  Pass Rate:      ${BOLD}${analysis.summary.passRate}%${RESET}`);
  console.log(`  Total Duration: ${(analysis.summary.totalDuration / 1000).toFixed(1)}s`);
  console.log(`  Avg Duration:   ${analysis.summary.avgDuration}ms`);
  console.log(`  ${riskColor}Risk Level:     ${BOLD}${analysis.risk.level}${RESET}`);
  console.log(`${'─'.repeat(50)}\n`);

  if (analysis.summary.failed > 0) {
    console.log(`${RED}${BOLD}  FAILURE ANALYSIS${RESET}`);
    console.log(`${'─'.repeat(50)}`);
    for (const [category, tests] of Object.entries(analysis.failureCategories)) {
      console.log(`  ${YELLOW}${category}${RESET} (${tests.length} failures):`);
      for (const t of tests) {
        console.log(`    ${RED}✗${RESET} ${t.title}`);
        if (t.errors[0]) {
          const msg = t.errors[0].message.split('\n')[0];
          console.log(`      ${DIM}${msg.substring(0, 80)}${RESET}`);
        }
      }
    }
    console.log();
  }

  // Generate HTML report
  const reportsDir = path.join(__dirname, 'reports');
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

  const html = generateHTML(analysis);
  const reportPath = path.join(reportsDir, 'executive_summary.html');
  fs.writeFileSync(reportPath, html);

  console.log(`${CYAN}  📄 HTML Report: ${reportPath}${RESET}\n`);
  console.log(`${DIM}  Also run: ${YELLOW}node slack_formatter.js${RESET}${DIM} for Slack message${RESET}\n`);
}

function generateHTML(analysis) {
  const { summary, risk, failedTests, failureCategories } = analysis;

  const passAngle = (summary.passed / summary.total) * 360;

  const failureRows = failedTests.map(t => {
    const errorMsg = t.errors[0]?.message?.split('\n')[0] || 'Unknown error';
    return `
    <tr style="border-bottom: 1px solid #333;">
      <td style="padding: 12px;"><span style="color: #f44336;">&#10007;</span> ${t.title}</td>
      <td style="padding: 12px;">${t.duration}ms</td>
      <td style="padding: 12px; font-size: 13px; color: #aaa;">${errorMsg}</td>
    </tr>`;
  }).join('');

  const categoryCards = Object.entries(failureCategories).map(([cat, tests]) => `
    <div style="background: #1a1a2e; border-radius: 8px; padding: 16px; margin-bottom: 8px;">
      <div style="font-weight: bold; text-transform: uppercase; font-size: 13px; color: #FF9800; margin-bottom: 8px;">${cat}</div>
      <div style="font-size: 24px; font-weight: bold;">${tests.length}</div>
      <div style="color: #888; font-size: 12px;">failure${tests.length > 1 ? 's' : ''}</div>
    </div>
  `).join('');

  const recommendations = [];
  if (failureCategories.timeout) recommendations.push('Increase timeout values or add explicit wait conditions for slow elements.');
  if (failureCategories.assertion) recommendations.push('Review assertion expectations - some may be based on incorrect assumptions.');
  if (failureCategories.selector) recommendations.push('Consider using self-healing locators or more resilient selectors (role-based, test-id).');
  if (summary.passRate < 70) recommendations.push('Critical: Pass rate below 70%. Block deployment until failures are addressed.');
  if (summary.passRate >= 90) recommendations.push('Test suite is healthy. Consider adding more edge case coverage.');

  const recItems = recommendations.map(r => `<li style="margin-bottom: 8px;">${r}</li>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Test Executive Summary</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f0f23; color: #e0e0e0; padding: 24px; }
    .container { max-width: 1100px; margin: 0 auto; }
    h1 { font-size: 28px; text-align: center; margin-bottom: 4px; }
    .subtitle { text-align: center; color: #888; margin-bottom: 32px; font-size: 14px; }
    .dashboard { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
    .card { background: #16213e; border-radius: 12px; padding: 20px; text-align: center; }
    .card .value { font-size: 32px; font-weight: bold; }
    .card .label { font-size: 12px; color: #888; margin-top: 4px; text-transform: uppercase; }
    .section { background: #16213e; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
    .section h2 { font-size: 18px; margin-bottom: 16px; color: #64B5F6; }
    table { width: 100%; border-collapse: collapse; }
    th { padding: 12px; text-align: left; background: #0f3460; color: #fff; font-size: 12px; text-transform: uppercase; }
    .risk-badge { display: inline-block; padding: 8px 24px; border-radius: 20px; font-weight: bold; font-size: 18px; }
    ul { padding-left: 20px; }
    li { color: #ccc; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Test Executive Summary</h1>
    <p class="subtitle">Generated: ${analysis.timestamp} | AI Smart Test Reporter</p>

    <div class="dashboard">
      <div class="card">
        <div class="value" style="color: #64B5F6;">${summary.total}</div>
        <div class="label">Total Tests</div>
      </div>
      <div class="card">
        <div class="value" style="color: #4CAF50;">${summary.passed}</div>
        <div class="label">Passed</div>
      </div>
      <div class="card">
        <div class="value" style="color: #f44336;">${summary.failed}</div>
        <div class="label">Failed</div>
      </div>
      <div class="card">
        <div class="value" style="color: ${risk.color};">${summary.passRate}%</div>
        <div class="label">Pass Rate</div>
      </div>
    </div>

    <div class="section" style="text-align: center;">
      <h2>Risk Assessment</h2>
      <span class="risk-badge" style="background: ${risk.color}; color: white;">${risk.level} RISK</span>
      <p style="margin-top: 12px; color: #aaa;">Based on ${summary.passRate}% pass rate across ${summary.total} tests</p>
    </div>

    ${summary.failed > 0 ? `
    <div class="section">
      <h2>Failure Categories</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px;">
        ${categoryCards}
      </div>
    </div>

    <div class="section">
      <h2>Failed Tests</h2>
      <table>
        <thead><tr><th>Test</th><th>Duration</th><th>Error</th></tr></thead>
        <tbody>${failureRows}</tbody>
      </table>
    </div>
    ` : ''}

    <div class="section">
      <h2>Recommendations</h2>
      <ul>${recItems}</ul>
    </div>

    <div style="text-align: center; margin-top: 24px; color: #555; font-size: 12px;">
      <p>AI Smart Test Reporter — TheTestingAcademy</p>
    </div>
  </div>
</body>
</html>`;
}

main();
