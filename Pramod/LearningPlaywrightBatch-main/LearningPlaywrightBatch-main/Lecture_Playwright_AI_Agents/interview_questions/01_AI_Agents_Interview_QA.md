# AI Agents - Interview Questions & Answers

---

**Q1: What is an AI agent?**

A1: An AI agent is an autonomous software system powered by a large language model (LLM) that can perceive its environment, reason about tasks, and take actions using tools to achieve a specific goal. Unlike simple chatbots that respond to single prompts, agents operate in a loop: they observe, plan, act, and evaluate results before deciding the next step. This iterative cycle allows them to handle multi-step tasks without constant human guidance.

---

**Q2: What is the difference between an AI agent and a chatbot?**

A2: A chatbot typically handles single-turn or multi-turn conversations within a fixed dialogue flow and produces text responses. An AI agent goes further by having access to tools (file systems, browsers, APIs) and the ability to take autonomous actions in the real world. The key distinction is agency: a chatbot answers questions, while an agent completes tasks by executing multi-step plans and interacting with external systems.

---

**Q3: What is the agent loop and why is it important?**

A3: The agent loop is the core execution cycle of an AI agent: Observe the current state, Reason about what to do next, Act by calling a tool, and Evaluate the result. This loop repeats until the task is complete or the agent determines it cannot proceed. It is important because it enables the agent to handle dynamic situations, recover from errors, and adapt its strategy based on intermediate results rather than following a rigid script.

---

**Q4: How do AI agents use tools?**

A4: AI agents use tools by generating structured function calls that the runtime executes on their behalf. The agent receives a list of available tools with their descriptions and parameter schemas. When the agent decides it needs to perform an action (like navigating a browser or reading a file), it outputs a tool call with the appropriate parameters. The runtime executes the tool and returns the result to the agent, which then decides the next step.

---

**Q5: What is the difference between autonomy and automation in AI agents?**

A5: Automation follows predefined rules and scripts to execute repetitive tasks with no deviation. Autonomy means the agent can make decisions, choose between strategies, and adapt to unexpected situations. An automated script will fail if the environment changes, while an autonomous agent can observe the change, reason about it, and adjust its approach. Most practical AI agents operate on a spectrum between full automation and full autonomy.

---

**Q6: How do AI agents reason about tasks?**

A6: AI agents reason through chain-of-thought prompting, where the LLM breaks a complex task into smaller steps and thinks through each one before acting. The agent considers the current state, available tools, constraints, and past results to decide the best next action. Some agent frameworks use explicit planning stages where the agent writes out a plan before execution, while others interleave reasoning and action in each loop iteration.

---

**Q7: What are multi-agent systems and when would you use them?**

A7: Multi-agent systems use multiple specialized agents that collaborate to complete a complex task, with each agent responsible for a specific subtask. You would use them when a single agent's scope would be too broad, or when different parts of the workflow require different tools or expertise. Playwright's three-agent system (planner, generator, healer) is a practical example: each agent focuses on one phase of the testing lifecycle, leading to better results than a single do-everything agent.

---

**Q8: What are the common architectural patterns for AI agents?**

A8: The most common patterns are: ReAct (Reasoning + Acting in alternating steps), Plan-then-Execute (create a full plan before taking any action), and Hierarchical (a manager agent delegates to specialist agents). There are also patterns like self-reflection, where the agent critiques its own output before finalizing, and tool-augmented retrieval, where the agent searches for relevant information before acting. The choice of pattern depends on the task complexity and reliability requirements.

---

**Q9: What are the risks of using AI agents in production?**

A9: Key risks include hallucination (the agent confidently takes wrong actions), runaway execution (the agent enters an infinite loop or takes unintended destructive actions), cost overruns (each LLM call costs money), and security vulnerabilities (agents with file system or network access could be exploited). Mitigation strategies include setting execution limits, requiring human approval for destructive actions, implementing cost caps, and sandboxing agent tool access.

---

**Q10: What is hallucination in the context of AI agents, and how can you mitigate it?**

A10: Hallucination occurs when the LLM generates confidently stated but incorrect information, which for agents means taking actions based on false assumptions. In testing, an agent might assert a value that does not exist or write a locator for a non-existent element. Mitigation strategies include grounding the agent with real page snapshots, having the agent verify its assumptions before acting, requiring tool-based evidence for decisions, and implementing human review checkpoints.

---

**Q11: When should you use AI agents vs. traditional automation?**

A11: Use AI agents when the task involves exploration, judgment, or adaptation to changing environments, such as testing a frequently changing UI or generating test plans for unfamiliar pages. Use traditional automation when the workflow is well-defined, deterministic, and cost-sensitive, such as running a stable regression suite in CI/CD. Agents excel at creative and exploratory work; traditional automation excels at reliable, repeatable execution.

---

**Q12: How do you evaluate the performance of an AI agent?**

A12: Agent evaluation considers task completion rate (did it achieve the goal?), accuracy (were the actions and outputs correct?), efficiency (how many steps and tool calls did it take?), cost (total LLM token usage), and robustness (does it handle edge cases gracefully?). For testing agents specifically, you also measure test pass rate of generated code, locator resilience, and the ratio of tests requiring manual intervention after agent processing.

---

**Q13: What are the cost considerations when using AI agents?**

A13: Every LLM call in the agent loop consumes tokens, and complex tasks can require dozens of iterations. Costs depend on the model used (larger models are more expensive but more capable), the number of tool calls, and the amount of context passed in each call. For testing agents, costs accumulate when the agent takes browser snapshots (large context) or processes long test files. Teams should set token budgets, use smaller models where possible, and cache results to control costs.

---

**Q14: Name three popular AI agent frameworks.**

A14: LangChain/LangGraph provides a flexible framework for building agents with various LLM backends and tool integrations. CrewAI specializes in multi-agent collaboration with role-based agent definitions. Anthropic's Claude Code SDK enables agents that can interact with codebases, terminals, and browsers. Other notable frameworks include AutoGen (Microsoft), Semantic Kernel, and OpenAI's Assistants API. Each framework offers different tradeoffs between flexibility, ease of use, and built-in capabilities.

---

**Q15: What is the Model Context Protocol (MCP) and how does it relate to agents?**

A15: MCP is an open protocol that standardizes how AI applications connect to external tools and data sources. Instead of each agent framework implementing custom tool integrations, MCP provides a universal interface that any agent can use to access any MCP-compatible tool server. This means an agent built with one framework can use the same MCP tools as an agent built with another framework, promoting interoperability and reducing integration effort.

---

**Q16: What is agent orchestration?**

A16: Agent orchestration is the process of coordinating multiple agents to work together on a complex task. This involves defining the order of agent execution, passing outputs from one agent as inputs to the next, handling failures and retries, and managing shared state. In Playwright's agent system, orchestration means running the planner first, feeding its output to the generator, and invoking the healer when tests fail. Orchestration can be manual (human triggers each agent) or automated (a pipeline script runs them sequentially).

---

**Q17: What is human-in-the-loop and why is it important for AI agents?**

A17: Human-in-the-loop means a human reviews and approves agent actions at critical decision points before they are executed. This is important because AI agents can make mistakes that are costly to reverse, such as deleting files, modifying production data, or committing broken code. By requiring human approval for high-impact actions while letting the agent handle routine steps autonomously, teams get the efficiency benefits of agents with the safety guarantees of human oversight.

---

**Q18: What are the challenges of testing AI agents themselves?**

A18: Testing AI agents is inherently difficult because their behavior is non-deterministic; the same input can produce different actions due to LLM randomness. Challenges include creating reproducible test scenarios, measuring partial success (the agent got 4 out of 5 steps right), handling external dependencies (live websites, APIs), and defining pass/fail criteria for open-ended tasks. Common approaches include using deterministic seeds, snapshot testing of tool call sequences, and evaluating against rubrics rather than exact outputs.

---

**Q19: What is the future direction of AI agents?**

A19: The field is moving toward more reliable and specialized agents with better tool use, longer context windows, and multimodal capabilities (understanding screenshots, not just text). Key trends include standardized protocols like MCP for tool integration, fine-tuned models optimized for agent tasks, better safety frameworks, and tighter integration with development workflows. In testing specifically, agents are evolving from assistants that help write tests to autonomous systems that maintain entire test suites.

---

**Q20: How do you handle an AI agent that gets stuck in a loop?**

A20: Prevention is the first line of defense: set maximum iteration limits, token budgets, and time limits for agent execution. Detection involves monitoring for repeated tool calls with identical parameters or oscillating between two states. Recovery strategies include forcing the agent to summarize its progress and reassess its approach, escalating to a human operator, or terminating the agent and falling back to a simpler strategy. Well-designed agent prompts include explicit instructions for what to do when progress stalls.
