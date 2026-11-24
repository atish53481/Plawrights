# Playwright Platform — Run Jenkins jobs inside the official Playwright Docker image

## Role

You are a senior DevOps and full-stack engineer working in the existing `PlaywrightExt` repo.
Sub-project 4 ("Platform Jenkins Execution") is already implemented on `feat/platform-jenkins`:
- spec: `docs/superpowers/specs/2026-10-03-platform-jenkins-design.md`
- plan: `docs/superpowers/plans/2026-10-03-platform-jenkins.md`

Today the generated pipeline runs on a Windows agent with `bat` steps. It runs `npm install` and
`npx playwright install chromium` on the agent itself, and needs Node.js on the agent's PATH.

**Goal:** change only *where the tests execute*. Each Jenkins build must run `npx playwright test`
inside the official Playwright Docker image (`mcr.microsoft.com/playwright`) on the user's own
machine. This is free and unlimited: no cloud service and no paid runner. Everything else about runs
stays the same:
- the extension drives runs
- the server triggers Jenkins
- the build pulls the script with a one-time run token
- status comes only from Jenkins

Do not rebuild sub-project 4. Do not change the extension's behaviour, the web app, the Bridge,
or the Orchestrator.

## Work order

1. **Inspect first, change nothing.** Read the Jenkins spec and plan, plus these files:
   - `server/src/jenkins/pipeline.ts`
   - `server/src/jenkins/jenkins-client.ts`
   - `server/src/services/execution-service.ts`
   - `server/src/services/jenkins-service.ts`
   - `server/test/jenkins-client.test.ts`
   - `server/test/jenkins-stub.ts`
   - `server/src/config.ts`
   - `PlaywrightPlatform/README.md`

   Then summarise what the pipeline does today and which tests pin its text.
2. **Write a short design spec** at `docs/superpowers/specs/2026-10-04-platform-jenkins-docker-design.md`
   covering the decisions below. Stop and show it to me before planning.
3. **Write an implementation plan** at `docs/superpowers/plans/2026-10-04-platform-jenkins-docker.md`
   in the same style as the earlier plans: tasks, failing test first, exact files, expected output.
4. **Implement task by task** on branch `feat/platform-jenkins-docker`, cut from `feat/platform-jenkins`.
   Run tests after each task and commit after each task.

## Required design (decide anything not covered here, and list each decision in the spec)

### 1. Docker via `docker run`, not the Docker Pipeline plugin
- The pipeline calls `docker run --rm ...` from the agent's shell. It must not use `agent { docker { } }`.
  Mounting workspaces through that plugin is unreliable on Windows agents with Docker Desktop.
- One pipeline works on both agent types. Use `isUnix()` to choose `sh` or `bat`, and write each
  command once through a small Groovy helper. Keep the existing `@` prefix on Windows lines that
  carry the token.
- Mount the workspace at `/work` and set `-w /work`. On Windows, the path is `%WORKSPACE%`.
  Document that Docker Desktop must share that drive. With the WSL2 backend it is shared by default.
- Recommended flags: `--init` and `--ipc=host` (Chromium needs it). On Linux, also add
  `-u <uid>:<gid>` and `-e HOME=/tmp`. Without the user flag, files the container creates are owned
  by root and `deleteDir()` fails on the next build.
- Use a named volume for the npm cache (for example `-v playwright-npm-cache:/tmp/.npm` with
  `npm_config_cache=/tmp/.npm`), so builds after the first are fast.

### 2. Image and version pinning
- Add the server setting `PLAYWRIGHT_DOCKER_IMAGE` in `config.ts` and `.env.example`, with a default
  like `mcr.microsoft.com/playwright:v1.XX.X-noble`.
  - Look up the current stable tag. Do not guess it.
  - Validate the value with a strict regex (registry/name:tag, no spaces or shell metacharacters).
- Pass the image to the build as a new string job parameter `PLAYWRIGHT_IMAGE`, alongside
  `EXECUTION_ID`, `PLATFORM_URL`, and `RUN_TOKEN`. Declare it in `jobConfigXml()`, the same way as
  the other three.
- The generated `package.json` must pin `@playwright/test` to the **exact** version in the image tag.
  Derive the version from the tag in code. A mismatch makes Playwright look for browsers the image
  does not have.
- Remove `npx playwright install chromium`. The image already contains the browsers.
- Remove the requirement for Node.js on the agent. The agent needs only Docker and `curl`.

### 3. Networking and the run token: the container never talks to the platform
- The **agent** downloads the script with `curl`, exactly as today, before the container starts.
- The **container** gets no `RUN_TOKEN` and no `PLATFORM_URL`. It runs `npm install`, then
  `npx playwright test`, then the existing result-summary script.
  - Change that script so it **writes** `result-body.json` instead of POSTing it.
- The **agent** then POSTs `result-body.json` with
  `curl -sS -f -X POST -H "Content-Type: application/json" -H "Authorization: Bearer ..." --data-binary @result-body.json`.
- This avoids `host.docker.internal` and server binding problems: with the default
  `PLATFORM_PUBLIC_URL=http://127.0.0.1:3000`, 127.0.0.1 inside a container is the container itself.
  It also keeps the token out of the container.
- A test must assert that no `docker run` line in the pipeline mentions `RUN_TOKEN` or `PLATFORM_URL`.

### 4. Status rules stay as they are
- A non-zero exit from the container's test command marks the build `UNSTABLE`. Any other stage
  failing gives `FAILURE`.
- The existing status mapping is unchanged.
- Archive `playwright-report/**` as today.

### 5. Preflight and clearer errors
- Add a first stage `Preflight` that runs `docker version` and `docker image inspect` or
  `docker pull` for the image.
- On failure, the agent posts `{ total: 0, passed: 0, failed: 0, skipped: 0, errorMessage }` with a
  plain reason, for example: "Docker is not available on the Jenkins agent" or "Could not pull
  mcr.microsoft.com/playwright:...". Then it fails the build.
- In `ExecutionService.finish`, when the outcome is `ERROR` because of `FAILURE` with no tests and
  the build already reported an error message, keep that message instead of the generic
  "The build failed before the tests ran…". Pin this with a test.

### 6. Keep everything else unchanged
- No new endpoints and no extension changes.
- No migration, unless the spec shows one is unavoidable. If it is, add a new migration file and
  never edit a shipped one.
- Existing jobs pick up the new definition when an ADMIN presses **Create Job** again. Say so in
  the README.

## Tests (TDD; all must pass)

Server, using Vitest and the existing Jenkins stub:
- Pipeline text:
  - uses `docker run`
  - uses `isUnix()` with both `sh` and `bat` branches
  - mounts `/work`
  - passes `--ipc=host`
  - uses the npm cache volume
  - uses the `PLAYWRIGHT_IMAGE` parameter
  - has no `playwright install` step
  - no `docker run` line contains `RUN_TOKEN` or `PLATFORM_URL`
  - the result is POSTed by `curl` from the agent
- `jobConfigXml()`: declares four parameters, and the markup inside the script is escaped.
- Generated `package.json`: pins `@playwright/test` to the image tag's version. Cover several tags
  in a table-driven test, including `-noble` and `-jammy` suffixes.
- Config: default image; an invalid image value is rejected; a run passes `PLAYWRIGHT_IMAGE` to Jenkins.
- Preflight message preserved: a `FAILURE` build with a reported error message and zero tests ends
  as `ERROR` with that message.
- The whole existing suite stays green.

Run:
- `npm run typecheck`, `npm test`, and `npm run build` in `PlaywrightPlatform/`
- `node --test "PlaywrightExtension/tests/*.test.mjs"`

Confirm with `git diff --stat` that `PlaywrightPlatform/web`, `PlaywrightBridge`, and
`PlaywrightOrchestrator` are untouched.

## Documentation

Update `PlaywrightPlatform/README.md` ("Run a script on Jenkins"):
- **What the Jenkins machine needs:**
  - Docker (Docker Desktop on Windows with Linux containers, or Docker Engine on Linux)
  - `curl`
  - the Pipeline plugin
  - the Jenkins service account must be allowed to run `docker`: the `docker` group on Linux,
    or Docker Desktop running for that user on Windows
  - Node.js is no longer needed on the agent
- How to change `PLAYWRIGHT_DOCKER_IMAGE`, and why the tag and `@playwright/test` must match.
- First build pulls the image (about 1–2 GB), so it is slow. Later builds reuse it and the npm cache.
- Troubleshooting rows:
  - "Docker is not available on the Jenkins agent"
  - image pull fails (proxy or offline)
  - permission denied on `/var/run/docker.sock`
  - Windows drive not shared with Docker Desktop
  - root-owned files in the workspace on Linux

Also update `.env.example` and the Jenkins line in `CLAUDE.md`.

## Final check against my real Jenkins (needs me; do not mark it verified without it)

Jenkins runs at `http://localhost:7070`. Prepare a checklist for me:
1. `docker version` works for the account Jenkins runs as.
2. In the extension: Settings → Jenkins → **Test Connection** → **Create Job**. The job now has the
   `PLAYWRIGHT_IMAGE` parameter.
3. Run a passing script. The console log shows `docker run mcr.microsoft.com/playwright:...`, and
   the panel shows Passed with counts and a report link.
4. Run a failing script. The panel shows Failed with the first failure message.
5. Stop Docker Desktop and run again. The panel shows Error: "Docker is not available on the
   Jenkins agent".
6. Search the console log for `Bearer`. No token value appears.
7. Run again after a successful run. It is noticeably faster: no image pull, and the npm cache is
   reused.

Report anything you could not verify as **not verified**, with the reason.