#!/usr/bin/env node
/**
 * Visual Regression Report Generator
 * Re-captures screenshots, compares against baselines, generates HTML report
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { compareScreenshots } = require('./compare_screenshots');

const GREEN = '\x1b[32m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

const BASE_URL = 'https://the-internet.herokuapp.com';
const PAGES = [
  { name: 'homepage', path: '/' },
  { name: 'login', path: '/login' },
  { name: 'dropdown', path: '/dropdown' },
  { name: 'checkboxes', path: '/checkboxes' },
  { name: 'hovers', path: '/hovers' },
];

async function generateReport() {
  console.log(`\n${CYAN}╔═══════════════════════════════════════════════════════════════╗${RESET}`);
  console.log(`${CYAN}║        ${BOLD}AI Visual Regression - Report Generator${RESET}${CYAN}              ║${RESET}`);
  console.log(`${CYAN}╚═══════════════════════════════════════════════════════════════╝${RESET}\n`);

  const baselinesDir = path.join(__dirname, 'baselines');
  const currentDir = path.join(__dirname, 'current');
  const reportsDir = path.join(__dirname, 'reports');

  if (!fs.existsSync(currentDir)) fs.mkdirSync(currentDir, { recursive: true });
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

  // Step 1: Capture current screenshots
  console.log(`${DIM}Step 1: Capturing current screenshots...${RESET}\n`);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  for (const pg of PAGES) {
    await page.goto(`${BASE_URL}${pg.path}`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(currentDir, `${pg.name}.png`), fullPage: true });
    console.log(`${GREEN}  ✓${RESET} Captured: ${pg.name}`);
  }
  await browser.close();

  // Step 2: Compare screenshots
  console.log(`\n${DIM}Step 2: Comparing against baselines...${RESET}\n`);
  const results = [];

  for (const pg of PAGES) {
    const baselinePath = path.join(baselinesDir, `${pg.name}.png`);
    const currentPath = path.join(currentDir, `${pg.name}.png`);
    const comparison = compareScreenshots(baselinePath, currentPath);

    results.push({ page: pg.name, url: `${BASE_URL}${pg.path}`, ...comparison });

    const statusColor = comparison.status === 'no_change' ? GREEN
      : comparison.status === 'minor_change' ? YELLOW
      : comparison.status === 'moderate_change' ? YELLOW
      : RED;

    console.log(`${statusColor}  ${comparison.status === 'no_change' ? '✓' : '⚠'}${RESET} ${BOLD}${pg.name}${RESET} — ${comparison.status} (${comparison.diffPercentage}% diff)`);
  }

  // Step 3: Generate HTML report
  console.log(`\n${DIM}Step 3: Generating HTML report...${RESET}\n`);
  const html = generateHTML(results);
  const reportPath = path.join(reportsDir, 'visual_regression_report.html');
  fs.writeFileSync(reportPath, html);

  // Summary
  const noChange = results.filter(r => r.status === 'no_change').length;
  const changes = results.length - noChange;

  console.log(`${CYAN}${'═'.repeat(63)}${RESET}`);
  console.log(`${BOLD}  VISUAL REGRESSION SUMMARY${RESET}`);
  console.log(`${CYAN}${'═'.repeat(63)}${RESET}`);
  console.log(`  ${GREEN}✓ No change:${RESET} ${noChange} pages`);
  if (changes > 0) console.log(`  ${YELLOW}⚠ Changed:${RESET}   ${changes} pages`);
  console.log(`  ${CYAN}📄 Report:${RESET}   ${reportPath}`);
  console.log(`${CYAN}${'═'.repeat(63)}${RESET}\n`);
}

function generateHTML(results) {
  const timestamp = new Date().toISOString();
  const noChange = results.filter(r => r.status === 'no_change').length;
  const changes = results.length - noChange;

  const statusColors = {
    no_change: '#4CAF50',
    minor_change: '#FF9800',
    moderate_change: '#FF5722',
    major_change: '#f44336',
    new_page: '#2196F3',
  };

  const rows = results.map(r => `
    <tr style="border-bottom: 1px solid #333;">
      <td style="padding: 12px;"><strong>${r.page}</strong></td>
      <td style="padding: 12px;"><a href="${r.url}" style="color: #64B5F6;">${r.url}</a></td>
      <td style="padding: 12px;">
        <span style="background: ${statusColors[r.status] || '#666'}; padding: 4px 12px; border-radius: 12px; color: white; font-size: 12px;">
          ${r.status.replace('_', ' ')}
        </span>
      </td>
      <td style="padding: 12px; text-align: center;">${r.diffPercentage}%</td>
      <td style="padding: 12px; font-size: 13px; color: #aaa;">${r.message}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Visual Regression Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #1a1a2e; color: #e0e0e0; padding: 24px; }
    .container { max-width: 1100px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 32px; }
    .header h1 { font-size: 28px; color: #fff; margin-bottom: 8px; }
    .header p { color: #888; font-size: 14px; }
    .dashboard { display: flex; gap: 16px; margin-bottom: 32px; }
    .card { flex: 1; background: #16213e; border-radius: 12px; padding: 20px; text-align: center; }
    .card .value { font-size: 36px; font-weight: bold; }
    .card .label { font-size: 13px; color: #888; margin-top: 4px; }
    table { width: 100%; background: #16213e; border-radius: 12px; overflow: hidden; border-collapse: collapse; }
    th { padding: 14px 12px; text-align: left; background: #0f3460; color: #fff; font-size: 13px; text-transform: uppercase; }
    .footer { text-align: center; margin-top: 24px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Visual Regression Report</h1>
      <p>Generated: ${timestamp}</p>
    </div>

    <div class="dashboard">
      <div class="card">
        <div class="value" style="color: #64B5F6;">${results.length}</div>
        <div class="label">Pages Checked</div>
      </div>
      <div class="card">
        <div class="value" style="color: #4CAF50;">${noChange}</div>
        <div class="label">No Change</div>
      </div>
      <div class="card">
        <div class="value" style="color: ${changes > 0 ? '#FF9800' : '#4CAF50'};">${changes}</div>
        <div class="label">Changes Detected</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Page</th>
          <th>URL</th>
          <th>Status</th>
          <th>Diff %</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    <div class="footer">
      <p>AI Visual Regression Tool — TheTestingAcademy</p>
    </div>
  </div>
</body>
</html>`;
}

generateReport().catch(console.error);
