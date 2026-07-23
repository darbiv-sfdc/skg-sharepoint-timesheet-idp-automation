# R-GENIE Cursor Commands

Complete reference for all available R-GENIE Cursor commands.

---

## Agent Activation

Load agents instantly with setup and activation:

| Command | Agent |
|---------|-------|
| `/use-00-master-orchestrator` | Master Orchestrator (7-stage pipeline) |
| `/use-01-technical-design` | Technical Design (6-phase workflow) |
| `/use-02-api-specification` | API Specification (RAML/OpenAPI) |
| `/use-03-app-development` | App Development (MuleSoft 4.6+) |
| `/use-03-01-dataweave` | DataWeave Transformation |
| `/use-04-munit` | MUnit Testing |
| `/use-05-readme` | ReadMe Documentation |
| `/use-06-code-review` | Code Review (100-point scoring) |
| `/use-07-error-analysis` | Error Analysis |
| `/use-08-boomi-documentation` | Boomi Documentation |

---

## Agent Management

| Command | Purpose |
|---------|---------|
| `/enable-all-agents` | Enable all agents for indexing |
| `/disable-all-agents` | Disable all agents from indexing |
| `/show-agent-status` | Display current agent status |

### Enable/Disable mechanism

| File | Controls | Agent-writable? | Notes |
|------|----------|-----------------|-------|
| `.cursorignore` | Agent **access** (read + index) | ❌ No — Cursor hard-protects this path | Comment a line to **enable** an agent, uncomment to **disable** it |

> `.cursorignore` is the single source of truth. Because Cursor write-protects it, the `/enable-*`, `/disable-*`, and `/use-*` commands follow an **execute-or-ask** pattern: the agent attempts the `sed -i ''` edit, and if the write is blocked it hands you the exact command to run in your own terminal.

---

## Workspace Management

| Command | Purpose |
|---------|---------|
| `/setup-rgenie-cursor` | Configure workspace for Cursor |
| `/toggle-rgenie-visibility` | Toggle R-GENIE file visibility |

---

## Knowledge Base

| Command | Purpose |
|---------|---------|
| `/add-production-learnings` | Add production insights to agent knowledge |

---

## General Tips

- **One agent per chat** — Always start a new chat with the relevant `/use-XX` command. Do not mix agents in a single chat.
- **Clean workspace** — Remove unnecessary projects/files from your workspace (move to `temp/` or outside). This avoids indexing irrelevant content and keeps agents focused.
- **Forensic review (optional)** — At the end of a task, switch to a premium model (e.g., Claude Opus) for a final review of your entire conversation for higher accuracy.
- **PDF/Word inputs** — Copy text to `.txt` or `.md` files, and take screenshots for visual content. For Word docs, export via Google Docs to markdown.

---

## Quick Start

```bash
/use-01-technical-design    # Activates agent and creates folders
# Place requirements in project/input_01_design/
# Start working!
```
