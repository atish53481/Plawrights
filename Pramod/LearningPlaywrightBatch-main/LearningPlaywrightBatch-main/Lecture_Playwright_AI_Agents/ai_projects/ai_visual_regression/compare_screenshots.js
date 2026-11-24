/**
 * Screenshot Comparison Engine
 * Compares baseline and current screenshots using byte-level analysis
 */

const fs = require('fs');

/**
 * Compare two screenshot files
 * Returns comparison result with diff metrics
 */
function compareScreenshots(baselinePath, currentPath) {
  if (!fs.existsSync(baselinePath)) {
    return {
      status: 'new_page',
      match: false,
      diffPercentage: 100,
      message: 'No baseline exists - this is a new page',
      baselineSize: 0,
      currentSize: fs.existsSync(currentPath) ? fs.statSync(currentPath).size : 0,
    };
  }

  if (!fs.existsSync(currentPath)) {
    return {
      status: 'missing_current',
      match: false,
      diffPercentage: 100,
      message: 'Current screenshot is missing',
      baselineSize: fs.statSync(baselinePath).size,
      currentSize: 0,
    };
  }

  const baseline = fs.readFileSync(baselinePath);
  const current = fs.readFileSync(currentPath);

  // Size comparison
  const sizeDiff = Math.abs(baseline.length - current.length);
  const sizeRatio = sizeDiff / Math.max(baseline.length, current.length) * 100;

  // Byte-level comparison (compare overlapping bytes)
  const minLength = Math.min(baseline.length, current.length);
  let differentBytes = 0;

  for (let i = 0; i < minLength; i++) {
    if (baseline[i] !== current[i]) {
      differentBytes++;
    }
  }

  // Add size difference as fully different bytes
  differentBytes += Math.abs(baseline.length - current.length);
  const totalBytes = Math.max(baseline.length, current.length);
  const diffPercentage = (differentBytes / totalBytes) * 100;

  // Classify the change
  let status, message;
  if (diffPercentage < 1) {
    status = 'no_change';
    message = 'Screenshots are virtually identical';
  } else if (diffPercentage < 5) {
    status = 'minor_change';
    message = 'Small differences detected (possibly dynamic content like timestamps)';
  } else if (diffPercentage < 15) {
    status = 'moderate_change';
    message = 'Moderate differences detected (layout or content changes)';
  } else {
    status = 'major_change';
    message = 'Significant differences detected (major redesign or layout break)';
  }

  return {
    status,
    match: diffPercentage < 1,
    diffPercentage: parseFloat(diffPercentage.toFixed(2)),
    sizeChangePercent: parseFloat(sizeRatio.toFixed(2)),
    message,
    baselineSize: baseline.length,
    currentSize: current.length,
    differentBytes,
    totalBytes,
  };
}

module.exports = { compareScreenshots };
