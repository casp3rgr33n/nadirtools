# NadirTools Developer & Agent Compendium

Welcome to **NadirTools** (a product of Solitude Dark Labs). This compendium serves as the source of truth for developer agents working on this codebase.

---

## 📂 Codebase & Architecture Overview

NadirTools is a high-performance, client-side utility suite built with **Next.js** and deployed via **OpenNext / Cloudflare Workers**. All calculations must run fully client-side to preserve absolute user privacy.

### Core Directory Structure
- `apps/web/app/` — Next.js App Router routes.
- `apps/web/utils/calculations.ts` — Contains the extracted mathematical calculations for all interactive tools (Subnets, Firewall ACL Validator, Freelance Tax, Cron Expression Visualizer, Cash-on-Cash Yield).
- `apps/web/utils/test-runner.ts` — Interactive TypeScript unit test suite.
- `config/tool-constants.json` — Static definitions, guides metadata, and anchor publication timestamps (`publishedAt`) for sitemap generators.

---

## 🧪 Verification & Test Workflows

Always verify code correctness before proposing commits or deployments.

### 1. Run Unit Tests (WSL Node environment)
Since Node/NPM environments reside in WSL, execute tests via interactive bash:
```bash
wsl bash -i -c "cd /mnt/c/Users/Casp3r/AI/nadirtools/apps/web && npx tsx utils/test-runner.ts"
```

### 2. Verify Next.js Build
Compile and bundle the production assets for Cloudflare using OpenNext:
```bash
wsl bash -i -c "cd /mnt/c/Users/Casp3r/AI/nadirtools/apps/web && npm run build"
```

---

## 🚀 Push & Deployment Guide (CRITICAL)

### Avoid Interactive Git Prompts
> [!WARNING]
> Running standard `wsl git push` will hang indefinitely. This occurs because the terminal is non-interactive (non-TTY) and Git tries to prompt for username/credentials in the background.

### Recommended Push Flow
Always use the `github-mcp-server` `push_files` tool. This tool pushes code changes via the GitHub REST API using the pre-authenticated session, bypassing local credential issues entirely.

#### MCP Tool Configuration
- **Server**: `github-mcp-server`
- **Tool**: `push_files`
- **Arguments**:
  - `owner`: `"casp3rgr33n"`
  - `repo`: `"nadirtools"`
  - `branch`: `"main"`
  - `message`: `"<commit-message>"`
  - `files`: Array of `{ path: string, content: string }`

To prepare the payload safely:
1. Generate the payload of modified files using a python script to read file contents without line numbers.
2. Direct the model to call `push_files` with the accumulated file array.
