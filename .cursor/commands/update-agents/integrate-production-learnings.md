# Integrate Production Learnings

Move pending learnings from `XX_Production_Learnings.md` into agent rule files.

---

## ⚠️ PREREQUISITE: Study Agent Before Modifying

**You MUST read and understand the agent architecture before proposing ANY changes.**

---

## Step 1: Deep-Dive Agent Study ⛔ MANDATORY

### 1.1 Read These Files (In Order)

| # | File | What to Extract |
|---|------|-----------------|
| 1 | `README.md` | Agent version, capabilities, entry command |
| 2 | `ARCHITECTURE.md` | Workflow phases, file relationships, design rationale |
| 3 | `rules/INDEX.md` | All rule files, their purposes, loading behavior |
| 4 | `rules/XX_Main.mdc` | Entry point, RISEN framework, delegation pattern |
| 5 | `rules/XX-00_Phase_Orchestration.mdc` | Phase definitions, state transitions |
| 6 | `rules/XX-01_Guidance.mdc` (or similar) | Main patterns, existing content style |
| 7 | `templates/*-template-guide.md` | **(Agents 01/05/06 only)** Content structure, section details |

### 1.2 Build Mental Model

**Answer these questions BEFORE proceeding:**

1. **What phases does this agent have?** (e.g., 0-Requirements → 1-Analysis → ... → N-Completion)
2. **Which files are `alwaysApply: true`?** (Keep these LEAN - they load every time)
3. **Which files are `alwaysApply: false`?** (Phase-specific, can be more detailed)
4. **What's the delegation chain?** (Main → Phase Orchestration → Specific rules)
5. **What existing sections exist in each rule file?** (Match style when adding)

### 1.3 Create File Map

```
AGENT: {name} v{version}
═══════════════════════════════════════════

ALWAYS LOADED (keep lean):
├── XX_Main.mdc → Entry point, RISEN, high-level
└── XX-02_Mandatory_Stop_Points.mdc → Interactive enforcement

PHASE-SPECIFIC (can be detailed):
├── XX-00_Phase_Orchestration.mdc → Phase workflow
├── XX-01_Guidance.mdc → Patterns, examples
├── XX-03_Critical_Insights.mdc → Error patterns
└── XX-04_Connector_*.mdc → Domain-specific

SECTIONS IN GUIDANCE FILE:
├── Section 1: {name} - {what belongs here}
├── Section 2: {name} - {what belongs here}
└── ...
```

---

## Step 2: Identify Target Agent

| Agent | File |
|-------|------|
| `00_Master_Orchestrator_System` | `00_Production_Learnings.md` |
| `01_Technical_Design_Agent` | `01_Production_Learnings.md` |
| `02_API_Specification_Agent` | `02_Production_Learnings.md` |
| `03_App_Development_Agent` | `03_Production_Learnings.md` |
| `03-01_Dataweave_Agent` | `03-01_Production_Learnings.md` |
| `04_Munit_Agent` | `04_Production_Learnings.md` |
| `05_ReadMe_Agent` | `05_Production_Learnings.md` |
| `06_Code_Review_Agent` | `06_Production_Learnings.md` |
| `07_Error_Analysis_Agent` | `07_Production_Learnings.md` |

---

## Step 3: Read & Classify Learnings

Read `## 🆕 PENDING INTEGRATION` section.

**For each learning:**

| Attribute | Options |
|-----------|---------|
| **Type** | Error fix · Pattern · Best practice · Workflow change |
| **Scope** | Global · Phase-specific · Connector-specific |
| **Impact** | Critical · High · Medium · Low |
| **Target** | File + Section (based on Step 1 analysis) |

---

## Step 4: Placement Decision

| Learning Type | Target | Reason |
|---------------|--------|--------|
| Workflow change | Main .mdc | Affects user flow |
| Error pattern | Guidance (error section) or Critical Insights | Grouped fixes |
| Connector-specific | Connector reference file | Domain grouping |
| Best practice | Guidance file | General patterns |
| **Structure/content change** | **templates/*.md** | **Template-specific (see below)** |

**Key Rules:**
- **`alwaysApply: true` files** → Only add if CRITICAL (every token costs context)
- **Phase-specific** → Add to the rule loaded during that phase
- **Match existing section** → Never create new sections without clear need

---

## Step 4.1: Rules/Templates Decoupling (Agents 01, 05, 06)

**Applies to:**
- `01_Technical_Design_Agent`
- `05_ReadMe_Agent`
- `06_Code_Review_Agent`

### Design Principle

```
RULES (Generic - Stable)              TEMPLATES (Specific - Can Change)
├── How to think                      ├── *-style.yaml (structure, inclusion)
├── How to interact                   ├── *-template-guide.md (content guidance)
├── When to stop/wait                 └── examples/ (formatting reference)
├── Phase transitions                 
└── Decision strategies               
```

### Placement Rules

| Content Type | Goes In | NOT In |
|--------------|---------|--------|
| Section numbers (2.4, 3.1, etc.) | templates/ | rules/ |
| Specific section names | templates/ | rules/ |
| Diagram placement details | templates/ | rules/ |
| Content requirements | templates/ | rules/ |
| Behavioral guidance | rules/ | templates/ |
| Phase workflow | rules/ | templates/ |
| Stop/wait patterns | rules/ | templates/ |

### Template Files

| Agent | Template Guide | Style Config |
|-------|---------------|--------------|
| 01 | `templates/design-template-guide.md` | `templates/design-style.yaml` |
| 05 | `templates/readme-template-guide.md` | `templates/readme-style.yaml` |
| 06 | `templates/review-template-guide.md` | `templates/review-style.yaml` |

### Integration Decision Tree

```
Is learning about WHAT to generate (sections, structure, content)?
  └── YES → Add to templates/*-template-guide.md
  └── NO → Continue...

Is learning about HOW to behave (workflow, decisions, interactions)?
  └── YES → Add to rules/*.mdc
  └── NO → Continue...

Does learning include specific section numbers or names?
  └── YES → STOP! Must go in templates, not rules
  └── NO → Proceed with normal placement
```

### Validation Check

Before modifying any rule file in agents 01, 05, or 06:

- [ ] Learning does NOT contain specific section numbers (e.g., "Section 2.4")
- [ ] Learning does NOT dictate specific section names
- [ ] Learning does NOT specify diagram placement locations
- [ ] Learning focuses on behavior/strategy, not content structure
- [ ] If structural → Target is templates/, not rules/

---

## Step 5: Present Plan ⛔ MANDATORY STOP

```
📋 INTEGRATION PLAN
═══════════════════════════════════════════

Agent: {name} (v{version})

FILES STUDIED:
- README.md ✓
- ARCHITECTURE.md ✓  
- rules/INDEX.md ✓
- rules/XX_Main.mdc ✓
- rules/XX-00_Phase_Orchestration.mdc ✓
- rules/XX-01_Guidance.mdc ✓
- templates/*-template-guide.md ✓  (for agents 01/05/06)

PENDING LEARNINGS: {count}

LEARNING 1: {title}
├── Target: {file_path}
├── Section: {existing_section_name}
├── alwaysApply: {true/false}
├── Rules/Templates Check: {PASS/FAIL} (for agents 01/05/06)
└── Rationale: {why this location}

═══════════════════════════════════════════
✅ approve | ❌ reject | ✏️ modify
```

**For agents 01/05/06, verify Rules/Templates Check:**
- PASS = Learning is behavioral/strategic (goes to rules/)
- PASS = Learning is structural/content (goes to templates/)
- FAIL = Learning has section numbers but targets rules/ → Fix target

**Wait for approval.**

---

## Step 6: Integrate (After Approval)

**Format - Concise Instructions:**
```markdown
### {Title}
<!-- Integrated: YYYY-MM-DD -->

{Direct instruction or rule. Keep it concise.}

{Minimal example showing correct approach}
```

**Example:**
```markdown
### Badge Formatting
<!-- Integrated: 2026-01-16 -->

Use plain text metadata format. **DO NOT** use external SVG badges (shields.io URLs).

```markdown
**Version:** 1.0.1-SNAPSHOT | **MuleSoft Runtime:** 4.9.0+ | **Status:** Active
```
```

**Rules:**
1. **APPEND** to end of target section (never insert mid-content)
2. **MATCH STYLE** of surrounding content
3. **CONCISE** - Direct instruction, not problem/solution format
4. **ONE example** per learning (not multiple variations)
5. **UPDATE** Production Learnings: move to INTEGRATED section

---

## Step 7: Report

```
✅ INTEGRATION COMPLETE
═══════════════════════════════════════════

Modified:
1. {file} → Section: {section} → Added: {learning}

Production Learnings:
- Moved {count} to ✅ INTEGRATED

Test: Run /use-XX-agent to verify
```

---

## Integration Principles

| Principle | Why |
|-----------|-----|
| **Study first, edit second** | Blind edits break workflows |
| **Append, don't restructure** | Preserve existing flow |
| **Concise > Verbose** | Context bloat = diluted agent |
| **Direct instructions, not problem/solution** | Reference-style content is more actionable |
| **Match file style** | Consistency matters |
| **`alwaysApply: true` = minimal** | Every byte costs context |
| **Rules generic, templates specific** | Rules stay stable when templates change |

---

## Quality Checklist

Before integrating:
- [ ] Read all agent architecture files
- [ ] Identified correct target section
- [ ] Pattern is immediately understandable
- [ ] **CONCISE** - Direct instruction format (not problem/solution)
- [ ] ONE minimal example
- [ ] No tutorial-style explanations
- [ ] Every line adds value
- [ ] **For agents 01/05/06:** No hardcoded section numbers in rules
- [ ] **For agents 01/05/06:** Structural changes go to templates/

---

🧞‍♂️ **R-GENIE: Understand → Plan → Integrate**

