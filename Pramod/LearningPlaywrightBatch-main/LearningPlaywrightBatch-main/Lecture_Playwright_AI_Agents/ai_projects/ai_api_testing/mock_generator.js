#!/usr/bin/env node
/**
 * Mock Generator
 * Generates mock API responses from contract definitions
 * Optionally starts a local mock server
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

const GREEN = '\x1b[32m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

const PORT = 3456;

/**
 * Generate mock HTML response from contract
 */
function generateMockResponse(contract) {
  const elements = (contract.requiredElements || []).map(el => {
    if (el === 'form') return '<form action="#" method="post"><input name="test" /><button type="submit">Submit</button></form>';
    if (el === 'input') return '';
    if (el === 'button') return '';
    if (el === 'h1') return `<h1>${contract.name}</h1>`;
    if (el === 'ul') return '<ul><li>Mock item 1</li><li>Mock item 2</li></ul>';
    if (el === 'a') return '<a href="/">Home</a>';
    return `<${el}>Mock ${el}</${el}>`;
  }).filter(Boolean).join('\n    ');

  const texts = (contract.requiredText || []).map(t => `<p>${t}</p>`).join('\n    ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Mock: ${contract.name}</title>
</head>
<body>
  <div id="content">
    <h2>Mock Response: ${contract.name}</h2>
    ${elements}
    ${texts}
    <p><em>This is a mock response generated from API contract.</em></p>
  </div>
</body>
</html>`;
}

/**
 * Generate all mocks and save to files
 */
function generateAllMocks() {
  console.log(`\n${CYAN}╔═══════════════════════════════════════════════════════════════╗${RESET}`);
  console.log(`${CYAN}║          ${BOLD}API Mock Generator${RESET}${CYAN}                                  ║${RESET}`);
  console.log(`${CYAN}╚═══════════════════════════════════════════════════════════════╝${RESET}\n`);

  const contractsPath = path.join(__dirname, 'contracts', 'api_contracts.json');
  const { contracts } = JSON.parse(fs.readFileSync(contractsPath, 'utf-8'));
  const mocksDir = path.join(__dirname, 'mocks');

  if (!fs.existsSync(mocksDir)) fs.mkdirSync(mocksDir, { recursive: true });

  const mocks = [];

  for (const contract of contracts) {
    const mockHtml = generateMockResponse(contract);
    const fileName = contract.name.toLowerCase().replace(/\s+/g, '_') + '.html';
    const filePath = path.join(mocksDir, fileName);

    fs.writeFileSync(filePath, mockHtml);
    mocks.push({
      name: contract.name,
      endpoint: contract.endpoint,
      method: contract.method,
      status: contract.expectedStatus,
      contentType: contract.expectedContentType || 'text/html',
      file: fileName,
      body: mockHtml,
    });

    console.log(`${GREEN}  ✓${RESET} ${BOLD}${contract.name}${RESET} → ${DIM}mocks/${fileName}${RESET}`);
  }

  // Save mock registry
  const registryPath = path.join(mocksDir, 'registry.json');
  fs.writeFileSync(registryPath, JSON.stringify(mocks.map(m => ({
    name: m.name,
    endpoint: m.endpoint,
    method: m.method,
    status: m.status,
    file: m.file,
  })), null, 2));

  console.log(`\n${CYAN}  Generated ${mocks.length} mock responses${RESET}`);
  console.log(`${CYAN}  📁 Output: ${mocksDir}${RESET}\n`);

  return mocks;
}

/**
 * Start a local mock server
 */
function startMockServer(mocks) {
  const server = http.createServer((req, res) => {
    const mock = mocks.find(m =>
      m.endpoint === req.url && m.method === req.method
    );

    if (mock) {
      res.writeHead(mock.status, { 'Content-Type': mock.contentType });
      res.end(mock.body);
    } else if (req.url === '/') {
      // Serve index page listing all mocks
      const links = mocks.map(m => `<li><a href="${m.endpoint}">${m.name}</a> (${m.method} ${m.endpoint})</li>`).join('\n');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`<html><body><h1>Mock API Server</h1><ul>${links}</ul></body></html>`);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Mock not found');
    }
  });

  server.listen(PORT, () => {
    console.log(`${GREEN}${BOLD}  Mock server running at http://localhost:${PORT}${RESET}`);
    console.log(`${DIM}  Press Ctrl+C to stop${RESET}\n`);
  });

  return server;
}

// Main
const mocks = generateAllMocks();

if (process.argv.includes('--serve')) {
  startMockServer(mocks);
} else {
  console.log(`${DIM}  To start mock server: ${YELLOW}node mock_generator.js --serve${RESET}\n`);
}
