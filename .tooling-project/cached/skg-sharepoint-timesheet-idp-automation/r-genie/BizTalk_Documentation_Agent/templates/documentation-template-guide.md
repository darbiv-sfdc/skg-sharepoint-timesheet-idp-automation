# BizTalk Technical Design — Template Guide V1.1

**Purpose:** Zero-assumption documentation — a developer must rebuild the integration in MuleSoft from this document alone.
**Author:** Cheppali Shaik Sohail
**Version:** 1.1.0

> **⚠️ CRITICAL — MATCH THE EXAMPLE EXACTLY.** Before generating any file, read `templates/documentation-style.yaml` and the **canonical example** `examples/01_oracle_changepo/`. Your output structure (headers, section order, table columns, reference blockquotes, certification box) MUST match the example byte-for-byte in form — only the extracted values change.

---

## Core Principle

> **Document what EXISTS in the source, not what you ASSUME — and flag what cannot be replicated.**

Every extracted element must: (1) cite its source file (+ OID/LinkID), (2) be count-verified, (3) include complete configuration, (4) be reproducible.

---

## Output Structure (EXACT)

```
project/output_biztalk/{app_name}/
├── biztalk_design_{app_name}.md          # Main document (7 sections)
├── supporting-docs/
│   ├── artifact-inventory.md             # Phase 0
│   ├── orchestration-flows.md            # Phase 1
│   ├── schema-structures.md              # Phase 2
│   ├── map-mappings.md                   # Phase 2
│   ├── pipeline-helper-reference.md      # Phase 3
│   ├── replication-gap-report.md         # Phase 4
│   └── verification-checklist.md         # Phase 5
└── .biztalk-state.json
```

**Naming:** `{app_name}` = BizTalk application/solution name (e.g., `VenOracle._ChangePO`, `VenMYEInvoice`).

---

## Reference Format (EXACT)

Every reference from the main document to a supporting doc uses this blockquote pattern:

```markdown
> **{icon} {Title}:** See [`supporting-docs/{file}.md`](supporting-docs/{file}.md) for {description}.
```

| Icon | Supporting doc | Canonical description |
|------|----------------|-----------------------|
| 📦 | artifact-inventory.md | full file list, artifact-type counts, and the assembly-reference graph |
| 🔀 | orchestration-flows.md | every shape (verbatim expressions + OIDs), ports, messages, variables, correlations, and the Mermaid flow |
| 🗂️ | schema-structures.md | full schema field trees, namespaces, and fields-in-use |
| 🔗 | map-mappings.md | every map link (source→target XPaths + functoid/XSLT logic) and constants |
| 🧩 | pipeline-helper-reference.md | pipeline stages, port bindings, and `.cs` helper signatures + call-sites |
| 🚧 | replication-gap-report.md | the BizTalk→MuleSoft mapping and every replication gap with reason + recommended action |
| 📋 | verification-checklist.md | file-by-file reconciliation, count summary, and certification |

---

## Document Structure Overview

| # | Section | Marker | Filled in Phase |
|---|---------|--------|-----------------|
| 1 | Application Overview | `<!-- SECTION:1 -->` | 0 |
| 2 | Architecture | `<!-- SECTION:2 -->` | 0 |
| 3 | Orchestration Documentation | `<!-- SECTION:3 -->` | 1 |
| 4 | Schemas & Data Mappings | `<!-- SECTION:4 -->` | 2 |
| 5 | Pipelines, Ports & Helpers | `<!-- SECTION:5 -->` | 3 |
| 6 | MuleSoft Replication Readiness | `<!-- SECTION:6 -->` | 4 |
| 7 | Validation & Certification | `<!-- SECTION:7 -->` | 5 |

---

## MAIN DOCUMENT — EXACT TEMPLATES

### Header (EXACT)

```markdown
# BizTalk Technical Design — {app_name}

> Forensic, zero-assumption documentation for MuleSoft rebuild.
> **Source:** `{source_path}`  |  **Generated:** {date}  |  **Agent:** BizTalk Documentation Agent v{version}
> Principle: document what EXISTS in the source; flag what cannot be replicated.
```

### Section 1 — Application Overview `<!-- SECTION:1 -->`

```markdown
<!-- SECTION:1 -->
## 1. Application Overview

**Application:** {name} (project `{btproj}`)
**Root namespace / assembly:** {namespace} ({signing}, target framework {tfm}, output type {type})  <!-- omit line if not discoverable -->
**Purpose:** {one-sentence business purpose}
**Integration scope:** {source system} → BizTalk → {target system}

**Artifact counts:**

| Type | Count | Notes |
|------|-------|-------|
| Orchestrations (.odx) | {n} | {note or names} |
| Maps (.btm/.xsl) | {n} | {note} |
| Schemas (.xsd) | {n} | {note — present vs external} |
| Pipelines (.btp) | {n} | {note} |
| Helpers (.cs) | {n} | {note — present vs referenced-absent} |

**Flow:** {2–4 sentence end-to-end narrative}.

> **📦 Artifact inventory:** See [`supporting-docs/artifact-inventory.md`](supporting-docs/artifact-inventory.md) for the full file list, artifact-type counts, and the assembly-reference graph.
```

### Section 2 — Architecture `<!-- SECTION:2 -->`

```markdown
<!-- SECTION:2 -->
## 2. Architecture

```mermaid
%%{ init: { 'flowchart': { 'curve': 'linear' } } }%%
flowchart LR
    SRC[{source}<br/>{format}] --> RP[Receive Port<br/>{port}]
    RP --> ORCH[Orchestration<br/>{orch}]
    ORCH --> TGT[{target}<br/>{transport}]
    style SRC fill:#90caf9
    style RP fill:#a5d6a7
    style ORCH fill:#a5d6a7
    style TGT fill:#ef9a9a
```

**Project hierarchy:** {projects + folders}.

**Assembly-reference graph (from `.btproj`):**

| Referenced Assembly | Used For | Source in export? |
|---------------------|----------|-------------------|
| `{assembly}` | {purpose} | 🟢 Yes / 🔴 No |

**Hosting / ports:** {logical receive/send ports, port types, message types; physical binding present? flag ⚠️ ASSUMPTION if absent}.
```

### Section 3 — Orchestration Documentation `<!-- SECTION:3 -->` (repeat per `.odx`)

```markdown
<!-- SECTION:3 -->
## 3. Orchestration Documentation

### {OrchName} (`{file}.odx`) — {n}/{n} shapes

**Service:** {modifier}, {invokable}, {transactional}. **Activation:** `{shape}` (Activate=True) on `{port}`.
**Messages:** `{msg}` (`{type}`, {dir}){, …}.
**Variables:** `{var}` ({type}, init `{value}`){, …}.
**Correlations:** {none / list}.

| # | Shape | Name | Config / Expression | OID |
|---|-------|------|---------------------|-----|
| {k} | {ShapeType} | {name} | {compact config / expression summary} | `{oid}` |

> {⚠️ runtime-behavior note if any}. Full verbatim expressions + per-shape detail in `supporting-docs/orchestration-flows.md`.

```mermaid
%%{ init: { 'flowchart': { 'curve': 'linear' } } }%%
flowchart TD
    {nodes in execution order; branches for Decision/Parallel; dashed -.-> for catch/back-edges}
    {style lines by semantic role}
```

> **🔀 Orchestration detail:** See [`supporting-docs/orchestration-flows.md`](supporting-docs/orchestration-flows.md) for every shape (verbatim expressions + OIDs), ports, messages, variables, correlations, and the Mermaid flow.
```

### Section 4 — Schemas & Data Mappings `<!-- SECTION:4 -->`

```markdown
<!-- SECTION:4 -->
## 4. Schemas & Data Mappings

### Schema: `{file}.xsd`
- {target namespace, root, key fields; flag 🔴 GAP if body external/absent}.

### Map: {MapName} (`.btm` UTF-16 + `.xsl`) — {n}/{n} links
> {note if CustomXSLT / .btm↔.xsl divergence}.

| Link | Source | Target | Logic |
|------|--------|--------|-------|
| {k} | `{source xpath}` | `{target xpath}` | {functoid/XSLT logic + constants} |

> **🗂️ Schema structures:** See [`supporting-docs/schema-structures.md`](supporting-docs/schema-structures.md) for full schema field trees, namespaces, and fields-in-use.
> **🔗 Map mappings:** See [`supporting-docs/map-mappings.md`](supporting-docs/map-mappings.md) for every map link (source→target XPaths + functoid/XSLT logic) and constants.
```

### Section 5 — Pipelines, Ports & Helpers `<!-- SECTION:5 -->`

```markdown
<!-- SECTION:5 -->
## 5. Pipelines, Ports & Helpers

**Pipelines:** {none custom / per-`.btp` stages → components; ⚠️ ASSUMPTION if binding absent}.
**Ports:** {logical receive/send ports; intent}.
**Helpers (referenced, source absent → 🔴 GAP):**
- `{Namespace.Helper.Method}({args})` — {behavior from call-site only}. Call-site: {shape}.

Framework calls (replicable): {list}.

> **🧩 Pipeline & helper reference:** See [`supporting-docs/pipeline-helper-reference.md`](supporting-docs/pipeline-helper-reference.md) for pipeline stages, port bindings, and `.cs` helper signatures + call-sites.
```

### Section 6 — MuleSoft Replication Readiness `<!-- SECTION:6 -->`

```markdown
<!-- SECTION:6 -->
## 6. MuleSoft Replication Readiness

| BizTalk Construct | MuleSoft Equivalent | Verdict |
|-------------------|---------------------|---------|
| {construct} | {mulesoft equivalent} | 🟢 / 🟡 {reason} / 🔴 {reason} |

**Replication gaps ({g}):** {one-line summary of each gap}.

> **🚧 Replication-gap report:** See [`supporting-docs/replication-gap-report.md`](supporting-docs/replication-gap-report.md) for the BizTalk→MuleSoft mapping and every replication gap with reason + recommended action.
```

### Section 7 — Validation & Certification `<!-- SECTION:7 -->`

```markdown
<!-- SECTION:7 -->
## 7. Validation & Certification

| File | Found | Documented |
|------|-------|------------|
| `{file}` | {elements found} | {n}/{n} ✅ |

> **📋 Verification checklist:** See [`supporting-docs/verification-checklist.md`](supporting-docs/verification-checklist.md) for file-by-file reconciliation, count summary, and certification.

```
╔══════════════════════════════════════════════════════════════╗
║  BIZTALK DOCUMENTATION — COVERAGE CERTIFICATION                ║
║  App: {app_name}                                               ║
║  ✅ All present artifacts documented                            ║
║     (shapes {n}/{n}, map links {n}/{n}, schemas {n}/{n}, helpers {n}/{n}) ║
║  🔴 {g} external/binding dependencies flagged as replication gaps ║
║  RESULT: {COMPLETE for provided source | INCOMPLETE — see gaps} ║
╚══════════════════════════════════════════════════════════════╝
```
```

> **Note on the certification box:** keep the content lines exactly as above (App / coverage counts / gap count / RESULT). The `║` borders need not be pixel-aligned, but every content line MUST be present.

---

## SUPPORTING DOCUMENT — EXACT TEMPLATES

Every supporting doc starts with this header:

```markdown
# {Doc Title} — {app_name}

> Phase {n}. {one-line scope + source}.
```

### artifact-inventory.md (Phase 0)
1. **Files in export** table — `| # | File | Type | Encoding | Notes |`
2. **Artifact-type counts** table — `| Artifact type | Present | Referenced-but-absent |`
3. **Assembly-reference graph** — fenced tree (`├──`, `└──`) with 🟢/🔴 per reference.
4. **Referenced-but-absent** table — `| Reference | Kind | Referenced by |`

### orchestration-flows.md (Phase 1) — per orchestration
- Heading `## {OrchName} — {n}/{n} shapes` + Module/Service/Activation bullets.
- **Port type & port** table — `| Element | Detail | OID |`
- **Messages** table — `| Message | Type | Direction | OID |`
- **Variables** table — `| Variable | Type | Initial value | OID |` + `**Correlations:**` line.
- **Shape-by-shape flow** table — `| # | Shape Type | Name | Config / Expression | Source OID |`
- **Inline expression code (verbatim)** — fenced ```csharp blocks per shape (`**S{n} — "{name}" (OID `{oid}`):**`), never truncated.
- **Helper call-sites** table — `| Helper | Signature (as called) | Call-site shape |`
- **Mermaid flow** — `flowchart TD` with `curve: linear`.

### schema-structures.md (Phase 2) — per schema
- Property table — `| Property | Value |` (target namespace, imports, root, annotations).
- **Structure** fenced tree; flag 🔴 GAP for absent/external bodies.
- **Fields-in-use** table (when full schema absent) — `| Source XPath … | Used in |`.
- Target schema block (if external) with recovered shape tree.

### map-mappings.md (Phase 2) — per map
- `.btm` ↔ `.xsl` divergence note (if CustomXSLT) + fenced `.btm` summary.
- **Effective mapping** table — `| Link | Source | Target | Logic |` (every link).
- **Body template** fenced block (literal text/labels, verbatim).
- **Header / control** bullets (xsl:output, templates, namespaces).
- Runtime-override ⚠️ notes where the orchestration supersedes the map.

### pipeline-helper-reference.md (Phase 3)
- **Pipelines** — none-custom note or stage→component list; ⚠️ ASSUMPTION if binding absent.
- **Ports** table — `| Port | Kind | Binding | Notes |`
- **Helpers (source absent → 🔴 GAP)** — numbered entries: Assembly, Signature (as called), Behavior (call-site only), Call-sites, `[ENV]`/`[ENCRYPTED]` markers.
- **Framework calls (replicable)** bullets.

### replication-gap-report.md (Phase 4)
- **BizTalk → MuleSoft construct mapping** table — `| BizTalk Construct | MuleSoft Equivalent | Verdict |`
- **Gap register** table — `| # | Artifact | Gap | Why not replicable | Recommended MuleSoft action |`
- **Tree-of-Thought** for any ambiguous rebuild choice (Branch A / Branch B / Chosen).

### verification-checklist.md (Phase 5)
- **File-by-file reconciliation** table — `| File | Elements found | Documented | Status |`
- **Count summary** table — `| Metric | Inventory (Phase 0) | Documented | Match |`
- **Quality checklist** — `[x]` items (mirror `02_Guidance.mdc §7`).
- **Certification** — the EXACT ASCII box (same as main-doc §7).

---

## PER-SHAPE-TYPE FORMATS (orchestration-flows.md "Config / Expression" column)

Document each orchestration shape with the appropriate compact form. Full verbatim code always goes in the fenced `csharp` blocks below the shape table.

| Shape Type | What to capture in "Config / Expression" |
|------------|------------------------------------------|
| **Receive** | Port, Operation/message, `Activate=True/False`, DNF filter predicate (or "No DNF filter") |
| **Send** | Port, Operation/message, delivery notification if set |
| **Construct** | Which message it constructs (wraps Transform/MessageAssignment children) |
| **Transform** | `transform (out) = {Namespace.Maps.MapName} (in)` — name in + out parts |
| **MessageAssignment** | Summary + `(see code block S{n})`; full verbatim in csharp block |
| **VariableAssignment** | Summary + `(see code block S{n})`; full verbatim in csharp block |
| **Decision** | "Two branches ({names})"; one row per `DecisionBranch` with its guard expression |
| **DecisionBranch** | `Guard: {boolean expression}` (verbatim) |
| **Loop** | Loop condition expression; body shapes follow |
| **Scope / Catch** | Transaction type; exception type per Catch; compensation if any |
| **Call / CallExternal** | `call {Namespace.Helper} ({args})`; flag 🔴 GAP if helper source absent |
| **Parallel** | Number of branches; each branch documented in order |
| **Terminate** | `ErrorMessage`/reason; `terminate "{text}"` |

> Always include the `Source OID` for every shape. Decode `&quot;`, `&#xD;&#xA;` in expressions and reproduce verbatim.

---

## CONTENT PATTERNS (✅ MUST / ❌ MUST NOT)

### Main document
- ✅ Header has Source, Generated date, Agent version (3 fields).
- ✅ §1 artifact-counts table uses the 3 fixed columns (`Type | Count | Notes`) and the 5 fixed rows.
- ✅ §3 shape table uses `# | Shape | Name | Config / Expression | OID` — and one Mermaid `flowchart TD` per orchestration.
- ✅ Every section ends with the correct reference blockquote(s) + icon.
- ✅ §7 ends with the EXACT certification box (App line + coverage counts + gap count + RESULT).
- ❌ Do NOT inline full verbatim expressions, full field trees, or all map links in the main doc — those live in supporting docs.
- ❌ Do NOT rename, reorder, or drop columns/sections; do NOT omit a section — mark "Not applicable — no {artifact} present" instead.

### Supporting docs
- ✅ Every supporting doc has the `# {Title} — {app_name}` header + `> Phase {n}.` line.
- ✅ orchestration-flows.md includes verbatim `csharp` code blocks for every expression shape, never truncated.
- ✅ map-mappings.md documents EVERY link; consults BOTH `.btm` and `.xsl`; flags divergence.
- ✅ verification-checklist.md ends with the ASCII certification box.
- ❌ Do NOT summarize away a shape, link, field, or helper.
- ❌ Do NOT invent logic for absent `.cs`/assemblies — flag 🔴 GAP.
- ❌ Do NOT expose secrets — mark `[ENCRYPTED]` / `[ENV]`.

### References
- ✅ ALL references use the blockquote pattern `> **{icon} {Title}:** See [`supporting-docs/{file}.md`]({path}) for {description}.`
- ✅ Relative paths only: `supporting-docs/{file}.md`.

---

## VALIDATION CHECKLIST (before finishing)

- [ ] Main doc + all 7 supporting docs created.
- [ ] Header, section order, and ALL table columns match the canonical example.
- [ ] Every reference uses the blockquote + icon format.
- [ ] One `flowchart TD` per orchestration; system-context `flowchart LR` in §2; `curve: linear` on all.
- [ ] All counts verified (shapes N/N, links N/N, fields, helpers).
- [ ] Every absent dependency flagged 🔴 GAP; secrets `[ENCRYPTED]`/`[ENV]`.
- [ ] §7 + verification-checklist.md carry the EXACT certification box.

---

## Example Reference

| Example | Role |
|---------|------|
| `examples/01_oracle_changepo/` | **Canonical full anchor** — main doc + all 7 supporting docs. Match this EXACTLY. |
