# AI UI Tester 🧪🤖

An intelligent, AI-powered UI and E2E test generation, analysis, and self-healing platform. The application provides an elegant, clean user interface (built in a premium light theme) for specifying testing scenarios in natural language, orchestrating the test runs, visualizing live logs, and reviewing deep AI analyses of bugs, root causes (RCA), and self-healing selector suggestions.

### 🌐 Live Demo
Visit the hosted application here: **[https://Piyush-Patole.github.io/AI.UITester/](https://Piyush-Patole.github.io/AI.UITester/)**

---

## 🌟 Key Features

### 1. ⚙️ Setup & Queue
- **Target Environment Config**: Easily define your target environment URL along with optional username and password credentials.
- **Natural Language Scenarios**: Type or paste one or multiple test scenarios in plain English (e.g., *"Verify the login form fails with invalid password and shows a red alert"*).
- **Interactive Queue**: Manage, review, and clear your testing queue before starting the batch processing. Includes browser selection (Chromium, Firefox, WebKit) and test type tags (Functional, Accessibility, Performance).

### 2. 🕷️ Autonomous Website Crawler & UI Validation Engine
- **BFS Discovery & Site Mapping**: Automatically traverses website paths, normalizes URLs, maps route trees (sitemaps), and maps parent-child hierarchy in real time.
- **Dynamic State Explorer**: Scrapes the DOM to discover widget elements (modals, accordions, menu triggers, forms, tab layouts) and logs them as distinct testable states.
- **WCAG Compliance audits**: Employs **Axe Core** to run automated accessibility checks (WCAG 2.0-2.2 & Section 508) in both real browsers (Playwright) and simulations.
- **Multi-viewport Visual Regressions**: Generates and checks layout shifts across viewports (Desktop, Tablet, Mobile) and highlights shifts or color changes against baselines.
- **AI Defect Classification**: Feeds findings to Groq LLM to instantly categorize bugs by severity (Critical, High, Medium, Low), construct root cause explanations, and suggest HTML fixes.

### 3. 🖥️ Execution Logs
- **Live Terminal Logs**: Watch test and crawler runs in real time using a centered developer console style with custom icons.
- **Progress Tracking**: Clear visual progress indicators showing the completion rate of the current test batch.
- **Smart Transitions**: The application automatically shifts navigation to the logs when a run begins.

### 4. 📊 Detailed Results Table
- **Full-Width Interactive Grid**: A fully-featured spreadsheet table using **AG Grid Community** to view detailed results:
  - **AI RCA (Root Cause Analysis)**: Issue title, description, reason, and recommended bug fixes.
  - **Locator Self-Healing**: Automatically suggested locators when existing DOM selectors break, including confidence scores.
  - **Flakiness Classification**: Analytics determining whether failures are due to genuine bugs or flaky tests.
- **Data Exporting**: One-click actions to copy the results to clipboard (TSV) or download them as CSV/Excel formats.

### 5. 📈 Analytics Dashboard
- **Executive Metrics**: High-level visual statistics including Total Tests, Pass Rate %, Passed, Failed, and Flaky counts.
- **Interactive Charts**:
  - **Execution Status**: Donut pie chart summarizing pass, fail, flaky, and unknown distributions.
  - **Failure Severity**: Bar chart classifying failures by severity (Critical, High, Medium, Low) to help triage bugs.

---

## 🕷️ How the Autonomous Crawler Engine Works

The crawler runs an autonomous **11-step execution workflow**:

```
Step 1: BFS Page Discovery ──> Step 2: Generate Sitemap ──> Step 3: Build Route Graph 
       │
       ▼
Step 4: Identify Interactive Selectors ──> Step 5: Explore Safe UI States 
       │
       ▼
Step 6: Run E2E UI Tests ──> Step 7: Axe Accessibility Scan ──> Step 8: Multi-Viewport Screenshots 
       │
       ▼
Step 9: Baseline Comparison ──> Step 10: AI Defect Analysis ──> Step 11: Produce JSON Report
```

---

## 🛠️ Technology Stack & Core Tools

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite 8](https://vite.dev/) (For clean SPA structure and HMR)
- **AI Integrations**: [Groq API](https://groq.com/) using models like `llama-3.3-70b-versatile` (Powers test plan generation, RCA bug triaging, self-healing, flakiness checks, and crawler defect classifications)
- **Automation & Audits**: [Playwright](https://playwright.dev/) + [@axe-core/playwright](https://www.npmjs.com/package/@axe-core/playwright) (Runs E2E traversal, screen capture, and accessibility checks)
- **UI Components & Icons**: [Material UI (MUI v9)](https://mui.com/material-ui/) + [Lucide React](https://lucide.dev/) (Renders the premium light theme cards, layout tabs, console terminal, and inputs)
- **Data Grid**: [AG Grid Community (v35)](https://www.ag-grid.com/) (Renders the full-width results sheet with sorting, filtering, and data exporters)
- **Charts**: [Recharts (v3)](https://recharts.org/) (Calculates and displays visual analytics donut and bar charts)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (Maintains session credentials, active scenarios queue, and run results in memory)

---

## 📂 Project Structure

```bash
ai-ui-tester/
├── scripts/
│   └── run-crawler.ts       # Node.js CLI script executing the crawler engine
├── src/
│   ├── api/                 # Groq client configuration & services
│   ├── assets/              # Static assets & icons
│   ├── components/
│   │   ├── common/          # Global dialogs (API key setup)
│   │   ├── crawler/         # Autonomous crawler settings & dashboard panel
│   │   ├── dashboard/       # Stat cards, Pie & Bar charts
│   │   ├── input/           # Credentials form, Queue list, text field inputs
│   │   ├── layout/          # AppShell, Header, & NavTabs navigation
│   │   ├── processing/      # Progress bars & monospace log console
│   │   └── results/         # Results grid tables & custom cell badges
│   ├── hooks/               # Batch processor, export tools, dashboard calculators
│   ├── prompts/             # System and user prompts for Groq LLM
│   ├── services/
│   │   └── crawler/         # CrawlOrchestrator, SiteDiscovery, Axe & Visual services
│   ├── store/               # Zustand stores (scenario, session, result states)
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # CSV/XLSX export utils & column definition builders
│   ├── theme.ts             # MUI theme mode, palette, and style overrides
│   ├── main.tsx             # Application mount entrypoint
│   └── index.css            # Global CSS overrides
├── package.json
├── tsconfig.json
└── vite.config.ts           # Vite build parameters & base subfolder settings
```

---

## 🚀 Getting Started

### 📋 Prerequisites
Ensure you have **Node.js** (v18 or higher) and a package manager (**npm**, **yarn**, or **pnpm**) installed.

### 📥 Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Piyush-Patole/AI.UITester.git
   cd AI.UITester/ai-ui-tester
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Install browser binaries (for real crawling):
   ```bash
   npx playwright install chromium
   ```

### 💻 Running Locally

#### 1. Start the React Frontend Dashboard
To launch the Vite development server:
```bash
npm run dev
```
Open **[http://localhost:5173/AI.UITester/](http://localhost:5173/AI.UITester/)** in your browser. Go to the **Autonomous Crawler** tab to execute simulated or auth-driven crawls interactively.

#### 2. Run the Node CLI Crawler
To run the automated Playwright crawler locally from your terminal:
```bash
# Syntax:
npm run crawl -- <target-url> [max-depth]

# Example:
npm run crawl -- https://example.com 2
```
This runs the full 11-step crawlers audit and outputs a structured `crawl-report.json` to the root directory.

---

## 🏗️ Production Build & Local Deployment

### Compile the Assets
To build a highly optimized production bundle:
```bash
npm run build
```
This generates the static files in the `/dist` directory.

### Deploying to GitHub Pages
Since the project is configured with a base path of `/AI.UITester/`, you can deploy it to GitHub Pages.

#### Deployment Script
A simple and clean script to publish the `/dist` bundle directly to your `gh-pages` branch:
```powershell
# 1. Build the production files
npm run build

# 2. Navigate to build output
cd dist

# 3. Push to gh-pages branch
git init
git checkout -B gh-pages
git add -A
git commit -m "deploy: release on GitHub Pages"
git remote add origin https://github.com/Piyush-Patole/AI.UITester.git
git push -f origin gh-pages
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
