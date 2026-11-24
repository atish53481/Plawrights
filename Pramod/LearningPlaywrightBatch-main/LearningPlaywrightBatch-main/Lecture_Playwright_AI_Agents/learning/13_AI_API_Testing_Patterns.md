# AI API Testing Patterns

## Introduction

API testing is critical in modern microservices architectures. This module covers how AI
techniques can enhance API testing — from contract validation to smart mock generation
and schema drift detection.

---

## What Is Contract Testing?

Contract testing verifies that an API's actual behavior matches its documented contract
(expected endpoints, status codes, response schemas, required fields).

```
┌──────────────────┐          ┌──────────────────┐
│   API Contract   │          │   Live API       │
│   (Expected)     │  ──vs──  │   (Actual)       │
│                  │          │                  │
│ GET /login → 200 │          │ GET /login → 200 │ ✅ Match
│ POST /auth → 302 │          │ POST /auth → 200 │ ❌ Drift!
│ GET /users → JSON │          │ GET /users → XML │ ❌ Drift!
└──────────────────┘          └──────────────────┘
```

### Why Contracts Matter
- **Frontend-Backend alignment**: Frontend expects JSON, backend sends XML
- **Version compatibility**: v2 API removes a field that v1 clients need
- **Third-party reliability**: External API changes without notice
- **Microservice communication**: Service A expects field X, Service B stops sending it

---

## Contract Definition Format

```json
{
  "name": "User Login",
  "endpoint": "/authenticate",
  "method": "POST",
  "body": {
    "username": "tomsmith",
    "password": "SuperSecretPassword!"
  },
  "expectedStatus": 200,
  "expectedContentType": "text/html",
  "expectedRedirect": "/secure",
  "requiredText": ["Welcome to the Secure Area"],
  "requiredElements": ["a[href='/logout']"]
}
```

### Contract Fields
| Field | Purpose | Example |
|-------|---------|---------|
| `name` | Human-readable identifier | "User Login" |
| `endpoint` | API path | "/authenticate" |
| `method` | HTTP method | "POST" |
| `body` | Request body (for POST/PUT) | `{ "username": "test" }` |
| `expectedStatus` | Expected HTTP status | 200, 301, 404 |
| `expectedContentType` | Expected Content-Type header | "application/json" |
| `expectedRedirect` | Expected redirect URL | "/secure" |
| `requiredText` | Text that must appear in response | ["Welcome"] |
| `requiredElements` | HTML elements that must exist | ["form", "input"] |

---

## Schema Validation

### What to Validate
1. **Status Code**: Does the API return the expected status?
2. **Content Type**: Is the response format correct?
3. **Response Structure**: Are required fields/elements present?
4. **Response Content**: Does the response contain expected text?
5. **Redirects**: Does the API redirect where expected?
6. **Timing**: Does the response arrive within acceptable time?

### Validation Implementation
```javascript
function validateResponse(response, contract) {
  const checks = [];

  // Status code check
  checks.push({
    name: 'Status Code',
    expected: contract.expectedStatus,
    actual: response.status(),
    pass: response.status() === contract.expectedStatus
  });

  // Content type check
  const contentType = response.headers()['content-type'] || '';
  if (contract.expectedContentType) {
    checks.push({
      name: 'Content Type',
      expected: contract.expectedContentType,
      actual: contentType,
      pass: contentType.includes(contract.expectedContentType)
    });
  }

  // Required text check
  if (contract.requiredText) {
    const body = await response.text();
    for (const text of contract.requiredText) {
      checks.push({
        name: `Contains "${text}"`,
        expected: true,
        actual: body.includes(text),
        pass: body.includes(text)
      });
    }
  }

  return checks;
}
```

---

## Mock Generation from Contracts

### Why Generate Mocks?
- **Offline testing**: No dependency on live servers
- **Speed**: Local mocks are instant, no network latency
- **Reliability**: Mocks never go down or change unexpectedly
- **Edge cases**: Easy to simulate errors, timeouts, weird responses

### How It Works
```
Contract: GET /login → 200, HTML with <form>
     ↓
Mock Generator
     ↓
Mock Response: HTML file with matching <form> structure
     ↓
Mock Server: localhost:3456/login → serves the HTML
```

### Mock Server Architecture
```javascript
const http = require('http');
const mocks = loadMocksFromContracts();

const server = http.createServer((req, res) => {
  const mock = mocks.find(m =>
    m.endpoint === req.url && m.method === req.method
  );

  if (mock) {
    res.writeHead(mock.status, { 'Content-Type': mock.contentType });
    res.end(mock.body);
  } else {
    res.writeHead(404);
    res.end('Mock not found');
  }
});

server.listen(3456);
```

---

## API Testing with Playwright

Playwright provides `page.request` for API testing without a browser UI:

```javascript
const { test, expect } = require('@playwright/test');

test('API contract: login endpoint', async ({ request }) => {
  const response = await request.post('/authenticate', {
    form: {
      username: 'tomsmith',
      password: 'SuperSecretPassword!'
    }
  });

  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toContain('Welcome');
});
```

### Playwright API Testing vs. Browser Testing
| Aspect | API Testing (`request`) | Browser Testing (`page`) |
|--------|------------------------|-------------------------|
| Speed | Fast (no rendering) | Slower (full rendering) |
| Scope | HTTP layer only | Full user experience |
| Use Case | Contract validation | End-to-end flows |
| JavaScript | Not executed | Fully executed |
| Assertions | Status, headers, body | DOM, visual, interaction |

---

## Schema Drift Detection

Schema drift happens when an API's actual response changes without updating the contract.

### Detection Strategy
```
Week 1: Contract says GET /users → { id, name, email }
Week 2: API returns  GET /users → { id, name, email, phone }  ← New field (safe)
Week 3: API returns  GET /users → { id, name }                ← Missing field! (breaking)
```

### Automated Drift Detection
1. **Baseline**: Record response schema from live API
2. **Monitor**: Periodically re-check and compare
3. **Alert**: Notify when schema changes
4. **Classify**: Additive changes (new fields) vs. Breaking changes (removed fields)

```javascript
function detectDrift(baselineSchema, currentSchema) {
  const added = currentSchema.filter(f => !baselineSchema.includes(f));
  const removed = baselineSchema.filter(f => !currentSchema.includes(f));

  return {
    hasDrift: added.length > 0 || removed.length > 0,
    breaking: removed.length > 0,
    added,
    removed
  };
}
```

---

## Best Practices

### 1. Contract-First Development
- Define contracts before writing code
- Both frontend and backend agree on the contract
- Tests validate both sides against the same contract

### 2. Version Your Contracts
- Keep contracts in version control alongside code
- Use semantic versioning for API versions
- Track contract changes in commit history

### 3. Test at Multiple Levels
```
┌─────────────────────────────────────┐
│         E2E Browser Tests           │  ← Few (expensive, slow)
├─────────────────────────────────────┤
│       API Contract Tests            │  ← Many (fast, reliable)
├─────────────────────────────────────┤
│         Unit Tests                  │  ← Most (fastest)
└─────────────────────────────────────┘
```

### 4. Automate Mock Updates
When the contract changes, automatically regenerate mocks:
```bash
node mock_generator.js  # Reads contracts, generates mocks
```

---

## Interview Questions

**Q: What is contract testing?**
A: Contract testing verifies that an API's actual behavior matches its documented contract — expected endpoints, status codes, response schemas, and required fields.

**Q: How does contract testing differ from integration testing?**
A: Integration testing verifies that components work together correctly. Contract testing specifically verifies that the interface between components matches agreed-upon specifications. Contract tests are faster and more focused.

**Q: What is schema drift?**
A: Schema drift occurs when an API's actual response structure changes without updating the contract. This can cause downstream failures when consumers expect the original schema.

**Q: Why generate mocks from contracts?**
A: Mock generation ensures mocks stay synchronized with contracts. Manual mocks can drift from reality, causing false test passes. Contract-generated mocks are always consistent with expected behavior.

**Q: How do you handle API versioning in contract tests?**
A: Maintain separate contract files per API version. Run contract tests against each version independently. Alert when a version's contract violations exceed a threshold.
