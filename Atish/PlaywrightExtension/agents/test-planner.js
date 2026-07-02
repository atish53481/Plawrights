import { BaseAgent } from './base-agent.js';

export class TestPlannerAgent extends BaseAgent {
  constructor(provider) {
    super('Test Planner', provider);
  }

  buildSystemPrompt() {
    return `You are an expert QA Lead and Test Architect. Your role is to analyze requirements and produce comprehensive test strategies.
Output structured markdown with: Test Strategy, Test Types, Functional Test Cases (with TC IDs), Risk Areas, Test Data, Automation Candidates, RTM.
Be specific, actionable, and include negative/boundary/security test cases. Use tables where appropriate.`;
  }

  async run({ text, inputType = 'feature', options = {} }) {
    const prompt = `Analyze the following ${inputType} and produce a complete test strategy and test plan.

**Input Type:** ${inputType}
**Content:**
${text}

Generate:
${options.strategy !== false ? '- Complete Test Strategy' : ''}
- Functional Test Cases (with TC IDs, Steps, Expected Results, Priority, Type)
- Smoke Tests
- Regression Test Suite
- Negative Tests
- Boundary Tests
- Risk Areas
- Test Data Requirements
- Automation Candidates
- Requirement Traceability Matrix`;

    const result = await this.provider.complete({ system: this.buildSystemPrompt(), prompt, maxTokens: 6000 });
    this.record({ text, inputType }, result);
    return result;
  }
}
