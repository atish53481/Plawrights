Yes. What you are describing is essentially turning your existing Playwright Agent Plugin into a complete Playwright Test Management + CI/CD platform:

Record/Generate → Project → Database → Script Management → Jenkins → Execution → Results/Reports → Healer

# Playwright Agent Plugin — Project Management, Database & Jenkins CI/CD

## 1. ROLE

You are a senior full-stack architect, Playwright automation engineer, DevOps engineer, and database engineer.

I already have an existing **Playwright Agent Plugin** that is working successfully.

DO NOT rebuild the existing Playwright functionality from scratch.

Your responsibility is to extend the existing plugin with:

1. Project Management
2. Database-backed Playwright Script Repository
3. Script Management
4. Playwright Agent integration
5. Jenkins CI/CD integration
6. CI/CD execution control
7. Test execution results
8. Playwright reports
9. Execution history
10. Optional automatic healing/re-generation workflow

The existing Playwright functionality must continue working exactly as it does today.

---

# 2. EXISTING PLAYWRIGHT FUNCTIONALITY

The existing plugin already contains Playwright agents/workflows such as:

* Playwright Planner
* Playwright Generator
* Playwright Healer
* Playwright recording/generation functionality
* Playwright test script generation
* End-to-end Playwright test execution

The existing functionality is working correctly.

### IMPORTANT

Do not break or replace the existing implementation.

First inspect the existing codebase and understand:

* Current architecture
* Existing Playwright agents
* Existing MCP/tool architecture
* Existing UI
* Existing backend
* Existing script generation flow
* Existing recording flow
* Existing file structure
* Existing configuration
* Existing environment variables
* Existing test execution mechanism

Then integrate the new functionality into the existing architecture.

---

# 3. TARGET ARCHITECTURE

Implement the following architecture:

```text
                         PLAYWRIGHT AGENT PLUGIN
                                  |
             +--------------------+--------------------+
             |                    |                    |
             v                    v                    v
       Playwright Planner   Playwright Generator   Playwright Healer
             |                    |                    |
             +--------------------+--------------------+
                                  |
                                  v
                         PROJECT MANAGEMENT
                                  |
                                  v
                         TEST SCRIPT MANAGEMENT
                                  |
                                  v
                           DATABASE REPOSITORY
                                  |
                    +-------------+-------------+
                    |                           |
                    v                           v
             Script Metadata              Script Content
                    |                           |
                    +-------------+-------------+
                                  |
                                  v
                         CI/CD INTEGRATION
                                  |
                                  v
                               JENKINS
                                  |
                                  v
                         Jenkins Pipeline/Job
                                  |
                                  v
                       Playwright Test Execution
                                  |
                  +---------------+---------------+
                  |                               |
                  v                               v
             Test Results                  Playwright Report
                  |                               |
                  +---------------+---------------+
                                  |
                                  v
                         PLUGIN DASHBOARD
```

---

# 4. DATABASE

Use a relational database.

Preferred database:

**PostgreSQL**

However, structure the application so that the database layer is abstracted and can be changed later.

For local development, provide an easy Docker-based PostgreSQL setup.

Example:

```text
Docker
 |
 +-- PostgreSQL
       |
       +-- playwright_projects
       +-- playwright_scripts
       +-- test_executions
       +-- execution_results
       +-- jenkins_configurations
       +-- execution_logs
```

---

# 5. DATABASE SCHEMA

Design a proper relational schema.

## PROJECT

Table:

```text
projects
```

Fields:

```text
id
name
description
status
created_at
updated_at
created_by
```

Example:

```text
Project
--------
id: 1
name: E-Commerce Application
description: Playwright E2E automation
status: ACTIVE
```

---

# 6. TEST SCRIPT TABLE

Create:

```text
test_scripts
```

Fields:

```text
id
project_id
name
description
script_content
language
framework
script_type
version
status
created_at
updated_at
created_by
updated_by
```

Example:

```text
id: 101
project_id: 1
name: Login Test
language: TypeScript
framework: Playwright
script_type: E2E
version: 1
status: ACTIVE
script_content: <complete Playwright script>
```

Store the COMPLETE Playwright test script in the database.

Do not store only the script path.

The database must contain the actual script content.

---

# 7. SCRIPT VERSIONING

Implement script versioning.

If a script is modified:

```text
Login Test
   |
   +-- Version 1
   +-- Version 2
   +-- Version 3
```

Create:

```text
test_script_versions
```

Fields:

```text
id
script_id
version
script_content
created_at
created_by
change_summary
```

The latest version should be clearly identifiable.

Allow users to:

* View versions
* Compare versions
* Restore a previous version
* Execute a selected version

---

# 8. TEST EXECUTION TABLE

Create:

```text
test_executions
```

Fields:

```text
id
project_id
script_id
script_version
jenkins_job_id
jenkins_build_number
trigger_type
status
started_at
completed_at
duration
environment
browser
report_url
created_at
```

Possible statuses:

```text
QUEUED
RUNNING
PASSED
FAILED
ABORTED
ERROR
```

Trigger types:

```text
MANUAL
JENKINS
SCHEDULED
API
```

---

# 9. EXECUTION RESULT TABLE

Create:

```text
execution_results
```

Fields:

```text
id
execution_id
script_id
test_name
status
duration
error_message
stack_trace
screenshot_path
video_path
trace_path
created_at
```

Support:

```text
PASSED
FAILED
SKIPPED
```

---

# 10. JENKINS CONFIGURATION

Create:

```text
jenkins_configurations
```

Fields:

```text
id
name
base_url
username
credential_reference
job_name
folder
enabled
created_at
updated_at
```

IMPORTANT:

Never store plaintext Jenkins passwords or API tokens in the database.

Use:

* Environment variables
* Secret manager
* Jenkins credentials
* Encrypted secrets

where appropriate.

---

# 11. PROJECT UI

Add a new menu:

```text
Projects
```

The UI should contain:

```text
Projects

+ Create Project
+ Search
+ Refresh

------------------------------------------------

Project Name        Scripts    Last Run    Status
------------------------------------------------
E-Commerce          25         PASSED      Active
Banking Application 42         FAILED      Active
CRM                 18         PASSED      Active
```

---

# 12. CREATE PROJECT

When the user clicks:

```text
Create Project
```

Display:

```text
Create New Project

Project Name:
[_____________________]

Description:
[_____________________]

[Create Project]
[Cancel]
```

When the user clicks Create:

1. Validate project name
2. Create project in PostgreSQL
3. Generate project ID
4. Return project details
5. Open Project Dashboard

---

# 13. PROJECT DASHBOARD

When opening a project:

```text
Project: E-Commerce

---------------------------------------------

Overview

Total Scripts       25
Passed Tests        20
Failed Tests        3
Not Executed        2
Last Execution      2 minutes ago

---------------------------------------------

[Scripts]
[Executions]
[CI/CD]
[Reports]
[Settings]
```

---

# 14. SCRIPT MANAGEMENT

Inside:

```text
Project → Scripts
```

Display:

```text
Scripts

+ New Script
+ Record
+ Generate
+ Import

-----------------------------------------------------

Script Name       Version   Status     Last Run
-----------------------------------------------------
Login Test        v3        Passed     2 mins ago
Checkout Test     v5        Failed     10 mins ago
Search Test       v2        Passed     20 mins ago
```

Actions:

```text
View
Edit
Run
Delete
Duplicate
Version History
Heal
Download
```

---

# 15. STORE GENERATED SCRIPT

When the existing Playwright Generator creates a script, provide:

```text
Save to Project
```

Example:

```text
Project:
[E-Commerce]

Script Name:
[Login Test]

Description:
[Login functionality E2E test]

[Save to Database]
```

When the user clicks:

```text
Save to Database
```

the complete generated Playwright script must be stored in:

```text
projects
test_scripts
test_script_versions
```

---

# 16. RECORDING FLOW

Existing recording functionality must remain intact.

After recording:

```text
Playwright Recorder
       |
       v
Generated Script
       |
       v
Preview
       |
       v
Save to Project
       |
       v
Database
```

The user should be able to select:

```text
Project
Script Name
Description
```

and save the generated script.

---

# 17. PLAYWRIGHT PLANNER INTEGRATION

Existing Planner must continue working.

Example:

```text
User Requirement

"Test login with valid and invalid credentials"
```

Planner:

```text
Test Scenario
    |
    +-- Login with valid credentials
    +-- Login with invalid credentials
    +-- Verify error message
```

Generator then generates Playwright code.

After generation:

```text
Save to Project
```

must save the generated script into the database.

---

# 18. PLAYWRIGHT HEALER INTEGRATION

Existing Healer must also be connected to the database.

When a database-backed script fails:

```text
Database Script
      |
      v
Jenkins
      |
      v
Playwright Test
      |
      v
FAILED
      |
      v
Healer
      |
      v
Updated Script
```

The healed script should NOT automatically overwrite the existing version without user control.

Instead:

```text
Original Version
       |
       v
Healer
       |
       v
Proposed Healed Version
       |
       +----> Review
       |
       +----> Save as New Version
```

Provide:

```text
Accept Healing
Reject Healing
View Difference
```

---

# 19. JENKINS INTEGRATION

The plugin must integrate with Jenkins.

Assume Jenkins is running locally.

Example:

```text
http://localhost:8080
```

But do not hard-code this.

Provide configuration:

```text
Jenkins Configuration

Jenkins URL:
[http://localhost:8080]

Username:
[____________]

API Token:
[____________]

[ Test Connection ]
[ Save Configuration ]
```

---

# 20. JENKINS CONNECTION TEST

Implement:

```text
Test Connection
```

The plugin should verify:

```text
Jenkins reachable
Authentication successful
Jenkins version available
```

Display:

```text
✓ Jenkins connection successful
```

or:

```text
✗ Jenkins connection failed
```

Show useful error details.

---

# 21. JENKINS JOB MANAGEMENT

Inside:

```text
Project → CI/CD
```

display:

```text
Jenkins Configuration

Jenkins:
Connected ✓

Jobs:

+ Create Job
+ Refresh

-----------------------------------------

Job Name              Status
-----------------------------------------
playwright-e2e         Enabled
playwright-regression  Enabled
```

Allow the user to configure which Jenkins job belongs to the project.

---

# 22. DATABASE → JENKINS EXECUTION MODEL

This is a critical requirement.

When the user selects:

```text
Run Test
```

the plugin should:

1. Retrieve the selected project
2. Retrieve selected script
3. Retrieve selected version
4. Prepare the test execution
5. Make the script available to Jenkins
6. Trigger Jenkins job
7. Jenkins executes Playwright
8. Jenkins generates Playwright report
9. Plugin retrieves execution result
10. Plugin stores execution history
11. Plugin displays result

Architecture:

```text
PLUGIN
  |
  | Get Script
  v
DATABASE
  |
  | Script Content
  v
PLUGIN BACKEND
  |
  | Prepare Execution
  v
JENKINS
  |
  | npm install
  | npx playwright install
  | npx playwright test
  |
  v
PLAYWRIGHT
  |
  v
RESULT
  |
  v
PLUGIN
  |
  +--> Database
  |
  +--> Dashboard
```

---

# 23. IMPORTANT: SCRIPT TRANSFER TO JENKINS

Do not assume that Jenkins can directly access the database.

Create a controlled execution mechanism.

Possible approach:

```text
Plugin Backend
      |
      v
Create temporary workspace
      |
      +-- playwright.config.ts
      +-- package.json
      +-- tests/
      |     +-- generated-test.spec.ts
      |
      v
Jenkins
      |
      v
Execute
```

Prefer a secure and maintainable approach.

If the existing project repository already exists, integrate with it rather than unnecessarily creating temporary repositories.

---

# 24. JENKINS PIPELINE

Create a reusable Jenkins pipeline.

Example:

```groovy
pipeline {

    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Preparing Playwright tests'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Install Playwright') {
            steps {
                sh 'npx playwright install --with-deps'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npx playwright test'
            }
        }

        stage('Generate Report') {
            steps {
                sh 'npx playwright show-report'
            }
        }
    }

    post {

        always {
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
            archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
        }
    }
}
```

Adapt the pipeline to the existing project architecture.

Do not blindly copy this pipeline if the existing Jenkins setup uses Windows agents, Docker, Maven, npm, etc.

Detect the existing environment and configure accordingly.

---

# 25. JENKINS TRIGGER API

Implement backend APIs for:

```text
POST /api/jenkins/jobs/{jobId}/run
```

and:

```text
GET /api/jenkins/jobs/{jobId}/status
```

and:

```text
POST /api/jenkins/jobs/{jobId}/stop
```

and:

```text
GET /api/jenkins/jobs/{jobId}/builds
```

The plugin should be able to:

```text
Trigger
Monitor
Stop
Refresh
View Build
```

---

# 26. CI/CD DASHBOARD

Create:

```text
Project → CI/CD
```

Example:

```text
CI/CD Dashboard

Jenkins: CONNECTED ✓

Pipeline:
playwright-e2e

Latest Build:
#128

Status:
PASSED ✓

Duration:
4m 23s

Started:
14:22

Completed:
14:26

---------------------------------

[Run Pipeline]
[Stop]
[Refresh]
[View Jenkins]
[View Report]
```

---

# 27. EXECUTION LIVE STATUS

When the pipeline is running:

```text
QUEUED
   ↓
STARTING
   ↓
RUNNING
   ↓
TEST EXECUTION
   ↓
GENERATING REPORT
   ↓
COMPLETED
```

The UI should poll Jenkins or use WebSocket/SSE where appropriate.

Avoid excessive polling.

---

# 28. TEST RESULTS

After execution:

```text
Execution #128

Status: FAILED

Total Tests: 25
Passed: 21
Failed: 3
Skipped: 1

Duration: 4m 23s
```

Show:

```text
Test Name
Status
Duration
Error
Screenshot
Video
Trace
```

---

# 29. PLAYWRIGHT REPORT

Integrate the Playwright HTML report.

Provide:

```text
[Open Playwright Report]
```

The report should be accessible from the plugin.

If Jenkins hosts the report, securely expose or proxy the report URL.

Do not expose Jenkins credentials or internal secrets to the browser.

---

# 30. EXECUTION HISTORY

Create:

```text
Project → Executions
```

Example:

```text
Execution History

Build     Date        Trigger      Status     Duration
--------------------------------------------------------
#128      Oct 03      Manual       Passed     4m23s
#127      Oct 03      Jenkins      Failed     3m51s
#126      Oct 02      Manual       Passed     4m12s
#125      Oct 02      Scheduled    Passed     4m40s
```

Allow filtering by:

```text
Project
Script
Status
Date
Trigger
Environment
```

---

# 31. DELETE SCRIPT

Allow:

```text
Delete Script
```

Before deletion:

```text
Are you sure?

This will remove the script from the project.

[Cancel] [Delete]
```

Prefer soft deletion.

Add:

```text
deleted_at
deleted_by
```

instead of permanently deleting data unless permanent deletion is explicitly requested.

---

# 32. PROJECT DELETE

Use the same approach.

Prefer:

```text
ACTIVE
ARCHIVED
DELETED
```

instead of immediately deleting all records.

Protect historical execution records.

---

# 33. SCRIPT SEARCH

Implement search:

```text
Search scripts...
```

Support:

```text
Script Name
Description
Tags
Test Scenario
```

---

# 34. TAGGING

Allow scripts to have tags:

```text
Smoke
Regression
Critical
Login
Checkout
API
UI
Security
```

This allows Jenkins execution by tag.

Example:

```text
Run:
Smoke Tests
```

or:

```text
Run:
Regression Tests
```

---

# 35. BULK EXECUTION

Allow:

```text
Select Scripts

☑ Login
☑ Checkout
☑ Search
☐ Profile

[Run Selected]
```

Backend should create one execution session containing multiple scripts.

Example:

```text
Execution #129

Scripts:
25

Passed:
22

Failed:
2

Skipped:
1
```

---

# 36. ENVIRONMENT CONFIGURATION

Support:

```text
DEV
QA
UAT
STAGING
PRODUCTION
```

Do not hard-code URLs inside test scripts.

Example:

```text
Environment Configuration

DEV
Base URL:
https://dev.example.com

QA
Base URL:
https://qa.example.com

UAT
Base URL:
https://uat.example.com
```

Pass environment configuration securely to Jenkins.

---

# 37. BROWSER CONFIGURATION

Allow:

```text
Chromium
Firefox
WebKit
```

Optionally:

```text
Desktop Chrome
Desktop Firefox
Mobile Chrome
Mobile Safari
```

Example:

```text
Browser:
[Chromium ▼]

Environment:
[QA ▼]
```

---

# 38. SECURITY REQUIREMENTS

Because this application manages test scripts and CI/CD credentials, security is mandatory.

Implement:

### Authentication

Protect backend APIs.

### Authorization

At minimum:

```text
ADMIN
USER
VIEWER
```

Example:

```text
ADMIN
- Create project
- Delete project
- Configure Jenkins
- Run pipeline
- Manage scripts

USER
- Create scripts
- Run tests
- View reports

VIEWER
- View projects
- View scripts
- View reports
```

---

# 39. SECRET MANAGEMENT

Never expose:

```text
Jenkins password
Jenkins API token
Database password
Environment secrets
Application credentials
```

in:

* Browser UI
* Logs
* Git
* Database plaintext
* API response

Use environment variables or encrypted secret storage.

---

# 40. API DESIGN

Create clean REST APIs.

Example:

### Projects

```text
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
```

### Scripts

```text
GET    /api/projects/:projectId/scripts
POST   /api/projects/:projectId/scripts
GET    /api/scripts/:id
PUT    /api/scripts/:id
DELETE /api/scripts/:id
```

### Versions

```text
GET  /api/scripts/:id/versions
POST /api/scripts/:id/versions
GET  /api/scripts/:id/versions/:version
POST /api/scripts/:id/versions/:version/restore
```

### Execution

```text
POST /api/scripts/:id/run
GET  /api/executions
GET  /api/executions/:id
POST /api/executions/:id/stop
```

### Jenkins

```text
POST /api/jenkins/test-connection
GET  /api/jenkins/jobs
POST /api/jenkins/jobs/:id/run
GET  /api/jenkins/jobs/:id/status
POST /api/jenkins/jobs/:id/stop
```

---

# 41. API VALIDATION

Implement:

* Request validation
* Response validation
* Error handling
* HTTP status codes
* Authentication middleware
* Authorization middleware
* Rate limiting where appropriate
* Audit logging

---

# 42. ERROR HANDLING

Errors should be meaningful.

Example:

```text
Jenkins unavailable

Unable to connect to Jenkins at:
http://localhost:8080

Check:
1. Jenkins is running
2. Jenkins URL is correct
3. Credentials are valid
4. Network connection is available
```

Do not expose stack traces to normal users.

---

# 43. AUDIT LOG

Create:

```text
audit_logs
```

Track:

```text
User
Action
Resource
Resource ID
Timestamp
IP
Result
```

Examples:

```text
Atish created project E-Commerce
Atish saved Login Test
Atish triggered Jenkins Build #128
Atish deleted Checkout Test
```

---

# 44. DATABASE MIGRATIONS

Use a proper migration framework supported by the selected backend.

Never manually modify production tables.

Provide:

```text
migration
seed
rollback
```

scripts.

---

# 45. LOCAL DEVELOPMENT

Provide Docker Compose:

```text
docker-compose.yml
```

with:

```text
PostgreSQL
```

Optionally:

```text
pgAdmin
```

if useful.

Example:

```text
docker compose up -d
```

should start the database.

---

# 46. ENVIRONMENT VARIABLES

Create:

```text
.env.example
```

Example:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/playwright_db

JENKINS_URL=http://localhost:8080
JENKINS_USERNAME=
JENKINS_API_TOKEN=

APP_PORT=3000
```

Do not commit `.env`.

Add:

```text
.env
```

to `.gitignore`.

---

# 47. DO NOT BREAK EXISTING PLAYWRIGHT AGENTS

The following existing capabilities must continue working:

```text
Playwright Planner
Playwright Generator
Playwright Recorder
Playwright Healer
Playwright Test Execution
```

The new system must wrap around these capabilities rather than replacing them.

---

# 48. INTEGRATED END-TO-END FLOW

The final product should support this complete flow:

```text
USER
 |
 | Create Project
 v
PROJECT
 |
 | Record / Plan / Generate
 v
PLAYWRIGHT AGENT
 |
 v
GENERATED SCRIPT
 |
 | Save
 v
DATABASE
 |
 v
SCRIPT REPOSITORY
 |
 | Run
 v
PLUGIN BACKEND
 |
 v
JENKINS
 |
 v
PLAYWRIGHT
 |
 v
TEST EXECUTION
 |
 +--------+---------+
 |                  |
 v                  v
PASS              FAIL
 |                  |
 v                  v
REPORT            HEALER
 |                  |
 v                  v
DATABASE       PROPOSED FIX
 |                  |
 +--------+---------+
          |
          v
      DASHBOARD
```

---

# 49. OPTIONAL SCHEDULED EXECUTION

Support Jenkins scheduled execution.

Example:

```text
Every night at 11 PM
```

or:

```text
Every Monday-Friday at 9 AM
```

The configuration should remain controlled by Jenkins where possible.

The plugin should display schedule information.

---

# 50. CI/CD PIPELINE PARAMETERS

Allow the plugin to pass parameters to Jenkins:

```text
PROJECT_ID
SCRIPT_ID
SCRIPT_VERSION
ENVIRONMENT
BROWSER
TAGS
EXECUTION_ID
```

Example:

```text
PROJECT_ID=1
SCRIPT_ID=101
SCRIPT_VERSION=3
ENVIRONMENT=QA
BROWSER=chromium
EXECUTION_ID=128
```

Jenkins should use these parameters to determine what needs to execute.

---

# 51. REPORT CALLBACK

After Jenkins completes the build, the backend should associate:

```text
Jenkins Build
        |
        v
Execution ID
        |
        v
Project
        |
        v
Script
        |
        v
Execution Result
        |
        v
Playwright Report
```

Avoid relying solely on frontend polling.

Where possible, support a Jenkins webhook/callback.

Example:

```text
POST /api/jenkins/webhook
```

---

# 52. OBSERVABILITY

Add structured logs.

Example:

```text
[PROJECT]
Created project 101

[SCRIPT]
Saved script 1001 version 3

[JENKINS]
Triggered job playwright-e2e build #128

[EXECUTION]
Execution 5001 started

[EXECUTION]
Execution 5001 completed: PASSED
```

Never log secrets.

---

# 53. TESTING REQUIREMENTS

Create automated tests for:

### Backend

* Project CRUD
* Script CRUD
* Script versioning
* Database operations
* Jenkins connection
* Jenkins job triggering
* Execution status
* Authentication
* Authorization

### Frontend

* Create project
* Open project
* Create script
* Save generated script
* Delete script
* Run script
* View execution
* View report

### Integration

Test:

```text
Create Project
      ↓
Generate Script
      ↓
Save Script
      ↓
Trigger Jenkins
      ↓
Execute Playwright
      ↓
Receive Result
      ↓
Store Result
      ↓
Display Report
```

---

# 54. UI/UX REQUIREMENTS

The UI should look like a modern professional automation platform.

Suggested navigation:

```text
-------------------------------------------
PLAYWRIGHT AI
-------------------------------------------

Dashboard

Projects

  > Project 1
  > Project 2

Playwright Agents
  > Planner
  > Generator
  > Recorder
  > Healer

CI/CD
  > Jenkins
  > Executions

Reports

Settings
-------------------------------------------
```

Use clear status indicators:

```text
PASSED
FAILED
RUNNING
QUEUED
ERROR
```

Provide confirmation dialogs for destructive actions.

---

# 55. PROJECT DASHBOARD DESIGN

Create a dashboard similar to:

```text
+------------------------------------------------+
| E-Commerce Automation                          |
|                                                |
| Scripts     Passed     Failed     Last Run     |
|   25          21         3       2 mins ago    |
+------------------------------------------------+

[Run All] [Create Script] [CI/CD]

--------------------------------------------------

Scripts

Search...

Login Test             v3    PASSED    [Run]
Checkout Test           v5    FAILED    [Run]
Search Test             v2    PASSED    [Run]

--------------------------------------------------

Recent Executions

#128    PASSED     4m23s
#127    FAILED     3m51s
#126    PASSED     4m12s
```

---

# 56. IMPORTANT ARCHITECTURAL PRINCIPLE

Separate these layers:

```text
UI
 |
 v
API
 |
 v
SERVICE
 |
 +---- Project Service
 +---- Script Service
 +---- Execution Service
 +---- Jenkins Service
 +---- Report Service
 +---- Agent Service
 |
 v
DATABASE
```

Do not put database queries directly into UI components.

Do not put Jenkins logic directly into UI components.

---

# 57. AGENT SERVICE

Create a common abstraction for the existing Playwright agents:

```text
PlaywrightAgentService
```

Possible operations:

```text
plan()
generate()
heal()
record()
validate()
```

This allows the project system to invoke the existing agents consistently.

---

# 58. SCRIPT LIFECYCLE

Implement:

```text
DRAFT
   ↓
GENERATED
   ↓
SAVED
   ↓
VALIDATED
   ↓
READY
   ↓
RUNNING
   ↓
PASSED / FAILED
   ↓
HEALING
   ↓
NEW VERSION
```

---

# 59. DO NOT ASSUME FILESYSTEM AS THE SOURCE OF TRUTH

The database should be the source of truth for:

```text
Projects
Scripts
Versions
Execution history
Jenkins configuration metadata
Reports metadata
```

Filesystem/workspaces may be temporary execution artifacts.

---

# 60. DATABASE SCRIPT EXECUTION

Implement a secure mechanism where database scripts can be converted into runnable Playwright test files during CI execution.

For example:

```text
Database

script_content
     |
     v
Execution Service
     |
     v
Temporary Jenkins Workspace
     |
     +-- tests/generated/test-101.spec.ts
     |
     v
npx playwright test
```

After execution:

```text
Temporary Workspace
       |
       +-- results
       +-- screenshots
       +-- traces
       +-- report
```

Store metadata/results in the database.

Clean temporary files after execution where appropriate.

---

# 61. FUTURE EXTENSIBILITY

Design the system so additional CI/CD providers can later be added:

```text
CIProvider
 |
 +-- Jenkins
 +-- GitHub Actions
 +-- GitLab CI
 +-- Azure DevOps
```

For now, implement:

```text
Jenkins
```

completely.

---

# 62. DELIVERABLES

After implementation provide:

### 1. Architecture

Explain:

```text
Frontend
Backend
Database
Playwright Agents
Jenkins
Execution Engine
Reports
```

### 2. Database

Provide:

```text
Schema
Migrations
Relationships
Indexes
```

### 3. Backend

Provide:

```text
REST APIs
Services
Jenkins integration
Execution engine
```

### 4. Frontend

Provide:

```text
Projects
Scripts
Versions
CI/CD
Executions
Reports
```

### 5. Jenkins

Provide:

```text
Jenkinsfile
Job configuration
Webhook configuration
Credentials configuration
```

### 6. Docker

Provide:

```text
docker-compose.yml
.env.example
```

### 7. Documentation

Provide:

```text
README.md
Installation
Database setup
Jenkins setup
Plugin configuration
Project creation
Script creation
CI/CD execution
Troubleshooting
```

---

# 63. IMPLEMENTATION PROCESS

Follow this order.

## PHASE 1 — ANALYZE EXISTING PROJECT

First inspect the complete existing codebase.

Identify:

```text
Frontend
Backend
Playwright agents
MCP components
Existing database
Existing APIs
Existing UI
Existing execution mechanism
```

Do NOT modify code yet.

Create an architecture summary.

---

## PHASE 2 — DATABASE

Implement:

```text
PostgreSQL
Projects
Scripts
Versions
Executions
Execution Results
Jenkins Configuration
Audit Logs
```

Add migrations.

---

## PHASE 3 — PROJECT MANAGEMENT

Implement:

```text
Create Project
List Projects
View Project
Update Project
Archive Project
```

---

## PHASE 4 — SCRIPT MANAGEMENT

Implement:

```text
Create
Read
Update
Delete
Version
Restore
Search
Tag
```

---

## PHASE 5 — CONNECT EXISTING PLAYWRIGHT AGENTS

Connect:

```text
Planner
Generator
Recorder
Healer
```

to project/script storage.

---

## PHASE 6 — JENKINS

Implement:

```text
Connection
Authentication
Job discovery
Job configuration
Job triggering
Build monitoring
Build stopping
Webhook
```

---

## PHASE 7 — EXECUTION ENGINE

Implement:

```text
Database Script
       ↓
Execution Workspace
       ↓
Playwright
       ↓
Jenkins
       ↓
Results
       ↓
Database
```

---

## PHASE 8 — REPORTING

Implement:

```text
Execution history
Pass/fail
Screenshots
Videos
Traces
Playwright HTML report
Jenkins build information
```

---

## PHASE 9 — HEALING

Connect failed execution to:

```text
Playwright Healer
```

and support:

```text
Review
Accept
Reject
New Version
```

---

## PHASE 10 — SECURITY

Perform security review for:

```text
Authentication
Authorization
Jenkins credentials
Database credentials
API security
Input validation
Command injection
Path traversal
SSRF
Secret exposure
XSS
CSRF
SQL injection
Audit logging
```

Pay special attention to the fact that the system executes generated code through Jenkins.

---

# 64. ACCEPTANCE CRITERIA

The implementation is considered successful only when this complete scenario works:

```text
1. User opens Playwright Plugin

2. User clicks Create Project

3. Project is created in PostgreSQL

4. User opens project

5. User uses existing Playwright Planner

6. Planner creates test plan

7. Generator creates Playwright script

8. User clicks Save to Project

9. Script is stored in PostgreSQL

10. Script appears under Project → Scripts

11. User can view the complete script

12. User can create a new version

13. User configures Jenkins

14. Plugin successfully connects to localhost Jenkins

15. User selects script

16. User clicks Run

17. Plugin creates execution record

18. Jenkins job is triggered

19. Jenkins executes Playwright

20. Playwright produces results

21. Jenkins completes build

22. Plugin receives build result

23. Execution result is saved to PostgreSQL

24. Plugin displays PASSED/FAILED

25. User can view screenshots

26. User can view trace/video if available

27. User can open Playwright report

28. Failed tests can be sent to Playwright Healer

29. Healed script is shown as a proposed new version

30. User can accept the healed version

31. New script version is stored in PostgreSQL

32. User can run the new version through Jenkins

33. Complete execution history remains available
```

---

# 65. FINAL EXPECTED PRODUCT

The final application should effectively become:

```text
          PLAYWRIGHT AI AUTOMATION PLATFORM
                         |
        +----------------+----------------+
        |                |                |
        v                v                v
      PLAN           GENERATE           RECORD
        |                |                |
        +----------------+----------------+
                         |
                         v
                   SCRIPT REPOSITORY
                         |
                         v
                      DATABASE
                         |
              +----------+----------+
              |                     |
              v                     v
           VERSION               TAGGING
              |
              v
             CI/CD
              |
              v
           JENKINS
              |
              v
         PLAYWRIGHT
              |
       +------+------+
       |             |
       v             v
     PASS           FAIL
       |             |
       v             v
    REPORT         HEALER
       |             |
       |             v
       |       NEW VERSION
       |             |
       +------+------+
              |
              v
          DASHBOARD
```

The primary goal is to transform the existing Playwright Agent Plugin into a complete **AI-powered Playwright Test Management and CI/CD platform**, while preserving all existing functionality.

Before making implementation changes, inspect the existing repository and provide the current architecture and proposed integration points. Then implement the phases incrementally and verify each phase before proceeding to the next.

                    PLAYWRIGHT AI PLATFORM
                             |
          +------------------+------------------+
          |                  |                  |
          v                  v                  v
     AI AGENT LAYER     TEST MANAGEMENT     SKILL LAYER
          |                  |                  |
   Planner/Generator    Projects             Skills
   Recorder/Healer      Scripts              Skill Files
                        Versions              Instructions
          |                  |                  |
          +------------------+------------------+
                             |
                          DATABASE
                             |
                      Execution Service
                             |
              +--------------+--------------+
              |                             |
              v                             v
           Jenkins                    Future CI/CD
              |                    GitHub/GitLab/etc.
              v
          Playwright
              |
              v
        Results / Reports
              |
              v
           DATABASE
              |
              v
          Plugin UI
		  
		  
Skill: Banking Playwright Standards

Purpose:
Generate Playwright tests according to our banking automation standards.

Rules:
- Use TypeScript
- Use Page Object Model
- Use fixtures
- Do not use hard-coded credentials
- Use environment variables
- Capture trace on failure
- Use meaningful test names
- Follow project locator standards
Project
   |
   +-- Selected Skills
   |      |
   |      +-- Playwright Standards
   |      +-- Banking Standards
   |
   v
Planner
   |
   v
Generator
   |
   v
Playwright Script

# ADDITIONAL MODULE — PROJECT SKILLS MANAGEMENT

Extend the existing Playwright AI platform with a **Skills Management System**.

The existing architecture must remain:

```text
Plugin
   ↓
Database
   ↓
Execution Service
   ↓
Jenkins
   ↓
Playwright
   ↓
Results
   ↓
Database
   ↓
Plugin
```

At the same time, maintain the existing AI layer:

```text
Planner
Generator
Recorder
Healer
```

Add a third layer:

```text
Skills
```

The Skills layer provides reusable instructions, standards, context, rules, examples and project-specific knowledge to the Playwright AI agents.

---

# 1. PROJECT SKILLS

Every Project should optionally have its own Skills.

Example:

```text
Project
│
├── Skills
│   ├── playwright-standards
│   ├── banking-test-standards
│   └── security-testing
│
├── Test Scripts
├── Executions
├── Reports
└── CI/CD
```

A Skill belongs to a Project but should also support reusable/global Skills.

Support:

```text
GLOBAL SKILL
PROJECT SKILL
```

---

# 2. SKILL FILE FORMAT

Primary supported format:

```text
.skill.md
```

Example:

```text
login-automation.skill.md
```

The file should use Markdown.

Example:

```markdown
# Login Automation Skill

## Purpose

Generate Playwright tests for login functionality.

## Rules

- Use TypeScript.
- Use Page Object Model.
- Do not hard-code credentials.
- Use environment variables.
- Prefer stable locators.
- Add assertions for successful login.
- Capture trace on failure.

## Locator Rules

Prefer:

1. getByRole()
2. getByLabel()
3. getByTestId()

Avoid:

- Arbitrary XPath
- CSS selectors when stable semantic locators exist

## Example

Use:

page.getByRole('button', { name: 'Login' })

instead of:

page.locator('//button[text()="Login"]')
```

Do not force every Skill to follow exactly this format. The system should allow free-form Markdown while supporting optional structured metadata.

---

# 3. SKILL METADATA

Store metadata separately from the file content.

Example:

```text
skills
```

Fields:

```text
id
name
description
scope
project_id
file_name
content
version
status
created_at
updated_at
created_by
updated_by
```

Possible scope:

```text
GLOBAL
PROJECT
```

Possible status:

```text
ACTIVE
ARCHIVED
```

---

# 4. SKILL VERSIONING

Skills must support versioning.

Example:

```text
Login Automation Skill

Version 1
Version 2
Version 3
```

Create:

```text
skill_versions
```

Fields:

```text
id
skill_id
version
content
change_summary
created_at
created_by
```

Allow:

```text
View Version
Compare Version
Restore Version
Create New Version
```

---

# 5. UPLOAD SKILL FROM PLUGIN

Add:

```text
Project → Skills
```

UI:

```text
Skills

+ Add Skill
+ Upload Skill
+ Create Skill

-----------------------------------

Playwright Standards
v3
ACTIVE

Banking Automation
v2
ACTIVE

Security Testing
v1
ACTIVE
```

When user clicks:

```text
Upload Skill
```

allow:

```text
Select File
```

Supported initially:

```text
.skill.md
.md
.txt
```

Validate:

* File extension
* File size
* Encoding
* Filename
* Malicious content where applicable

Then store the Skill in the database.

---

# 6. CREATE SKILL FROM PLUGIN

Also allow users to create a Skill without uploading a file.

UI:

```text
Create Skill

Name:
[________________________]

Description:
[________________________]

Skill Content:

[ Markdown Editor
  ................................
  ................................
  ................................
]

Scope:

( ) Global
( ) Project

[Save Skill]
```

Save it to the database.

---

# 7. SKILL ATTACHMENT TO PROJECT

A Global Skill should be attachable to multiple projects.

Example:

```text
Global Skills

☑ Playwright Best Practices
☑ Security Testing Standards
☐ API Testing Standards
```

Project:

```text
E-Commerce

Attached Skills:

Playwright Best Practices
Security Testing Standards
```

Do not duplicate the actual Skill content unnecessarily.

Use a relationship table:

```text
project_skills
```

Fields:

```text
project_id
skill_id
enabled
priority
created_at
```

---

# 8. SKILL PRIORITY

Support priority/order.

Example:

```text
1. Project Security Rules
2. Project Playwright Standards
3. Global Playwright Standards
```

If multiple Skills provide instructions, the agent should receive them in a deterministic order.

---

# 9. SKILL SELECTION DURING GENERATION

When the user opens:

```text
Generate Playwright Test
```

show:

```text
Project:
E-Commerce

Available Skills:

☑ Playwright Standards
☑ E-Commerce Automation Rules
☐ Security Testing

[Generate]
```

The selected Skills should be supplied to the Planner/Generator.

---

# 10. AUTOMATIC PROJECT SKILLS

Provide:

```text
Use Project Skills Automatically
```

If enabled:

```text
Planner
   ↓
Automatically loads enabled Project Skills
   ↓
Generator
   ↓
Playwright Script
```

The user should not need to manually select Skills every time.

Allow the user to disable this behavior.

---

# 11. PLANNER + SKILLS

The Planner must be able to consume Skills.

Flow:

```text
User Requirement
       +
Project Skills
       |
       v
Playwright Planner
       |
       v
Test Plan
```

Example:

```text
Requirement:

"Test login functionality"

Skill:

"Always test valid login, invalid login and locked user."

Planner should create scenarios according to the Skill.
```

Do not hard-code this behavior into the Planner.

The Skill should provide the instruction.

---

# 12. GENERATOR + SKILLS

Flow:

```text
Test Plan
    +
Selected Project Skills
    +
Existing Project Configuration
    |
    v
Playwright Generator
    |
    v
Playwright Test Script
```

The generated script should follow applicable Skills.

---

# 13. HEALER + SKILLS

The Healer must also consume Skills.

Flow:

```text
Failed Test
    +
Original Script
    +
Project Skills
    |
    v
Playwright Healer
    |
    v
Proposed Fixed Script
```

Example Skill:

```text
Never replace a getByRole locator with XPath unless absolutely necessary.
```

The Healer should respect this instruction.

---

# 14. SKILLS + SCRIPT STORAGE

When a script is saved, record which Skills were used.

Create:

```text
script_skills
```

Fields:

```text
script_id
skill_id
skill_version
```

This is important for reproducibility.

Example:

```text
Login Test v5

Generated using:

Playwright Standards v3
Banking Automation v2
Security Testing v1
```

If the Skill changes later, the historical script still knows which Skill versions were used.

---

# 15. SKILLS + EXECUTION

Skills normally influence generation/healing rather than runtime execution.

However, allow optional execution metadata:

```text
execution_skill_snapshot
```

When an execution begins, record the relevant Skill versions.

This allows debugging later:

```text
Execution #128

Script:
Login Test v5

Skills:

Playwright Standards v3
Banking Standards v2
```

---

# 16. SKILL IMPORT FROM EXTENSION

The browser extension/plugin should support:

```text
Add Skill
```

with:

```text
Upload File
Paste Content
Create Skill
Import From Project
```

Example:

```text
Project → Skills → Add Skill

+ Upload .skill.md
+ Create Skill
+ Paste Skill
```

---

# 17. SKILL DOWNLOAD

Allow:

```text
Download Skill
```

The user should be able to download the Skill as:

```text
.skill.md
```

This allows Skills to be moved between projects.

---

# 18. SKILL DUPLICATION

Allow:

```text
Duplicate Skill
```

Example:

```text
Global Playwright Standards
        ↓
Duplicate
        ↓
Banking Playwright Standards
```

The new Skill receives its own ID/version history.

---

# 19. SKILL SEARCH

Add:

```text
Search Skills...
```

Search:

```text
Name
Description
Content
Tags
```

---

# 20. SKILL TAGGING

Allow:

```text
Playwright
Security
API
Banking
Accessibility
Performance
Regression
Mobile
```

Store tags separately or as a normalized relationship.

---

# 21. SKILL LIBRARY

Add a global:

```text
Skill Library
```

Example:

```text
Skill Library

Playwright
├── Playwright Best Practices
├── Page Object Model
├── Locator Strategy
└── Playwright API Testing

Security
├── OWASP Testing
├── Authentication Testing
└── API Security

Banking
├── Card Testing
├── Payment Testing
└── Transaction Validation
```

Initially allow users to create their own Skills.

Keep the architecture extensible for future built-in Skills.

---

# 22. SKILL CONTEXT SERVICE

Create:

```text
SkillService
```

Responsibilities:

```text
getProjectSkills(projectId)
getGlobalSkills()
getActiveSkills(projectId)
getSkillVersion(skillId, version)
buildAgentContext(projectId, selectedSkills)
```

The service should return a structured context to the AI agents.

Example:

```json
{
  "project": "E-Commerce",
  "skills": [
    {
      "name": "Playwright Standards",
      "version": 3,
      "content": "..."
    },
    {
      "name": "Security Testing",
      "version": 1,
      "content": "..."
    }
  ]
}
```

---

# 23. PREVENT SKILL PROMPT INJECTION

Because Skill files are user-controlled content, treat them as untrusted input.

Do not allow Skill content to override:

* System security rules
* Application authorization
* Credential handling
* Tool permissions
* Execution restrictions

Clearly separate:

```text
System Instructions
        ↓
Application Instructions
        ↓
Project Configuration
        ↓
Skill Content
        ↓
User Requirement
```

Skills are configuration/context, not privileged system instructions.

---

# 24. SKILL SECURITY

Perform validation against:

```text
Prompt injection
Malicious instructions
Credential exfiltration
Command execution instructions
Secret disclosure
Path traversal
Malicious file upload
Oversized files
XSS in rendered Markdown
HTML injection
```

Sanitize Markdown when displaying Skill content in the UI.

Never execute Skill content as code.

---

# 25. COMPLETE AI FLOW

The final AI flow should become:

```text
                  PROJECT
                     |
             +-------+-------+
             |               |
             v               v
          SKILLS         REQUIREMENT
             |               |
             +-------+-------+
                     |
                     v
                  PLANNER
                     |
                     v
                 TEST PLAN
                     |
                     v
                 GENERATOR
                     |
                     v
              PLAYWRIGHT SCRIPT
                     |
                     v
                  DATABASE
                     |
                     v
                  JENKINS
                     |
                     v
                 PLAYWRIGHT
                     |
              +------+------+
              |             |
              v             v
            PASS          FAIL
              |             |
              v             v
           REPORT         HEALER
                            |
                            +
                            |
                         SKILLS
                            |
                            v
                     PROPOSED FIX
                            |
                            v
                       NEW VERSION
```

---

# 26. COMPLETE PRODUCT ARCHITECTURE

The final platform should have three major layers.

## AI Layer

```text
Planner
Generator
Recorder
Healer
```

## Test Management / DevOps Layer

```text
Projects
Scripts
Versions
Executions
Jenkins
Reports
CI/CD
```

## Skills Layer

```text
Global Skills
Project Skills
Skill Versions
Skill Library
Skill Context
```

Together:

```text
                 PLAYWRIGHT AI PLATFORM
                          |
       +------------------+------------------+
       |                  |                  |
       v                  v                  v
   AI AGENTS       TEST MANAGEMENT        SKILLS
       |                  |                  |
 Planner              Projects          Global Skills
 Generator            Scripts           Project Skills
 Recorder             Versions          Skill Versions
 Healer               Executions        Skill Library
       |               Jenkins               |
       |               Reports               |
       +------------------+------------------+
                          |
                       DATABASE
                          |
                   EXECUTION SERVICE
                          |
                       JENKINS
                          |
                     PLAYWRIGHT
```

---

# 27. ACCEPTANCE CRITERIA FOR SKILLS

The implementation is complete when the following works:

```text
1. User creates Project

2. User opens Project → Skills

3. User uploads .skill.md

4. Skill is saved to PostgreSQL

5. Skill appears in Project Skills

6. User can view Skill

7. User can edit Skill

8. User can version Skill

9. User can enable/disable Skill

10. User can attach Global Skill

11. User opens Playwright Generator

12. Project Skills are automatically loaded

13. User generates Playwright test

14. Generator follows Skill instructions

15. Script is saved to database

16. Script records the Skill versions used

17. User runs script through Jenkins

18. Jenkins executes Playwright

19. Test fails

20. User invokes Healer

21. Healer receives the applicable Skills

22. Healer generates proposed fix

23. User reviews difference

24. User accepts fix

25. New script version is created

26. New version records the Skill versions

27. User can execute the new version through Jenkins
```

The Skills system must be implemented as a first-class feature of the existing Playwright platform, not as a simple file-upload attachment.
