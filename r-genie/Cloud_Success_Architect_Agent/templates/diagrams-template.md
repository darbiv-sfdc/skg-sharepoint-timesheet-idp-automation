# {Customer Name} — Per-Flow Architecture Drill-Downs

> **Companion to:** `HLD.md`
> **Audience:** Panel + technical reviewers (same as HLD)
> **Purpose:** Break down the §5 architecture HLD into per-capability data flows that the panel can absorb in 30-60 seconds each. The HLD answers *"What is the architecture?"*; this file answers *"How does each promised capability actually work?"*
> **Generated in:** Phase 6 Step 7 (after HLD §5 architecture diagram is locked)
> **Date:** YYYY-MM-DD

---

## How This File Is Built (Progressive Documentation v2)

> This template is a **skeleton** — Phase 6 fills it after `HLD.md` §5 is locked. The agent identifies the **distinct capability flows** from the Phase 4 finalist component list and Phase 6 §6 Design Choices, then produces **one Mermaid drill-down per flow**, capped at **4 flows in this file**. Additional flows defer to `Supporting.md` Appendix C.
>
> **When this file is mandatory:** ≥2 distinct capability flows in the proposed architecture (e.g., a separate read-path and write-path; or 4 customer-facing capabilities like the retail example). For single-capability use cases, the HLD §5 architecture diagram alone is sufficient — this file is OMITTED and the §7 Data Flows section of HLD carries the text-only flow summary.
>
> **Reference example:** `examples/retail-personalized-offerings_diagrams.md` — canonical 4-flow drill-down (Personalized Recommendations · Real-Time Inventory · Automated Order Fulfillment · Real-Time Customer Support).
>
> **Best practices applied:** `01_Guidance.mdc` §7.6 (8 Mermaid syntax/layout rules D1-D8) + §7.7.2 (Per-Flow Drill-Down recipe).

---

## Flow Selection Heuristic (Phase 6 Step 7)

Pick flows that:

1. **Map 1:1 to a stated customer ambition** (from Phase 1 success metrics or Phase 4B coverage matrix top rows) — not generic platform mechanics
2. **Demonstrate ≥3 components** from the §5 architecture working together (single-component flows belong in HLD §7 text, not here)
3. **Have distinct architectural signatures** — read vs write, sync vs async, agent-first vs API-first. Two flows that look 90% identical should merge into one and note the variant
4. **Are panel-relevant** — what the CDO / VP Integration / Director Arch / VP Business Apps will defend post-meeting

> **Max 4 flows per file.** If the use case has more, pick the top 4 by panel-impact × architectural distinctness; defer the rest to Supporting Doc Appendix C.

---

## Flow Template (repeat per capability)

```text
## {N}. {Capability Name — e.g., "Personalized Recommendations"}
*{One-line italic sub-header naming the architectural signature — e.g., "Grounding the Agentforce response using unstructured data + structured customer profiles"}*

```mermaid
%%{ init: { 'flowchart': { 'curve': 'linear' }, 'themeVariables': { 'fontSize': '16px' } } }%%
flowchart LR
    %% LAYOUT ORDER (per §7.6 D3): source/channel → subgraphs → target → connections → styles
    %% NODE SHAPES: [(...)] data store · ([...]) persona/channel · {{...}} gateway/policy · [...] service/component
    %% LINE BREAKS: <br/> always (D1) — never <br> or \n
    %% EDGES: --> action/data-flow (solid) · -.-> governance / grounding / response-return (dashed) (D4)
    %% NUMBERED STEPS on edges: "1. ...", "2. ...", "3. ..." — short, action-oriented (~3-8 words)

    %% LAYER 1 — source/persona/channel node
    C([{Persona / channel}]):::user

    %% LAYER 2 — subgraphs (one per logical zone — typically 2-3)
    subgraph Sources [Data Sources]
        Src1[({Source 1})]:::backend
        Src2[({Source 2})]:::backend
    end

    subgraph Mule [MuleSoft API-Led]
        Exp[{Experience API}]:::ms
        Proc[{Process API}]:::ms
        Sys[{System API}]:::ms
    end

    subgraph Salesforce [Salesforce Platform]
        Agent[{Agentforce surface}]:::sf
        TA[{Topic & Actions}]:::sf
        SoR[({Salesforce SoR if applicable})]:::sf
    end

    %% LAYER 3 — backend / target node (if outside subgraphs)
    Target[({Target system})]:::backend

    %% LAYER 4 — numbered-step connections (1, 2, 3, ... in order of flow)
    C -->|"1. {Action ≤8 words}"| Agent
    Agent -->|"2. Triggers<br/>'{Action name}'"| TA
    TA -->|"3. Calls API"| Exp
    Exp -->|"4. Routes request"| Proc
    Proc -->|"5. Queries / writes"| Sys
    Sys --> Target
    Target -.->|"6. Returns<br/>{result}"| Agent
    Agent -->|"7. Delivers result<br/>to user"| C
```

**Strategy Summary** _(3-4 bullets — architectural rationale, NOT narrative)_:

- **{Architectural lever 1}:** {≤25 words — what this flow uses uniquely and why it matters}
- **{Architectural lever 2}:** {≤25 words}
- **{Architectural lever 3}:** {≤25 words}
- **{Optional architectural lever 4}:** {≤25 words}

---
```

---

## 1. {Flow 1 Name}

<!-- SECTION: flow-1 -->
_(Phase 6 Step 7 — fill from Flow Template above. The first flow is typically the **board-promised outcome** — the one the panel will most defend.)_
<!-- END SECTION -->

---

## 2. {Flow 2 Name}

<!-- SECTION: flow-2 -->
_(Phase 6 Step 7 — second-priority flow by panel impact.)_
<!-- END SECTION -->

---

## 3. {Flow 3 Name}

<!-- SECTION: flow-3 -->
_(Phase 6 Step 7 — only include if a third distinct architectural signature exists. Otherwise stop at 2 flows.)_
<!-- END SECTION -->

---

## 4. {Flow 4 Name}

<!-- SECTION: flow-4 -->
_(Phase 6 Step 7 — only include if a fourth distinct flow earns its place. Cap is 4 flows per file; the rest defer to Supporting Doc Appendix C.)_
<!-- END SECTION -->

---

## Minimal Class Palette (per §7.7.1 — recommended for drill-downs)

The **4-class minimal palette** is the proven minimal subset for drill-downs (per `01_Guidance.mdc` §7.7.1). Use this in every drill-down to keep visual parity across the 4 flows:

```mermaid
%% Embed in every flow's Mermaid block, after the connections section
classDef sf      fill:#00A1E0,stroke:#005fb2,stroke-width:2px,color:#FFFFFF,rx:8px,ry:8px
classDef ms      fill:#1A1A1A,stroke:#00A1E0,stroke-width:2px,color:#FFFFFF,rx:8px,ry:8px
classDef backend fill:#E0E5EE,stroke:#B0B8C4,stroke-width:2px,color:#000000,rx:8px,ry:8px
classDef user    fill:#F4F6F9,stroke:#B0B8C4,stroke-width:2px,color:#000000,rx:20px,ry:20px
```

| Class | Maps to (per §7.1 brand palette) | Use For |
|-------|----------------------------------|---------|
| `sf` | `salesforceCore` | Any Salesforce surface — Agentforce, Topic & Actions, Service Cloud, Health Cloud, Data Cloud, etc. |
| `ms` | `mulesoft` / `mulesoftAI` | Any MuleSoft service — Experience API, Process API, System API, Flex Gateway, AI Chain, IDP, Topic Center |
| `backend` | `systemsOfRecord` / `customerInfra` | Customer-owned SoRs (EPIC, SAP, Oracle, S3, GDrive, OpenText, etc.) |
| `user` | `engagement` | The human persona / channel entering the flow |

> For diagrams that need finer-grained product distinction (e.g., separating Agentforce purple from Data Cloud cobalt from Service Cloud orange), use the **full 18-class brand palette** from `01_Guidance.mdc` §7.1 instead. Most drill-downs are clearer with the 4-class minimal palette — adopt the 18-class only when product brand attribution is panel-relevant.

---

## Optional: Note on MuleSoft's Continuous Evolution

_(Optional closing block — include only if the use case is materially shaped by 2026 MuleSoft Agent Fabric / Topic Center / MCP-A2A protocols / Anypoint Code Builder Vibes / LLM Gateway. Otherwise omit. Pattern is in the retail example's closing block — keep to 3-5 single-sentence bullets, panel-friendly, cite the research_log.md date and source.)_

---

> **Companion HLD:** `HLD.md` (overall architecture is in HLD §5)
> **Additional flows (if >4):** `Supporting.md` Appendix C
> **Mermaid syntax + layout best practices:** `01_Guidance.mdc` §7.6
> **Per-Flow Drill-Down recipe:** `01_Guidance.mdc` §7.7.2
> **Canonical worked example:** `examples/retail-personalized-offerings_diagrams.md`

---

> 🧞‍♂️ R-GENIE Cloud Success Architect Agent by Cheppali Shaik Sohail
> ✍️ Authored with: Cloud Success Architect Agent v1.7.0 | {generation-date}
> 🔧 Tuned by Cheppali Shaik Sohail via R-GENIE Agent Tuner | v1.7.0 | 2026-05-12
