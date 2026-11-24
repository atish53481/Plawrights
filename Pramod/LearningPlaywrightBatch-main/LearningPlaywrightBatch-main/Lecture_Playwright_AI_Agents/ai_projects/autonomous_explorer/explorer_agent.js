#!/usr/bin/env node
/**
 * Autonomous Explorer Agent
 * Explores web applications and finds bugs without pre-written test scripts
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { getAllLinks, getPageMetadata } = require('./action_strategies');
const { runAllChecks } = require('./bug_detector');

const GREEN = '\x1b[32m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

const DEFAULT_URL = 'https://the-internet.herokuapp.com';
const MAX_PAGES = 15;
const MAX_TIME_MS = 60000;

async function explore(startUrl = DEFAULT_URL) {
  console.log(`\n${CYAN}╔═══════════════════════════════════════════════════════════════╗${RESET}`);
  console.log(`${CYAN}║          ${BOLD}AI Autonomous Explorer Agent${RESET}${CYAN}                        ║${RESET}`);
  console.log(`${CYAN}║          Finds Bugs Without Test Scripts                       ║${RESET}`);
  console.log(`${CYAN}╚═══════════════════════════════════════════════════════════════╝${RESET}\n`);

  console.log(`${DIM}Starting URL:${RESET} ${startUrl}`);
  console.log(`${DIM}Max pages:${RESET}    ${MAX_PAGES}`);
  console.log(`${DIM}Max time:${RESET}     ${MAX_TIME_MS / 1000}s\n`);

  const startTime = Date.now();
  const visited = new Set();
  const queue = [startUrl];
  const explorationLog = [];
  const allIssues = [];

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  // Collect console messages
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
  });

  let pageCount = 0;

  while (queue.length > 0 && pageCount < MAX_PAGES && (Date.now() - startTime) < MAX_TIME_MS) {
    const url = queue.shift();

    // Normalize URL
    const normalizedUrl = url.startsWith('http') ? url : `${startUrl}${url.startsWith('/') ? '' : '/'}${url}`;

    // Skip if already visited or external
    if (visited.has(normalizedUrl)) continue;
    if (!normalizedUrl.startsWith(startUrl)) continue;

    visited.add(normalizedUrl);
    pageCount++;

    console.log(`${CYAN}  [${pageCount}/${MAX_PAGES}]${RESET} ${BOLD}Exploring:${RESET} ${normalizedUrl}`);

    try {
      // Clear console messages for this page
      consoleMessages.length = 0;

      const response = await page.goto(normalizedUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
      const statusCode = response?.status() || 0;

      // Get page metadata
      const metadata = await getPageMetadata(page);

      // Run bug detection
      const issues = await runAllChecks(page, consoleMessages, startUrl);

      // Check HTTP status
      if (statusCode >= 400) {
        issues.push({
          type: `http_${statusCode}`,
          severity: statusCode >= 500 ? 'critical' : 'high',
          description: `HTTP ${statusCode} error on ${normalizedUrl}`,
        });
      }

      // Log results
      const pageLog = {
        url: normalizedUrl,
        status: statusCode,
        title: metadata.title,
        metadata,
        issues,
        timestamp: new Date().toISOString(),
      };

      explorationLog.push(pageLog);
      allIssues.push(...issues.map(i => ({ ...i, url: normalizedUrl })));

      const issueIcon = issues.length > 0 ? `${YELLOW}⚠ ${issues.length} issue(s)${RESET}` : `${GREEN}✓ clean${RESET}`;
      console.log(`    ${DIM}Status: ${statusCode} | ${issueIcon}${RESET}`);

      // Discover new links
      const links = await getAllLinks(page);
      for (const link of links) {
        const fullUrl = link.href.startsWith('http') ? link.href : `${startUrl}${link.href.startsWith('/') ? '' : '/'}${link.href}`;
        if (!visited.has(fullUrl) && fullUrl.startsWith(startUrl)) {
          queue.push(fullUrl);
        }
      }

    } catch (err) {
      console.log(`    ${RED}✗ Error: ${err.message.substring(0, 60)}${RESET}`);
      explorationLog.push({
        url: normalizedUrl,
        status: 0,
        error: err.message,
        issues: [{ type: 'navigation_error', severity: 'high', description: err.message }],
        timestamp: new Date().toISOString(),
      });
    }
  }

  await browser.close();

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  // Save exploration log
  const logPath = path.join(__dirname, 'exploration_log.json');
  fs.writeFileSync(logPath, JSON.stringify({ startUrl, pages: explorationLog, summary: { pagesVisited: pageCount, totalIssues: allIssues.length, duration: `${duration}s` } }, null, 2));

  // Generate HTML report
  const reportsDir = path.join(__dirname, 'reports');
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

  const html = generateExplorationReport(explorationLog, allIssues, startUrl, duration, pageCount);
  const reportPath = path.join(reportsDir, 'exploration_report.html');
  fs.writeFileSync(reportPath, html);

  // Summary
  const criticalIssues = allIssues.filter(i => i.severity === 'critical').length;
  const highIssues = allIssues.filter(i => i.severity === 'high').length;

  console.log(`\n${CYAN}${'═'.repeat(63)}${RESET}`);
  console.log(`${BOLD}  EXPLORATION SUMMARY${RESET}`);
  console.log(`${CYAN}${'═'.repeat(63)}${RESET}`);
  console.log(`  Pages explored:   ${pageCount}`);
  console.log(`  Duration:         ${duration}s`);
  console.log(`  Total issues:     ${allIssues.length > 0 ? YELLOW : GREEN}${allIssues.length}${RESET}`);
  if (criticalIssues > 0) console.log(`  ${RED}Critical:${RESET}         ${criticalIssues}`);
  if (highIssues > 0) console.log(`  ${YELLOW}High:${RESET}             ${highIssues}`);
  console.log(`  ${CYAN}📄 Report: ${reportPath}${RESET}`);
  console.log(`  ${CYAN}📋 Log: ${logPath}${RESET}`);
  console.log(`${CYAN}${'═'.repeat(63)}${RESET}\n`);
}

function generateExplorationReport(log, issues, startUrl, duration, pageCount) {
  const severityColors = { critical: '#f44336', high: '#FF5722', medium: '#FF9800', low: '#64B5F6' };

  const issuesByType = {};
  for (const issue of issues) {
    if (!issuesByType[issue.type]) issuesByType[issue.type] = [];
    issuesByType[issue.type].push(issue);
  }

  const pageRows = log.map(p => {
    const issueCount = (p.issues || []).length;
    const statusColor = p.status >= 400 ? '#f44336' : p.status >= 300 ? '#FF9800' : '#4CAF50';
    return `
    <tr style="border-bottom: 1px solid #333;">
      <td style="padding: 10px;"><span style="color: ${statusColor};">${p.status || 'ERR'}</span></td>
      <td style="padding: 10px;"><a href="${p.url}" style="color: #64B5F6; text-decoration: none;">${p.url.replace(startUrl, '')|| '/'}</a></td>
      <td style="padding: 10px;">${p.title || 'N/A'}</td>
      <td style="padding: 10px; color: ${issueCount > 0 ? '#FF9800' : '#4CAF50'};">${issueCount}</td>
    </tr>`;
  }).join('');

  const issueCards = Object.entries(issuesByType).map(([type, items]) => `
    <div style="background: #1a1a2e; border-radius: 8px; padding: 16px; margin-bottom: 8px;">
      <div style="font-weight: bold; color: #FF9800; margin-bottom: 8px;">${type.replace(/_/g, ' ').toUpperCase()} (${items.length})</div>
      ${items.map(i => `<div style="font-size: 13px; color: #aaa; margin: 4px 0;">• ${i.description.substring(0, 100)}</div>`).join('')}
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Exploration Report</title>
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
    .section { background: #16213e; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
    .section h2 { font-size: 18px; margin-bottom: 16px; color: #64B5F6; }
    table { width: 100%; border-collapse: collapse; }
    th { padding: 12px 10px; text-align: left; background: #0f3460; color: #fff; font-size: 12px; text-transform: uppercase; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Autonomous Exploration Report</h1>
    <p class="subtitle">Target: ${startUrl} | Duration: ${duration}s | ${new Date().toISOString()}</p>

    <div class="dashboard">
      <div class="card"><div class="value" style="color: #64B5F6;">${pageCount}</div><div class="label">Pages Explored</div></div>
      <div class="card"><div class="value" style="color: ${issues.length > 0 ? '#FF9800' : '#4CAF50'};">${issues.length}</div><div class="label">Issues Found</div></div>
      <div class="card"><div class="value" style="color: #4CAF50;">${duration}s</div><div class="label">Duration</div></div>
      <div class="card"><div class="value" style="color: #64B5F6;">${Object.keys(issuesByType).length}</div><div class="label">Issue Types</div></div>
    </div>

    <div class="section">
      <h2>Pages Explored</h2>
      <table>
        <thead><tr><th>Status</th><th>Path</th><th>Title</th><th>Issues</th></tr></thead>
        <tbody>${pageRows}</tbody>
      </table>
    </div>

    ${issues.length > 0 ? `
    <div class="section">
      <h2>Issues by Type</h2>
      ${issueCards}
    </div>
    ` : '<div class="section"><h2>No Issues Found</h2><p style="color: #4CAF50;">The exploration completed without finding any issues.</p></div>'}

    <div style="text-align: center; margin-top: 24px; color: #555; font-size: 12px;">
      AI Autonomous Explorer — TheTestingAcademy
    </div>
  </div>
</body>
</html>`;
}

// Allow custom URL via command line
const startUrl = process.argv[2] || DEFAULT_URL;
explore(startUrl).catch(console.error);
