# Mermaid Diagram Best Practices — Generation Standard

**Purpose:** Domain-agnostic mechanics for producing Mermaid diagrams that render correctly and read cleanly. Apply to EVERY Mermaid diagram emitted by an R-GENIE agent (Phase Orchestration state machines, INDEX.md dependency maps, ARCHITECTURE.md workflows, agent-generated deliverables).
**Author:** Cheppali Shaik Sohail
**Version:** 1.0.0
**Scope:** `flowchart` / `graph` / `stateDiagram-v2` / `sequenceDiagram` — the mechanics below apply universally; diagram-type-specific notes are called out where they differ.
**Owners:** Consumed by Agent Builder (bakes into every generated agent) and Agent Tuner (retrofits existing agents).

---

## 1. Why This Document Exists

Mermaid renders differently across GitHub, GitLab, VS Code preview, Obsidian, Docusaurus, Cursor, Windsurf, and the various Mermaid Live editors. A diagram that "looks fine" in one renderer can be broken, overlapping, or illegible in another. Most breakage comes from a small set of mechanics:

- Using `\n` instead of `<br/>` for line breaks.
- Not controlling node declaration order → renderer picks a layout that overlaps arrows.
- Not controlling connection order → shared-source arrows cross each other.
- Curved edges where straight lines would be clearer.
- Missing `init` directives that every renderer needs to honour the same way.
- Redundant labels that create visual clutter and obscure the semantic direction.

This doc is the single source of truth for those mechanics.

---

## 2. The Ten Non-Negotiable Rules

| # | Rule | Why |
|---|------|-----|
| 1 | **Use `<br/>` for line breaks in labels.** NEVER use `\n`. | `\n` renders as literal `\n` in most renderers (GitHub, VS Code preview, Cursor, Windsurf, many Mermaid Live configs). |
| 2 | **Start `flowchart` / `graph` diagrams with the linear-curve init directive** (see §3) for predictable straight edges. | Default curved edges collide and overlap in dense diagrams; `linear` gives deterministic routing. |
| 3 | **Declare nodes in the order you want them rendered.** Upstream/primary path first, downstream/branch path last. | Mermaid's layout engine uses declaration order as a tie-breaker for vertical placement. |
| 4 | **List connections in the order you want arrows routed.** The first connection from a shared source gets the primary route; later connections branch. | Arrow overlap is almost always fixed by re-ordering connection statements, not by tweaking styles. |
| 5 | **Separate connection groups with blank lines** when a diagram has multiple sub-paths. | Mermaid uses blank-line boundaries as layout hints to route sub-paths on distinct lanes. |
| 6 | **Solid `-->` = request/forward direction. Dashed `-.->` = response/return/async direction.** Never mix the two semantics. | Gives readers a consistent semantic vocabulary. |
| 7 | **Edge labels must be short and descriptive.** Prefer action labels (`"Publish"`, `"SFTP Get"`, `"File Data"`) over IDs or sentences. | Long labels push arrows apart and break the visual grid; duplicate IDs on every arrow obscure the diagram. |
| 8 | **Declare all `style` statements at the end of the diagram**, in the same order as node declarations. | Interleaving styles with nodes/connections is visually noisy and makes maintenance harder. |
| 9 | **Quote labels that contain spaces, parentheses, slashes, or HTML** — e.g., `NODE["Customer 360<br/>(Data Cloud)"]`. | Unquoted labels with special characters are parsed inconsistently across renderers. |
| 10 | **Every sub-graph/layer node must connect to something.** No dangling nodes. If a node has no inbound or outbound edge, either delete it or add the missing connection. | Dangling nodes indicate incomplete semantics and are a strong signal the author ran out of understanding. |

---

## 3. The Mandatory Init Directive (flowchart / graph)

Every `flowchart` or `graph` diagram MUST begin with this directive:

```
%%{ init: { 'flowchart': { 'curve': 'linear' } } }%%
graph LR
```

Why:
- `linear` produces straight orthogonal/diagonal edges instead of curved bezier splines.
- Curved edges visually overlap in dense diagrams; linear edges do not.
- GitHub / GitLab / Mermaid Live / VS Code preview all honour this directive identically.

For `stateDiagram-v2` and `sequenceDiagram`, the init directive is NOT required (those diagram types don't use curved flowchart edges).

---

## 4. Graph Direction Decision Matrix

| Diagram Purpose | Direction | Mermaid Syntax |
|-----------------|-----------|----------------|
| Integration / data flow, source → target | Left-to-right | `graph LR` |
| Architecture with upstream → downstream | Left-to-right | `graph LR` |
| Hierarchical / organizational / taxonomy | Top-down | `graph TD` |
| Dependency map (what depends on what) | Top-down | `graph TD` |
| Workflow state machine | N/A (uses its own layout) | `stateDiagram-v2` |
| Call-order interaction | N/A (uses its own layout) | `sequenceDiagram` |

**Never change direction mid-diagram.** If you need two directions, make two diagrams.

---

## 5. Layout Control — Deterministic Rendering

The single most common cause of ugly Mermaid diagrams is leaving layout to the renderer. Control it.

### 5.1 Node Declaration Order Controls Vertical Placement

Mermaid places earlier-declared nodes on the top lane when there's ambiguity. Structure declarations as:

1. **Upstream / source / left-most nodes first**
2. **Middle / processing / sub-graph nodes second**
3. **Downstream / target / right-most nodes last**

```
SOURCE["Client"]

subgraph processing["Middle Layer"]
    P1["Process A"]
    P2["Process B"]
end

TARGET["Database"]
```

### 5.2 Connection Order Controls Arrow Routing

When a node has multiple outbound arrows, the first-listed connection gets the primary (top) route; later connections bend below it. Rule of thumb:

- **List the simpler / shorter path first.**
- **List the branching / multi-hop path second.**

```
P -->|"primary"| TARGET_A
P -->|"secondary"| INTERMEDIATE -->|"forward"| TARGET_B
```

If two arrows from the same node visually overlap in your renderer: swap their declaration order; do NOT try to fix it with styles.

### 5.3 Blank Lines Between Connection Groups

Mermaid treats contiguous connection blocks as one routing unit. Insert blank lines between logically distinct groups so the layout engine routes them on separate lanes:

```
SFDC -->|"SOAP"| E1 -->|"REST"| SAP

SFDC -->|"SOAP"| E2 -->|"REST"| SAP

SAP -->|"Event"| E3 -->|"REST"| SFDC
```

### 5.4 Style Block Ordering

Put all `style` declarations at the very end of the diagram, in the same order as the nodes were declared:

```
%%{ init: { 'flowchart': { 'curve': 'linear' } } }%%
graph LR
    A["Alpha"]
    B["Bravo"]
    C["Charlie"]

    A --> B --> C

    style A fill:#E3F2FD,stroke:#90CAF9,color:#000
    style B fill:#FFF3E0,stroke:#FFCC80,color:#000
    style C fill:#E8F5E9,stroke:#A5D6A7,color:#000
```

---

## 6. Arrow Semantics

| Syntax | Semantic | Example Use |
|--------|----------|-------------|
| `-->` | Request / forward / synchronous call | `Client --> API` |
| `-.->` | Response / return / async reply / data-return | `API -.-> Client` |
| `==>` | Emphasised / primary path (optional) | Use sparingly for "happy path" highlighting |
| `-->|"label"|` | Labelled forward edge | `Client -->|"REST"| API` |
| `-.->|"label"|` | Labelled return edge | `API -.->|"Response"| Client` |

**Rule:** In any single diagram, pick ONE meaning for `-.->` and stick to it. Most common choice: dashed = return/response/async.

**Async fire-and-forget flows (Solace/event publishers):** show the publish arrow only — NO return arrow. The absence of a return arrow is semantic.

---

## 7. Edge Label Discipline

### 7.1 What Labels Are For

Edge labels answer ONE of three questions:
1. **What protocol/transport?** — `"REST"`, `"SOAP"`, `"JDBC"`, `"SFTP"`
2. **What action?** — `"Publish"`, `"Subscribe"`, `"SFTP Get"`, `"File Data"`
3. **What payload/event?** — `"Invoice Created"`, `"Order Shipped"`

Pick ONE of these per edge. Don't combine (`"REST Subscribe Order Created"` is visual noise).

### 7.2 Multi-Line Labels

Use `<br/>` for line breaks inside edge labels, same as node labels:

```
A -->|"REST POST<br/>flow IDs 12730, 12740"| B
```

### 7.3 Avoid Redundant Labels on Multi-Target Fan-Out

When a node sends the same data to multiple targets, DO NOT repeat the full label on every outbound arrow. Use differentiating action labels:

```
✅ GOOD:
PROC -->|"File Retrieval"| S_EXT
PROC -->|"NAV Delivery"| S_INT

❌ BAD:
PROC -->|"flow 26730 26740 26750"| S_EXT
PROC -->|"flow 26730 26740 26750"| S_INT
```

### 7.4 Pub/Sub Arrow Label Placement

For message-bus intermediaries (Solace, Kafka, SQS, EventBridge):

```
Source -->|"Publish"|        MESSAGE_BUS
MESSAGE_BUS -->|"Subscribe<br/>event-ids"| Consumer
```

- The **Publish** arrow label is generic — the source doesn't know its subscribers.
- The **Subscribe** arrow label is specific — the consumer knows what it listens for.
- Never reverse these.

---

## 8. Node Label Patterns

### 8.1 Multi-Line Node Labels

```
NODE_ID["Line one<br/>Line two<br/>(optional qualifier)"]
```

Examples:
- `F12730["12730<br/>GetSalesOrder"]` — ID + name
- `API["customer-api<br/>(Solace Subscriber)"]` — name + trigger qualifier
- `SYSTEM["SAP ECC<br/>(S/4HANA)"]` — system + version

### 8.2 Trigger / State Qualifiers

When a node's behaviour depends on how it's invoked, append a qualifier in parentheses on a new line:

| Qualifier | When to Use |
|-----------|-------------|
| `(Scheduled)` | Time-triggered (cron / scheduler) |
| `(WSS Listener)` | SOAP/WSS listener |
| `(REST Listener)` | Default HTTP listener — often omitted since REST is the default |
| `(Solace Subscriber)` | Message-bus subscriber |
| `(Queue Listener)` | Anypoint MQ / SQS / VM queue subscriber |
| `(Deprecated)` / `(Decommissioned)` | Node retained for history, not active |

### 8.3 Node ID Conventions

- Use uppercase or PascalCase for system-level nodes: `SFDC`, `SAP`, `MESSAGE_BUS`.
- Use prefixed IDs for enumerable flows: `F12730` (F for Flow), `P_ORDER` (P for Process API), `E_CUSTOMER` (E for Experience API).
- Keep IDs short (≤12 chars) — they appear in every connection statement.
- IDs must be unique within a diagram. Reuse across diagrams is fine.

---

## 9. Subgraph Patterns

Subgraphs group related nodes visually. Use them when:
- 3+ nodes share a semantic category (e.g., "all Experience APIs").
- You want a labelled boundary box around a group.
- A domain has internal sub-groupings worth highlighting.

### 9.1 Syntax

```
subgraph flows1["Create Order"]
    F12730["12730<br/>GetOrder"]
    F12740["12740<br/>CheckOrder"]
    F12750["12750<br/>SubmitOrder"]
end
```

### 9.2 Subgraph ID Naming

- Single subgraph in a diagram → use `flows` (no suffix).
- Multiple subgraphs → use `flows1`, `flows2`, `flows3` — OR use domain-meaningful IDs like `createOrder`, `approveOrder`.
- Never reuse a subgraph ID in the same diagram.

### 9.3 Subgraph-Level Styles

Style the subgraph box itself, not just its nodes:

```
style flows1 fill:#E3F2FD,stroke:#90CAF9,color:#000
```

---

## 10. Color Palette Guidance

### 10.1 Use Material Design 200/300-Level Colors

They render well on both light and dark backgrounds and are colour-blind-friendly enough for most common cases.

### 10.2 Semantic Color Assignment

Assign colours by **semantic role**, not by alphabetical order. A color should mean the same thing across EVERY diagram in a given deliverable.

| Semantic Role | Suggested Palette |
|---------------|-------------------|
| Source / consumer / client | Blue 300 — `fill:#4FC3F7,stroke:#0288D1,color:#000` |
| Target / end-system / datastore | Amber 300 — `fill:#FFB74D,stroke:#F57C00,color:#000` |
| Middleware / processing layer | Green 200 — `fill:#A5D6A7,stroke:#66BB6A,color:#000` |
| Event bus / queue | Purple 200 — `fill:#B39DDB,stroke:#512DA8,color:#000` |
| External / 3rd-party | Pink 200 — `fill:#F48FB1,stroke:#EC407A,color:#000` |
| Accelerator / sub-flow | Orange 200 — `fill:#FFCC80,stroke:#EF6C00,color:#000` |
| Deprecated / decommissioned | Grey 300 — `fill:#E0E0E0,stroke:#9E9E9E,color:#000` |

### 10.3 Subgraph Background Palette (Lighter Variants)

Use Material Design 50/100-level fills for subgraph boxes so the enclosed node colours remain dominant:

| Subgraph Category | Fill |
|-------------------|------|
| Standard / happy-path | `fill:#E3F2FD,stroke:#90CAF9,color:#000` (Blue 50) |
| Batch / scheduled | `fill:#FFF3E0,stroke:#FFCC80,color:#000` (Orange 50) |
| Event / async | `fill:#E8F5E9,stroke:#A5D6A7,color:#000` (Green 50) |
| Round-trip / bidirectional | `fill:#FCE4EC,stroke:#F48FB1,color:#000` (Pink 50) |
| AI / ML / advanced | `fill:#EDE7F6,stroke:#B39DDB,color:#000` (Purple 50) |

### 10.4 Define a Palette Once Per Deliverable

If an agent emits multiple diagrams in the same document, define the palette ONCE (usually in a "Legend" table) and reference it from every diagram. Don't invent new colors per diagram.

---

## 11. Bidirectional and Round-Trip Flows

When the same two systems have flows in BOTH directions, show each direction in a SEPARATE subgraph:

```
subgraph flows1["Request: A → B"]
    F1["Flow 1"]
end

subgraph flows2["Response: B → A"]
    F2["Flow 2"]
end
```

For single-flow round-trips (call target, receive data, deliver elsewhere), use dashed arrows for the return hop:

```
PROC -->|"Call"| TARGET_A
TARGET_A -.->|"Data"| PROC
PROC -->|"Deliver"| TARGET_B
```

---

## 12. State Diagrams (`stateDiagram-v2`)

The layout/declaration-order rules from §5 apply, but syntax differs:

```
stateDiagram-v2
    [*] --> Phase0: trigger event
    Phase0 --> CP0: work complete
    CP0 --> Phase1: user approved
    CP0 --> Phase0: user requested changes
    Phase1 --> [*]: done
```

**State-diagram specifics:**
- Use `[*]` for start/end pseudostates.
- Transitions use `-->` (dashed transitions are not standard — use notes for clarification).
- Label transitions with the **trigger event**, not the action: `user approved`, not `proceeds`.
- Group related states with `state "Group Name" { ... }` when needed.
- NO init directive required.

---

## 13. Sequence Diagrams (`sequenceDiagram`)

```
sequenceDiagram
    participant C as Client
    participant A as API
    participant D as Database

    C->>A: POST /order
    A->>D: INSERT order
    D-->>A: order_id
    A-->>C: 201 Created
```

**Sequence-diagram specifics:**
- `->>` = synchronous call; `-->>` = response.
- `->)` = asynchronous / fire-and-forget.
- Declare participants in left-to-right call order.
- Use `Note over X: ...` for side-channel clarification, sparingly.

---

## 14. Self-Check Before Emitting Any Diagram

Run this checklist BEFORE pasting a Mermaid block into an output file:

- [ ] `flowchart`/`graph` diagrams start with `%%{ init: { 'flowchart': { 'curve': 'linear' } } }%%`
- [ ] Zero occurrences of `\n` in any label (node or edge)
- [ ] Every multi-word label uses `<br/>` for line breaks
- [ ] Node declarations ordered upstream → downstream
- [ ] Connection statements ordered primary-path → branching-path
- [ ] Blank lines separate distinct connection groups
- [ ] Arrow semantics consistent: `-->` = forward, `-.->` = return/async
- [ ] Edge labels are short action/protocol/event strings (not full sentences)
- [ ] No redundant labels repeated on multi-target fan-out arrows
- [ ] All style declarations at the end of the diagram
- [ ] Style declaration order matches node declaration order
- [ ] No dangling nodes (every node has at least one connection)
- [ ] Labels with spaces/special chars wrapped in `"..."`
- [ ] Colours assigned by semantic role, not alphabetically
- [ ] If multiple diagrams in one document: same semantic colour assignments across all

---

## 15. Anti-Patterns (What Not To Do)

| Anti-Pattern | Symptom | Fix |
|--------------|---------|-----|
| `A["line1\nline2"]` | Renders as literal `\n` in GitHub, VS Code, Cursor, Windsurf | Use `<br/>` |
| No init directive | Arrows curve and overlap | Add `%%{ init: { 'flowchart': { 'curve': 'linear' } } }%%` |
| Nodes declared in alphabetical order | Renderer places source after target visually | Declare in upstream → downstream order |
| Same label on every fan-out arrow | Diagram reads as one mega-clump of text | Use differentiating action labels per arrow |
| Styles interleaved with nodes/connections | Hard to maintain; easy to duplicate or miss one | Move all styles to end, in node order |
| Reversed Publish/Subscribe labels | Reader thinks data flows the wrong way | `Publish` on source-side arrow, `Subscribe` on consumer-side arrow |
| Dangling node (no connections) | Indicates incomplete design | Delete OR add the missing edge |
| Curved edges in dense diagrams | Arrows overlap and become illegible | Use `curve: linear` |
| Diagram direction changed mid-document | Reader loses spatial orientation | One direction per diagram; use two diagrams if needed |
| Unquoted labels with `()` or `/` | Parser warnings / inconsistent rendering | Wrap label in `"..."` |

---

## 16. When To Use What Diagram Type

| Need | Diagram Type |
|------|--------------|
| Workflow state machine with phases + checkpoints | `stateDiagram-v2` |
| Integration/data flow, source → target | `flowchart LR` |
| Service architecture / layered APIs | `flowchart LR` |
| Rule-file dependency map | `flowchart TD` |
| Who-calls-whom in what order | `sequenceDiagram` |
| Hierarchy / taxonomy / org chart | `flowchart TD` |
| ER-like entity relationships | `erDiagram` (rarely needed in R-GENIE agents) |
| Gantt / timeline | `gantt` (only for scheduling/rollout diagrams) |

---

## 17. Integration With R-GENIE Agents

Every R-GENIE agent file that emits or references a Mermaid diagram MUST:
1. Link to this doc in its rules (typically via `@r-genie/{Agent_Name}_Agent/lib/docs/mermaid-diagram-best-practices.md` or the Agent Builder copy).
2. Include the §14 self-check in its SELF-CHECK block.
3. Use the §10 palette OR document a domain-specific variant in its own `lib/docs/`.
4. Place the §3 init directive at the top of every emitted flowchart.

When Agent Builder generates a new agent, these integrations are baked in automatically via `skeleton-templates.md` and the corresponding `rules/` references.

When Agent Tuner retrofits an existing agent, "Mermaid Standards Retrofit" is one of the named customization patterns in `customization-patterns.md`.

---

> 🧞‍♂️ R-GENIE Agent Framework by Cheppali Shaik Sohail
> ✍️ Document Author: Cheppali Shaik Sohail | v1.0.0 | 2026-04-23
