# Show R-GENIE Agent Status

Display the current enable/disable status of all R-GENIE agents.

## Execution

```bash
echo "R-GENIE ACCESS STATUS (.cursorignore):" && grep -E "^#?/r-genie/" .cursorignore | sed -e 's|^#/r-genie/|✅ ENABLED: /r-genie/|' -e 's|^/r-genie/|🚫 DISABLED: /r-genie/|'
```

## Status Legend

`.cursorignore` (agent **access** — read + index; Cursor-protected from agent edits):
- `#/r-genie/...` → **ENABLED** ✅ (commented = accessible)
- `/r-genie/...` → **DISABLED** 🚫 (uncommented = blocked)

## Quick Actions

- `/use-XX-agent-name` - Enable and load a specific agent
- `/enable-all-agents` - Enable all agents
- `/disable-all-agents` - Disable all agents
