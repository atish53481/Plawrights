/**
 * Self-Healing Locator Strategies
 * Fallback chain for finding elements when primary selector fails
 */

const STRATEGIES = [
  {
    name: 'role_based',
    description: 'Find by ARIA role and accessible name',
    find: async (page, context) => {
      if (!context.role) return null;
      try {
        const locator = page.getByRole(context.role, { name: context.name });
        if (await locator.count() > 0) return { locator, strategy: 'role_based', selector: `getByRole('${context.role}', { name: '${context.name}' })` };
      } catch (e) { /* skip */ }
      return null;
    }
  },
  {
    name: 'text_based',
    description: 'Find by visible text content',
    find: async (page, context) => {
      if (!context.text) return null;
      try {
        const locator = page.getByText(context.text, { exact: false });
        if (await locator.count() > 0) return { locator, strategy: 'text_based', selector: `getByText('${context.text}')` };
      } catch (e) { /* skip */ }
      return null;
    }
  },
  {
    name: 'label_based',
    description: 'Find form element by its label',
    find: async (page, context) => {
      if (!context.label) return null;
      try {
        const locator = page.getByLabel(context.label);
        if (await locator.count() > 0) return { locator, strategy: 'label_based', selector: `getByLabel('${context.label}')` };
      } catch (e) { /* skip */ }
      return null;
    }
  },
  {
    name: 'placeholder_based',
    description: 'Find input by placeholder text',
    find: async (page, context) => {
      if (!context.placeholder) return null;
      try {
        const locator = page.getByPlaceholder(context.placeholder);
        if (await locator.count() > 0) return { locator, strategy: 'placeholder_based', selector: `getByPlaceholder('${context.placeholder}')` };
      } catch (e) { /* skip */ }
      return null;
    }
  },
  {
    name: 'css_id_variation',
    description: 'Try common CSS ID variations',
    find: async (page, context) => {
      if (!context.cssVariations) return null;
      for (const variation of context.cssVariations) {
        try {
          const locator = page.locator(variation);
          if (await locator.count() > 0) return { locator, strategy: 'css_id_variation', selector: variation };
        } catch (e) { /* skip */ }
      }
      return null;
    }
  },
  {
    name: 'css_attribute',
    description: 'Find by name or type attribute',
    find: async (page, context) => {
      if (!context.attributes) return null;
      for (const attr of context.attributes) {
        try {
          const locator = page.locator(attr);
          if (await locator.count() > 0) return { locator, strategy: 'css_attribute', selector: attr };
        } catch (e) { /* skip */ }
      }
      return null;
    }
  },
  {
    name: 'xpath_fallback',
    description: 'Last resort XPath lookup',
    find: async (page, context) => {
      if (!context.xpath) return null;
      try {
        const locator = page.locator(context.xpath);
        if (await locator.count() > 0) return { locator, strategy: 'xpath_fallback', selector: context.xpath };
      } catch (e) { /* skip */ }
      return null;
    }
  }
];

/**
 * Build healing context from a broken selector
 * Infers likely element attributes from the selector pattern
 */
function buildHealingContext(originalSelector) {
  const context = { cssVariations: [], attributes: [] };

  // Extract potential ID from selector
  const idMatch = originalSelector.match(/#([\w-]+)/);
  if (idMatch) {
    const id = idMatch[1];
    // Try common variations: remove prefixes, change casing
    context.cssVariations.push(
      `#${id}`,
      `#${id.toLowerCase()}`,
      `#${id.replace(/[-_]field$/, '')}`,
      `#${id.replace(/^(wrong|broken|old|bad)[-_]?/, '')}`,
      `[id*="${id.split('-').pop()}"]`
    );
  }

  // Infer element type from selector keywords
  if (/user|email|login/i.test(originalSelector)) {
    context.role = 'textbox';
    context.name = /user/i.test(originalSelector) ? 'Username' : 'Email';
    context.label = context.name;
    context.attributes.push('[name="username"]', '[id="username"]', 'input[type="text"]');
    context.xpath = '//input[@name="username" or @id="username"]';
  }
  if (/pass/i.test(originalSelector)) {
    context.role = 'textbox';
    context.name = 'Password';
    context.label = 'Password';
    context.attributes.push('[name="password"]', '[id="password"]', 'input[type="password"]');
    context.xpath = '//input[@type="password"]';
  }
  if (/submit|login|btn|button/i.test(originalSelector)) {
    context.role = 'button';
    context.name = 'Login';
    context.text = 'Login';
    context.attributes.push('button[type="submit"]', '.radius', 'button', 'input[type="submit"]');
    context.xpath = '//button[@type="submit"] | //i[contains(@class,"sign-in")]/..'
  }
  if (/check/i.test(originalSelector)) {
    context.role = 'checkbox';
    context.attributes.push('input[type="checkbox"]', '#checkboxes input');
    context.xpath = '//input[@type="checkbox"]';
  }
  if (/flash|message|alert|error/i.test(originalSelector)) {
    context.attributes.push('#flash', '.flash', '[id="flash"]', '.alert');
    context.xpath = '//div[@id="flash"]';
  }

  return context;
}

/**
 * Try all strategies to find an element
 */
async function findWithHealing(page, originalSelector, customContext = {}) {
  const context = { ...buildHealingContext(originalSelector), ...customContext };

  for (const strategy of STRATEGIES) {
    const result = await strategy.find(page, context);
    if (result) {
      return result;
    }
  }

  return null;
}

module.exports = { STRATEGIES, buildHealingContext, findWithHealing };
