/**
 * Bug Detector
 * Detects various types of issues on web pages
 */

/**
 * Check for console errors
 */
function checkConsoleErrors(messages) {
  const errors = messages.filter(m =>
    m.type === 'error' || m.type === 'warning'
  );
  return errors.map(e => ({
    type: 'console_error',
    severity: e.type === 'error' ? 'high' : 'medium',
    description: `Console ${e.type}: ${e.text.substring(0, 200)}`,
  }));
}

/**
 * Check for broken images
 */
async function checkBrokenImages(page) {
  const brokenImages = await page.evaluate(() => {
    const broken = [];
    document.querySelectorAll('img').forEach(img => {
      if (!img.complete || img.naturalWidth === 0) {
        broken.push({
          src: img.src || img.getAttribute('src') || 'unknown',
          alt: img.alt || 'no alt text',
        });
      }
    });
    return broken;
  });

  return brokenImages.map(img => ({
    type: 'broken_image',
    severity: 'medium',
    description: `Broken image: ${img.src} (alt: "${img.alt}")`,
  }));
}

/**
 * Check if page is a 404 or error page
 */
async function checkErrorPage(page) {
  const issues = [];
  const title = await page.title();
  const url = page.url();

  if (/404|not found/i.test(title)) {
    issues.push({
      type: '404_page',
      severity: 'high',
      description: `404 page detected: ${url}`,
    });
  }

  if (/500|internal.*error|server.*error/i.test(title)) {
    issues.push({
      type: '500_page',
      severity: 'critical',
      description: `Server error page detected: ${url}`,
    });
  }

  return issues;
}

/**
 * Check for missing page title
 */
async function checkMissingTitle(page) {
  const title = await page.title();
  if (!title || title.trim().length === 0) {
    return [{
      type: 'missing_title',
      severity: 'medium',
      description: `Page has no title: ${page.url()}`,
    }];
  }
  return [];
}

/**
 * Check for empty page body
 */
async function checkEmptyPage(page) {
  const bodyText = await page.evaluate(() => document.body?.innerText?.trim() || '');
  if (bodyText.length < 10) {
    return [{
      type: 'empty_page',
      severity: 'high',
      description: `Page appears to be empty: ${page.url()}`,
    }];
  }
  return [];
}

/**
 * Check for dead links (links pointing to non-existent pages)
 */
async function checkDeadLinks(page, baseUrl) {
  const links = await page.evaluate(() => {
    const anchors = [];
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (href && !href.startsWith('javascript:') && !href.startsWith('#') && !href.startsWith('mailto:')) {
        anchors.push(href);
      }
    });
    return anchors.slice(0, 10); // Limit to first 10 links
  });

  const deadLinks = [];
  for (const link of links) {
    try {
      const fullUrl = link.startsWith('http') ? link : `${baseUrl}${link.startsWith('/') ? '' : '/'}${link}`;
      const response = await page.request.get(fullUrl);
      if (response.status() >= 400) {
        deadLinks.push({
          type: 'dead_link',
          severity: 'medium',
          description: `Dead link (${response.status()}): ${fullUrl}`,
        });
      }
    } catch (e) {
      // Skip network errors
    }
  }

  return deadLinks;
}

/**
 * Run all bug detection checks on a page
 */
async function runAllChecks(page, consoleMessages, baseUrl) {
  const issues = [];

  issues.push(...checkConsoleErrors(consoleMessages));
  issues.push(...await checkBrokenImages(page));
  issues.push(...await checkErrorPage(page));
  issues.push(...await checkMissingTitle(page));
  issues.push(...await checkEmptyPage(page));

  return issues;
}

module.exports = { checkConsoleErrors, checkBrokenImages, checkErrorPage, checkMissingTitle, checkEmptyPage, checkDeadLinks, runAllChecks };
