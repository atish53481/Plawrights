# Agentic Testing - Interview Questions & Answers

---

**Q1: What is agentic testing?**

A1: Agentic testing is an approach to software testing where AI agents autonomously plan, create, execute, and maintain automated tests. Unlike traditional automation where humans write every test script, agentic testing uses LLM-powered agents that can explore applications, generate test code, and self-heal broken tests. The human role shifts from writing tests to reviewing agent output, setting quality standards, and handling edge cases the agents cannot resolve.

---

**Q2: What are self-healing tests and how do they work?**

A2: Self-healing tests automatically detect when they fail due to application changes and repair themselves without manual intervention. They work by analyzing the failure (wrong selector, changed text, moved element), navigating to the live application to observe its current state, generating a corrected locator or assertion, and verifying the fix by re-running the test. The key enabler is AI reasoning: the healer understands why the test broke and what the correct fix should be, rather than blindly retrying.

---

**Q3: How does AI-generated test maintenance differ from manual test maintenance?**

A3: Manual test maintenance requires a QA engineer to read failure reports, identify root causes, understand the application change, and update test code. This is time-consuming and scales poorly with large test suites. AI-generated maintenance automates the diagnosis and repair cycle, handling routine breakage (selector changes, text updates) in seconds rather than hours. However, AI maintenance struggles with business logic changes and requires human review for correctness, making it a complement to rather than a replacement for human maintenance.

---

**Q4: How does agentic testing compare to record-and-playback tools?**

A4: Record-and-playback tools capture user interactions and replay them as tests, producing brittle scripts tied to exact element positions and attributes. Agentic testing uses AI reasoning to understand the purpose of interactions and generate more resilient tests with semantic locators and meaningful assertions. Record-and-playback requires manual cleanup of generated code, while agentic testing produces cleaner output by understanding testing best practices. However, record-and-playback is deterministic and free, while agentic testing is non-deterministic and incurs LLM costs.

---

**Q5: What role does prompt engineering play in agentic testing?**

A5: Prompt engineering is critical because the quality of agent output directly depends on the instructions and context provided. Well-crafted prompts specify the target URL, testing scope, expected locator strategies, assertion types, and output format. Poor prompts lead to vague test plans, brittle locators, and missing edge cases. QA engineers who master prompt engineering can get significantly better results from the same agents, making it an essential skill for agentic testing adoption.

---

**Q6: What are the cost implications of AI-powered testing?**

A6: AI-powered testing incurs costs for every LLM API call, with costs scaling by model size and context length. A single agent run can make dozens of LLM calls, each processing thousands of tokens (especially when browser snapshots are included). For a large test suite, daily healing runs could cost hundreds of dollars monthly. Teams must balance model capability against cost: use cheaper models for routine tasks and reserve expensive models for complex reasoning. Token budgets and caching strategies help control spending.

---

**Q7: How reliable are AI-generated tests compared to human-written tests?**

A7: AI-generated tests are generally reliable for straightforward interactions (clicking buttons, filling forms, verifying text) but less reliable for complex business logic, multi-step workflows, and edge cases that require domain knowledge. Studies show AI-generated tests achieve 70-85% first-run pass rates, with most failures due to timing issues or incorrect locators rather than fundamental logic errors. The best approach is to use AI generation as a starting point and apply human review for production readiness.

---

**Q8: How can agentic testing be integrated into CI/CD pipelines?**

A8: Integration involves several strategies: running the healer agent as a post-failure step that automatically attempts to fix broken tests before notifying the team, using the planner and generator in a nightly job to create tests for newly deployed features, and setting up guardrails (cost limits, time limits, approval gates) to prevent runaway agent execution. The agent output (fixed files, new tests) can be committed to a branch for human review before merging, maintaining quality control while automating the bulk of the work.

---

**Q9: What is a hybrid human-AI testing approach?**

A9: A hybrid approach divides testing responsibilities between AI agents and human testers based on their strengths. AI handles repetitive, high-volume tasks: generating boilerplate tests, maintaining selectors, running exploratory scans across pages. Humans handle tasks requiring judgment: defining test strategies, reviewing generated code, testing complex business workflows, and making decisions about edge cases. This approach maximizes efficiency while maintaining the critical thinking that pure AI testing lacks.

---

**Q10: Can AI agents perform visual testing?**

A10: AI agents can perform basic visual testing by taking screenshots and using multimodal LLMs to analyze them for obvious issues (missing elements, broken layouts, overlapping text). However, they are not as precise as dedicated visual testing tools like Percy or Applitools, which use pixel-level comparison with configurable thresholds. AI visual testing is better for exploratory checks ("does this page look right?") while dedicated tools are better for regression detection ("did anything change from the baseline?").

---

**Q11: How can AI agents be used for API testing?**

A11: AI agents can generate API tests by reading API documentation or OpenAPI/Swagger specifications, then producing test code that covers endpoint validation, request/response schema checks, error handling, and boundary conditions. They can also explore APIs dynamically by making calls and observing responses. However, API testing often requires understanding of business rules, authentication flows, and data dependencies that agents may not fully grasp without extensive context. Agents work best for generating boilerplate API test structure that humans then refine.

---

**Q12: How does AI assist with test planning and test strategy?**

A12: AI agents can analyze an application's pages, identify testable elements and user flows, and generate comprehensive test plans that a human might take hours to produce. They excel at systematic coverage: listing every interactive element, considering standard edge cases (empty inputs, special characters, boundary values), and organizing scenarios logically. The limitation is strategic thinking: AI plans tend to be thorough but generic, while human-created plans incorporate business priorities, risk assessment, and domain-specific knowledge.

---

**Q13: What are the common coverage gaps in AI-generated tests?**

A13: AI-generated tests commonly miss: business rule validation (the agent does not know your domain rules), cross-feature interactions (testing checkout requires understanding inventory), non-functional requirements (performance, accessibility beyond basic checks), error recovery flows (what happens after a network timeout?), and stateful scenarios (tests that depend on specific database state). These gaps occur because the agent's knowledge is limited to what it can observe on the page and what is provided in the prompt.

---

**Q14: How does model selection affect testing agent performance?**

A14: Larger, more capable models (like Opus) produce more accurate test plans, better locators, and more reliable healing, but cost more and run slower. Smaller models (like Haiku) are faster and cheaper but may miss edge cases, produce brittle locators, or fail to diagnose complex test failures. The optimal strategy is to match model size to task complexity: use smaller models for routine generation and maintenance, and reserve larger models for planning complex test suites or healing difficult failures.

---

**Q15: When should you NOT use AI agents for testing?**

A15: Avoid AI agents for: safety-critical systems where test correctness must be formally verified, compliance testing that requires auditable human sign-off, performance and load testing (agents add overhead and non-determinism), tests involving sensitive data (LLM calls may transmit data to external APIs), and situations where the cost of LLM usage exceeds the time saved. Also avoid agents when your team lacks the expertise to review AI-generated code, as unreviewed agent output can introduce subtle bugs.

---

**Q16: What regulatory and compliance concerns exist around AI-generated tests?**

A16: Regulated industries (healthcare, finance, aviation) often require documented evidence that tests were created and reviewed by qualified humans. AI-generated tests raise questions about accountability (who is responsible when an AI-generated test misses a defect?), auditability (can you trace the reasoning behind each test?), and data privacy (do browser snapshots sent to LLM APIs contain sensitive user data?). Teams in regulated environments typically use AI agents for drafting tests but require formal human review and approval before the tests are considered valid.

---

**Q17: How should QA teams be trained to work with AI testing tools?**

A17: Training should cover three areas: prompt engineering (how to communicate effectively with agents), output review (how to evaluate AI-generated tests for correctness and completeness), and tool integration (how to set up and run agents in the development workflow). Teams should start with supervised use where every agent output is reviewed, then gradually increase autonomy as confidence grows. Training should emphasize that AI is a tool to augment their expertise, not replace it, and that human judgment remains essential for test strategy and quality assurance.

---

**Q18: How do you measure the ROI of AI-powered testing?**

A18: Measure ROI by comparing the cost of AI testing (LLM API fees, setup time, review time) against the cost of manual testing (engineer hours for test creation, maintenance, and debugging). Key metrics include: time saved per test created, time saved per test healed, reduction in test maintenance backlog, test coverage improvement, and defect detection rate. Most teams see the highest ROI in maintenance (healing broken tests) rather than creation, because maintenance is repetitive and scales linearly with suite size.

---

**Q19: How will AI agents affect the future of QA careers?**

A19: AI agents will shift QA roles from manual test writing toward test strategy, agent supervision, and quality architecture. QA engineers will need skills in prompt engineering, AI output evaluation, and understanding LLM capabilities and limitations. Junior-level tasks (writing simple test scripts, updating selectors) will be increasingly automated, while senior-level tasks (designing test architectures, defining quality standards, handling complex edge cases) will grow in importance. The career path evolves from "test writer" to "test strategist and AI supervisor."

---

**Q20: What are the challenges of scaling agentic testing across a large organization?**

A20: Scaling challenges include: cost management (hundreds of developers using LLM-powered agents can quickly become expensive), consistency (different teams may get different quality results depending on their prompts), governance (ensuring AI-generated tests meet organizational standards), infrastructure (providing agent access to staging environments, test data, and CI/CD systems), and cultural adoption (convincing experienced QA engineers to trust and supervise AI output rather than writing tests manually). Successful scaling requires centralized prompt templates, cost monitoring, quality gates, and a dedicated team to manage the AI testing platform.
