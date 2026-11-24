# Project 5: Accessibility Audit Agent

## Overview
Crawls application pages, evaluates them against WCAG 2.1 accessibility rules, and generates a prioritized compliance report with fix suggestions.

## Quick Start
```bash
# Run the full audit crawler
node audit_crawler.js

# Run individual a11y tests
npx playwright test tests/a11y_audit.spec.js --config=../../playwright.config.js
```

## Files
| File | Purpose |
|------|---------|
| `wcag_rules.js` | 14 WCAG 2.1 rule definitions with checks |
| `audit_crawler.js` | Main crawler + report generator |
| `tests/a11y_audit.spec.js` | Playwright a11y test specs |
| `reports/` | Generated HTML and JSON reports |

## WCAG Rules Covered
| Rule | Level | Category | Severity |
|------|-------|----------|----------|
| Images must have alt text | A | Images | Critical |
| Page must have lang attribute | A | Document | Critical |
| Page must have title | A | Document | Critical |
| Form inputs must have labels | A | Forms | Critical |
| Headings in sequential order | A | Headings | Moderate |
| Links must have text | A | Links | Serious |
| No generic link text | AA | Links | Moderate |
| Buttons must have text | A | Forms | Critical |
| Tables must have headers | A | Tables | Serious |
| Skip navigation link | A | Keyboard | Moderate |
| Viewport allows zoom | AA | Document | Serious |
| Valid ARIA roles | A | ARIA | Serious |
| Autocomplete on forms | AA | Forms | Minor |

## Compliance Score
Score = (rules passed / total checks) * 100
- 90%+ = Good compliance
- 70-89% = Needs improvement
- < 70% = Critical issues to address
