# Project 3: AI Visual Regression

## Overview
Compares screenshots between test runs and classifies changes semantically — going beyond pixel-diff to understand what changed and whether it matters.

## How It Works
1. **Capture baselines**: `node capture_baseline.js` takes screenshots of target pages
2. **Run comparison**: `node visual_report_generator.js` re-captures and compares
3. **Review report**: Open `reports/visual_regression_report.html`

## Quick Start
```bash
# Step 1: Capture baseline screenshots
node capture_baseline.js

# Step 2: Compare and generate report
node visual_report_generator.js
```

## Change Classification
| Status | Diff % | Meaning |
|--------|--------|---------|
| `no_change` | < 1% | Screenshots are virtually identical |
| `minor_change` | 1-5% | Small differences (dynamic content, timestamps) |
| `moderate_change` | 5-15% | Layout or content changes |
| `major_change` | > 15% | Significant redesign or layout break |
| `new_page` | 100% | No baseline exists yet |

## Files
| File | Purpose |
|------|---------|
| `capture_baseline.js` | Captures baseline screenshots |
| `compare_screenshots.js` | Byte-level comparison engine |
| `visual_report_generator.js` | Main comparison + HTML report |
| `baselines/` | Baseline screenshot storage |
| `current/` | Current run screenshots |
| `reports/` | Generated HTML reports |
