# Research Sources & 3-Tier Research Protocol — Cloud Success Architect Agent

> **Purpose:** Authoritative spec for Phase 2B research — how to refresh capability knowledge before Phase 3 brainstorming. Three tiers: indexed `@Docs:<name>` first → live web fallback → baked-in catalog last-resort. Extracted from `rules/01_Guidance.mdc` §12 and `rules/00_Phase_Orchestration.mdc` Phase 2B to keep rule files lean (per `AGENT_ARCHITECTURE_STANDARD.md` size limits).
>
> **Used by:** `rules/00_Phase_Orchestration.mdc` Phase 2B (the protocol section references this file), `rules/01_Guidance.mdc` §12 (summary stub references this file).
>
> **Maintainer:** Cheppali Shaik Sohail | v1.1.0 | 2026-05-06

---

## 1. 3-TIER RESEARCH PROTOCOL (Phase 2B — MANDATORY)

> **Why this exists:** The MuleSoft + Agentforce product surface updates frequently (Agent Fabric, Agent Visualizer, LLM Gateway, Trusted Agent Identity, Hyperforce regional GA, AgentExchange partner additions, Data 360 features). The capability catalog `mulesoft-agentforce-capability-catalog.md` is a baseline only. This protocol refreshes it via three tiers, indexed-first, before Phase 3 brainstorming.

### 1.1 Tier 1 — INDEXED FIRST (`@Docs:<name>`)

For each of the 5–8 capability areas scoped in §2A:

1. Identify primary `@Docs:<name>` via Routing Table §2
2. Query: `@Docs:<primary> "<area + status/region/edition keywords>"`
3. If ≥1 cited passage with status info returned → CAPTURED
   - Record: `source-mode = "@Docs:<name>"`, last-indexed-date, passage URL, research-date = today
4. If no result OR generic marketing only → escalate to Tier 2
5. If primary returns ambiguous/conflicting info → query secondary `@Docs:<name>` from Routing Table to disambiguate; if still unresolved → escalate to Tier 2

### 1.2 Tier 2 — LIVE WEB FALLBACK

For each unresolved area:

1. Use `search_web` and/or `read_url_content` against the live URL in Routing Table §2
2. Capture: status, URL, research-date, fetch outcome
3. Record: `source-mode = "live-fetch (reason: @Docs gap | Cloudflare-blocked | SPA-rendered | indexed-likely-stale)"`
4. If 403 / blocked / fetch failure → escalate to Tier 3

### 1.3 Tier 3 — CATALOG LAST-RESORT

For each still-unresolved area:

1. Use `lib/docs/mulesoft-agentforce-capability-catalog.md` baseline
2. Record: `source-mode = "⚠️ STALE catalog 2026-04-23"`
3. Every Phase 3 recommendation citing this MUST display `⚠️ CATALOG-ONLY` badge
4. **STOP** and notify user that live verification was unavailable; ask whether to wait-and-retry or proceed with explicit caveat on every recommendation

### 1.4 Stale-Index Escape Hatch

If an indexed `@Docs:<name>` was last indexed >30 days ago AND the capability area is a 2026 feature listed below — **SKIP Tier 1** and go directly to Tier 2 with `source-mode = "live-fetch (indexed-likely-stale)"`:

- Agent Fabric / Agent Visualizer / Agent Registry
- LLM Gateway
- Trusted Agent Identity
- Hyperforce regional GA (any region GA after Apr 2026)
- AgentExchange (partner roster shifts weekly)
- Any capability flagged `⚠️ PREVIEW` in catalog §0 At-a-Glance

### 1.5 RGV Cycle

```
1. READ:    5–8 capability areas scoped → Expected: each has source-mode + status + URL + date
2. GENERATE: research_log.md entries
3. VERIFY:  No area has source-mode = "missing"
            Report Tier ratio: Tier-1 (@Docs) : Tier-2 (live) : Tier-3 (catalog)
4. FIX:     Re-query with broader terms before checkpoint; escalate tier if needed
```

### 1.6 `research_log.md` Template

```markdown
# Research Log — {use-case-slug}
**Research date:** {YYYY-MM-DD}
**Phase:** 2B (Capability Discovery — 3-Tier Research)
**Tier ratio:** Tier-1: {X} / Tier-2: {Y} / Tier-3: {Z} / Total: {N}

## Capability Area: {name}
- **Status:** {GA / Preview / Beta / Roadmap / Deprecated}
- **Source-mode:** {@Docs:<name> | live-fetch | ⚠️ STALE catalog}
- **Source(s):** {URL 1}, {URL 2}
- **Last-indexed (if @Docs):** {YYYY-MM-DD}
- **Research-date:** {YYYY-MM-DD}
- **Key facts:** {bullet points — limits, regional availability, dependencies}
- **Customer-fit signal:** maps to Phase {N} pain "{customer fact}"

## Catalog Gaps Detected
- {capability}: in research, not in baked-in catalog → ⚠️ PREVIEW candidate

## Deprecations / Renames
- {old name} → {new name} (source: URL, date)

## Tier Escalation Notes
- Areas escalated Tier 1 → Tier 2: {list with reason}
- Areas escalated Tier 2 → Tier 3: {list with reason}
```

### 1.7 Failure Handling

If ALL three tiers fail for any area: **STOP**. Do NOT fabricate. Offer the user:

- (a) wait and retry (transient network blip / re-sync indexed doc), or
- (b) proceed with `⚠️ RESEARCH UNAVAILABLE — relying on catalog dated {catalog date}` flag on every Phase 3 recommendation citing that area.

---

## 2. `@Docs` ROUTING TABLE

> **How to read:** For each capability area the agent will research in Phase 2B, this table specifies primary indexed `@Docs:<name>` (Tier 1), secondary fallback `@Docs:<name>`, and the live URL for Tier 2 fallback.
>
> **Bold rows** = capability areas added in v1.4.0 (Q1 2026 features).

| Capability Area | Primary `@Docs` | Secondary `@Docs` | Live Fallback URL |
|----------------|----------------|------------------|------------------|
| MuleSoft Accelerators (Healthcare/FS/Retail/Mfg/CG/LS/SAP/OMS) | `mulesoft-docs` | `mulesoft-news` | `https://docs.mulesoft.com/accelerators-home/` |
| Anypoint Runtime Fabric / CloudHub 2.0 / Flex Gateway | `mulesoft-docs` | `mulesoft-platform` | `https://docs.mulesoft.com/gateway/latest/` |
| Anypoint Code Builder / Topic Center / IDP / Composer | `mulesoft-docs` | `mulesoft-news` | `https://docs.mulesoft.com/anypoint-code-builder/` |
| **Agent Fabric / Agent Visualizer / Agent Registry** | `mulesoft-docs` | `mulesoft-for-agentforce` | `https://docs.mulesoft.com/agent-fabric/` |
| **LLM Gateway** | `mulesoft-docs` | `mulesoft-news` | `https://docs.mulesoft.com/general/agent-fabric-release-notes` |
| **Trusted Agent Identity** | `mulesoft-docs` | `mulesoft-news` | `https://docs.mulesoft.com/general/agent-fabric-release-notes` |
| MuleSoft AI Chain (Inference + Vector) | `mulesoft-platform` | `mulesoft-news` | `https://www.mulesoft.com/platform/ai/ai-chain` |
| MuleSoft for Flow / Composer | `mulesoft-platform` | `mulesoft-docs` | `https://www.mulesoft.com/platform/agentforce` |
| Agentforce Builder / Voice / Multi-Agent / Subagents / Observability | `agentforce-whatsnew` | `agentforce-product` | `https://www.salesforce.com/agentforce/what-is-new/` |
| **Agentforce 360 Platform / Atlas / Intelligent Context** | `agentforce-platform` | `agentforce-whatsnew` | `https://www.salesforce.com/platform/agentforce-platform` |
| **AgentExchange (partner agents)** | `agent-exchange` | `agentforce-whatsnew` | `https://www.salesforce.com/agentforce/agentexchange/` |
| Einstein Trust Layer (zero-retention/masking/audit) | `salesforce-trust-ai` | `trailhead-agentforce` | `https://www.salesforce.com/artificial-intelligence/trusted-ai/` |
| **Hyperforce / Data Residency / Sovereign Cloud** | `salesforce-hyperforce` | `salesforce-architect` | `https://www.salesforce.com/platform/what-is-hyperforce/` |
| Data 360 / Data Cloud / Vector Retrieval | `agentforce-platform` | `salesforce-architect` | `https://architect.salesforce.com/docs/architect/fundamentals/guide/data-360-architecture` |
| Reference Architectures / Well-Architected Framework | `salesforce-architect` | `salesforce-engineering` | `https://architect.salesforce.com/` |
| Salesforce Release Notes (GA/Preview confirmation) | `salesforce-release-notes` | `agentforce-whatsnew` | `https://help.salesforce.com/s/articleView?id=release-notes` |
| MuleSoft Q1/Q2 roadmap / news | `mulesoft-news` | `mulesoft-platform` | `https://blogs.mulesoft.com/news/` |
| Industry Cloud (Health Cloud / FS Cloud / Mfg Cloud) | `salesforce-resources-docs` | `salesforce-architect` | `https://resources.docs.salesforce.com/` |
| Trailhead modules (educational baseline) | `trailhead-agentforce` | — | `https://trailhead.salesforce.com/content/learn/modules/` |
| Developer / Admin announcements | `salesforce-developer` / `salesforce-admin` | `salesforce-news` | `https://developer.salesforce.com/blogs/` |

---

## 3. INDEXED DOC INVENTORY

> **How to use:** This is the canonical list of indexed `@Docs:<name>` available for Tier 1 research. New deployments must add these in Cursor → Settings → Features → Docs. Stale-detection thresholds: re-sync weekly for Tier-1 docs, monthly for marketing/news, per-release for release-notes.

### 3.1 Tier-1 (Must-Have — Core Coverage)

| `@Docs:<name>` | Base URL | Type | Notes |
|----------------|----------|------|-------|
| `mulesoft-docs` | `https://docs.mulesoft.com/` | Full doc site (~5K pages) | **Primary workhorse** — covers all accelerators, Flex Gateway, Code Builder, Agent Fabric, Visualizer |
| `agentforce-whatsnew` | `https://www.salesforce.com/agentforce/what-is-new/` | News page | Release announcements |
| `salesforce-architect` | `https://architect.salesforce.com/` | Reference architecture site | Enterprise Agentic Architecture, Data 360 Architecture, Well-Architected |
| `mulesoft-news` | `https://blogs.mulesoft.com/news/` | Blog | Quarterly roadmaps, AI Chain, product announcements |

### 3.2 Tier-2 (Strongly Recommended)

| `@Docs:<name>` | Base URL | Type | Notes |
|----------------|----------|------|-------|
| `mulesoft-platform` | `https://www.mulesoft.com/platform/` | Marketing pages | AI Chain, Topic Center, Agentforce |
| `agentforce-product` | `https://www.salesforce.com/agentforce/` | Marketing pages | Builder, Voice, Multi-Agent, Observability |
| `salesforce-release-notes` | `https://help.salesforce.com/s/articleView?id=release-notes.htm` | Help system | Spring/Summer/Winter GA confirmations |
| `salesforce-trust-ai` | `https://www.salesforce.com/artificial-intelligence/trusted-ai/` | Single landing | Einstein Trust Layer |

### 3.3 Tier-3 (Educational / Deep-Dive)

| `@Docs:<name>` | Base URL | Type | Notes |
|----------------|----------|------|-------|
| `trailhead-agentforce` | `https://trailhead.salesforce.com/content/learn/modules/` | Modules | Trust Layer, Data Cloud + Agentforce, Builder walkthroughs |
| `salesforce-engineering` | `https://engineering.salesforce.com/` | Blog | Platform deep-dives (A2A, MCP) |
| `salesforce-developer` | `https://developer.salesforce.com/blogs/` | Blog | Developer-facing announcements |
| `salesforce-admin` | `https://admin.salesforce.com/blog/` | Blog | Admin-facing announcements |

### 3.4 Tier-1.5 (Q1 2026 Capability Coverage)

| `@Docs:<name>` | Base URL | Type | Notes |
|----------------|----------|------|-------|
| `mulesoft-for-agentforce` | `https://www.salesforce.com/mulesoft/agentforce/` | Single page | MuleSoft + Agentforce bridge — Agent Fabric marketing |
| `salesforce-hyperforce` | `https://www.salesforce.com/platform/what-is-hyperforce/` | Single page | **Critical for Data Residency NFR (Phase 4A + 7)** |
| `agentforce-platform` | `https://www.salesforce.com/platform/agentforce-platform` | Single page | Agentforce 360 Platform — Atlas, Intelligent Context, Metadata-Data Layer |
| `agent-exchange` | `https://www.salesforce.com/agentforce/agentexchange/` | Single page | Partner-curated agent marketplace |

### 3.5 Optional (Industry / Executive)

| `@Docs:<name>` | Base URL | Type | Notes |
|----------------|----------|------|-------|
| `salesforce-resources-docs` | `https://resources.docs.salesforce.com/` | PDF index | Industry Cloud official PDFs (Health/FS/Mfg) |
| `salesforce-news` | `https://www.salesforce.com/news/` | News site | Top-of-funnel exec announcements |

### 3.6 Coverage Notes

- **Single-page docs** (`mulesoft-for-agentforce`, `salesforce-hyperforce`, `agentforce-platform`, `agent-exchange`, `salesforce-trust-ai`) are EXPECTED to return only 1–2 passages — that's by design, they ARE single-page references.
- **Cloudflare/SPA-prone** (most `www.salesforce.com/*` pages): expect partial crawl coverage; Tier 2 fallback common.
- **Login-walled** (`anypoint.mulesoft.com/exchange/...`): NOT indexed; live fetch typically also blocked. Acceptable to mark `⚠️ DOCUMENTATION-RESTRICTED` for these.

---

## 4. LIVE URL REFERENCE (Tier 2 Source Detail)

> Kept for transparency on what the Live Fallback URLs in §2 map to. Use only when Tier 1 indexed lookup is empty/stale.

### 4.1 MuleSoft — Product Truth

| Source | What It Gives You | Priority |
|--------|-------------------|----------|
| `https://docs.mulesoft.com/accelerators-home/` | Authoritative list of all MuleSoft Accelerators | HIGHEST |
| `https://docs.mulesoft.com/release-notes/accelerators/accelerators-release-notes` | Per-accelerator release notes | HIGH |
| `https://docs.mulesoft.com/gateway/latest/` | Flex Gateway (incl. Managed Flex Gateway) | HIGH |
| `https://docs.mulesoft.com/release-notes/flex-gateway/flex-gateway-release-notes` | Flex Gateway release notes | HIGH |
| `https://docs.mulesoft.com/release-notes/code-builder/acb-release-notes` | Anypoint Code Builder release notes | HIGH |
| `https://docs.mulesoft.com/anypoint-code-builder/ai-enabling-api-project-topic-center` | Topic Center technical docs | HIGH |
| `https://docs.mulesoft.com/agent-fabric/` | **Agent Fabric documentation** | HIGHEST (v1.4.0) |
| `https://docs.mulesoft.com/agent-visualizer/` | **Agent Visualizer documentation** | HIGH (v1.4.0) |
| `https://docs.mulesoft.com/general/agent-fabric-release-notes` | **Agent Fabric / LLM Gateway / Trusted Agent Identity release notes** | HIGHEST (v1.4.0) |
| `https://blogs.mulesoft.com/news/` | Product announcements, quarterly roadmaps | HIGH |
| `https://www.mulesoft.com/platform/ai/ai-chain` | MuleSoft AI Chain | MEDIUM |
| `https://www.mulesoft.com/platform/agentforce-topic-center` | Topic Center product page | MEDIUM |

### 4.2 Agentforce — Product Truth

| Source | What It Gives You | Priority |
|--------|-------------------|----------|
| `https://www.salesforce.com/agentforce/what-is-new/` | Canonical "what's new" for Agentforce 360 | HIGHEST |
| `https://www.salesforce.com/platform/agentforce-platform` | **Agentforce 360 Platform — Atlas, Intelligent Context, Metadata-Data Layer** | HIGHEST (v1.4.0) |
| `https://www.salesforce.com/agentforce/` | Agentforce product landing | HIGH |
| `https://www.salesforce.com/agentforce/agent-builder/` | Agentforce Builder | HIGH |
| `https://www.salesforce.com/agentforce/voice/` | Agentforce Voice | HIGH |
| `https://www.salesforce.com/agentforce/multi-agent-orchestration/` | Multi-Agent Orchestration + Superagents | HIGH |
| `https://www.salesforce.com/agentforce/observability/` | Agentforce Observability | HIGH |
| `https://www.salesforce.com/agentforce/agentexchange/` | **AgentExchange partner marketplace** | HIGHEST (v1.4.0) |
| `https://www.salesforce.com/mulesoft/agentforce/` | **MuleSoft for Agentforce bridge** | HIGH (v1.4.0) |
| `https://architect.salesforce.com/docs/architect/fundamentals/guide/enterprise-agentic-architecture` | Enterprise Agentic Architecture & Design Patterns | HIGHEST |

### 4.3 Hyperforce / Platform Substrate (NEW v1.4.0)

| Source | What It Gives You | Priority |
|--------|-------------------|----------|
| `https://www.salesforce.com/platform/what-is-hyperforce/` | **Hyperforce overview — regional sovereign clouds, FedRAMP, data residency** | HIGHEST |
| `https://architect.salesforce.com/docs/architect/fundamentals/guide/data-360-architecture` | Data 360 architecture (formerly Data Cloud) | HIGHEST |

### 4.4 Data Cloud / Data 360 + Einstein Trust Layer

| Source | What It Gives You | Priority |
|--------|-------------------|----------|
| `https://www.salesforce.com/artificial-intelligence/trusted-ai/` | Einstein Trust Layer | HIGH |
| `https://trailhead.salesforce.com/content/learn/modules/the-einstein-trust-layer/meet-the-einstein-trust-layer` | Trust Layer deep-dive | MEDIUM |
| `https://trailhead.salesforce.com/content/learn/modules/data-cloud-powered-agentforce/` | Data Cloud + Agentforce grounding | HIGH |

### 4.5 Salesforce Release Notes (GA / Preview confirmation)

| Source | What It Gives You | Priority |
|--------|-------------------|----------|
| `https://help.salesforce.com/s/articleView?id=release-notes` | Official Salesforce seasonal release notes | HIGH |
| `https://developer.salesforce.com/blogs/` | Developer-facing feature announcements | MEDIUM |
| `https://admin.salesforce.com/blog/` | Admin-facing feature announcements | MEDIUM |

### 4.6 Industry-Accelerator-Specific (drill-down URLs)

| Industry | Source |
|----------|--------|
| Healthcare / Life Sciences | `https://docs.mulesoft.com/healthcare/latest/` + `https://docs.mulesoft.com/life-sciences/latest/` |
| Financial Services | `https://docs.mulesoft.com/financial-services/latest/` |
| Retail | `https://docs.mulesoft.com/retail/latest/` |
| Manufacturing | `https://docs.mulesoft.com/manufacturing/latest/` |
| Consumer Goods | `https://docs.mulesoft.com/consumer-goods/latest/` |
| SAP-heavy customers | `https://anypoint.mulesoft.com/exchange/org.mule.examples/mulesoft-accelerator-for-sap/` (login-walled — typically not indexable) |
| Salesforce Order Management | `https://docs.mulesoft.com/salesforce-oms/latest/` |
| Data Cloud heavy | `https://anypoint.mulesoft.com/exchange/org.mule.examples/mulesoft-accelerator-for-datacloud/` (login-walled) |

### 4.7 Industry Cloud (Salesforce — NEW v1.4.0)

| Source | What It Gives You |
|--------|-------------------|
| `https://resources.docs.salesforce.com/` | Industry Cloud official PDFs (Health Cloud, FS Cloud, Mfg Cloud admin/user/dev guides) |
| `https://developer.salesforce.com/developer-centers/health-cloud` | Health Cloud developer center |
| `https://www.salesforce.com/financial-services/cloud/guide/` | Financial Services Cloud guide |
| `https://developer.salesforce.com/docs/platform/data-models/guide/` | Data models gallery |

---

## 5. RESEARCH DISCIPLINE

**DO:**

- Always capture **source-mode** + URL + research-date — every entry in `research_log.md` has all three
- Prefer Tier 1 indexed `@Docs` first — faster, no rate limits, semantic retrieval
- Cross-confirm GA status across 2+ sources for any HIGHEST-tier capability recommendation
- Use `architect.salesforce.com` (or `@Docs:salesforce-architect`) for reference architecture decisions
- Apply Stale-Index Escape Hatch (§1.4) for 2026 features when indexed doc >30 days old
- Record fallbacks if a URL is blocked / 403 (common on `www.salesforce.com` Cloudflare-protected pages)

**DO NOT:**

- Cite blog posts alone for GA status — cross-confirm with `docs.mulesoft.com` / release notes
- Assume the baked-in catalog is current — Phase 2B refreshes it via the 3-tier protocol
- Skip Phase 2B because "I know this product" — the surface moves faster than memory
- Trust third-party summaries over canonical Salesforce / MuleSoft sources
- Silently substitute Tier 3 catalog when Tier 1/2 fail — STOP and notify the user
- Fabricate region/edition/GA status — mark `⚠️ ASSUMPTION` if unverifiable

---

> 🧞‍♂️ R-GENIE Cloud Success Architect Agent by Cheppali Shaik Sohail
> ✍️ Maintainer: Cheppali Shaik Sohail | v1.0.0 | 2026-05-02
> 🔧 Created by Cheppali Shaik Sohail via R-GENIE Agent Tuner | 2026-05-02
> 🔧 Tuned by Cheppali Shaik Sohail via R-GENIE Agent Tuner | v1.4.0 | 2026-05-06
