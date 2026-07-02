import { BaseAgent } from './base-agent.js';

const LANG_TEMPLATES = {
  typescript: { ext: 'ts', import: `import { test, expect } from '@playwright/test';` },
  javascript: { ext: 'js', import: `const { test, expect } = require('@playwright/test');` },
  python:     { ext: 'py', import: `from playwright.sync_api import sync_playwright, expect` },
  java:       { ext: 'java', import: `import com.microsoft.playwright.*;` },
  csharp:     { ext: 'cs', import: `using Microsoft.Playwright;` },
};

export class TestGeneratorAgent extends BaseAgent {
  constructor(provider) {
    super('Test Generator', provider);
  }

  buildSystemPrompt(language, framework) {
    return `You are an expert Playwright automation engineer. Generate production-ready ${language} Playwright tests.
Framework pattern: ${framework}.
Rules:
- Use meaningful locators (getByRole, getByLabel, getByTestId, data-testid)
- Never use CSS classes or XPath unless absolutely necessary
- Include proper assertions with expect()
- Add descriptive test names and tags (@smoke, @regression)
- Follow ${framework === 'pom' ? 'Page Object Model' : framework} pattern
- Include imports, page classes, and test files
Output complete, runnable code.`;
  }

  async run({ testPlan, language = 'typescript', framework = 'pom', options = {} }) {
    const systemPrompt = this.buildSystemPrompt(language, framework);
    const prompt = `Generate complete Playwright ${language} automation code for the following test plan.

**Language:** ${language}
**Pattern:** ${framework}
**Generate:** ${options.generatePOM !== false ? 'Page Objects + ' : ''}Test Files${options.fixtures ? ' + Fixtures' : ''}${options.utilities ? ' + Utilities' : ''}

**Test Plan / Requirements:**
${testPlan}

Output complete, production-ready, well-structured code with proper imports.`;

    const result = await this.provider.complete({ system: systemPrompt, prompt, maxTokens: 8000 });
    this.record({ language, framework }, result);
    return result;
  }
}
