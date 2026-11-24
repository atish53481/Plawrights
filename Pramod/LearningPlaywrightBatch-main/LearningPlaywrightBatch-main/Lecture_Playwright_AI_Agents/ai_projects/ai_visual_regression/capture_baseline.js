#!/usr/bin/env node
/**
 * AI Visual Regression - Baseline Capture
 * Takes screenshots of target pages to use as visual baselines
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const GREEN = '\x1b[32m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
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

async function captureBaselines() {
  console.log(`\n${CYAN}╔═══════════════════════════════════════════════════════════════╗${RESET}`);
  console.log(`${CYAN}║          ${BOLD}AI Visual Regression - Baseline Capture${RESET}${CYAN}             ║${RESET}`);
  console.log(`${CYAN}╚═══════════════════════════════════════════════════════════════╝${RESET}\n`);

  const baselinesDir = path.join(__dirname, 'baselines');
  if (!fs.existsSync(baselinesDir)) fs.mkdirSync(baselinesDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  console.log(`${DIM}[${new Date().toISOString()}]${RESET} ${CYAN}Capturing baselines for ${PAGES.length} pages...${RESET}\n`);

  for (const pg of PAGES) {
    const url = `${BASE_URL}${pg.path}`;
    await page.goto(url, { waitUntil: 'networkidle' });
    const filePath = path.join(baselinesDir, `${pg.name}.png`);
    await page.screenshot({ path: filePath, fullPage: true });
    const stats = fs.statSync(filePath);
    console.log(`${GREEN}  ✓${RESET} ${BOLD}${pg.name}${RESET} ${DIM}(${(stats.size / 1024).toFixed(1)} KB)${RESET}`);
    console.log(`    ${DIM}URL:${RESET}  ${url}`);
    console.log(`    ${DIM}File:${RESET} ${filePath}\n`);
  }

  await browser.close();

  console.log(`${CYAN}${'═'.repeat(63)}${RESET}`);
  console.log(`${BOLD}${GREEN}  Baselines captured: ${PAGES.length} pages${RESET}`);
  console.log(`${CYAN}  📁 Output: ${baselinesDir}${RESET}`);
  console.log(`${CYAN}${'═'.repeat(63)}${RESET}\n`);
  console.log(`${DIM}Next: Run ${YELLOW}node visual_report_generator.js${RESET}${DIM} to compare against baselines${RESET}\n`);
}

captureBaselines().catch(console.error);
