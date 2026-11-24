/**
 * Autonomous Explorer - Action Strategies
 * Functions for discovering and interacting with page elements
 */

/**
 * Get all links on the current page
 */
async function getAllLinks(page) {
  return await page.evaluate(() => {
    const links = [];
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      const text = a.textContent.trim().substring(0, 50);
      if (href && !href.startsWith('javascript:') && !href.startsWith('#') && !href.startsWith('mailto:')) {
        links.push({ href, text });
      }
    });
    return links;
  });
}

/**
 * Get all buttons on the current page
 */
async function getAllButtons(page) {
  return await page.evaluate(() => {
    const buttons = [];
    document.querySelectorAll('button, input[type="button"], input[type="submit"]').forEach(btn => {
      buttons.push({
        text: btn.textContent?.trim() || btn.value || '',
        type: btn.type || 'button',
        tag: btn.tagName.toLowerCase(),
      });
    });
    return buttons;
  });
}

/**
 * Get all form elements on the current page
 */
async function getAllForms(page) {
  return await page.evaluate(() => {
    const forms = [];
    document.querySelectorAll('form').forEach(form => {
      const inputs = [];
      form.querySelectorAll('input, select, textarea').forEach(input => {
        inputs.push({
          name: input.name || input.id || '',
          type: input.type || 'text',
          tag: input.tagName.toLowerCase(),
        });
      });
      forms.push({ action: form.action, method: form.method, inputs });
    });
    return forms;
  });
}

/**
 * Get page metadata
 */
async function getPageMetadata(page) {
  return await page.evaluate(() => ({
    title: document.title,
    url: window.location.href,
    headingCount: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
    imageCount: document.querySelectorAll('img').length,
    linkCount: document.querySelectorAll('a').length,
    formCount: document.querySelectorAll('form').length,
    buttonCount: document.querySelectorAll('button').length,
    hasMainContent: !!document.querySelector('main, #content, .content, [role="main"]'),
  }));
}

module.exports = { getAllLinks, getAllButtons, getAllForms, getPageMetadata };
