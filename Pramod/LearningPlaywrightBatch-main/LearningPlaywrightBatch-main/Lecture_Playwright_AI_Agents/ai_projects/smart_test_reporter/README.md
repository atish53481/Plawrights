# Project 4: Smart Test Reporter

## Overview
Reads Playwright JSON test results and generates business-readable executive summaries with risk scoring, failure root cause analysis, and Slack-ready notifications.

## Quick Start
```bash
# Generate HTML executive summary
node generate_summary.js

# Generate Slack message
node slack_formatter.js
```

## Files
| File | Purpose |
|------|---------|
| `sample_results.json` | Sample Playwright test results (7 pass, 3 fail) |
| `analyze_results.js` | Result parser and analyzer module |
| `generate_summary.js` | HTML executive summary generator |
| `slack_formatter.js` | Slack-compatible markdown formatter |
| `reports/` | Generated reports output |

## Features
- Pass/fail dashboard with risk assessment
- Failure categorization (timeout, assertion, selector, network)
- Root cause analysis per failure
- Recommendations based on patterns
- Slack-ready markdown output
- Dark-themed HTML report

## Risk Levels
| Pass Rate | Risk | Action |
|-----------|------|--------|
| >= 90% | LOW | Safe to deploy |
| 70-89% | MEDIUM | Review failures before deploy |
| < 70% | HIGH | Block deployment |
