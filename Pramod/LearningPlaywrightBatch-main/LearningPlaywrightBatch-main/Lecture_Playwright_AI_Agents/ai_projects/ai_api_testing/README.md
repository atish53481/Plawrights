# Project 7: AI API Testing

## Overview
Defines API contracts (expected endpoints, schemas, status codes), validates live API responses against them, and auto-generates mock servers from contracts.

## Quick Start
```bash
# Validate contracts against live API
node api_contract_validator.js

# Generate mock responses
node mock_generator.js

# Start mock server
node mock_generator.js --serve

# Run Playwright API tests
npx playwright test api_tests.spec.js --config=../../playwright.config.js
```

## Files
| File | Purpose |
|------|---------|
| `contracts/api_contracts.json` | API contract definitions (8 contracts) |
| `schema_analyzer.js` | Response validation engine |
| `api_contract_validator.js` | Main validator + HTML report |
| `mock_generator.js` | Mock response generator + server |
| `api_tests.spec.js` | Playwright API test specs |
| `mocks/` | Generated mock HTML responses |
| `reports/` | Compliance reports |

## Contract Format
```json
{
  "name": "Login Page",
  "endpoint": "/login",
  "method": "GET",
  "expectedStatus": 200,
  "expectedContentType": "text/html",
  "requiredElements": ["form", "input", "button"],
  "requiredText": ["Login Page"]
}
```

## Validation Checks
- HTTP status code
- Content-Type header
- Required HTML elements
- Required text content
- Redirect behavior
