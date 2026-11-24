# Using Agents with LLMs

## Introduction

Playwright's built-in agents use the `model` field in their YAML frontmatter to specify
which LLM powers their reasoning. The choice of model significantly impacts cost,
speed, quality, and capability. This document covers model selection, cost management,
and practical considerations for running agents in real-world scenarios.

---

## The Model Field

In an agent's `.agent.md` file, the model is specified as:

```yaml
---
name: Test Planner
model: sonnet
---
```

The `model` value is resolved by the host (Claude Code, etc.) to a specific API model.
Common values and their mappings:

| Model Value  | Resolves To                  | Provider    |
|--------------|------------------------------|-------------|
| `sonnet`     | Claude Sonnet (latest)       | Anthropic   |
| `opus`       | Claude Opus (latest)         | Anthropic   |
| `haiku`      | Claude Haiku (latest)        | Anthropic   |
| `gpt-4`      | GPT-4 (latest)               | OpenAI      |
| `gpt-4o`     | GPT-4o                       | OpenAI      |

Playwright's built-in agents default to `sonnet` -- a balance of capability and cost.

---

## Running Agents with Claude Code

Claude Code is the primary host for Playwright agents. Here is how to invoke them:

### Running the Test Planner
```bash
# Claude Code will detect the agent and run it
claude "Plan tests for https://the-internet.herokuapp.com/login"

# Or explicitly reference the agent
claude --agent test-planner "Plan tests for https://example.com/dashboard"
```

### Running the Test Generator
```bash
# Generate tests from a plan
claude "Generate tests from the test plan in test-plan.md"

# Or explicitly
claude --agent test-generator "Generate tests from test-plan.md"
```

### Running the Test Healer
```bash
# Heal failing tests
claude "Fix the failing tests in tests/login.spec.ts"

# Or explicitly
claude --agent test-healer "Fix all failing Playwright tests"
```

### Running the Full Pipeline
```bash
# Plan, generate, and verify in sequence
claude "Plan and generate tests for https://example.com/login, then run them"
```

---

## Cost and Performance Considerations

### Model Comparison for Testing Tasks

| Model          | Speed      | Quality    | Cost per 1M tokens | Best For                    |
|----------------|------------|------------|---------------------|-----------------------------|
| **Haiku**      | Very Fast  | Good       | ~$0.25 input / $1.25 output | Simple healing, quick plans |
| **Sonnet**     | Fast       | Very Good  | ~$3 input / $15 output      | Default for all agents      |
| **Opus**       | Slower     | Excellent  | ~$15 input / $75 output     | Complex test design         |
| **GPT-4o**     | Fast       | Very Good  | ~$2.50 input / $10 output   | Alternative to Sonnet       |

### Cost Estimates Per Task

| Task                        | Typical Tokens   | Sonnet Cost (est.) |
|-----------------------------|------------------|--------------------|
| Plan one page               | ~10K-30K total   | $0.10 - $0.50     |
| Generate 5 tests            | ~20K-50K total   | $0.30 - $0.80     |
| Heal 3 failing tests        | ~15K-40K total   | $0.20 - $0.60     |
| Full pipeline (one feature) | ~50K-120K total  | $0.60 - $2.00     |

**Note**: Costs vary based on page complexity, number of test scenarios, and how many
agent loop iterations are needed.

---

## Token Usage Patterns in Agentic Testing

Agents use tokens differently than simple chat interactions:

### Input Tokens (What the Agent Reads)
- System prompt from `.agent.md` file (~500-2000 tokens)
- Browser snapshots (accessibility trees) (~1000-5000 tokens each)
- Tool results (test output, error messages) (~200-2000 tokens each)
- Conversation history (grows with each iteration) (~cumulative)

### Output Tokens (What the Agent Generates)
- Reasoning and analysis (~200-500 tokens per step)
- Tool calls (structured JSON) (~50-200 tokens each)
- Final output (test plan, test code) (~500-3000 tokens)

### The Accumulation Problem

Agent conversations grow with each iteration. By the 10th loop, the context window
contains all previous observations, actions, and results. This means:

```
Iteration 1:  ~3K tokens total
Iteration 5:  ~15K tokens total
Iteration 10: ~30K tokens total
Iteration 20: ~60K tokens total
```

**Mitigation strategies:**
- Set maximum iteration limits
- Use models with large context windows
- Summarize previous iterations periodically

---

## When to Use Different Models

### Use Haiku (Fast/Cheap) When:
- Running the healer on simple selector updates
- Quick smoke test generation
- Budget-constrained CI/CD pipelines
- The page is simple with few interactive elements

### Use Sonnet (Balanced) When:
- Running any agent for the first time on a page
- Generating tests for moderately complex features
- Standard healing of test failures
- Default choice for most use cases

### Use Opus (Powerful/Expensive) When:
- Testing complex multi-step workflows (checkout, onboarding)
- The application has complex state management
- You need edge cases that require deep reasoning
- Test plan quality is critical (the plan drives everything downstream)
- Debugging subtle timing or race condition issues

---

## Rate Limiting and Batching Strategies

### Rate Limiting

LLM APIs have rate limits. When running agents at scale:

```
Strategy 1: Sequential execution
  Run agents one at a time, with delays between runs.
  Simple but slow.

Strategy 2: Parallel with throttling
  Run up to N agents concurrently, queue the rest.
  Faster, requires orchestration.

Strategy 3: Batch and schedule
  Collect all test tasks, run agents during off-peak hours.
  Most cost-effective for non-urgent work.
```

### Batching Test Healing

Instead of healing one test at a time, batch failures:

```bash
# Run all tests, collect failures
npx playwright test --reporter=json > results.json

# Invoke healer with all failures at once
claude --agent test-healer "Fix all failures reported in results.json"
```

The healer can fix multiple tests in a single session, which is more token-efficient
than separate sessions for each failure.

---

## Local vs Cloud LLM Considerations

### Cloud LLMs (Anthropic API, OpenAI API)

| Pros                          | Cons                          |
|-------------------------------|-------------------------------|
| Best model quality            | Ongoing API costs             |
| No hardware requirements      | Data leaves your network      |
| Always up-to-date models      | Rate limits                   |
| Scales instantly               | Latency depends on network    |

### Local LLMs (Ollama, llama.cpp)

| Pros                          | Cons                          |
|-------------------------------|-------------------------------|
| No API costs after setup      | Lower quality than cloud      |
| Data stays on your machine    | Requires powerful GPU          |
| No rate limits                | Slower inference               |
| Works offline                  | Model updates are manual       |

### Recommendation

Use **cloud LLMs for planning and generation** (quality matters most) and consider
**local LLMs for healing** (simpler task, more iterations, cost adds up).

---

## Key Takeaway

Model selection is a trade-off between cost, speed, and quality. Start with Sonnet
for all agents, then optimize: upgrade to Opus for complex planning tasks, downgrade
to Haiku for simple healing tasks. Monitor your token usage and costs, and batch
agent runs when possible to maximize efficiency.

---

*Next: [10 - The Future of AI in Testing](10_Future_Of_AI_In_Testing.md)*
