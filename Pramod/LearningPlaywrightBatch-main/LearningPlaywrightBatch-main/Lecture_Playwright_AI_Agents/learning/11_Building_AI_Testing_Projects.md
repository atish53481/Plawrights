# Building AI Testing Projects

## Introduction

This module covers **7 practical AI-powered testing projects** that you can build, demo, and discuss
in interviews. Each project solves a real testing challenge using AI techniques — from natural language
test generation to autonomous bug exploration.

---

## The 7 Projects at a Glance

| # | Project | Problem It Solves | AI Technique |
|---|---------|-------------------|--------------|
| 1 | Natural Language Test Writer | Writing tests is slow and repetitive | Template-based code generation from English descriptions |
| 2 | Self-Healing Locators | Tests break when UI changes | Fallback locator strategies with auto-recovery |
| 3 | AI Visual Regression | Pixel-diff tools create too many false positives | Semantic comparison classifying change types |
| 4 | Smart Test Reporter | Test results are hard for managers to understand | AI summarization with risk scoring |
| 5 | Accessibility Audit Agent | Manual WCAG audits are expensive | Automated rule-based crawling with fix suggestions |
| 6 | Autonomous Explorer | You can't test what you don't know exists | AI-driven exploration that finds bugs without scripts |
| 7 | AI API Testing | API contracts drift over time | Contract validation with auto-mock generation |

---

## Project 1: Natural Language Test Writer

### What It Does
Converts plain English test descriptions into runnable Playwright spec files.

### How It Works
```
Input:  "Verify login fails with wrong password"
          ↓
Template Engine (prompt_templates.js)
          ↓
Output: login_negative.spec.js (runnable Playwright test)
```

### Key Concepts
- **Template Matching**: Maps description keywords to code patterns
- **Code Generation**: Produces syntactically correct Playwright specs
- **Extensibility**: Add new templates for new test types

### When to Use
- Rapid test scaffolding for new features
- Non-technical stakeholders writing test requirements
- Generating boilerplate test structure

### Run It
```bash
cd ai_projects/natural_language_test_writer
node generate_tests.js
```

---

## Project 2: Self-Healing Locators

### What It Does
Automatically fixes broken CSS selectors at runtime, so tests don't fail just because
a developer changed an element's ID or class name.

### How It Works
```
Test uses: #wrong-username-field
     ↓ (selector fails)
Healing Fixture tries:
  1. getByRole('textbox', { name: 'Username' })
  2. getByText('Username')
  3. CSS variations (#username, [name="username"])
  4. XPath fallback
     ↓
Element found via strategy #1
     ↓
Test passes + healing logged
```

### Key Concepts
- **Custom Fixtures**: Extending Playwright's test object
- **Fallback Chains**: Try multiple strategies in priority order
- **Healing Logs**: Record what was healed for review

### When to Use
- Legacy applications with unstable selectors
- Cross-team development where UI changes frequently
- Reducing test maintenance burden

### Run It
```bash
cd ai_projects/self_healing_locators
npx playwright test tests/
```

---

## Project 3: AI Visual Regression

### What It Does
Compares screenshots between test runs and classifies changes as intentional redesigns
vs. layout bugs — going beyond simple pixel-diff tools.

### How It Works
```
Step 1: Capture baselines
  node capture_baseline.js → baselines/homepage.png, login.png, ...

Step 2: Run comparison
  node visual_report_generator.js
    → Re-captures current screenshots
    → Compares against baselines
    → Classifies: no_change / minor_change / major_change

Step 3: Review HTML report
  reports/visual_regression_report.html
```

### Key Concepts
- **Baseline Management**: Establishing "known good" state
- **Semantic Classification**: Not just "different" but "how different"
- **Change Categories**: No change (< 1%), Minor (1-10%), Major (> 10%)

### When to Use
- After CSS refactoring
- Before production deployments
- Cross-browser visual consistency checks

---

## Project 4: Smart Test Reporter

### What It Does
Reads Playwright JSON test results and generates business-readable executive summaries
with risk scoring and failure root cause analysis.

### How It Works
```
Playwright JSON Results
     ↓
analyze_results.js (parse + analyze)
     ↓
generate_summary.js → HTML executive report
slack_formatter.js  → Slack-ready markdown
```

### Key Concepts
- **Result Parsing**: Extracting insights from raw test data
- **Risk Scoring**: High/Medium/Low based on pass rate and failure patterns
- **Multi-Format Output**: HTML for stakeholders, Slack for team notifications

### When to Use
- Sprint demo presentations
- Daily test summary emails
- CI/CD pipeline status dashboards

---

## Project 5: Accessibility Audit Agent

### What It Does
Crawls your application pages, evaluates them against WCAG 2.1 accessibility guidelines,
and generates a prioritized fix report.

### How It Works
```
Target URL → Playwright crawls pages
     ↓
wcag_rules.js (20 WCAG rules)
     ↓
audit_crawler.js checks each rule per page
     ↓
audit_report_generator.js → HTML report
  - Violations by severity
  - Fix suggestions
  - Compliance score
```

### Key Concepts
- **WCAG 2.1 Levels**: A (minimum), AA (standard), AAA (enhanced)
- **Rule-Based Auditing**: Automated checks for common a11y issues
- **Prioritized Fixes**: Critical issues first, with code suggestions

### When to Use
- Before launch accessibility review
- Continuous a11y monitoring in CI/CD
- Compliance audits for legal requirements

---

## Project 6: Autonomous Explorer

### What It Does
Given a URL, autonomously explores the application — clicking links, filling forms,
checking for errors — and reports any bugs it finds, all without pre-written test scripts.

### How It Works
```
Starting URL
     ↓
Explorer Agent (BFS traversal)
  → Visit page
  → Check for bugs (console errors, 404s, broken images)
  → Find all links
  → Add unvisited links to queue
  → Repeat (max 15 pages, 60 seconds)
     ↓
exploration_log.json + HTML report
```

### Key Concepts
- **Autonomous Exploration**: No scripts, no selectors, just a URL
- **Bug Detection Heuristics**: Console errors, HTTP errors, broken resources
- **Bounded Exploration**: Time and page limits prevent infinite crawling

### When to Use
- Smoke testing a new deployment
- Discovering broken pages across a large site
- Exploratory testing augmentation

---

## Project 7: AI API Testing

### What It Does
Defines API contracts (expected endpoints, schemas, status codes) and validates live
API responses against them. Can also generate mock servers from contracts.

### How It Works
```
contracts/api_contracts.json (contract definitions)
     ↓
api_contract_validator.js
  → Makes requests to each endpoint
  → Validates response vs. contract
  → Generates compliance report
     ↓
mock_generator.js
  → Generates mock responses from contracts
  → Starts local mock server for offline testing
```

### Key Concepts
- **Contract-First Testing**: Define expectations, then validate
- **Schema Validation**: Structure, content type, required elements
- **Mock Generation**: Test without depending on live servers

### When to Use
- API versioning and backward compatibility checks
- Microservices contract verification
- Offline development and testing

---

## Architecture Overview

All 7 projects follow the same pattern:

```
┌─────────────────┐     ┌──────────────┐     ┌──────────────┐
│   Input/Config  │ ──→ │  AI Engine   │ ──→ │    Output    │
│  (JSON/Config)  │     │ (Rules/ML)   │     │ (Report/Code)│
└─────────────────┘     └──────────────┘     └──────────────┘
```

- **Input**: Configuration files (JSON, descriptions, contracts)
- **Engine**: Rule-based AI (templates, WCAG rules, heuristics)
- **Output**: Generated code, HTML reports, Slack messages

### No API Keys Required
All projects work with **template-based AI** — deterministic rule engines that use
pattern matching, fallback chains, and heuristics. This makes them:
- Free to run (no API costs)
- Deterministic (same input = same output)
- Easy to understand and extend

For enhanced results, optional OpenAI/Claude API integration can be added.

---

## Interview Tips

When discussing these projects in interviews:

1. **Explain the problem first**: "UI selectors break frequently, causing 30% of test failures"
2. **Describe your solution**: "I built a self-healing fixture with fallback strategies"
3. **Show the impact**: "Reduced test maintenance time by 60%"
4. **Discuss trade-offs**: "Healing adds ~200ms per locator, acceptable for E2E tests"
5. **Mention extensibility**: "The architecture supports adding new strategies easily"
