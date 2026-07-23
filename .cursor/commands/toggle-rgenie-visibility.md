# Toggle R-GENIE Visibility

Toggles `.vscode/settings.json` between two deterministic states. One file, one key-block change, byte-identical output every run.

## States

| State       | Explorer visibility | Editability          |
|-------------|---------------------|----------------------|
| **HIDDEN**  | R-GENIE files hidden | readonly (locked)   |
| **VISIBLE** | R-GENIE files shown  | editable (unlocked) |

- Always visible: `README.md`, `project/`
- Always hidden: `.git`, `.svn`, `.hg`, `.DS_Store`, `Thumbs.db`, `.mule`, `temp/`
- `files.exclude` is UI-only. AI still searches/reads/watches everything.

## Execution (3 steps, zero ambiguity)

### Step 1 — Detect current state

Read `.vscode/settings.json` with `read_file`. The `// R-GENIE Workspace` marker is the single source of truth:

| Marker value starts with… | Current | Target  |
|---------------------------|---------|---------|
| `"HIDDEN"`                | HIDDEN  | VISIBLE |
| `"VISIBLE"`               | VISIBLE | HIDDEN  |
| file missing / no marker  | —       | HIDDEN  |

### Step 2 — Apply the canonical target blob (execute-or-ask)

`.vscode/` is a **Cursor-protected path**: the agent's `edit` / `write_to_file` tools cannot modify `.vscode/settings.json` from inside the IDE sandbox (the write fails with `operation not permitted`). So this step uses the **execute-or-ask** pattern — attempt the write, and if it is blocked, hand the user one command to run in their own (unsandboxed) terminal.

**2a — Attempt (agent).** Try the `edit` tool on `.vscode/settings.json`:
- `old_string` = the **entire current file content** returned by `read_file` in Step 1
- `new_string` = the **exact canonical blob below** for the target state — copy verbatim, no paraphrasing, no reordering, no added/removed keys

If the file does not exist, try `write_to_file` with the canonical blob.

> **Preservation rule:** If the current file contains any top-level key other than `// R-GENIE Workspace`, `files.exclude`, `files.readonlyInclude` (e.g., `claudeCode.environmentVariables`), use `multi_edit` to replace only those three managed blocks and keep the extras untouched. Otherwise, full-file replacement is required.

**2b — Fall back to the user (when the write is blocked).** Do **not** report failure. Assemble the **complete** target file — the canonical blob for the target state, with any extra top-level keys from Step 1 merged back in — and present it to the user as a single copy-paste command, then **wait for their confirmation** before Step 3:

```bash
cat > .vscode/settings.json << 'EOF'
<full assembled target JSON — canonical blob + preserved extras>
EOF
```

The quoted delimiter (`'EOF'`) writes the body literally, so the result is byte-identical to the blob you assembled. The user's terminal is not sandboxed, so this write succeeds.

#### Canonical HIDDEN blob

```json
{
  "// R-GENIE Workspace": "HIDDEN — R-GENIE files invisible + readonly",
  "files.exclude": {
    "**/.git": true,
    "**/.svn": true,
    "**/.hg": true,
    "**/.DS_Store": true,
    "**/Thumbs.db": true,
    ".mule": true,
    "**/.vscode/**": true,
    "**/.cursor/**": true,
    "**/.windsurf/**": true,
    "**/r-genie/**": true,
    "**/docs/**": true,
    "**/.cursorignore": true,
    "**/.windsurfignore": true,
    "**/.gitignore": true,
    "**/LICENSE.md": true,
    "**/R-Genie_Framework.jpg": true,
    "**/install-r-genie.sh": true,
    "**/project/**": false
  },
  "files.readonlyInclude": {
    "**/r-genie/**": true,
    "**/.cursor/**": true,
    "**/.windsurf/**": true,
    "**/docs/**": true,
    "**/LICENSE.md": true,
    "**/R-Genie_Framework.jpg": true,
    "**/install-r-genie.sh": true,
    "**/README.md": true
  }
}
```

#### Canonical VISIBLE blob

```json
{
  "// R-GENIE Workspace": "VISIBLE — R-GENIE files shown + editable",
  "files.exclude": {
    "**/.git": true,
    "**/.svn": true,
    "**/.hg": true,
    "**/.DS_Store": true,
    "**/Thumbs.db": true,
    ".mule": true,
    "**/bkp/**": false,
    "**/.vscode/**": false,
    "**/.cursor/**": false,
    "**/.windsurf/**": false,
    "**/r-genie/**": false,
    "**/docs/**": false,
    "**/.cursorignore": false,
    "**/.windsurfignore": false,
    "**/.gitignore": false,
    "**/LICENSE.md": false,
    "**/R-Genie_Framework.jpg": false,
    "**/install-r-genie.sh": false,
    "**/project/**": false
  },
  "files.readonlyInclude": {}
}
```

### Step 3 — Confirm

Only after the change is actually applied — the agent's edit succeeded, or the user confirms they ran the Step 2b command — reply with exactly one line:
- `✅ R-GENIE: **HIDDEN** — files invisible + readonly`
- `✅ R-GENIE: **VISIBLE** — files shown + editable`

## Guardrails

- **Agent writes** only via `edit` / `multi_edit` / `write_to_file` on `.vscode/settings.json` — never a shell heredoc of its own.
- The `cat > … << 'EOF'` heredoc in Step 2b is the **only** sanctioned heredoc, and it is for the **user** to run when the agent's write is blocked. Always quote the delimiter (`'EOF'`) so the body is written literally.
- Never edit any file other than `.vscode/settings.json`.
- The two canonical blobs above are the contract. If they change, update both `.cursor/commands/toggle-rgenie-visibility.md` and `.windsurf/workflows/toggle-rgenie-visibility.md` together.
