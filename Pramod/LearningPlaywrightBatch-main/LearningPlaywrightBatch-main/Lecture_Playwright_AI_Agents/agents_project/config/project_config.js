const path = require('path');

module.exports = {
  app: {
    name: 'The Internet - Herokuapp',
    baseURL: 'https://the-internet.herokuapp.com',
    credentials: { username: 'tomsmith', password: 'SuperSecretPassword!' },
  },
  agents: {
    plannerPath: path.join(__dirname, '..', '..', 'node_modules', 'playwright', 'lib', 'agents', 'playwright-test-planner.agent.md'),
    generatorPath: path.join(__dirname, '..', '..', 'node_modules', 'playwright', 'lib', 'agents', 'playwright-test-generator.agent.md'),
    healerPath: path.join(__dirname, '..', '..', 'node_modules', 'playwright', 'lib', 'agents', 'playwright-test-healer.agent.md'),
  },
  reporting: {
    reportsDir: path.join(__dirname, '..', 'reports'),
    plansDir: path.join(__dirname, '..', 'plans'),
    generatedDir: path.join(__dirname, '..', 'generated'),
    healedDir: path.join(__dirname, '..', 'healed'),
  },
};
