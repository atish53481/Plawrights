# What Are AI Agents?

## Introduction

An **AI Agent** is a software system that uses a large language model (LLM) as its reasoning
engine to autonomously perform tasks. Unlike simple chatbots that respond to a single prompt,
agents operate in a loop -- observing their environment, making decisions, taking actions, and
iterating until a goal is achieved.

In the context of software testing, AI agents can explore applications, generate test cases,
execute tests, and even fix failures -- all with minimal human intervention.

---

## Chatbot vs Assistant vs Agent

| Dimension          | Chatbot                  | Assistant                  | Agent                           |
|--------------------|--------------------------|----------------------------|---------------------------------|
| **Interaction**    | Single turn Q&A          | Multi-turn conversation    | Autonomous multi-step workflow  |
| **Memory**         | None or minimal          | Session-based context      | Persistent task memory          |
| **Tool Use**       | None                     | Limited (search, calc)     | Extensive (browser, editor, CLI)|
| **Decision Making**| Template-based           | LLM-guided responses       | LLM-guided actions and planning |
| **Autonomy**       | Fully reactive           | Reactive with suggestions  | Proactive and goal-driven       |
| **Iteration**      | One response per prompt  | Follows conversation flow  | Loops until task is complete     |
| **Error Handling** | Returns "I don't know"   | Asks for clarification     | Retries with different approach  |
| **Example**        | FAQ bot on a website     | ChatGPT, GitHub Copilot    | Playwright Test Planner Agent   |

---

## Key Properties of AI Agents

### 1. Autonomy
Agents operate independently once given a goal. They decide what steps to take, what tools
to use, and when the task is complete.

### 2. Tool Use
Agents interact with external systems through tools -- browsers, file editors, terminals,
APIs. This is what separates agents from plain LLM prompts.

### 3. Reasoning
Agents use the LLM to analyze observations, form hypotheses, and decide on next steps.
This chain-of-thought reasoning is the "brain" of the agent.

### 4. Iteration
Agents do not stop after one action. They loop continuously:
- Take an action
- Observe the result
- Decide the next action
- Repeat until the goal is met or a limit is reached

---

## The Agent Loop

```
  ┌─────────────────────────────────────────────┐
  │                                             │
  │   ┌───────────┐       ┌───────────┐         │
  │   │  OBSERVE  │──────▶│   THINK   │         │
  │   │           │       │ (Reason)  │         │
  │   └───────────┘       └─────┬─────┘         │
  │         ▲                   │               │
  │         │                   ▼               │
  │   ┌─────┴─────┐       ┌───────────┐         │
  │   │  REPEAT   │◀──────│    ACT    │         │
  │   │ (Loop)    │       │ (Use Tool)│         │
  │   └───────────┘       └───────────┘         │
  │                                             │
  │          Until goal is achieved              │
  └─────────────────────────────────────────────┘
```

**Observe**: The agent takes a snapshot of the current state (page DOM, console logs, etc.)
**Think**: The LLM reasons about what it sees and what to do next.
**Act**: The agent calls a tool (click a button, fill a form, write code).
**Repeat**: The loop continues until the objective is satisfied.

---

## Why Agents Matter for Testing

### Repetitive Tasks
Agents never get bored. They can run the same exploratory flows across hundreds of pages
without fatigue or shortcuts.

### Rule-Based Checks
Agents can enforce rules consistently -- "every form must have labels", "every API response
must return in under 2 seconds" -- across an entire application.

### Exploratory Testing
Traditional automation only tests what you script. Agents can discover flows, edge cases,
and UI states that humans might miss because they explore dynamically.

### Self-Healing
When selectors change or pages are redesigned, agents can adapt. They use the current page
snapshot to find elements rather than relying on hardcoded locators.

---

## Real-World Analogy

Think of an AI agent as a **junior QA engineer that never sleeps**:

- You give them a goal: "Test the login page"
- They open the browser and look at the page (Observe)
- They think about what test scenarios make sense (Think)
- They type credentials, click buttons, check results (Act)
- They move on to the next scenario (Repeat)

The difference? This junior QA engineer:
- Works 24/7 without breaks
- Never forgets a test case
- Can test across multiple browsers simultaneously
- Costs a fraction of a human tester per hour
- Gets smarter with better prompts (not training)

But like any junior engineer, they still need:
- Clear instructions (good prompts)
- Supervision (human review of results)
- Guardrails (limits on what they can do)

---

## Key Takeaway

AI agents are not magic -- they are LLMs in a loop with access to tools. Their power comes
from combining reasoning with real-world interaction. In testing, this means agents can
explore, generate, execute, and fix tests in ways that were previously impossible without
significant human effort.

---

*Next: [02 - Agentic Testing vs Traditional Testing](02_Agentic_Testing_vs_Traditional.md)*
