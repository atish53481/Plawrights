/**
 * WCAG 2.1 Accessibility Rules
 * Rule-based checks for common accessibility issues
 */

const rules = [
  {
    id: 'img-alt',
    name: 'Images must have alt text',
    level: 'A',
    category: 'images',
    severity: 'critical',
    check: (html) => {
      const violations = [];
      const imgRegex = /<img\b(?![^>]*\balt\s*=)[^>]*>/gi;
      let match;
      while ((match = imgRegex.exec(html)) !== null) {
        violations.push({ element: match[0].substring(0, 100), fix: 'Add alt="description" to the <img> tag' });
      }
      return violations;
    }
  },
  {
    id: 'img-alt-empty',
    name: 'Images should not have empty alt text unless decorative',
    level: 'A',
    category: 'images',
    severity: 'moderate',
    check: (html) => {
      const violations = [];
      const imgRegex = /<img\b[^>]*\balt\s*=\s*""\s*[^>]*>/gi;
      let match;
      while ((match = imgRegex.exec(html)) !== null) {
        if (!/role\s*=\s*"(presentation|none)"/i.test(match[0])) {
          violations.push({ element: match[0].substring(0, 100), fix: 'Add descriptive alt text or role="presentation" for decorative images' });
        }
      }
      return violations;
    }
  },
  {
    id: 'html-lang',
    name: 'Page must have lang attribute',
    level: 'A',
    category: 'document',
    severity: 'critical',
    check: (html) => {
      if (!/<html[^>]*\blang\s*=/i.test(html)) {
        return [{ element: '<html>', fix: 'Add lang="en" (or appropriate language) to <html> tag' }];
      }
      return [];
    }
  },
  {
    id: 'page-title',
    name: 'Page must have a title',
    level: 'A',
    category: 'document',
    severity: 'critical',
    check: (html) => {
      if (!/<title[^>]*>[^<]+<\/title>/i.test(html)) {
        return [{ element: '<head>', fix: 'Add a descriptive <title> element inside <head>' }];
      }
      return [];
    }
  },
  {
    id: 'heading-order',
    name: 'Headings must be in sequential order',
    level: 'A',
    category: 'headings',
    severity: 'moderate',
    check: (html) => {
      const violations = [];
      const headingRegex = /<h([1-6])\b/gi;
      const levels = [];
      let match;
      while ((match = headingRegex.exec(html)) !== null) {
        levels.push(parseInt(match[1]));
      }
      for (let i = 1; i < levels.length; i++) {
        if (levels[i] > levels[i - 1] + 1) {
          violations.push({ element: `h${levels[i]} after h${levels[i - 1]}`, fix: `Heading level skipped: h${levels[i-1]} to h${levels[i]}. Use sequential heading levels.` });
        }
      }
      return violations;
    }
  },
  {
    id: 'form-label',
    name: 'Form inputs must have associated labels',
    level: 'A',
    category: 'forms',
    severity: 'critical',
    check: (html) => {
      const violations = [];
      const inputRegex = /<input\b(?![^>]*type\s*=\s*"(hidden|submit|button|reset|image)")[^>]*>/gi;
      let match;
      while ((match = inputRegex.exec(html)) !== null) {
        const idMatch = match[0].match(/\bid\s*=\s*"([^"]+)"/i);
        if (idMatch) {
          const labelRegex = new RegExp(`<label[^>]*\\bfor\\s*=\\s*"${idMatch[1]}"`, 'i');
          if (!labelRegex.test(html) && !/aria-label/i.test(match[0]) && !/aria-labelledby/i.test(match[0])) {
            violations.push({ element: match[0].substring(0, 100), fix: `Add <label for="${idMatch[1]}"> or aria-label attribute` });
          }
        } else if (!/aria-label/i.test(match[0])) {
          violations.push({ element: match[0].substring(0, 100), fix: 'Add id and matching <label for="id"> or aria-label attribute' });
        }
      }
      return violations;
    }
  },
  {
    id: 'link-text',
    name: 'Links must have discernible text',
    level: 'A',
    category: 'links',
    severity: 'serious',
    check: (html) => {
      const violations = [];
      const linkRegex = /<a\b[^>]*>\s*<\/a>/gi;
      let match;
      while ((match = linkRegex.exec(html)) !== null) {
        if (!/aria-label/i.test(match[0])) {
          violations.push({ element: match[0].substring(0, 100), fix: 'Add link text or aria-label' });
        }
      }
      return violations;
    }
  },
  {
    id: 'link-generic-text',
    name: 'Links should not use generic text like "click here"',
    level: 'AA',
    category: 'links',
    severity: 'moderate',
    check: (html) => {
      const violations = [];
      const genericTexts = ['click here', 'read more', 'more', 'here', 'link'];
      const linkRegex = /<a\b[^>]*>([^<]+)<\/a>/gi;
      let match;
      while ((match = linkRegex.exec(html)) !== null) {
        const text = match[1].trim().toLowerCase();
        if (genericTexts.includes(text)) {
          violations.push({ element: match[0].substring(0, 100), fix: `Replace "${text}" with descriptive link text` });
        }
      }
      return violations;
    }
  },
  {
    id: 'button-text',
    name: 'Buttons must have discernible text',
    level: 'A',
    category: 'forms',
    severity: 'critical',
    check: (html) => {
      const violations = [];
      const buttonRegex = /<button\b[^>]*>\s*<\/button>/gi;
      let match;
      while ((match = buttonRegex.exec(html)) !== null) {
        if (!/aria-label/i.test(match[0])) {
          violations.push({ element: match[0].substring(0, 100), fix: 'Add button text or aria-label' });
        }
      }
      return violations;
    }
  },
  {
    id: 'table-headers',
    name: 'Tables must have header cells',
    level: 'A',
    category: 'tables',
    severity: 'serious',
    check: (html) => {
      const violations = [];
      const tableRegex = /<table\b[^>]*>[\s\S]*?<\/table>/gi;
      let match;
      while ((match = tableRegex.exec(html)) !== null) {
        if (!/<th\b/i.test(match[0])) {
          violations.push({ element: '<table> without <th>', fix: 'Add <th> elements for table column/row headers' });
        }
      }
      return violations;
    }
  },
  {
    id: 'skip-nav',
    name: 'Page should have skip navigation link',
    level: 'A',
    category: 'keyboard',
    severity: 'moderate',
    check: (html) => {
      if (!/skip.*nav|skip.*content|skip.*main/i.test(html)) {
        return [{ element: '<body>', fix: 'Add a "Skip to main content" link at the top of the page' }];
      }
      return [];
    }
  },
  {
    id: 'meta-viewport',
    name: 'Viewport should not disable zoom',
    level: 'AA',
    category: 'document',
    severity: 'serious',
    check: (html) => {
      if (/user-scalable\s*=\s*no/i.test(html) || /maximum-scale\s*=\s*1[^0-9]/i.test(html)) {
        return [{ element: '<meta name="viewport">', fix: 'Remove user-scalable=no and allow maximum-scale > 1' }];
      }
      return [];
    }
  },
  {
    id: 'aria-valid-roles',
    name: 'ARIA roles must be valid',
    level: 'A',
    category: 'aria',
    severity: 'serious',
    check: (html) => {
      const violations = [];
      const validRoles = ['alert', 'alertdialog', 'application', 'article', 'banner', 'button', 'cell', 'checkbox', 'columnheader', 'combobox', 'complementary', 'contentinfo', 'definition', 'dialog', 'directory', 'document', 'feed', 'figure', 'form', 'grid', 'gridcell', 'group', 'heading', 'img', 'link', 'list', 'listbox', 'listitem', 'log', 'main', 'marquee', 'math', 'menu', 'menubar', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'navigation', 'none', 'note', 'option', 'presentation', 'progressbar', 'radio', 'radiogroup', 'region', 'row', 'rowgroup', 'rowheader', 'scrollbar', 'search', 'searchbox', 'separator', 'slider', 'spinbutton', 'status', 'switch', 'tab', 'table', 'tablist', 'tabpanel', 'term', 'textbox', 'timer', 'toolbar', 'tooltip', 'tree', 'treegrid', 'treeitem'];
      const roleRegex = /\brole\s*=\s*"([^"]+)"/gi;
      let match;
      while ((match = roleRegex.exec(html)) !== null) {
        if (!validRoles.includes(match[1].toLowerCase())) {
          violations.push({ element: `role="${match[1]}"`, fix: `"${match[1]}" is not a valid ARIA role` });
        }
      }
      return violations;
    }
  },
  {
    id: 'autocomplete',
    name: 'Form fields should have autocomplete attribute',
    level: 'AA',
    category: 'forms',
    severity: 'minor',
    check: (html) => {
      const violations = [];
      const fieldTypes = ['text', 'email', 'tel', 'password', 'url'];
      for (const type of fieldTypes) {
        const regex = new RegExp(`<input[^>]*type\\s*=\\s*"${type}"(?![^>]*autocomplete)[^>]*>`, 'gi');
        let match;
        while ((match = regex.exec(html)) !== null) {
          violations.push({ element: match[0].substring(0, 100), fix: `Add autocomplete attribute for ${type} input` });
        }
      }
      return violations;
    }
  },
];

module.exports = { rules };
