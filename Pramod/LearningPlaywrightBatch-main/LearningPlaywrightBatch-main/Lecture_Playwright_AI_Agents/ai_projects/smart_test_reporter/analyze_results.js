/**
 * Test Results Analyzer
 * Parses Playwright JSON results and extracts insights
 */

const fs = require('fs');

/**
 * Analyze Playwright JSON test results
 */
function analyzeResults(resultsPath) {
  const data = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
  const allTests = [];

  // Flatten tests from all suites
  for (const suite of data.suites || []) {
    for (const spec of suite.specs || []) {
      for (const test of spec.tests || []) {
        allTests.push({
          title: spec.title,
          status: test.status,
          duration: test.duration,
          errors: test.errors || [],
          suite: suite.title,
        });
      }
    }
  }

  const passed = allTests.filter(t => t.status === 'passed');
  const failed = allTests.filter(t => t.status === 'failed');
  const skipped = allTests.filter(t => t.status === 'skipped');

  // Categorize failures
  const failureCategories = {};
  for (const test of failed) {
    let category = 'unknown';
    const errorMsg = test.errors[0]?.message || '';

    if (/timed?\s*out/i.test(errorMsg)) category = 'timeout';
    else if (/expect.*to(Have|Contain|Be)/i.test(errorMsg)) category = 'assertion';
    else if (/locator|selector|not found/i.test(errorMsg)) category = 'selector';
    else if (/network|fetch|api/i.test(errorMsg)) category = 'network';

    if (!failureCategories[category]) failureCategories[category] = [];
    failureCategories[category].push(test);
  }

  const totalDuration = allTests.reduce((sum, t) => sum + t.duration, 0);
  const passRate = allTests.length > 0 ? (passed.length / allTests.length) * 100 : 0;

  // Risk assessment
  let riskLevel, riskColor;
  if (passRate >= 90) { riskLevel = 'LOW'; riskColor = '#4CAF50'; }
  else if (passRate >= 70) { riskLevel = 'MEDIUM'; riskColor = '#FF9800'; }
  else { riskLevel = 'HIGH'; riskColor = '#f44336'; }

  return {
    summary: {
      total: allTests.length,
      passed: passed.length,
      failed: failed.length,
      skipped: skipped.length,
      passRate: parseFloat(passRate.toFixed(1)),
      totalDuration,
      avgDuration: Math.round(totalDuration / Math.max(allTests.length, 1)),
    },
    risk: { level: riskLevel, color: riskColor },
    failureCategories,
    failedTests: failed,
    passedTests: passed,
    allTests,
    timestamp: new Date().toISOString(),
  };
}

module.exports = { analyzeResults };
