# Agent Builder - Examples

**Version:** 1.2.0  
**Author**: Cheppali Shaik Sohail

---

## What This Folder Contains

1. **Reference Agents** — One per archetype for the Agent Builder to study when generating new agents
2. **Session Examples** — What a typical Agent Builder creation session looks like for each archetype

---

## Reference Agents (One Per Archetype)

The Agent Builder MUST study the reference agent matching the selected archetype before generating rule files.

| Archetype | Reference Agent | Location | Scope |
|-----------|----------------|----------|-------|
| **Document Generator** | Technical Design (01) | `reference-agent-01-technical-design/` | Full agent (all files) |
| **Code Generator** | App Development (03) | `reference-agent-03-app-development/` | Main Entry + README |
| **Analyzer** | MUnit Testing (04) | `reference-agent-04-munit-testing/` | Main Entry + README |
| **Conversational** | Agent Tuner | `reference-agent-agent-tuner/` | Main Entry + README |

### Document Generator: Technical Design (01)

**Location:** `reference-agent-01-technical-design/`

A complete 5-file R-GENIE agent (Document Generator archetype) with Template_Configuration.

| File | Purpose | Lines |
|------|---------|-------|
| `rules/01_Technical_Design.mdc` | Main Entry — RISEN, workflow, critical rules | ~123 |
| `rules/01-00_Template_Configuration.mdc` | Template-first approach | ~96 |
| `rules/01-01_Phase_Orchestration.mdc` | 6-phase workflow, state machine | ~293 |
| `rules/01-02_Guidance.mdc` | Patterns, diagrams, mappings | ~323 |
| `rules/01-03_Mandatory_Stop_Points.mdc` | Stop points, anti-patterns, self-check | ~309 |
| `rules/INDEX.md` | Navigation, cross-references | ~173 |
| `templates/design-style.yaml` | Section structure config | ~105 |
| `templates/design-template-guide.md` | Content guide per section | ~383 |
| `examples/*.md` | Design document examples | 5 files |
| `README.md` | Agent overview | ~147 |
| `ARCHITECTURE.md` | Technical architecture | ~92 |
| `use-01-technical-design.md` | Activation workflow | ~40 |

**Use as reference for:** File structure, RISEN format, phase specification detail, stop point format, template/example patterns, activation workflow format.

### Code Generator: App Development (03)

**Location:** `reference-agent-03-app-development/`

Compact reference — Main Entry showing 4-file architecture, code-focused RISEN, project output structure, production safety rules.

**Use as reference for:** Code Generator RISEN format, production safety rules, project structure output, build/deploy phases.

### Analyzer: MUnit Testing (04)

**Location:** `reference-agent-04-munit-testing/`

Compact reference — Main Entry showing 10-phase Think-First workflow, quantitative success criteria, chat-first analysis phases.

**Use as reference for:** Analyzer RISEN format, scoring rubrics, Think-First approach, chat-vs-file output distinction, complex agent phase design.

### Conversational: Agent Tuner

**Location:** `reference-agent-agent-tuner/`

Compact reference — Main Entry showing dialogue-driven workflow, backup protocol, protection override, study-first approach.

**Use as reference for:** Conversational RISEN format, discovery-first phases, safety protocols, menu-based selection, protection override patterns.

---

## Typical Creation Sessions

### Document Generator Agent

**User goal:** "Create an agent that generates security audit reports for cloud infrastructure"  
**Agent Builder creates:**
1. 5 rule files (with Template_Configuration)
2. `templates/audit-style.yaml` + `templates/audit-template-guide.md`
3. Example audit report in `examples/`
4. README, ARCHITECTURE, Production_Learnings

**Session flow:** Goal → Architecture (Document Generator, 5 files) → RISEN element-by-element → 6 phases designed → Rule files generated → Templates + example → Docs → Validate → Register

### Code Generator Agent

**User goal:** "Create an agent that generates Terraform modules from architecture diagrams"  
**Agent Builder creates:**
1. 4 rule files
2. Example Terraform module in `examples/`
3. README, ARCHITECTURE, Production_Learnings

**Session flow:** Goal → Architecture (Code Generator, 4 files) → RISEN → 5 phases → Rule files → Example project → Docs → Validate → Register

### Analyzer Agent

**User goal:** "Create an agent that reviews Python code for security vulnerabilities and produces severity-scored reports"  
**Agent Builder creates:**
1. 4 rule files
2. Example analysis output in `examples/`
3. README, ARCHITECTURE, Production_Learnings

### Conversational Agent

**User goal:** "Create an agent that conducts project discovery interviews and produces project charters"  
**Agent Builder creates:**
1. 5 rule files (with Template_Configuration for charter template)
2. Question bank in `lib/docs/`
3. Example charter in `examples/`
4. README, ARCHITECTURE, Production_Learnings

---

## Key Principles

1. **Conversational design** — Every element designed collaboratively with the user
2. **Archetype-driven** — Correct scaffold based on goal analysis
3. **All 14 prompt techniques** — Embedded in every generated agent
4. **Architecture compliant** — Validated against `AGENT_ARCHITECTURE_STANDARD.md`
5. **User chooses location** — `r-genie/` or custom path
