#!/usr/bin/env node
/**
 * Accessibility Audit Crawler
 * Crawls pages and checks them against WCAG rules
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { rules } = require('./wcag_rules');

const GREEN = '\x1b[32m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

const BASE_URL = 'https://the-internet.herokuapp.com';
const PAGES_TO_AUDIT = [
  { name: 'Homepage', path: '/' },
  { name: 'Login', path: '/login' },
  { name: 'Dropdown', path: '/dropdown' },
  { name: 'Checkboxes', path: '/checkboxes' },
  { name: 'Forgot Password', path: '/forgot_password' },
  { name: 'Inputs', path: '/inputs' },
];

async function runAudit() {
  console.log(`\n${CYAN}╔═══════════════════════════════════════════════════════════════╗${RESET}`);
  console.log(`${CYAN}║          ${BOLD}AI Accessibility Audit Agent${RESET}${CYAN}                        ║${RESET}`);
  console.log(`${CYAN}║          WCAG 2.1 Compliance Checker                          ║${RESET}`);
  console.log(`${CYAN}╚═══════════════════════════════════════════════════════════════╝${RESET}\n`);

  console.log(`${DIM}Rules loaded: ${rules.length} WCAG checks${RESET}`);
  console.log(`${DIM}Pages to audit: ${PAGES_TO_AUDIT.length}${RESET}\n`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const auditResults = [];

  for (const pg of PAGES_TO_AUDIT) {
    const url = `${BASE_URL}${pg.path}`;
    console.log(`${CYAN}  Auditing: ${BOLD}${pg.name}${RESET} ${DIM}(${url})${RESET}`);

    await page.goto(url, { waitUntil: 'networkidle' });
    const html = await page.content();

    const pageViolations = [];
    for (const rule of rules) {
      const violations = rule.check(html);
      if (violations.length > 0) {
        pageViolations.push({
          ruleId: rule.id,
          ruleName: rule.name,
          level: rule.level,
          category: rule.category,
          severity: rule.severity,
          violations,
        });
      }
    }

    const totalViolations = pageViolations.reduce((sum, r) => sum + r.violations.length, 0);
    const icon = totalViolations === 0 ? `${GREEN}✓${RESET}` : `${YELLOW}⚠${RESET}`;
    console.log(`${icon}   ${totalViolations} violation(s) found\n`);

    auditResults.push({
      page: pg.name,
      url,
      violations: pageViolations,
      totalViolations,
    });
  }

  await browser.close();

  // Generate report
  const reportsDir = path.join(__dirname, 'reports');
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

  const html = generateAuditReport(auditResults);
  const reportPath = path.join(reportsDir, 'accessibility_report.html');
  fs.writeFileSync(reportPath, html);

  // Save JSON results
  fs.writeFileSync(path.join(reportsDir, 'audit_results.json'), JSON.stringify(auditResults, null, 2));

  // Summary
  const totalViolations = auditResults.reduce((sum, r) => sum + r.totalViolations, 0);
  const criticalCount = auditResults.reduce((sum, r) => sum + r.violations.filter(v => v.severity === 'critical').reduce((s, v) => s + v.violations.length, 0), 0);

  console.log(`${CYAN}${'═'.repeat(63)}${RESET}`);
  console.log(`${BOLD}  ACCESSIBILITY AUDIT SUMMARY${RESET}`);
  console.log(`${CYAN}${'═'.repeat(63)}${RESET}`);
  console.log(`  Pages audited:      ${PAGES_TO_AUDIT.length}`);
  console.log(`  Rules checked:      ${rules.length}`);
  console.log(`  Total violations:   ${totalViolations > 0 ? RED : GREEN}${totalViolations}${RESET}`);
  console.log(`  Critical issues:    ${criticalCount > 0 ? RED : GREEN}${criticalCount}${RESET}`);
  console.log(`  ${CYAN}📄 Report: ${reportPath}${RESET}`);
  console.log(`${CYAN}${'═'.repeat(63)}${RESET}\n`);
}

function generateAuditReport(results) {
  const totalViolations = results.reduce((sum, r) => sum + r.totalViolations, 0);
  const totalPages = results.length;
  const pagesWithIssues = results.filter(r => r.totalViolations > 0).length;

  const severityColors = { critical: '#f44336', serious: '#FF5722', moderate: '#FF9800', minor: '#64B5F6' };

  // Compliance score
  const maxPossible = totalPages * rules.length;
  const rulesPassed = maxPossible - totalViolations;
  const complianceScore = Math.max(0, Math.round((rulesPassed / maxPossible) * 100));

  const pageRows = results.map(r => {
    const violationDetails = r.violations.map(v => `
      <div style="margin-bottom: 12px; padding: 12px; background: #1a1a2e; border-radius: 8px; border-left: 3px solid ${severityColors[v.severity]};">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <strong>${v.ruleName}</strong>
          <span style="background: ${severityColors[v.severity]}; color: white; padding: 2px 8px; border-radius: 10px; font-size: 11px;">${v.severity} | Level ${v.level}</span>
        </div>
        ${v.violations.map(vio => `
          <div style="margin: 4px 0; padding: 4px 8px; font-size: 13px;">
            <code style="color: #aaa; font-size: 12px;">${vio.element}</code><br>
            <span style="color: #4CAF50;">Fix: ${vio.fix}</span>
          </div>
        `).join('')}
      </div>
    `).join('');

    return `
    <div style="background: #16213e; border-radius: 12px; padding: 20px; margin-bottom: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h3 style="margin: 0;">${r.page}</h3>
        <span style="color: ${r.totalViolations > 0 ? '#FF9800' : '#4CAF50'};">${r.totalViolations} violations</span>
      </div>
      <div style="color: #888; font-size: 13px; margin-bottom: 12px;">${r.url}</div>
      ${violationDetails || '<div style="color: #4CAF50;">No violations found</div>'}
    </div>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Accessibility Audit Report</title>
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
    code { background: #0f0f23; padding: 2px 6px; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Accessibility Audit Report</h1>
    <p class="subtitle">WCAG 2.1 Compliance Check | ${new Date().toISOString()}</p>

    <div class="dashboard">
      <div class="card">
        <div class="value" style="color: #64B5F6;">${totalPages}</div>
        <div class="label">Pages Audited</div>
      </div>
      <div class="card">
        <div class="value" style="color: ${totalViolations > 0 ? '#FF9800' : '#4CAF50'};">${totalViolations}</div>
        <div class="label">Violations</div>
      </div>
      <div class="card">
        <div class="value" style="color: #4CAF50;">${rules.length}</div>
        <div class="label">Rules Checked</div>
      </div>
      <div class="card">
        <div class="value" style="color: ${complianceScore >= 80 ? '#4CAF50' : '#FF9800'};">${complianceScore}%</div>
        <div class="label">Compliance</div>
      </div>
    </div>

    ${pageRows}

    <div style="text-align: center; margin-top: 24px; color: #555; font-size: 12px;">
      AI Accessibility Audit Agent — TheTestingAcademy
    </div>
  </div>
</body>
</html>`;
}

runAudit().catch(console.error);
