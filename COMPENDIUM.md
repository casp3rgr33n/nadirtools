# NadirTools Developer & Agent Compendium

Welcome to **NadirTools** (a product of Solitude Dark Labs). This compendium serves as the master source of truth for developer agents working on this codebase.

---

## 🎯 Project Mission & The 1000 Tools Goal

NadirTools is designed to be the ultimate, high-performance, client-side product suite for developers, sysadmins, database managers, and financial analysts. 

### 1. Zero-Telemetry Privacy
To preserve absolute user privacy, **100% of calculations must run fully client-side in the browser context**. No string inputs, database payloads, network logs, or financial matrices are ever uploaded or transmitted to any backend database.

### 2. The 1000 Tools Vision
The long-term roadmap for this repository is to scale to **1,000 distinct, client-side utility engines and calculators**. Every new tool must follow the exact modular pattern detailed below to ensure code sanity, automated testability, and organic SEO indexing at scale.

---

## 📂 Codebase & Architecture Overview

The active codebase is located in the native Linux filesystem:
- **WSL Path**: `/home/casp3r/nadirtools`
- **Windows Host Network Path**: `\\wsl.localhost\Ubuntu\home\casp3r\nadirtools\` (used by AI coding assistants running on Windows)

The workspace is a monorepo consisting of:
- `apps/web/app/` — Next.js App Router endpoints.
- `apps/web/components/` — UI components and interactive forms.
- `apps/web/utils/calculations.ts` — The core calculation engine.
- `apps/web/utils/test-runner.ts` — TypeScript test suite for calculators.
- `config/tool-constants.json` — Static index mapping metadata, SEO configurations, and guide page contents.

---

## 🛠️ The Expansion Protocol (How to Add a Tool)

When adding tool #6, #7, and onward toward the 1,000 tools goal, follow these sequential steps:

### Step 1: Define Metadata in `tool-constants.json`
Add a new object matching the slug of your tool under `tools` in [tool-constants.json](file:///c:/Users/Casp3r/AI/nadirtools/config/tool-constants.json):
```json
"your-tool-slug": {
  "publishedAt": "2026-06-20T12:00:00Z",
  "name": "Human Readable Tool Name",
  "category": "networking | security | finance | dev | database",
  "slug": "your-tool-slug",
  "description": "Short explanation of the utility.",
  "disclaimer": "Safety or audit disclaimer context.",
  "math": {
    "config_variable": 100
  },
  "guides": {
    "first-technical-guide": {
      "publishedAt": "2026-06-20T12:15:00Z",
      "title": "Title of the Accompanying Technical Article",
      "summary": "SEO-friendly description of the article.",
      "content": [
        "### Markdown Heading",
        "Body content explanation of the math or system architecture.",
        "\\[ \\text{Latex equations are supported} \\]"
      ]
    }
  }
}
```

### Step 2: Implement Calculation logic in `calculations.ts`
Write pure, stateless mathematical logic in [calculations.ts](file:///c:/Users/Casp3r/AI/nadirtools/apps/web/utils/calculations.ts). Do not touch React state here.
```typescript
export function calculateYourTool(param1: number, config: any) {
  // Pure logic
  return { result: param1 * config.config_variable };
}
```

### Step 3: Write Assertions in `test-runner.ts`
Add unit tests verifying your mathematical engine in [test-runner.ts](file:///c:/Users/Casp3r/AI/nadirtools/apps/web/utils/test-runner.ts):
```typescript
// Import your function at the top
const testResult = calculateYourTool(10, { config_variable: 5 });
assertEqual(testResult.result, 50, "Your tool multiplication logic is correct");
```

### Step 4: Add UI View in `ToolWrapper.tsx`
Create the client interface and bind its UI state using the calculations function inside [ToolWrapper.tsx](file:///c:/Users/Casp3r/AI/nadirtools/apps/web/components/ToolWrapper.tsx):
- Map `your-tool-slug` to render your new sub-component.
- Use stateless input forms.

---

## 🧪 Verification & Test Workflows

Always verify code correctness before proposing commits or deployments.

### 1. Run Unit Tests (WSL Node environment)
Since Node/NPM environments reside in WSL, execute tests via interactive bash:
```bash
wsl bash -i -c "cd /home/casp3r/nadirtools/apps/web && npx tsx utils/test-runner.ts"
```

### 2. Verify Next.js Build
Compile and bundle the production assets for Cloudflare using OpenNext:
```bash
wsl bash -i -c "cd /home/casp3r/nadirtools/apps/web && npm run build"
```

---

## 🚀 Push & Deployment Guide (CRITICAL)

### Avoid Interactive Git Prompts
> [!WARNING]
> Running standard `wsl git push` will hang indefinitely. This occurs because the terminal is non-interactive (non-TTY) and Git tries to prompt for username/credentials in the background.

### Recommended Push Flow
Always use the `github-mcp-server` `push_files` tool to bypass local credential issues. 

If the size of your modified files is large (e.g. >100KB), **never push all files in a single tool call** as it will exceed the LLM output token limits (typically 8,192 tokens) and get truncated. Instead, group your files and commit them in batches of 2-3 files.

---

## 🎨 Responsive UI & Widget Integration Guidelines

### 1. Viewport Constraints & Scroll Behavior
All modals, dialogs, and flyout overlays must include bounds checking to ensure they never clip off the screen on small/mobile devices:
- **Restrict height**: Apply `maxHeight: "calc(100vh - 2rem)"` (or similar viewport margins).
- **Enable scrolling**: Add `overflowY: "auto"` to allow the contents of the modal to scroll vertically if the screen height is too small or if an on-screen keyboard is active.
- **Compact grids**: Use flexible wrapping (`flexWrap: "wrap"` with a responsive flex-basis like `flex: "1 1 200px"`) and keep gaps/paddings tighter (`0.5rem` to `1rem`) to fit small viewports.

### 2. Guarding Optional External Integrations
External elements (such as Cloudflare Turnstile, captcha widgets, or external third-party embeds) must only load and render if their respective site credentials/keys are defined in environment variables:
- **Frontend check**: Do not load the external `<Script>` or mount the widget target container if the environment variable (e.g., `NEXT_PUBLIC_TURNSTILE_SITE_KEY`) is falsy or missing.
- **Server check**: Write server-side handlers to conditionally skip/bypass checking validation tokens if matching secret keys are not configured locally or in staging environments.

