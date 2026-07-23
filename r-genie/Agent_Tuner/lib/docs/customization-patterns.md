# Agent Tuner - Detailed Customization Patterns

**Purpose:** Detailed per-agent customization patterns, file modification guides, and validation checklists.  
**Author**: Cheppali Shaik Sohail  
**Version:** 1.1.0

---

## 1. Customizable Artifacts Per Agent

### Agent 01: Technical Design

| Artifact | File | Customization Scope |
|----------|------|---------------------|
| Main Entry | `rules/01_Technical_Design.mdc` | RISEN, phase count, critical rules, output structure |
| Template Config | `rules/01-00_Template_Configuration.mdc` | Pre-generation checklist, template structure |
| Phase Orchestration | `rules/01-01_Phase_Orchestration.mdc` | Phase tasks, checkpoints, state schema |
| Guidance | `rules/01-02_Guidance.mdc` | Architecture patterns, diagram strategy, field mapping formats, pitfalls |
| Stop Points | `rules/01-03_Mandatory_Stop_Points.mdc` | Phase-specific stops, self-check |
| Style YAML | `templates/design-style.yaml` | Section structure, inclusion flags, naming, output config |
| Template Guide | `templates/design-template-guide.md` | Section-by-section content guide (what goes where, when to produce) |
| Examples | `examples/*.md` | Design document formatting reference (batch, real-time, event-driven, multi-system) |

**Key customization flow:**
1. User provides design template (screenshot/image/markdown)
2. Convert to markdown example → confirm
3. Walk through each section conversationally → build template guide
4. Auto-generate style YAML from template guide
5. Update rules with project-specific behavioral guidance

### Agent 02: API Specification

| Artifact | File | Customization Scope |
|----------|------|---------------------|
| Main Entry | `rules/02_API_Specification.mdc` | RISEN, format support, non-negotiable rules |
| Template Config | `rules/02-00_Template_Configuration.mdc` | Example selection, pre-generation checklist |
| Phase Orchestration | `rules/02-01_Phase_Orchestration.mdc` | Phase tasks, checkpoints |
| Guidance | `rules/02-02_Guidance.mdc` | RAML/OAS patterns, security, quality scoring |
| Stop Points | `rules/02-08_Mandatory_Stop_Points.mdc` | Phase-specific stops |
| Examples | `examples/` | RAML and OAS example projects (folder-based) |

**Key customization flow:**
1. User provides example RAML/OAS project
2. Extract traits, fragments, security schemes, exchange_modules
3. Place example project in `examples/` as named folder
4. Update Template Configuration with project-specific checklist
5. Update Guidance with project-specific patterns (naming, versioning, traits)

### Agent 03: App Development

| Artifact | File | Customization Scope |
|----------|------|---------------------|
| Main Entry | `rules/03_App_Development.mdc` | RISEN, phase workflow, critical rules |
| Phase Orchestration | `rules/03-00_Phase_Orchestration.mdc` | Phase tasks, checkpoints |
| Guidance | `rules/03-01_Guidance.mdc` | Component reference, error patterns |
| Stop Points | `rules/03-02_Mandatory_Stop_Points.mdc` | Phase-specific stops |
| Examples | `examples/` | MuleSoft project examples, patterns-index, common-projects |
| Lib Docs | `lib/docs/` | component-reference.md, error-patterns.md, version-compatibility.md |

**Key customization flow:**
1. User provides example MuleSoft project(s)
2. Extract flow structure, common modules, config patterns, DataWeave patterns
3. Place example project in `examples/` with `pattern.md` architecture description
4. Add common error handling/components to `examples/common-projects/`
5. Create/update patterns index
6. Update Guidance with project-specific patterns

### Agents 04-09: General Pattern

| Agent | Key Artifacts | Primary Focus |
|-------|--------------|---------------|
| 04 MUnit | rules/ + examples/ | Test patterns, assertion strategies |
| 05 README | rules/ + templates/ + examples/ | Document structure, badge format |
| 06 Code Review | rules/ + templates/ + examples/ | Review criteria, scoring |
| 07 Error Analysis | rules/ + templates/ + examples/ | Error classification patterns |
| 08 Boomi Documentation | rules/ | Boomi-specific documentation |

---

## 2. Template Guide Construction Pattern (Agent 01)

### Section-by-Section Conversation Flow

For each section in the user's confirmed example:

```
1. EXTRACT section name and subsections from the example
2. PRESENT to user with summary of what the section contains
3. ASK 4 questions:
   a. Project-specific standards for this section?
   b. Content that should ALWAYS or NEVER be included?
   c. Specific diagram types or placements?
   d. Naming conventions or formatting rules?
4. RECORD user's answers (or "default" to keep as-is)
5. MOVE to next section
```

### Template Guide Structure

```markdown
# {Project} Technical Design Document Template Guide

**Purpose:** Content guide for each section
**Author**: {author}

## Document Structure Overview
### Core Sections
{list from design-style.yaml where include: true}

### Supplementary Sections (if any)
{list from design-style.yaml supplementary}

## Section-by-Section Guide

### {N}. {Section Name}
**When to Produce:** `include: true` (or condition)

**What Goes Here:**
- **{N}.1 {Subsection}**
  - {content description}
  - {project-specific standards from user}

**Format:** {formatting guidance}
**Project Standards:** {user-provided standards for this section}

---
{repeat for each section}

## Diagram Placement Rules
{from user's answers about diagram placement}

## Content Guidelines
### DO Include:
{from user's "ALWAYS include" answers}

### DO NOT Include:
{from user's "NEVER include" answers}

## Validation Checklist
{compiled from all section-specific requirements}
```

---

## 3. Example Project Placement Patterns

### For Technical Design (01)
```
r-genie/01_Technical_Design_Agent/examples/
├── {existing examples}
└── {NN}_{project_pattern}_design.md    # New example from user's template
```

### For API Specification (02)
```
r-genie/02_API_Specification_Agent/examples/
├── {existing examples}
└── {project-api-name}/                  # New example project folder
    ├── {api-name}.raml (or .yaml)
    ├── fragments/ (or components/)
    │   ├── libraries/
    │   ├── traits/
    │   └── security-schemes/
    └── examples/
```

### For App Development (03)
```
r-genie/03_App_Development_Agent/examples/
├── {existing examples}
├── {project-name}/                      # New example project
│   ├── pattern.md                       # Architecture description (REQUIRED)
│   ├── pom.xml
│   ├── src/main/mule/
│   └── src/main/resources/
└── common-projects/                     # Shared modules
    └── {module-name}/
```

---

## 4. Rules Modification Patterns

### RISEN Framework Update Pattern

```
BEFORE (generic):
| R - ROLE | MuleSoft Integration Architect - Technical design |

AFTER (project-specific):
| R - ROLE | MuleSoft Integration Architect - {project context}, 
{specific capabilities}, {project-compliant outputs} |
```

Key: Make RISEN specific to the project's technology stack, source/target systems, and compliance requirements.

### Guidance Addition Pattern

Always APPEND to existing sections. Never restructure.

```markdown
### {Title}
<!-- Added: {YYYY-MM-DD} via Agent Tuner -->

{Direct instruction or pattern. Keep concise.}

{Minimal example if needed}
```

### Stop Point Addition Pattern

```markdown
### {Phase N}: {Project-Specific Stop Name}
```
🚨 {STOP TITLE}

{Context for when this stop applies}

{Question format with clear options}

→ Option A: {description}
→ Option B: {description}

Waiting for your answer...
```
```

---

## 5. Validation Checklists Per Agent Type

### Template-Based Agents (01, 02, 05, 06, 07)

- [ ] templates/*.yaml has correct section structure
- [ ] templates/*-template-guide.md has section-by-section guide
- [ ] No section numbers/names hardcoded in rules/
- [ ] Rules reference templates for structural details
- [ ] Examples match template structure

### Example-Based Agents (02, 03)

- [ ] Example project placed in correct location
- [ ] Example has complete structure (not partial)
- [ ] README/patterns-index updated with new example
- [ ] pattern.md exists for App Dev examples
- [ ] Common modules in correct location

### All Agents

- [ ] RISEN framework complete (5 elements)
- [ ] Quick Reference table in every rule file
- [ ] Version numbers consistent across all rule files
- [ ] INDEX.md reflects current state
- [ ] README.md updated
- [ ] ARCHITECTURE.md updated
- [ ] All cross-references valid
- [ ] File sizes within limits
- [ ] Prompt techniques present (thinking, confidence, RGV, few-shot, ReAct, HITL)
- [ ] Mermaid diagrams comply with `lib/docs/mermaid-diagram-best-practices.md` (see §7 Mermaid Standards Retrofit)

---

## 7. Mermaid Standards Retrofit Pattern

**Purpose:** Retroactively bring an existing agent's Mermaid diagrams (and its guardrails for future diagrams) up to the R-GENIE Mermaid Diagram Standards defined in `lib/docs/mermaid-diagram-best-practices.md`.

**When to apply:** Any agent that (a) emits Mermaid diagrams in its rule files (Phase Orchestration state machine, INDEX.md dependency map/workflow, ARCHITECTURE.md flow), OR (b) produces Mermaid diagrams in its domain deliverables (HLD, flow map, architecture docs, design docs). In practice this applies to nearly every R-GENIE agent.

**Canonical reference:** `lib/docs/mermaid-diagram-best-practices.md` (Agent Tuner local copy; mirrors Agent Builder's copy).

### 7.1 Diagnostic Checklist (apply first — identify what needs fixing)

Read every `.md`/`.mdc` file in the target agent's `rules/`, `examples/`, `templates/`, and any domain-specific directories. For every Mermaid block found, verify:

| Check | Pass Criterion | Common Failure |
|-------|----------------|----------------|
| Init directive | `flowchart`/`graph` starts with `%%{ init: { 'flowchart': { 'curve': 'linear' } } }%%` | Missing → arrows curve and overlap in dense diagrams |
| Line breaks | Labels use `<br/>` | `\n` present → renders as literal text |
| Node declaration order | Upstream → downstream | Alphabetical or arbitrary → layout engine picks wrong orientation |
| Connection order | Primary path first, branching second | Reversed → arrows cross |
| Connection group separation | Blank line between distinct groups | Contiguous → renderer routes on one lane |
| Arrow semantics | Solid `-->` forward, dashed `-.->` return/async — consistent within diagram | Mixed semantics |
| Edge label discipline | Short action/protocol/event | Long sentences or duplicated IDs on fan-out arrows |
| Style placement | All `style` at end, in node-declaration order | Interleaved with nodes/connections |
| Label quoting | Labels with spaces/parens/slashes wrapped in `"..."` | Unquoted → parser warnings |
| Dangling nodes | Every node has ≥1 connection | Isolated node → incomplete semantics |
| Guidance file has Mermaid section | Agent's Guidance embeds Agent Builder §12.2 template, references `lib/docs/mermaid-diagram-best-practices.md` | Missing → agent has no guardrails for future diagrams |
| Stop Points file has MERMAID RENDERING GUARD | SELF-CHECK contains the §12.4 guard item | Missing → agent won't self-validate |

### 7.2 Retrofit Steps (ordered)

1. **Backup first** (see §8 — this was §6 pre-1.1).
2. **Copy** `lib/docs/mermaid-diagram-best-practices.md` from Agent Builder (or Agent Tuner's own copy) into the target agent's `lib/docs/` if not already present.
3. **Diagnose** every Mermaid block against §7.1 checklist. Note each violation with file:line reference.
4. **Fix diagrams** one file at a time (preserve Backup procedure §8). Use targeted `edit`/`multi_edit`; NEVER sed/regex-replace Mermaid blocks — they're too fragile and structure-sensitive.
5. **Embed Guidance section** in the agent's `rules/0X_Guidance.mdc` (or equivalent) using Agent Builder's `01_Guidance.mdc` §12.2 template, adapted to the agent's domain vocabulary.
6. **Embed SELF-CHECK guard** in the agent's `rules/0X_Mandatory_Stop_Points.mdc` (or equivalent) using Agent Builder's `01_Guidance.mdc` §12.4 template.
7. **Add reference row** to the agent's INDEX.md Quick Reference table: `Mermaid diagram standards | lib/docs/mermaid-diagram-best-practices.md`.
8. **Bump agent version** (patch-level bump: X.Y.Z → X.Y.(Z+1) at minimum; minor if significant). Update all rule file frontmatters + README + INDEX + Production_Learnings.
9. **Document retrofit** in the agent's `Production_Learnings.md` with before/after diagnostic counts and date.
10. **Smoke test** the agent post-retrofit: render each Mermaid block in GitHub preview / VS Code Markdown Preview / the target rendering surface. Confirm all diagrams render cleanly.

### 7.3 Retrofit Embedding Template (for the agent's Guidance file)

Copy from Agent Builder's `rules/01_Guidance.mdc` §12.2 — specifically:
- The ten-rule summary (applies as-is to any agent).
- The "Domain-Specific Colour Palette" table — customize roles/colors to the agent's domain.
- The BAD vs GOOD few-shot (keep generic or adapt to the agent's typical diagram).
- The SELF-CHECK compliance item for the Stop Points file.

Always APPEND (don't restructure) per the §4 Guidance Addition Pattern:

```markdown
## SECTION {N}: MERMAID DIAGRAM STANDARDS
<!-- Added: {YYYY-MM-DD} via Agent Tuner §7 Mermaid Standards Retrofit -->

> **Canonical reference:** `@r-genie/{Agent_Name}/lib/docs/mermaid-diagram-best-practices.md`

{copy the 10 rules + domain palette + few-shot from Agent Builder §12.2}
```

### 7.4 Retrofit Validation (after applying)

- [ ] Every Mermaid block in the agent has the `linear` init directive (flowcharts)
- [ ] Zero `\n` occurrences in any Mermaid label
- [ ] All `style` declarations appear at the end of their diagram block
- [ ] Node declaration order matches data flow direction
- [ ] No dangling nodes
- [ ] Guidance file has a Mermaid Diagram Standards section referencing the best-practices doc
- [ ] Stop Points file has MERMAID RENDERING GUARD in its SELF-CHECK
- [ ] INDEX.md Quick Reference cites `lib/docs/mermaid-diagram-best-practices.md`
- [ ] Agent version bumped in ALL rule files + README + INDEX
- [ ] Production_Learnings.md records the retrofit date + scope
- [ ] Rendered preview confirms all diagrams are clean

---

## 8. Backup & Restore Procedure

### Create Backup
```bash
# Timestamp format: YYYY-MM-DD-HHmmss
mkdir -p r-genie/{agent}/.backup-{timestamp}
cp -r r-genie/{agent}/rules/ r-genie/{agent}/.backup-{timestamp}/rules/
cp -r r-genie/{agent}/templates/ r-genie/{agent}/.backup-{timestamp}/templates/  # if exists
cp -r r-genie/{agent}/examples/ r-genie/{agent}/.backup-{timestamp}/examples/    # if exists
cp r-genie/{agent}/README.md r-genie/{agent}/.backup-{timestamp}/
cp r-genie/{agent}/ARCHITECTURE.md r-genie/{agent}/.backup-{timestamp}/
cp r-genie/{agent}/*_Production_Learnings.md r-genie/{agent}/.backup-{timestamp}/
```

### Restore from Backup
```bash
cp -r r-genie/{agent}/.backup-{timestamp}/* r-genie/{agent}/
```

### Verify Backup
Count files in backup vs original. All counts must match.
