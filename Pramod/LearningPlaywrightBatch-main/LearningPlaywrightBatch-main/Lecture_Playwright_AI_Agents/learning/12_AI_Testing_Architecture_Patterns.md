# AI Testing Architecture Patterns

## Introduction

Building AI-powered testing tools requires specific design patterns that differ from
traditional test automation. This module covers the key architecture patterns used
across all 7 AI testing projects.

---

## Pattern 1: Template-Based Code Generation

### When to Use
Generating test code, reports, or configurations from structured input.

### How It Works
```
┌─────────────┐     ┌──────────────────┐     ┌──────────────┐
│ Structured  │     │ Template Engine   │     │  Generated   │
│   Input     │ ──→ │ (Pattern Match +  │ ──→ │    Code      │
│  (JSON)     │     │  String Replace)  │     │  (.spec.js)  │
└─────────────┘     └──────────────────┘     └──────────────┘
```

### Implementation
```javascript
// Template registry maps test types to code generators
const templates = {
  title_check: (desc) => `
    test('${desc.description}', async ({ page }) => {
      await page.goto('${desc.page}');
      await expect(page).toHaveTitle(/${desc.expectedTitle}/);
    });
  `,
  login_negative: (desc) => `
    test('${desc.description}', async ({ page }) => {
      await page.goto('${desc.page}');
      await page.fill('#username', 'invalid');
      await page.fill('#password', 'wrong');
      await page.click('button[type="submit"]');
      await expect(page.locator('#flash')).toContainText('invalid');
    });
  `,
};

// Generator selects template by type
function generateTest(description) {
  const template = templates[description.type];
  return template(description);
}
```

### Used In
- Project 1: Natural Language Test Writer
- Project 7: AI API Testing (mock generation)

---

## Pattern 2: Fallback Chain (Self-Healing)

### When to Use
When the primary approach might fail and you need automatic recovery.

### How It Works
```
┌──────────┐    fail    ┌──────────┐    fail    ┌──────────┐
│Strategy 1│ ────────→  │Strategy 2│ ────────→  │Strategy 3│ ──→ ...
│ (CSS ID) │            │  (Role)  │            │  (Text)  │
└──────────┘            └──────────┘            └──────────┘
     │ success               │ success               │ success
     ↓                       ↓                       ↓
  Element Found           Element Found           Element Found
```

### Implementation
```javascript
const strategies = [
  {
    name: 'role',
    find: async (page, context) => {
      const element = page.getByRole(context.role, { name: context.name });
      if (await element.count() > 0) return element;
      return null;
    }
  },
  {
    name: 'text',
    find: async (page, context) => {
      const element = page.getByText(context.text);
      if (await element.count() > 0) return element;
      return null;
    }
  },
  {
    name: 'css_variation',
    find: async (page, context) => {
      for (const variation of context.cssVariations) {
        const element = page.locator(variation);
        if (await element.count() > 0) return element;
      }
      return null;
    }
  }
];

async function findWithFallback(page, originalSelector, context) {
  for (const strategy of strategies) {
    const element = await strategy.find(page, context);
    if (element) {
      console.log(`Healed: ${originalSelector} → ${strategy.name}`);
      return element;
    }
  }
  throw new Error(`All strategies failed for: ${originalSelector}`);
}
```

### Used In
- Project 2: Self-Healing Locators
- Project 6: Autonomous Explorer (action strategies)

---

## Pattern 3: Rule-Based Auditing

### When to Use
Evaluating content against a known set of rules (accessibility, compliance, quality).

### How It Works
```
┌──────────┐     ┌──────────────┐     ┌─────────────┐
│  Target  │     │  Rule Engine │     │ Violations  │
│  (Page)  │ ──→ │  (20 rules)  │ ──→ │   Report    │
└──────────┘     └──────────────┘     └─────────────┘
                       │
                  ┌────┴────┐
                  │  Rules  │
                  │  Array  │
                  └─────────┘
```

### Implementation
```javascript
const rules = [
  {
    id: 'img-alt',
    name: 'Images must have alt text',
    level: 'A',
    severity: 'critical',
    check: (html) => {
      const imgRegex = /<img(?![^>]*alt=)[^>]*>/gi;
      const violations = html.match(imgRegex) || [];
      return violations.map(v => ({
        element: v.substring(0, 80),
        message: 'Image missing alt attribute',
        fix: 'Add alt="description" to the <img> tag'
      }));
    }
  },
  // ... more rules
];

function audit(html) {
  const results = [];
  for (const rule of rules) {
    const violations = rule.check(html);
    if (violations.length > 0) {
      results.push({ rule: rule.id, level: rule.level, violations });
    }
  }
  return results;
}
```

### Used In
- Project 5: Accessibility Audit Agent
- Project 6: Autonomous Explorer (bug detection rules)

---

## Pattern 4: Crawl-Analyze-Report Pipeline

### When to Use
Processing multiple pages/endpoints and generating a consolidated report.

### How It Works
```
┌────────┐     ┌─────────┐     ┌──────────┐     ┌──────────┐
│  URL   │     │  Crawl  │     │ Analyze  │     │  Report  │
│  List  │ ──→ │  Pages  │ ──→ │  Each    │ ──→ │  HTML    │
└────────┘     └─────────┘     └──────────┘     └──────────┘
```

### Implementation
```javascript
async function pipeline(urls, analyzeFunction, reportGenerator) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const results = [];

  for (const url of urls) {
    await page.goto(url);
    const analysis = await analyzeFunction(page);
    results.push({ url, ...analysis });
  }

  await browser.close();
  const report = reportGenerator(results);
  fs.writeFileSync('reports/report.html', report);
  return results;
}
```

### Used In
- Project 3: AI Visual Regression (capture → compare → report)
- Project 5: Accessibility Audit (crawl → audit → report)
- Project 6: Autonomous Explorer (explore → detect → report)
- Project 7: AI API Testing (request → validate → report)

---

## Pattern 5: Contract Validation

### When to Use
Verifying that a system's behavior matches documented expectations.

### How It Works
```
┌──────────┐     ┌──────────────┐     ┌──────────────┐
│ Contract │     │   Actual     │     │  Comparison  │
│ (Expected│ ──→ │   Response   │ ──→ │   Result     │
│  Schema) │     │  (Live API)  │     │ (Pass/Fail)  │
└──────────┘     └──────────────┘     └──────────────┘
```

### Implementation
```javascript
function validateContract(response, contract) {
  const results = [];

  // Check status code
  results.push({
    check: 'status_code',
    expected: contract.expectedStatus,
    actual: response.status(),
    pass: response.status() === contract.expectedStatus
  });

  // Check content type
  if (contract.expectedContentType) {
    const contentType = response.headers()['content-type'] || '';
    results.push({
      check: 'content_type',
      expected: contract.expectedContentType,
      actual: contentType,
      pass: contentType.includes(contract.expectedContentType)
    });
  }

  return results;
}
```

### Used In
- Project 7: AI API Testing
- Project 4: Smart Test Reporter (validates result structure)

---

## Pattern 6: Result Summarization

### When to Use
Converting raw test data into human-readable insights.

### How It Works
```
┌──────────┐     ┌──────────────┐     ┌──────────────┐
│   Raw    │     │  Summarizer  │     │  Executive   │
│  Results │ ──→ │  (Aggregate  │ ──→ │   Summary    │
│  (JSON)  │     │   + Score)   │     │ (HTML/Slack) │
└──────────┘     └──────────────┘     └──────────────┘
```

### Key Metrics to Extract
- **Pass Rate**: total passed / total tests * 100
- **Failure Categories**: timeout vs. assertion vs. selector errors
- **Risk Score**: Low (> 90% pass), Medium (70-90%), High (< 70%)
- **Trends**: Comparing with previous run (if available)
- **Duration**: Average, min, max test execution time

### Used In
- Project 4: Smart Test Reporter
- Project 6: Autonomous Explorer (exploration summary)

---

## Combining Patterns

Real-world AI testing tools combine multiple patterns:

```
Natural Language Test Writer:
  Template Generation + Contract Validation (validate generated code)

Self-Healing Locators:
  Fallback Chain + Result Summarization (healing log)

Accessibility Audit:
  Crawl-Analyze-Report + Rule-Based Auditing

Autonomous Explorer:
  Crawl-Analyze-Report + Fallback Chain + Rule-Based Auditing
```

---

## Choosing Between Rule-Based AI and LLM-Based AI

| Aspect | Rule-Based (Our Projects) | LLM-Based (Enhanced) |
|--------|---------------------------|----------------------|
| **Cost** | Free | API costs per call |
| **Speed** | Fast (milliseconds) | Slow (1-5 seconds per call) |
| **Determinism** | Same input = same output | May vary between calls |
| **Accuracy** | High for defined rules | Higher for undefined scenarios |
| **Maintenance** | Update rules manually | Model improves with prompts |
| **Best For** | Known patterns | Unknown/complex scenarios |

### Hybrid Approach (Recommended for Production)
1. Use **rule-based** for known patterns (WCAG rules, contract validation)
2. Use **LLM-based** for complex analysis (root cause analysis, natural language understanding)
3. **Cache LLM results** to reduce costs and improve speed
4. **Fall back to rules** when LLM is unavailable

---

## Interview Discussion Points

1. **"Why not just use ChatGPT for everything?"**
   - Cost, latency, determinism, offline capability
   - Rule-based is better when you know the rules
   - LLMs are better when rules are hard to define

2. **"How do you handle false positives?"**
   - Confidence thresholds
   - Human-in-the-loop review for low-confidence results
   - Continuous learning from feedback

3. **"How do you scale AI testing?"**
   - Parallel execution across pages
   - Caching and incremental analysis
   - Contract-based testing reduces scope

4. **"What's the ROI of AI testing?"**
   - Reduced test maintenance (self-healing)
   - Faster test creation (natural language)
   - Earlier bug detection (autonomous exploration)
   - Better stakeholder communication (smart reports)
