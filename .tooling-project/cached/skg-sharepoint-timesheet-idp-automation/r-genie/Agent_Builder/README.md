# Agent Builder V1.5.0

**Create brand-new R-GENIE conversational agents for any domain or goal, following the PhaseWise Guided Autonomy pattern.**

---

## What This Agent Does

1. **Discovers** your goal through conversational questions
2. **Recommends** the right archetype (Document Generator, Code Generator, Analyzer, Conversational)
3. **Designs** the RISEN framework and phases collaboratively with you, element-by-element
4. **Generates** all rule files with all 14 prompt engineering techniques embedded
5. **Creates** examples, templates, and documentation
6. **Validates** against the R-GENIE Architecture Standard
7. **Registers** the new agent with activation workflow and ignore files

---

## RISEN Framework

| Element | Definition |
|---------|------------|
| **R - ROLE** | R-GENIE Agent Architect |
| **I - INPUT** | Goal description + optional domain examples |
| **S - STEPS** | 8-phase: Goal → Architecture → RISEN+Phases → Rules → Examples → Docs → Validate → Register |
| **E - EXPECTATION** | Complete R-GENIE agent, architecture-compliant |
| **N - NARROWING** | Include: agent creation. Exclude: modifying existing agents, testing created agents |

---

## Quick Start

### 1. Activate the Agent

```
/use-agent-builder
```

### 2. Describe Your Goal

Tell the Agent Builder what you want your agent to do. Examples:
- "Create an agent that generates security audit reports for cloud infrastructure"
- "Create an agent that reviews Python code for vulnerabilities"
- "Create an agent that conducts project discovery interviews"
- "Create an agent that generates Terraform modules from architecture diagrams"

### 3. Follow the 8-Phase Workflow

| Phase | What Happens | Your Action |
|-------|--------------|-------------|
| **0** | Agent Builder asks about your goal, audience, inputs, outputs | Describe your goal |
| **1** | Recommends archetype, structure, asks for location | Approve architecture |
| **2** | Designs RISEN element-by-element, phases one-by-one, collects domain intelligence | Approve each element |
| **3** | Generates rule files one at a time (per-file sub-checkpoints) | Review and approve each file |
| **4** | Creates examples and templates | Review and approve |
| **5** | Generates README, ARCHITECTURE docs | Review and approve |
| **6** | Validates structural compliance + semantic quality | Accept report |
| **7** | Writes files, creates activation workflow | Acknowledge |

### 4. Choose Agent Location

| Option | Path | When |
|--------|------|------|
| **First-class R-GENIE** | `r-genie/{Agent_Name}_Agent/` *(modern: name-based, no numeric prefix)* | Permanent agent in the R-GENIE ecosystem |
| **Custom location** | User-specified path | Experimental or project-specific agents |

---

## 4 Agent Archetypes

| Archetype | Best For | Rule Files | Examples |
|-----------|----------|------------|---------|
| **Document Generator** | Structured documents (designs, reports, reviews) | 5 (with Template_Config) | Technical Design, README, Code Review |
| **Code Generator** | Code, configs, specifications | 4 | API Spec, App Dev, DataWeave |
| **Analyzer** | Input analysis, scoring, assessments | 4 | MUnit Testing, Error Analysis |
| **Conversational** | Discovery, estimation, planning | 4-5 | Agent Tuner |

---

## Key Features

### Conversational Design
Every element of your agent is designed collaboratively. RISEN is crafted element-by-element, phases are designed one-by-one, and you approve everything before generation.

### All 14 Prompt Engineering Techniques
Every generated agent includes: RISEN, Chain of Thought, Confidence Calibration, RGV, Tree of Thought, Evidence-Bound, Few-Shot, ReAct, HITL, Semantic Anti-Autopilot, Constitutional Principles, Contradiction Handling, Graceful Degradation, Input Sanitization.

### Architecture Compliance
All generated agents are validated against `AGENT_ARCHITECTURE_STANDARD.md` — structural checks (file sizes, cross-references, RISEN completeness, prompt techniques, version consistency) **plus semantic checks** (RISEN specificity, phase distinctness, few-shot relevance, domain keyword presence, cross-file coherence).

### Any Domain
Not limited to MuleSoft. Create agents for security audits, Terraform, Python review, project management, data analysis, or any AI-IDE workflow.

---

## Rule Files

| File | Purpose | Priority |
|------|---------|----------|
| `Agent_Builder.mdc` | Main entry, RISEN, archetypes, workflow | HIGHEST |
| `00_Phase_Orchestration.mdc` | 8-phase workflow, state machine | HIGH |
| `01_Guidance.mdc` | Archetype patterns, prompt engineering, rule generation | HIGH |
| `02_Mandatory_Stop_Points.mdc` | Stop points, anti-patterns, compliance self-check | HIGHEST |

---

## Tips

1. **Be specific about your goal** — The more detailed your description, the better the generated agent
2. **Take time on RISEN** — This defines your agent's identity; review each element carefully
3. **Keep phases to 4-7** — More than 7 phases usually means over-engineering
4. **Stop points at decisions** — Place stops where user judgment adds value, not at every micro-step
5. **Review rule files carefully** — These define your agent's complete behavior

---

## Version History

- **V1.5.0** — **Template-First / Example-Based Progressive Documentation v2 — DEFAULT for multi-phase analytical agents**: Pattern #20 elevated to Pattern #20 v2 with **Five Mechanics** (Template-First Skeleton in Phase 0, Per-Phase Write Contract, Preview→Approve→Write-Clean-to-File loop, Phase N Consolidate-and-Polish mode, What stays in chat vs file). Trigger broadened from `longFormOutput: true` (>300 lines only) to `progressiveDocV2: true` — DEFAULT for any multi-phase agent producing a structured deliverable, regardless of total deliverable size. Phase 0 Progressive Documentation v2 Assessment replaces "Long-Form Output Assessment". Phase 3C/3D/3E generation hooks updated so generated agents inherit Per-Phase Write Contract in Phase Orchestration, adapted §10 in Guidance, and Per-Phase Write Self-Check in Stop Points. Critical Rule #7 added to Main Entry. Example-Anchored Conciseness (§10.5) replaces hard line caps — agents benchmark verbosity against `exampleAnchorPath` (canonical example output) instead of a number. Five new anti-pattern rows in Stop Points (wait-until-final-phase generation, final-phase regenerates earlier prose, hard line caps vs example-anchored conciseness, missing Phase 0 skeleton step). **Two canonical references** now cited in every relevant location: TDA (long-form, 600-1000 lines — original precedent) and CSA v1.7.0 (medium-form, 190-300 lines — reform precedent). Source: CSA v1.6.0 healthcare-recommendations run exhausted context window with Phase 5 starting documentation too late.
- **V1.3.6** — **Mermaid Diagram Standards canonicalization**: Created `lib/docs/mermaid-diagram-best-practices.md` (10 non-negotiable rules, mandatory `curve: 'linear'` init directive, deterministic layout via declaration order, arrow semantics, Material Design palette, state/sequence diagram specifics, pre-emit self-check). Wired into AGENT_ARCHITECTURE_STANDARD.md (Section 16), skeleton templates (Phase Orchestration state machine + INDEX.md Rule Dependency Map + Phase Workflow placeholders), Guidance §12 (embeddable template + BAD/GOOD few-shot + compliance check), Phase Orchestration generation steps, and Phase 6A structural validation. Added MERMAID RENDERING GUARD + MERMAID EMBEDDING GUARD to SELF-CHECK + 4 new anti-pattern rows.
- **V1.3.3** — **Watermark removed + tool-first activation skeleton**: (1) Removed all `watermark: "R-GENIE-CS150893"` frontmatter guidance from rule-generation (Mandatory Behavior #11, SELF-CHECK item, compliance checks, all 5 skeleton templates). Dual-author footer remains. Rationale: standard `AGENT_ARCHITECTURE_STANDARD.md` doesn't require watermark; it was an Agent Builder extension. (2) Replaced `sed -i ''` activation Step 1 pattern in the activation skeleton with a tool-first `edit`-based toggle — addresses Gap #15 Tool Misuse Hazard at generation time so future agents don't inherit the platform-fragile BSD-sed pattern.
- **V1.3.2** — **Progressive Documentation + Accuracy Primers**: (1) **Gap #16 IDE Edit-Size Failure Mode** added — second production-sourced gap documenting AI IDE edit-tool failure on large single-shot edits. (2) **Critical Rule #6 Progressive File Writing (Anti-Large-Edit)** — MANDATORY skeleton-first + per-phase bounded appends (≤300 lines/edit) for all long-form deliverables; Technical Design Agent is the canonical precedent. (3) **Pattern #20 Progressive Documentation** added to prompt engineering patterns. (4) **Patterns #21-23 Accuracy Primers (Psychological Framing)** — research-backed techniques: Deliberation Trigger ("take a moment to work carefully" — Google 2023, +7% GSM8K), Stakes Framing (factual domain stakes — EmotionPrompt, +10-13%), Error Premortem ("what could go wrong?" — Klein 2007 / CHI 2024, -12% confident-wrong). Emotional manipulation explicitly forbidden. (5) **Guidance Sections 10 + 11** + new `longFormOutput` state field + EDIT-SIZE GUARD in SELF-CHECK + 2 new anti-pattern rows.
- **V1.3.1** — **Tool-Use Hygiene (Gap #15 Tool Misuse Hazard)**: First gap sourced from R-GENIE production observations. Added Critical Rule #5 Tool-First Content Mutation (shell commands FORBIDDEN for `.mdc`/`.md`/`.yaml`/`.json`), TOOL-FIRST GUARD in SELF-CHECK, 3 new anti-pattern rows, and Gap #15 full documentation in `LLM_BEHAVIORAL_GAPS.md`. Also added SELF-CHECK completion checks for v1.3 concepts (Scripts Pillar + State Persistence assessments, stateful conditional, archetype layering, Lean Script Principle).
- **V1.3.0** — **Adaptive generation enhancements**: (1) **State Persistence Assessment** in Phase 0 — generated agents can now be `stateful: true` (full state file + resume) or `stateful: false` (stateless with optional `run_metadata.json` audit snapshot). WSR Agent is the canonical stateless precedent. (2) **Script vs LLM Decision Matrix + Lean Script Principle** — only script what LLMs are unreliable at; LLM-native reasoning is preferred when success rate is 99+/100. Includes WSR v1.1 → v1.2 refactor (19 scripts → 9) as the case study. (3) **Archetype Layering (Hybrid Agents)** — generated agents can declare a primary + secondary archetype (e.g., WSR = Document Generator + Conversational). Conditional sections in skeleton templates cover `stateful`, `scriptsPillar`, `inputComplexity`, and `archetypeSecondary`.
- **V1.2.0** — Per-file sub-checkpoints in Phase 3, semantic validation in Phase 6, domain intelligence gathering in Phase 2, activation file + display block skeleton templates, complexity estimation, backward navigation, enhanced state file, smoke test guide, ecosystem collision checks
- **V1.1.0** — LLM behavioral gap countermeasures: version alignment, enhanced RISEN Narrowing, mandatory `<thinking>` blocks, RGV verification, assumption flagging
- **V1.0.0** — Initial release: 8-phase workflow, 4 archetypes, generic domain support, 14 prompt technique embedding, architecture compliance validation
