# Salesforce Solution Architecture — Template Content Guide

**Author:** Cheppali Shaik Sohail
**Version:** 1.0.0
**Companion to:** `solution-architecture-style.yaml` (structure source)
**Purpose:** Section-by-section guidance on WHAT to write in each of the 12 sections. Loaded by Phase 0 of `@01_Phase_Orchestration.mdc`.

---

## How to Use This Guide

For each phase that writes a section, the agent should:
1. Read the section's entry below
2. Apply the structural budget from `@02_Guidance.mdc` Example-Anchored Conciseness
3. Cross-check against the canonical example: `examples/01_fnol_insurance_guidewire/solution_architecture_fnol_guidewire.md`
4. Generate prose that matches the depth, tone, and structure of the example for similar complexity

---

## §1. Business & Technical Context

**Phase**: 0   **Marker**: `<!-- SECTION: business-technical-context -->`

**What goes in:**
- **Scenario summary** (2-3 sentences): what we're building and why
- **Business drivers** (bulleted list, 3-5 items): why now, what success looks like
- **Stakeholders** (table): role, system/cloud they own, primary concern
- **In-scope / Out-of-scope** (two columns): what we will / won't address
- **Key NFRs** (table): NFR (volume, latency, availability, recoverability), target, source-of-target
- **Regulatory context** (1-2 sentences): HIPAA / PCI / GDPR / SOX / industry-specific (NAIC for insurance)

**Tone**: Concise, business-first. No SFDC jargon yet.

**Common pitfalls:**
- Over-explaining the business (this is a technical doc; 2-3 sentences max)
- Missing scale targets (always include TPS / daily volume / user count if available)
- Burying regulatory context (it drives Section 8 — make it visible)

---

## §2. Recommended Architecture

**Phase**: 1   **Marker**: `<!-- SECTION: recommended-architecture -->`

**What goes in:**
- **Architectural pattern** (1 sentence): event-driven async / hub-and-spoke / point-to-point / etc.
- **Key components** (table): component, role, SFDC product / external system
- **≥1 trade-off table** (mandatory) for the major decision (e.g., Sync REST vs Platform Event vs CDC):
  ```
  | Criterion | Option A | Option B | Option C | Chosen |
  |-----------|----------|----------|----------|--------|
  ```
- **Decision rationale** (3-5 sentences): why the chosen option won; cite NFRs from §1
- **Out-of-scope architectural choices** (1-2 sentences): what we considered and rejected, why

**Tone**: Architect-to-architect. Use SFDC terminology freely (Platform Event, FSC, etc.).

**Common pitfalls:**
- Asserting a pattern without trade-off table (Critical Rule #3 violation)
- Hand-waving rejection of alternatives ("Option B was worse" — say WHY)
- Missing decision-to-NFR linkage (every choice must trace back to §1 NFR)

---

## §3. Architecture Diagram

**Phase**: 2   **Marker**: `<!-- SECTION: architecture-diagram -->`

**What goes in:**
- **Mermaid block** (per `@02_Guidance.mdc` Mermaid Standards):
  - `flowchart TB` for layered systems (External → Integration → SFDC) OR `graph LR` for left-right data flow
  - Show: SFDC clouds, integration platform, external systems, event bus / queue, dead-letter handling
  - Color-code: SFDC blue, middleware orange, external gray (styles at end)
- **Diagram explanation** (3-6 sentences): walk the reader through the primary path; call out key components

**Tone**: Visual-first, prose supports. Reader should grasp the flow in 30 seconds.

**Common pitfalls:**
- Forgetting `%%{ init: { 'flowchart': { 'curve': 'linear' } } }%%` directive
- Using `\n` for line breaks instead of `<br/>`
- Diagram too cluttered (>15 nodes — split into sub-diagrams if needed)
- No explanation prose (diagram alone insufficient)

---

## §4. Data Model Design

**Phase**: 3 (sub-stop 4-a)   **Marker**: `<!-- SECTION: data-model-design -->`

**What goes in:**
- **Entity table** (rows = entities; cols = name, type [FSC/Custom/External], key fields, source-of-truth)
- **Relationship table** (rows = relationships; cols = parent, child, type [Master-Detail/Lookup], cardinality, sharing impact)
- **Per-entity notes** (1-2 sentences each): why this entity, key field rationale
- **Custom field justification** (per custom field): why it can't be stock SFDC

**Tone**: Data-modeler precision. Every column header should map to an SFDC concept.

**Common pitfalls:**
- Using stock objects (Case, Account) when Industry Cloud objects fit (Top Mistake #2)
- Missing sharing model annotation
- Over-customizing (custom field for everything; missing FSC opportunity)

---

## §5. Data Model Diagram (Lucidchart Instructions)

**Phase**: 3 (sub-stop 4-b)   **Marker**: `<!-- SECTION: data-model-diagram -->`

**What goes in:**
- **Lucidchart setup steps** (3-5 numbered): document type, page setup, color legend
- **Entity placement steps** (10-15 numbered): for each entity — shape, color, position (top/middle/bottom), field list
- **Relationship steps** (5-10 numbered): parent → child, cardinality label, line style
- **Annotation steps** (1-3 numbered): legend, PHI marker icons, sharing annotations

**Tone**: Step-by-step instruction manual. Anyone with Lucidchart access should be able to follow.

**Common pitfalls:**
- Generating Mermaid block (FORBIDDEN in §5 — `@03_Mandatory_Stop_Points.mdc` anti-pattern)
- Vague steps ("add the entities") — name each entity explicitly
- Missing field lists per entity
- Skipping color-coding rationale

---

## §6. Integration & Event Pattern

**Phase**: 4   **Marker**: `<!-- SECTION: integration-event-pattern -->`

**What goes in:**
- **Pattern decision table** (Sync REST vs Async Platform Event vs CDC vs message bus) with chosen option
- **Message contract block** (code-fenced):
  ```
  Event: Claim_Created__e
  Producer: SFDC FSC Insurance.Claim trigger
  Subscribers: MuleSoft (transform → Guidewire), AWS SNS (audit log)
  Payload: { claimNumber, lossDate, policyId, ...}
  Replay window: 72h (Salesforce Platform Event default)
  ```
- **Retry / replay / DLQ strategy** (3-5 sentences): how failures are handled
- **Latency expectations** (1-2 sentences): publish → subscriber consume → external system POST

**Tone**: Implementation-detailed but design-level (no actual Apex / Mule code). Cite SFDC limits where relevant (250K events/24h base, etc.).

**Common pitfalls:**
- Sync REST for high-volume (Top Mistake #1)
- Missing replay/DLQ strategy
- Not citing SFDC Platform Event limits

---

## §7. Automation & Orchestration

**Phase**: 5   **Marker**: `<!-- SECTION: automation-orchestration -->`

**What goes in:**
- **Component table** (rows = automation; cols = name, type [Flow/Trigger/Apex/Async/Batch/Scheduled], purpose, invocation)
- **Orchestration pattern** (1 sentence): Saga / Choreography / Orchestration / none
- **Per-component notes** (1-2 sentences each): why this type, key constraint considered
- **Execution order** (numbered, if multi-step): step 1 → step 2 → ...

**Tone**: SFDC-platform-aware. Apply Flow vs Apex vs Middleware decision matrix.

**Common pitfalls:**
- Hub-and-spoke logic in Apex when middleware is right
- Trivial Flow logic moved to Apex unnecessarily
- Missing orchestration pattern naming

---

## §8. Security & Compliance

**Phase**: 6   **Marker**: `<!-- SECTION: security-compliance -->`

**What goes in:**
- **Auth model** (1-2 sentences): SSO / OAuth / JWT / Connected App
- **Encryption posture table** (rows = field categories; cols = field, classification [PII/PHI/PCI], encryption [Shield/Field-Level/None], rationale)
- **Sharing model** (1-2 sentences): OWD setting, sharing rules, manual sharing usage
- **Compliance posture table** (rows = HIPAA/PCI/GDPR/SOX as applicable; cols = control, status, evidence)
- **Audit logging** (1-2 sentences): Field Audit Trail, Event Monitoring, external SIEM

**Tone**: Auditor-reviewable. Cite HIPAA/PCI paragraphs where relevant.

**Common pitfalls:**
- Skipping Shield Platform Encryption mention for PHI (Top Mistake #3)
- Confusing access control (profile permissions) with encryption (Shield)
- Missing audit logging

---

## §9. Scalability & Performance

**Phase**: 7 (sub-stop 8-a)   **Marker**: `<!-- SECTION: scalability-performance -->`

**What goes in:**
- **Volume baseline** (1-2 sentences): cite scenario / RFP / discovery answer
- **Arithmetic block** (mandatory, code-fenced):
  ```
  Daily volume:    50,000 claims/day
  Sustained TPS:   50,000 ÷ 86,400 = 0.579 TPS
  Burst factor:    5x (typical insurance morning spike)
  Peak TPS:        0.579 × 5 = 2.89 TPS
  Sanity check:    Platform Event base limit = 250K/24h ≫ 50K → OK
                   Apex async invocations = 250K/license/24h → OK
  ```
- **Sizing table** (rows = component; cols = component, expected load, governor limit, headroom)
- **Bulk patterns** (1-2 sentences): bulkified triggers, Apex Batch, Queueable
- **Caching / async offload strategy** (1-2 sentences)

**Tone**: Quant-heavy. Every number must have arithmetic. Validation script enforces.

**Common pitfalls:**
- Numbers without arithmetic (Gap #13 — script flags)
- Missing governor-limit comparison
- Hand-waving "scales well" without sizing math

---

## §10. Reusability & Productization

**Phase**: 7 (sub-stop 8-b)   **Marker**: `<!-- SECTION: reusability-productization -->`

**What goes in:**
- **≥3 named accelerators** (numbered list): name, what it does, where it can be reused (other industries / orgs / projects)
- **Packaging strategy** (1-2 sentences): unlocked package / 2GP managed / no packaging — why
- **Multi-org / multi-tenant considerations** (1-2 sentences): if applicable
- **Open-source / shared-library opportunities** (1-2 sentences): if applicable

**Tone**: Productization-minded. Architects consume HLDs; what can THEY take to their next project?

**Common pitfalls:**
- Vague "leverage best practices" non-accelerators
- <3 named accelerators (script can flag with extension)
- Skipping packaging analysis

---

## §11. Risks & Mitigations

**Phase**: 8 (sub-stop 9-a)   **Marker**: `<!-- SECTION: risks-mitigations -->`

**What goes in:**
- **Risk register table** (≥5 rows; cols = risk, category [Technical/Operational/Security/Vendor/Scope], likelihood [H/M/L], impact [H/M/L], mitigation, owner)
- Categories to cover (≥1 from each if applicable): Technical, Operational, Security, Vendor, Scope

**Tone**: Risk-honest. Owners must be named (role, not person, e.g., "SFDC TechLead", "Integration Architect", "Security Officer").

**Common pitfalls:**
- <5 risks (script can flag with extension)
- Vague mitigations ("monitor closely")
- Missing owners
- All risks in one category

---

## §12. References

**Phase**: 8 (sub-stop 9-b)   **Marker**: `<!-- SECTION: references -->`

**What goes in:**
- **Bulleted citation list**: each entry = URL + 1-line description
- Categories to include where applicable:
  - Salesforce Trailhead / Help / Developer Docs
  - SFDC Architect Decision Guides (e.g., FSC, Industry Clouds)
  - Vendor docs (Guidewire, MuleSoft, SAP, etc.)
  - Whitepapers / RFCs (e.g., OAuth 2.0 RFC, HIPAA §164)
  - Compliance frameworks (HIPAA, PCI-DSS, NIST)

**Tone**: Curator-of-credible-sources. NO marketing pages, NO blog posts unless authoritative.

**Common pitfalls:**
- Marketing URLs (`/products/`, `/why-salesforce/`) instead of docs URLs (`/docs/`, `/trailhead/`, `/developer.salesforce.com/`)
- Outdated links (verify Trailhead modules still exist)
- <5 references for medium-form HLD

---

## CONSOLIDATE & POLISH (Phase 8 final mode)

After all 12 sections written:
1. Re-read the entire file end-to-end
2. **Cross-section consistency**: entity names match across §4, §6, §7; vendor names consistent (Guidewire ClaimsCenter not "Guidewire CC")
3. **Terminology alignment**: pick one term per concept (e.g., "Platform Event" not interchangeably with "PE" or "platform event")
4. **Residual placeholder check**: search file for `_{pending Phase N}_` and `<!-- SECTION:` — must be ZERO
5. **Run validation script**: `node lib/scripts/validate-solution-doc.js {path}`
6. **Apply script fixes** (numeric arithmetic, Mermaid lint, missing sections)
7. **Final length check**: within ±20% of FNOL anchor for similar complexity
8. **Final style check**: tone consistent, no orphan sentences, headings hierarchy clean

**Forbidden in Consolidate mode**: regenerating sections already written and approved. Polish is cross-cutting only.

---

> 🧞‍♂️ R-GENIE Agent Framework by Cheppali Shaik Sohail
> ✍️ Agent Author: Cheppali Shaik Sohail | v1.0.0 | 2026-05-13
