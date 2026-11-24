/**
 * Schema Analyzer
 * Validates API responses against contracts and extracts structural schemas
 */

/**
 * Validate a response against a contract
 */
function validateResponse(status, headers, body, contract) {
  const checks = [];

  // Status code check
  checks.push({
    name: 'Status Code',
    expected: contract.expectedStatus,
    actual: status,
    pass: status === contract.expectedStatus,
  });

  // Content type check
  if (contract.expectedContentType) {
    const contentType = headers['content-type'] || '';
    checks.push({
      name: 'Content Type',
      expected: contract.expectedContentType,
      actual: contentType.split(';')[0].trim(),
      pass: contentType.includes(contract.expectedContentType),
    });
  }

  // Required text check
  if (contract.requiredText) {
    for (const text of contract.requiredText) {
      checks.push({
        name: `Contains "${text}"`,
        expected: true,
        actual: body.includes(text),
        pass: body.includes(text),
      });
    }
  }

  // Required HTML elements check
  if (contract.requiredElements) {
    for (const element of contract.requiredElements) {
      const regex = new RegExp(`<${element}[\\s>]`, 'i');
      checks.push({
        name: `Has <${element}> element`,
        expected: true,
        actual: regex.test(body),
        pass: regex.test(body),
      });
    }
  }

  const passed = checks.filter(c => c.pass).length;
  const failed = checks.filter(c => !c.pass).length;

  return {
    contract: contract.name,
    endpoint: contract.endpoint,
    method: contract.method,
    checks,
    passed,
    failed,
    total: checks.length,
    compliant: failed === 0,
  };
}

/**
 * Extract structural schema from HTML
 */
function extractSchema(html) {
  const schema = {
    hasForm: /<form\b/i.test(html),
    hasTables: /<table\b/i.test(html),
    hasImages: /<img\b/i.test(html),
    hasLinks: /<a\b/i.test(html),
    hasHeadings: /<h[1-6]\b/i.test(html),
    hasInputs: /<input\b/i.test(html),
    hasButtons: /<button\b/i.test(html),
    inputTypes: [],
    headingLevels: [],
  };

  // Extract input types
  const inputRegex = /type\s*=\s*"([^"]+)"/gi;
  let match;
  while ((match = inputRegex.exec(html)) !== null) {
    if (!schema.inputTypes.includes(match[1])) {
      schema.inputTypes.push(match[1]);
    }
  }

  // Extract heading levels
  const headingRegex = /<h([1-6])\b/gi;
  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    if (!schema.headingLevels.includes(level)) {
      schema.headingLevels.push(level);
    }
  }

  return schema;
}

module.exports = { validateResponse, extractSchema };
