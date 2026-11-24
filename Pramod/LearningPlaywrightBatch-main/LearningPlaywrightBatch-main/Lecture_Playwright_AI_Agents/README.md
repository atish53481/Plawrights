# Lecture - Playwright AI Agents: Automated Test Planning, Generation & Healing

## Overview

This lecture covers **Playwright's built-in AI Agents** — three powerful agents that automate the entire test creation lifecycle. You'll learn how AI agents **plan** tests by exploring applications, **generate** test code from plans, and **heal** broken tests automatically. This is the future of test automation.

## What You'll Learn

1. **What are AI Agents** - Definition, properties, and the agent loop
2. **Agentic Testing vs Traditional** - When to use AI-driven testing
3. **Playwright's 3 Built-in Agents** - Planner, Generator, Healer
4. **Test Planner Agent** - How it explores apps and creates test plans
5. **Test Generator Agent** - How it converts plans to executable tests
6. **Test Healer Agent** - How it diagnoses and fixes failing tests
7. **Agent Workflow** - The Plan → Generate → Heal lifecycle
8. **Prompt Engineering** - Writing effective agent prompts for testing
9. **Using Agents with LLMs** - Claude, GPT, and model considerations
10. **Future of AI in Testing** - Trends, risks, and career implications

## Folder Structure

```
learning/            - Core concepts: agents, workflows, prompt engineering (13 modules)
agents_project/      - Complete agent pipeline project with tests
ai_projects/         - 7 practical AI-powered testing projects
exercises/           - Hands-on practice exercises
notes/               - Quick reference guides
interview_questions/ - Interview preparation Q&A (60 questions)
```

## AI Projects (NEW)

| # | Project | What It Does | Run It |
|---|---------|-------------|--------|
| 1 | Natural Language Test Writer | English → Playwright specs | `node ai_projects/natural_language_test_writer/generate_tests.js` |
| 2 | Self-Healing Locators | Auto-fixes broken selectors | `npx playwright test ai_projects/self_healing_locators/tests/` |
| 3 | AI Visual Regression | Screenshot diff + HTML report | `node ai_projects/ai_visual_regression/capture_baseline.js` |
| 4 | Smart Test Reporter | Executive summary from results | `node ai_projects/smart_test_reporter/generate_summary.js` |
| 5 | Accessibility Audit Agent | WCAG compliance checker | `node ai_projects/accessibility_audit_agent/audit_crawler.js` |
| 6 | Autonomous Explorer | Finds bugs without scripts | `node ai_projects/autonomous_explorer/explorer_agent.js` |
| 7 | AI API Testing | Contract validation + mocks | `node ai_projects/ai_api_testing/api_contract_validator.js` |

## Prerequisites

- Node.js 18+ installed
- Playwright installed (`npm install`)
- Claude Code or compatible AI host (for running agents)
- Basic understanding of JavaScript and testing concepts

## Quick Start

### Run the Tests

```bash
# 1. Navigate to lecture directory
cd Lecture_Playwright_AI_Agents

# 2. Run all tests (expect 7 pass, 3 intentional failures)
npx playwright test

# 3. Run the agent pipeline demo
node agents_project/agents/full_agent_pipeline.js
```

### View Reports

```bash
# View Playwright HTML report
npx playwright show-report agents_project/reports/html-report

# View TTA custom report
open tta-report/index.html
```

## Learning Path

1. Start with `learning/01_What_Are_AI_Agents.md` — understand the fundamentals
2. Read through all learning files in order (01-13)
3. Explore `agents_project/` to see built-in Playwright agents in action
4. Run the agent pipeline: `node agents_project/agents/full_agent_pipeline.js`
5. **Try the 7 AI projects** in `ai_projects/` — each has its own README
6. Complete the exercises in `exercises/`
7. Review `notes/` for quick reference
8. Prepare for interviews with `interview_questions/`
