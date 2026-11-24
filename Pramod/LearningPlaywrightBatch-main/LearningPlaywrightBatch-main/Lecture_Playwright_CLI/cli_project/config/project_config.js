const path = require('path');

module.exports = {
  app: {
    name: 'The Internet - Herokuapp',
    baseURL: 'https://the-internet.herokuapp.com',
    credentials: { username: 'tomsmith', password: 'SuperSecretPassword!' },
  },
  cli: {
    defaultBrowser: 'chromium',
    browsers: ['chromium', 'firefox', 'webkit'],
    defaultWorkers: 1,
    defaultTimeout: 30000,
  },
  reporting: {
    reportsDir: path.join(__dirname, '..', 'reports'),
    tracesDir: path.join(__dirname, '..', 'traces'),
  },
};
