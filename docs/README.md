# AI-Driven UI Testing Tool — Demo Version

This is a pure frontend, browser-only demonstration of the AI-Driven UI Testing Tool. It uses the Groq API (`llama-3.3-70b-versatile`) directly from the client to generate test plans, analyze failures, and suggest locators based on natural language or HAR/JSON inputs.

## Features
- **Natural Language Input**: Describe your test scenarios in plain English.
- **AI Test Generation**: Uses Groq to parse scenarios into structured Playwright test steps.
- **Simulated RCA**: Analyzes mock failures to provide root cause analysis and confidence scoring.
- **Self-Healing Locators**: Suggests alternative, stable locators for broken selectors.
- **Dashboard & Export**: Visualize results with charts and export to CSV/Excel.

## Getting Started

### Prerequisites
- Node.js (v18+)
- A valid [Groq API Key](https://console.groq.com/keys)

### Installation
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the development server.

### Usage
1. Open the application in your browser.
2. Enter your Groq API key when prompted (it is stored in memory only).
3. Enable "Demo Mode" in the header to pre-fill sample scenarios.
4. Click "Generate & Analyze" to see the AI in action.

## Deployment
This application is designed to be statically hosted on GitHub Pages, Netlify, or Vercel. 
Run `npm run build` to generate the static files in the `dist` directory.

## Backend Migration
Please refer to `BACKEND_MIGRATION.txt` for instructions on how to transition this demo into a production application with a real backend test execution engine.
