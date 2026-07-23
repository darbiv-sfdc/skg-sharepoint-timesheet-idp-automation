---
description: Package a single R-GENIE agent (and only the files it needs) into a standalone shareable directory
---

# Create Agent Distribution Package

Produce a **standalone, shareable copy** of this repo containing **exactly one** R-GENIE agent (and the minimal supporting files it needs to run inside Cursor / Windsurf). Useful when you want to hand off a single agent — built or tuned here — without leaking every other agent in the repo.

This is the generalized form of the trimming that produced this `r-genie-agent-builder` repo from the parent `r-genie-ai-codemate` repo.

---

## What the command does

1. **Discovers** all agents present in `r-genie/`
2. **Asks** you which one to package
3. **Asks** you where to write the package (default: sibling directory outside this repo)
4. **Mirrors** only the files required by the chosen agent into that destination
5. **Regenerates** the focused `README.md`, `.cursorignore`, `.windsurfignore`, and per-IDE command index so the package describes only that one agent
6. **Reports** the result and suggested next steps

The command is **interactive** — it stops at every decision point and waits for your approval before doing anything destructive.

---

## Phase 0 — Initialization

Confirm you're running this from the repo root. If not, stop and ask the user to `cd` to the root.

Verify these required paths exist:
- `r-genie/`
- `.cursor/commands/`
- `.windsurf/workflows/`
- `README.md`
- `LICENSE.md`

If any are missing, abort with a clear error.

---

## Phase 1 — Discover agents [STOP & WAIT after presenting]

An **R-GENIE agent** is any direct child folder of `r-genie/` that contains a `rules/` subfolder with at least one `.mdc` file.

Run:

```bash
find r-genie -mindepth 1 -maxdepth 1 -type d | while read d; do
  if find "$d/rules" -maxdepth 1 -name "*.mdc" 2>/dev/null | grep -q .; then
    echo "$d"
  fi
done
```

For each agent folder found, also read the first paragraph (or first heading) of `<folder>/README.md` (if present) to get a one-line description.

Present a numbered table to the user:

```
Agents available for packaging:

  #  | Agent                              | Purpose
  ---|------------------------------------|--------------------------------------
   1 | Agent_Builder_Cursor_Windsurf      | <one-line from README>
   2 | Agent_Tuner_Cursor_Windsurf        | <one-line from README>
   3 | <Any_Other_Agent>                  | <one-line from README>

Reply with the number or the full folder name of the agent you want to package.
```

⛔ **STOP AND WAIT** for the user's selection. Do **not** proceed without explicit input.

---

## Phase 2 — Confirm destination [STOP & WAIT]

Once the user picks an agent (call it `<Agent_Folder>`), derive a kebab-case slug from it:

```
<Agent_Folder>  =  Agent_Builder_Cursor_Windsurf
<kebab>         =  agent-builder-cursor-windsurf
```

Propose this default destination path:

```
../<kebab>-distribution/
```

(A sibling directory outside the current repo. The package is meant to be standalone, so keeping it outside the source repo's working tree is the cleanest default.)

Alternative options to offer:
- `project/output_distribution/<kebab>/` — keep inside this repo (still gitignored or moved later)
- A custom path the user provides

Show the user:

```
🎯 Selected agent: <Agent_Folder>
📦 Proposed destination: ../<kebab>-distribution/

Options:
  1. Use the default sibling path (../<kebab>-distribution/)
  2. Use project/output_distribution/<kebab>/ (inside this repo)
  3. Custom path — type it here
```

⛔ **STOP AND WAIT.**

Validation rules (run before proceeding):
- Destination must **not** be inside the source `r-genie/` folder.
- Destination must **not** be the current repo root.
- If destination already exists and is non-empty, ask whether to abort, overwrite, or pick a different path. ⛔ **STOP AND WAIT** for that answer too.

---

## Phase 3 — Inclusion / Exclusion plan [STOP & WAIT to show the plan]

Before any file is touched, present the exact plan as a checklist so the user can review it.

### ✅ Include

| Path in source | Path in package | Notes |
|---|---|---|
| `r-genie/AGENT_ARCHITECTURE_STANDARD.md` | `r-genie/AGENT_ARCHITECTURE_STANDARD.md` | Shared spec — required by every agent |
| `r-genie/<Agent_Folder>/` | `r-genie/<Agent_Folder>/` | Full recursive copy (rules, examples, lib, README, ARCHITECTURE.md, Production_Learnings.md) |
| `.cursor/commands/use-<kebab>.md` | `.cursor/commands/use-<kebab>.md` | Only this agent's activator |
| `.cursor/commands/enable-all-agents.md` | same | Shared admin |
| `.cursor/commands/disable-all-agents.md` | same | Shared admin |
| `.cursor/commands/show-agent-status.md` | same | Shared admin |
| `.cursor/commands/toggle-rgenie-visibility.md` | same | Shared admin |
| `.cursor/commands/add-production-learnings.md` | same | Shared admin |
| `.cursor/commands/create-agent-distribution-package.md` | same | This command — included so receivers can re-package |
| `.cursor/commands/README.md` | regenerated (see Phase 5) | Focused on single agent |
| `.cursor/rules/*.mdc` | same | All workspace rules |
| `.windsurf/workflows/*` | mirror of `.cursor/commands/*` above | Same shape, `.windsurfignore` instead of `.cursorignore` |
| `.windsurf/rules/*.md` | same | All workspace rules |
| `docs/` | `docs/` | Entire folder (framework-level docs) |
| `LICENSE.md` | same | |
| `R-Genie_Framework.jpg` | same | |
| `.gitignore` | same | |
| `.vscode/settings.json` | same | If present |
| `.cursorignore` | regenerated (see Phase 5) | Entry only for chosen agent |
| `.windsurfignore` | regenerated (see Phase 5) | Entry only for chosen agent |
| `README.md` | regenerated (see Phase 5) | Focused on single agent |

### ❌ Exclude

- Every other `r-genie/<OtherAgent>/` folder
- Every other agent's activator: `.cursor/commands/use-<other-kebab>.md` and `.windsurf/workflows/use-<other-kebab>.md`
- `project/` — per-session state folders
- `temp/`, `node_modules/`, `target/`, `build/`, `dist/`
- `.git/` — the destination starts with no history
- `.DS_Store`, `Thumbs.db`
- Any `*_Production_Learnings.md` belonging to *other* agents (only the chosen agent's learnings ship)
- Any `cursor_agent_builder_usage.md` or other chat-transcript files at the repo root

### 📦 Package summary

Present to the user:

```
📦 Package plan for <Agent_Folder>:

  Destination:   <resolved-absolute-path>
  Files to copy: ~<N> files / ~<size> total
  Agents in package: 1 (<Agent_Folder>)

⛔ Confirm before proceeding: type 'proceed' / 'cancel'
```

⛔ **STOP AND WAIT.**

---

## Phase 4 — Create the package

After `proceed`, execute in order:

**4a. Create destination skeleton**

```bash
mkdir -p "<DEST>/r-genie" \
         "<DEST>/.cursor/commands" \
         "<DEST>/.cursor/rules" \
         "<DEST>/.windsurf/workflows" \
         "<DEST>/.windsurf/rules" \
         "<DEST>/docs"
```

**4b. Copy `r-genie/`**

```bash
cp r-genie/AGENT_ARCHITECTURE_STANDARD.md "<DEST>/r-genie/"
cp -R "r-genie/<Agent_Folder>" "<DEST>/r-genie/"
```

**4c. Copy `.cursor/`**

```bash
# Shared admin commands + this agent's activator
for cmd in enable-all-agents disable-all-agents show-agent-status \
           toggle-rgenie-visibility add-production-learnings \
           create-agent-distribution-package use-<kebab>; do
  [ -f ".cursor/commands/$cmd.md" ] && cp ".cursor/commands/$cmd.md" "<DEST>/.cursor/commands/"
done
cp -R .cursor/rules/* "<DEST>/.cursor/rules/"
```

**4d. Copy `.windsurf/`** (mirror)

```bash
for wf in enable-all-agents disable-all-agents show-agent-status \
          toggle-rgenie-visibility add-production-learnings \
          create-agent-distribution-package use-<kebab>; do
  [ -f ".windsurf/workflows/$wf.md" ] && cp ".windsurf/workflows/$wf.md" "<DEST>/.windsurf/workflows/"
done
cp -R .windsurf/rules/* "<DEST>/.windsurf/rules/"
```

**4e. Copy framework-level files**

```bash
cp -R docs/* "<DEST>/docs/"
cp LICENSE.md R-Genie_Framework.jpg "<DEST>/"
[ -f .gitignore ] && cp .gitignore "<DEST>/"
[ -d .vscode ] && cp -R .vscode "<DEST>/"
```

---

## Phase 5 — Regenerate focused files

These four files in the destination must describe **only** the packaged agent. Do **not** copy them verbatim — generate them fresh.

**5a. `<DEST>/.cursorignore`**

```
# Cursor AI Indexing Ignore Patterns

# =====================================
# R-GENIE AGENT CONTROL
# =====================================
# Comment line = ENABLED | Uncomment line = DISABLED
# Use /enable-XX or /disable-XX commands to manage
#
# This package contains a single agent:
#   - <Agent_Folder>

/r-genie/<Agent_Folder>/

# =====================================
# Always Excluded Directories
# =====================================
/do-not-index/
/temp/
/temp/**
/.windsurf/
.windsurfignore

# =====================================
# INCLUDED FOR AI AWARENESS
# =====================================
!/.cursor/rules/

# =====================================
# COMMON EXCLUDES
# =====================================
**/node_modules/
**/build/
**/dist/
**/target/
**/coverage/
**/*.log
**/*.lock
**/.vscode/
**/.idea/
**/.DS_Store
```

**5b. `<DEST>/.windsurfignore`** — same shape but with `.windsurf` ↔ `.cursor` swapped at the bottom.

**5c. `<DEST>/.cursor/commands/README.md`** and `<DEST>/.windsurf/workflows/README.md`

Generate an index that lists only the commands actually present in the package: `/use-<kebab>` plus the shared admin commands. Follow the same shape as this repo's existing per-IDE READMEs.

**5d. `<DEST>/README.md`** — focused root README

Generate a fresh root README that describes:
- This is a distribution package containing **one** R-GENIE agent (`<Agent_Folder>`)
- How to install (clone, open in Cursor / Windsurf)
- How to activate the agent: `/use-<kebab>`
- The full admin-command surface
- Project layout (only what's actually in the package)
- A pointer back to the parent repo (`r-genie-agent-builder`) for context

Keep it concise (~100 lines). Use the same tone/structure as the parent repo's README.

---

## Phase 6 — Optional: initialize git [STOP & ASK]

Ask the user:

```
The package is created at <DEST>. Do you want to:
  1. Initialize it as a fresh git repo (recommended for hand-off — single initial commit)
  2. Leave it un-versioned (you'll init / push it yourself later)
```

If option 1:

```bash
cd "<DEST>" && \
git init && \
git add -A && \
git commit -m "Initial commit — distribution package for <Agent_Folder>"
```

**Per R-GENIE Git Push Protection, never push the new repo without explicit user instruction.**

---

## Phase 7 — Report

Present a summary:

```
✅ Package created

📦 Destination:        <DEST>
🧞‍♂️ Packaged agent:     <Agent_Folder>
📂 Top-level entries:  <tree summary from `ls -la <DEST>`>
📊 Stats:              <file count> files, <size> total
🌿 Git:                <initialized | not initialized>

Next steps:
  cd <DEST>
  # Open in Cursor or Windsurf
  # Run /use-<kebab> to activate the packaged agent
```

End the workflow. **Do not** modify the source repo — this command is read-only against the source.

---

## Anti-patterns (do NOT do)

- ❌ Do not skip any STOP & WAIT — every Phase 1, 2, 3, 6 boundary requires explicit user approval.
- ❌ Do not delete or modify anything in the **source** repo. This command is read-only against the source.
- ❌ Do not include other agents' folders, activators, or Production_Learnings in the package.
- ❌ Do not include `project/`, `.git/`, `temp/`, `node_modules/`, or chat-transcript files.
- ❌ Do not `git push` the new repo. Stop at `git commit` per R-GENIE Git Push Protection.
- ❌ Do not write the package into the source `r-genie/` tree (workspace-organization rule).

---

## Display on activation

```
CREATE AGENT DISTRIBUTION PACKAGE - ACTIVATED

🧞‍♂️ R-GENIE (AI-CodeMate) by Cheppali Shaik Sohail
   Mode: Repo packaging | Read-only against source

✅ Ready | 🛑 Checkpoints at every phase (4 stops)
📂 Output: sibling directory (default) or your choice

📥 HOW TO USE:
  • The command will list every agent in r-genie/
  • Pick one, confirm destination, review the plan
  • The command does the file copy + focused README/ignore regen
  • Optional: it can init a fresh git repo for you

⚠️ DISCLAIMER: AI-generated output. Review the package before sharing.

🚀 Listing available agents now…
```
