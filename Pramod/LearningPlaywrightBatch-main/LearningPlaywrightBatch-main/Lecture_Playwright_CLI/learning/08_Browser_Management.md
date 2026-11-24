# Browser Management - install

## Overview

Playwright bundles its own browser binaries (Chromium, Firefox, WebKit). The `npx playwright install` command downloads these binaries to your system. Browsers must be installed before tests can run.

---

## Install Commands

| Command | Description |
|---------|-------------|
| `npx playwright install` | Install all configured browsers |
| `npx playwright install chromium` | Install only Chromium |
| `npx playwright install firefox` | Install only Firefox |
| `npx playwright install webkit` | Install only WebKit |
| `npx playwright install --with-deps` | Install browsers and OS-level dependencies |
| `npx playwright install chromium --with-deps` | Install Chromium and its OS dependencies |
| `npx playwright install --dry-run` | Show what would be installed without downloading |

---

## Browser Channels

In addition to the bundled browsers, Playwright can use installed "branded" browsers via channels:

| Channel | Browser Used |
|---------|-------------|
| `chrome` | Google Chrome (stable) |
| `chrome-beta` | Google Chrome Beta |
| `chrome-dev` | Google Chrome Dev |
| `chrome-canary` | Google Chrome Canary |
| `msedge` | Microsoft Edge (stable) |
| `msedge-beta` | Microsoft Edge Beta |
| `msedge-dev` | Microsoft Edge Dev |
| `msedge-canary` | Microsoft Edge Canary |

### Using channels in config

```javascript
// playwright.config.js
export default {
  projects: [
    {
      name: 'Google Chrome',
      use: { channel: 'chrome' },
    },
    {
      name: 'Microsoft Edge',
      use: { channel: 'msedge' },
    },
  ],
};
```

### Using channels from CLI

```bash
npx playwright test --project "Google Chrome"
```

**Note:** Channels use the browser already installed on your system. They are not downloaded by `npx playwright install`.

---

## Where Browsers are Stored

Playwright stores downloaded browsers in a cache directory:

| OS | Default Path |
|----|-------------|
| macOS | `~/Library/Caches/ms-playwright` |
| Linux | `~/.cache/ms-playwright` |
| Windows | `%LOCALAPPDATA%\ms-playwright` |

You can customize the location with the `PLAYWRIGHT_BROWSERS_PATH` environment variable:

```bash
# Store browsers in a custom directory
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers npx playwright install

# Use the same path when running tests
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers npx playwright test
```

---

## Browser Versions

Playwright pins specific browser versions for each release to ensure consistent behavior:

| Playwright Version | Chromium | Firefox | WebKit |
|-------------------|----------|---------|--------|
| 1.49.x | 131.x | 133.x | 18.2 |
| 1.48.x | 130.x | 132.x | 18.2 |
| 1.47.x | 129.x | 130.x | 18.0 |
| 1.46.x | 128.x | 129.x | 18.0 |

> These are approximate. Check `npx playwright --version` and the [Playwright releases page](https://github.com/microsoft/playwright/releases) for exact versions.

To see which browsers are currently installed:

```bash
npx playwright install --dry-run
```

---

## System Dependencies (--with-deps)

On Linux, browsers require system libraries (e.g., `libgbm`, `libatk`, `libcups`). The `--with-deps` flag installs them automatically:

```bash
# Install browsers AND required system packages
npx playwright install --with-deps

# Install only Chromium and its dependencies
npx playwright install chromium --with-deps
```

This requires `sudo` permissions on Linux. On macOS and Windows, system dependencies are generally not needed.

---

## Docker

Playwright provides official Docker images with browsers pre-installed:

```bash
# Pull the official Playwright Docker image
docker pull mcr.microsoft.com/playwright:v1.49.0-noble

# Run tests inside the container
docker run --rm -v $(pwd):/app -w /app mcr.microsoft.com/playwright:v1.49.0-noble \
  npx playwright test
```

### Docker Image Naming Convention

```
mcr.microsoft.com/playwright:v<version>-<os>
```

| Tag | Description |
|-----|-------------|
| `v1.49.0-noble` | Ubuntu 24.04 (Noble) with Playwright 1.49.0 |
| `v1.49.0-jammy` | Ubuntu 22.04 (Jammy) with Playwright 1.49.0 |

### Dockerfile Example

```dockerfile
FROM mcr.microsoft.com/playwright:v1.49.0-noble

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

CMD ["npx", "playwright", "test"]
```

---

## CI Considerations

### GitHub Actions

```yaml
- name: Install Playwright Browsers
  run: npx playwright install --with-deps
```

### Caching Browsers in CI

```yaml
- name: Cache Playwright browsers
  uses: actions/cache@v4
  with:
    path: ~/.cache/ms-playwright
    key: playwright-${{ hashFiles('package-lock.json') }}

- name: Install Playwright (skip if cached)
  run: npx playwright install --with-deps
```

### Using Docker in CI

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright:v1.49.0-noble
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx playwright test
```

---

## Uninstalling / Cleaning Up Browsers

```bash
# Remove all Playwright browser caches
rm -rf ~/Library/Caches/ms-playwright     # macOS
rm -rf ~/.cache/ms-playwright             # Linux
```

There is no built-in `npx playwright uninstall` command.

---

## Tips

- Always run `npx playwright install` after updating the `@playwright/test` package.
- Use `--with-deps` on Linux CI environments to avoid missing library errors.
- Use Docker images in CI to avoid browser installation entirely.
- Set `PLAYWRIGHT_BROWSERS_PATH` for shared or custom installation directories.

---

## Next Steps

Continue to [09_Config_vs_CLI_Flags.md](./09_Config_vs_CLI_Flags.md) to learn the relationship between config options and CLI flags.
