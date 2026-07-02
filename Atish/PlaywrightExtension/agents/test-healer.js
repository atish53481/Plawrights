import { BaseAgent } from './base-agent.js';

export class TestHealerAgent extends BaseAgent {
  constructor(provider) {
    super('Test Healer', provider);
  }

  buildSystemPrompt() {
    return `You are an expert Playwright test repair engineer. Analyze broken Playwright tests and provide fixes.
Always:
1. Identify root cause (locator failure, timing, DOM change, API change, etc.)
2. Provide confidence score (0-100%)
3. Show before/after comparison
4. Suggest multiple fix options ranked by quality
5. Explain WHY the original locator failed
6. Suggest preventive measures
Output structured markdown with code blocks.`;
  }

  async run({ brokenCode, errorMessage = '', context = '' }) {
    const prompt = `Analyze this broken Playwright test and provide a complete healing report.

**Error Message:**
${errorMessage || 'Test is failing / locator not found'}

**Context / DOM Change:**
${context || 'Unknown - analyze from code'}

**Broken Test Code:**
\`\`\`
${brokenCode}
\`\`\`

Provide:
1. Root cause analysis
2. Confidence score
3. Multiple fix options (ranked best first)
4. Before/After comparison
5. Prevention recommendations`;

    const result = await this.provider.complete({ system: this.buildSystemPrompt(), prompt, maxTokens: 4000 });
    this.record({ brokenCode, errorMessage }, result);
    return result;
  }
}
