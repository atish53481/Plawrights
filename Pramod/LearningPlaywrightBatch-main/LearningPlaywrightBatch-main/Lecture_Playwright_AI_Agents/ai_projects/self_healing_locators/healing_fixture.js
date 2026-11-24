/**
 * Self-Healing Playwright Fixture
 * Wraps page interactions with automatic locator healing
 */

const { test: base, expect } = require('@playwright/test');
const { findWithHealing } = require('./locator_strategies');
const fs = require('fs');
const path = require('path');

const HEALING_LOG_PATH = path.join(__dirname, 'healing_log.json');

// Load existing healing log
function loadHealingLog() {
  try {
    return JSON.parse(fs.readFileSync(HEALING_LOG_PATH, 'utf-8'));
  } catch {
    return [];
  }
}

// Save healing log
function saveHealingLog(log) {
  fs.writeFileSync(HEALING_LOG_PATH, JSON.stringify(log, null, 2));
}

// Add a healing entry
function logHealing(entry) {
  const log = loadHealingLog();
  log.push({
    ...entry,
    timestamp: new Date().toISOString(),
  });
  saveHealingLog(log);
}

/**
 * Create a self-healing page wrapper
 * Intercepts locator calls and heals broken selectors
 */
function createHealingPage(page, testInfo) {
  return {
    // Proxy the original page
    ...page,
    goto: (...args) => page.goto(...args),
    url: () => page.url(),
    title: () => page.title(),
    content: () => page.content(),
    waitForLoadState: (...args) => page.waitForLoadState(...args),
    screenshot: (...args) => page.screenshot(...args),
    evaluate: (...args) => page.evaluate(...args),
    on: (...args) => page.on(...args),
    close: (...args) => page.close(...args),

    /**
     * Self-healing locator - tries original first, then heals
     */
    locator: (selector) => {
      const originalLocator = page.locator(selector);

      // Return a proxy that heals on interaction
      return new Proxy(originalLocator, {
        get(target, prop) {
          const original = target[prop];

          // Intercept action methods
          if (['click', 'fill', 'type', 'check', 'uncheck', 'selectOption', 'hover'].includes(prop)) {
            return async (...args) => {
              // Try original selector first
              try {
                if (await target.count() > 0) {
                  return await original.call(target, ...args);
                }
              } catch (e) { /* original failed, try healing */ }

              // Attempt healing
              console.log(`\x1b[33m  ⚕ Healing selector: ${selector}\x1b[0m`);
              const healed = await findWithHealing(page, selector);

              if (healed) {
                console.log(`\x1b[32m  ✓ Healed via ${healed.strategy}: ${healed.selector}\x1b[0m`);
                logHealing({
                  test: testInfo.title,
                  originalSelector: selector,
                  healedSelector: healed.selector,
                  strategy: healed.strategy,
                  action: prop,
                });
                return await healed.locator[prop](...args);
              }

              // Healing failed, throw original error
              throw new Error(`Self-healing failed for selector: ${selector}. All strategies exhausted.`);
            };
          }

          // Intercept assertion-related methods
          if (['count', 'isVisible', 'isChecked', 'inputValue', 'textContent', 'innerText', 'innerHTML'].includes(prop)) {
            return async (...args) => {
              try {
                if (await target.count() > 0) {
                  return await original.call(target, ...args);
                }
              } catch (e) { /* try healing */ }

              console.log(`\x1b[33m  ⚕ Healing selector for ${prop}: ${selector}\x1b[0m`);
              const healed = await findWithHealing(page, selector);

              if (healed) {
                console.log(`\x1b[32m  ✓ Healed via ${healed.strategy}: ${healed.selector}\x1b[0m`);
                logHealing({
                  test: testInfo.title,
                  originalSelector: selector,
                  healedSelector: healed.selector,
                  strategy: healed.strategy,
                  action: prop,
                });
                return await healed.locator[prop](...args);
              }

              return await original.call(target, ...args);
            };
          }

          // Return original for other properties
          if (typeof original === 'function') {
            return original.bind(target);
          }
          return original;
        }
      });
    },
  };
}

/**
 * Extended test fixture with self-healing page
 */
const test = base.extend({
  healingPage: async ({ page }, use, testInfo) => {
    const healingPage = createHealingPage(page, testInfo);
    await use(healingPage);
  },
});

module.exports = { test, expect };
