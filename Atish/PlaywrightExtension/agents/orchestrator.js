import { TestPlannerAgent } from './test-planner.js';
import { TestGeneratorAgent } from './test-generator.js';
import { TestHealerAgent } from './test-healer.js';
import { RecorderAgent } from './recorder-agent.js';
import { InspectorAgent } from './inspector-agent.js';
import { ChatAgent } from './chat-agent.js';
import { FrameworkAgent } from './framework-agent.js';
import { ExportAgent } from './export-agent.js';
import { BrowserSessionAgent } from './browser-session-agent.js';

export class Orchestrator {
  constructor(provider) {
    this.provider = provider;
    this.agents = {};
    this.executionLog = [];
    this._initAgents();
  }

  _initAgents() {
    const p = this.provider;
    this.agents = {
      planner:   new TestPlannerAgent(p),
      generator: new TestGeneratorAgent(p),
      healer:    new TestHealerAgent(p),
      recorder:  new RecorderAgent(p),
      inspector: new InspectorAgent(p),
      chat:      new ChatAgent(p),
      framework: new FrameworkAgent(p),
      export:    new ExportAgent(p),
      session:   new BrowserSessionAgent(p),
    };
  }

  setProvider(provider) {
    this.provider = provider;
    Object.values(this.agents).forEach(a => a.setProvider(provider));
  }

  async dispatch(agentName, input) {
    const agent = this.agents[agentName];
    if (!agent) throw new Error(`Unknown agent: ${agentName}`);

    const entry = { agent: agentName, input, startedAt: Date.now() };
    try {
      const result = await agent.run(input);
      entry.result = result;
      entry.duration = Date.now() - entry.startedAt;
      entry.status = 'success';
      this.executionLog.push(entry);
      return result;
    } catch (err) {
      entry.error = err.message;
      entry.status = 'error';
      this.executionLog.push(entry);
      throw err;
    }
  }

  // Collaborative workflow: Requirements → Plan → Code
  async runFullPipeline(requirement) {
    const log = [];
    log.push('🔍 Test Planner analyzing requirements...');
    const plan = await this.dispatch('planner', { text: requirement, inputType: 'feature' });
    log.push('✅ Test plan generated');

    log.push('⚡ Test Generator creating automation code...');
    const code = await this.dispatch('generator', { testPlan: plan, language: 'typescript', framework: 'pom' });
    log.push('✅ Playwright tests generated');

    return { plan, code, log };
  }

  getAgent(name) { return this.agents[name]; }
  getLog() { return this.executionLog; }
  clearLog() { this.executionLog = []; }
}
