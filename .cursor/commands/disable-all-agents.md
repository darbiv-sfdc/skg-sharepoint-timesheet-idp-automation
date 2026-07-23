# Disable All R-GENIE Agents

Disable ALL R-GENIE agents from indexing at once.

## Execution

```bash
sed -i '' 's|^#/r-genie/|/r-genie/|' .cursorignore
```

> ⚠️ The agent attempts this command **once**. If the `.cursorignore` write is blocked (Cursor protects this path from agent edits), it will **not retry or use workarounds** — it asks you to run it in your own terminal, then waits.

## Confirm

Report: "🚫 **ALL 9 R-GENIE agents** are now **DISABLED** - Reduced Cursor context"

To re-enable and use a specific agent, run `/use-XX-agent-name` (e.g., `/use-01-technical-design`).
