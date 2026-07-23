# Agent Tuner V1.2

**Customize any R-GENIE agent's rules, templates, examples, and best practices to match your project-specific standards.**

---

## What This Agent Does

1. **Studies** the target agent's complete architecture (rules, templates, examples)
2. **Collects** your project standards through agent-specific conversational flows
3. **Tunes** templates, examples, and rules with your approval at every step
4. **Validates** all changes against the R-GENIE Architecture Standard
5. **Activates** the customized agent, with full backup for rollback

---

## RISEN Framework

| Element | Definition |
|---------|------------|
| **R - ROLE** | R-GENIE Agent Customization Specialist |
| **I - INPUT** | Target agent ID + project standards (templates, examples, naming conventions) |
| **S - STEPS** | 7-phase workflow: Discovery → Backup → Standards → Templates → Rules → Validate → Activate |
| **E - EXPECTATION** | Modified agent files with backup, architecture-compliant |
| **N - NARROWING** | Include: rules, templates, examples, docs. Exclude: new agent creation |

---

## Quick Start

### 1. Activate the Agent

```
/use-agent-tuner
```

### 2. Select Target Agent

| ID | Agent | Key Customization Focus |
|----|-------|------------------------|
| 01 | Technical Design | Document structure/style, template guide, examples |
| 02 | API Specification | Traits, fragments, exchange_modules, example projects |
| 03 | App Development | Project template, common modules, error handling |
| 04 | MUnit Testing | Test patterns, assertion strategies |
| 05 | README | Document structure, badge format |
| 06 | Code Review | Review criteria, scoring |
| 07 | Error Analysis | Error classification patterns |
| 08 | Boomi Documentation | Boomi-specific patterns |

### 3. Follow the 7-Phase Workflow

| Phase | What Happens | Your Action |
|-------|--------------|-------------|
| **0** | Agent Tuner studies target agent, presents customization menu | Select scope |
| **1** | Creates timestamped backup of all agent files | Confirm backup |
| **2** | Collects project standards (agent-specific questions) | Provide standards |
| **3** | Tunes templates and examples (conversational for 01) | Approve changes |
| **4** | Tunes rule files (behavioral guidance) | Approve changes |
| **5** | Validates against architecture standard | Accept report |
| **6** | Writes all changes, shows activation summary | Acknowledge |

### 4. Agent-Specific Inputs

**Technical Design (01):** Provide your design template as screenshot, image, or markdown. The Tuner will convert it to a markdown example, then walk through each section asking about project-specific standards.

**API Specification (02):** Provide an existing RAML or OpenAPI project. The Tuner will extract common traits, fragments, and security schemes.

**App Development (03):** Provide a reference MuleSoft project plus common error handling and shared components.

---

## Key Features

### Backup-First Safety
Every customization session starts with a timestamped backup. Full rollback available at any time.

### Conversational Template Guide (Agent 01)
The Tuner walks through each section of your design template one-by-one, asking about project-specific standards before compiling the template guide.

### Rules/Templates Decoupling
Structural content (section names, numbers, diagram placement) goes to `templates/`. Behavioral content (how to think, when to stop) goes to `rules/`. The Tuner enforces this separation.

### Architecture Compliance
All modifications are validated against `AGENT_ARCHITECTURE_STANDARD.md` before writing. File sizes, cross-references, RISEN completeness, prompt techniques — all checked.

---

## Output

**Modified Files:** `r-genie/{target_agent}/` (in-place)  
**Backup:** `r-genie/{target_agent}/.backup-{timestamp}/`  
**State:** `project/output_tuner/.tuner-state.json`

---

## Rule Files

| File | Purpose | Priority |
|------|---------|----------|
| `Agent_Tuner.mdc` | Main entry, RISEN, workflow, agent inventory | HIGHEST |
| `00_Phase_Orchestration.mdc` | 7-phase workflow, state machine | HIGH |
| `01_Guidance.mdc` | Customization patterns, agent-specific flows | HIGH |
| `02_Mandatory_Stop_Points.mdc` | Stop points, anti-patterns, self-check | HIGHEST |

---

## Tips

1. **Start with your best example** — The more complete your template/example, the better the customization
2. **Be specific about standards** — When asked about section-specific standards, detailed answers produce better results
3. **Review each phase** — Take time to review template guide and rule changes before approving
4. **Check the backup** — Before approving Phase 6, verify the backup location is correct

---

## Version History

- **V1.2.0** — Mermaid Standards Retrofit: added `lib/docs/mermaid-diagram-best-practices.md`; new §7 retrofit pattern in `customization-patterns.md` (diagnostic checklist + 10 ordered steps + embedding template + validation); new Section 9 in Guidance (trigger conditions + tuning flow + anti-patterns); Mermaid compliance added to All-Agents validation checklist
- **V1.1.0** — LLM behavioral gap countermeasures: version alignment, enhanced RISEN Narrowing, mandatory `<thinking>` blocks, RGV verification, assumption flagging
- **V1.0.0** — Initial release: 7-phase workflow, agent-specific flows for 01/02/03, backup-first safety, architecture compliance validation
