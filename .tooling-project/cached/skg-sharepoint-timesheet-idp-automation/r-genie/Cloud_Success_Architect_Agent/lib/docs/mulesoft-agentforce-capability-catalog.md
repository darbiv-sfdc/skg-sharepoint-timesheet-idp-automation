# MuleSoft + Agentforce Capability Catalog (Extended Reference)

> **Version:** 1.2.0 | **Catalog Date:** 2026-05-06 | **Author:** Cheppali Shaik Sohail
> **Purpose:** Extended capability reference for the Cloud Success Architect Agent. Quick-reference tables live in `rules/01_Guidance.mdc` Section 2; this file holds the depth.
> **Disclaimer:** Capability availability evolves rapidly. **This catalog is a baseline only — Phase 2B 3-Tier Research Protocol refreshes it against indexed `@Docs` (primary) → live web (fallback) → catalog (last-resort) before every customer engagement.** Validate against current product documentation before customer commitments. Preview / beta features are flagged.
> **Canonical sources:** `lib/docs/research-sources-and-protocol.md` §2 (Routing Table) + §4 (Live URL Reference); summary in `rules/01_Guidance.mdc` §12

---

## 0. What Changed in 2025–2026 (At-a-Glance)

> Use this section to orient quickly. Confirm every item via Phase 2 Live Research.

**Agentforce 360 launched** — the Agentforce umbrella now includes:
- **Agentforce Builder** — new conversational authoring workspace ("vibe-building", doc/canvas/script views, one-click simulations, portable JSON)
- **Agent Script** — new scripting language for deterministic agent control
- **Agentforce Voice** — native voice across phone / web / mobile
- **Intelligent Context** — grounds agents in unstructured business data (low-code doc pipelines)
- **Multi-Agent Orchestration + Subagents + Superagents** — agent team collaboration, single-entry-point superagents that route to specialists
- **Agentforce Observability** — near-real-time monitoring, analysis, optimization
- **Agentforce Testing Center** — agent testing and reliability tooling
- **AgentExchange** — 30+ partner integrations (AWS, Box, Cisco, Google Cloud, IBM, Notion, PayPal, Stripe, Teradata, WRITER, etc.)
- **A2A (Agent-to-Agent) + MCP (Model Context Protocol)** — coming / early support for cross-vendor agent orchestration

**Data 360** — branding evolution of Data Cloud; watch for dual naming in customer conversations.

**MuleSoft Q1 2026 highlights:**
- **MuleSoft for Flow: Integration Winter 2026** release — deeper Salesforce-native integration for business users
- **MuleSoft AI Chain** — Inference + Vector connectors (GA); bring LLMs into Mule flows with vector stores (Pinecone, Milvus, Einstein, others)
- **MuleSoft for Agentforce: Topic Center** — centralized registry of topics, actions, instructions for Agentforce agents (designed in Anypoint Code Builder, synced to Salesforce API Catalog)
- **Managed Flex Gateway** (GA) — MuleSoft-managed variant of Flex Gateway; one-click upgrades, no runtime ops
- **Anypoint Code Builder February 2026 release** — A2A Connector (beta), AI-create integrations
- **Agent Fabric** (GA Q1 2026) — Centralized orchestration across Agentforce + Bedrock + Vertex AI + Copilot Studio agents; cross-ecosystem governance via Flex Gateway. Components: Agent Registry, Agent Visualizer, LLM Gateway. CA Cloud + JP Cloud expansion Apr 2026.
- **Agent Visualizer** (GA Feb 9, 2026) — Visual graph of agent network with MCP server insights, governance gap detection (which agents are NOT behind Flex Gateway)
- **LLM Gateway** (GA Q1 2026) — LLM-aware proxy on Flex Gateway; A2A/MCP/LLM Flex policies for multi-LLM-provider governance
- **Trusted Agent Identity** (⚠️ Preview / Regional — Canada Cloud + Japan Cloud only as of Apr 29, 2026) — Role-based agent response policies

**Salesforce platform highlights (substrate + marketplace):**
- **Hyperforce** — Underlying cloud-native substrate for Agentforce 360, Data 360, all Salesforce clouds; 17+ regions including Canada Cloud, Japan Cloud, EU Cloud, Australia Cloud, India Cloud, US, Govt Cloud Plus. Quarterly region-add cadence.
- **AgentExchange** (GA 2026) — Partner-curated, security-vetted AI agent marketplace; 30+ launch partners (AWS, Box, Cisco, Google Cloud, IBM, Notion, PayPal, Stripe, Teradata, WRITER, etc.)

**MuleSoft Accelerators — current official list (confirm via `docs.mulesoft.com/accelerators-home/`):**
1. Consumer Goods — trade promotion + retail execution
2. Data Cloud — unlock + connect core systems of record for Data Cloud
3. Financial Services — banking, wealth, insurance customer 360
4. Healthcare — Payer / Provider foundations (HL7 FHIR, eligibility, claims)
5. Life Sciences — pharma / med-tech / CRO digital operations *(new)*
6. Manufacturing — discrete + process manufacturing foundations *(new)*
7. Retail — ERP / CRM / MDM / commerce / marketing activation
8. Salesforce OMS — Salesforce Order Management extensions
9. SAP — SAP ERP data exposure accelerator

> **Note:** Earlier draft versions of this catalog listed "Utilities" and "Salesforce Industries" as accelerators. These names do NOT appear on the current official MuleSoft Accelerators page as of 2026-04-23. Confirm industry-specific accelerator availability via Phase 2 research before recommending.

---

## 1. MuleSoft Anypoint Platform

### 1.1 Runtimes

#### Anypoint Runtime Fabric (RTF)
- **What**: Customer-hosted Kubernetes-native runtime
- **When**: Customer needs to run Mule workloads inside their own VPC / data center, multi-region DR, hybrid on-prem + cloud
- **Customer signals**: "data residency", "private cloud", "we can't put integration on vendor-managed infrastructure"

#### CloudHub 2.0
- **What**: Fully managed, Kubernetes-native cloud runtime (iPaaS)
- **When**: Customer wants minimal ops overhead, fast provisioning, elastic scaling
- **Customer signals**: "lean integration team", "don't want to manage infra", "need to deploy APIs this quarter"
- **Tradeoff**: Less control vs. RTF, but far faster time-to-deploy

### 1.2 API Management

#### API Manager
- **What**: API governance — policies, contracts, SLA tiers, client applications, analytics
- **When**: Customer has APIs in production and needs governance
- **Key policies**: OAuth 2.0 + Salesforce / PingFederate / Okta / generic OIDC, rate limiting, IP allowlist, JSON/XML threat protection, custom policies via XML + Groovy or Java

#### Flex Gateway
- **What**: Ultra-lightweight, any-cloud, any-runtime API gateway (based on Envoy)
- **When**: Edge deployments, non-Mule APIs needing governance, partner-facing APIs in DMZ, Kubernetes sidecar patterns
- **Customer signals**: "heterogeneous API landscape", "non-Mule APIs need policies too", "partner exposure", "service mesh"

### 1.3 Reuse & Catalog

#### Anypoint Exchange
- **What**: Central catalog of APIs, connectors, templates, examples, custom assets
- **When**: Multi-team API programs, federated delivery, partner contributions
- **Value**: Discoverability + reuse measurement

#### API Experience Hub
- **What**: Salesforce Experience Cloud-based branded developer portal
- **When**: Customer building an API monetization / partner ecosystem play
- **Customer signals**: "API as a product", "partner onboarding", "developer experience matters"

### 1.4 Messaging & Data

#### Anypoint MQ
- **What**: Managed messaging (queues, FIFO queues, message exchanges)
- **When**: Event-driven patterns, system decoupling, async workflows, guaranteed delivery
- **Customer signals**: "retry semantics", "decouple systems", "process spikes asynchronously"

#### DataGraph
- **What**: Unified GraphQL layer that federates multiple REST APIs into a single graph
- **When**: Front-end teams need single query surface, reduce over-/under-fetching
- **Maturity note**: Not a universal fit — best for customers with multiple fragmented APIs that share a domain model

### 1.5 Developer Experience

#### Anypoint Code Builder (ACB)
- **What**: Cloud-native IDE with AI-assisted flow design (successor to Anypoint Studio for many workflows)
- **When**: Modernizing developer experience, onboarding new integration developers
- **Value**: Browser-native, consistent across devices, AI-assisted authoring

#### Anypoint Studio (Classic)
- **What**: Desktop Eclipse-based IDE
- **When**: Existing teams, specific feature needs not yet in ACB
- **Note**: Long-term direction is ACB; plan migration

### 1.6 Connectors
- **What**: 1000+ pre-built integrations (Salesforce, SAP, Workday, ServiceNow, Oracle, Microsoft, AWS/Azure/GCP, databases, message brokers, etc.)
- **When**: Always — prefer connectors over custom HTTP calls
- **Strategy**: Customer's existing SaaS inventory → connector coverage assessment in Phase 2

### 1.7 LLM Gateway
- **What**: LLM-aware proxy built on Flex Gateway; enforces A2A, MCP, and LLM Flex policies (rate limits, caching, audit, prompt logging, egress control)
- **When**: Multi-LLM-provider customers (OpenAI + Azure + Anthropic + Einstein) needing single governance plane; cost-control / abuse-prevention layer in front of LLM endpoints
- **Customer signals**: "shadow LLM usage", "uncontrolled OpenAI spend", "consistent prompt logging across LLM providers", "LLM egress policy"
- **GA Status**: Q1 2026 GA; A2A/MCP/LLM Flex policies live in Canada Cloud + Japan Cloud as of Apr 29, 2026
- **Positioning**: Sits IN FRONT OF LLM provider endpoints; pairs with Agent Fabric for full agent governance

---

## 2. MuleSoft AI & Agentic Layer

### 2.1 MuleSoft AI Chain
- **What**: Bring LLMs into Mule flows — connectors to OpenAI, Azure OpenAI, Anthropic, Einstein GPT, plus primitives for RAG, prompt orchestration, vector stores
- **When**:
  - Classify/summarize/route incoming messages inside an integration flow
  - Enrich data with LLM output before persistence
  - RAG at ingest time (vectorize + store)
- **Vector store integrations**: Pinecone, Milvus, Einstein, others
- **Positioning vs Agentforce**: AI Chain runs *inside flows*, Agentforce runs *conversational agents*. They complement each other.

### 2.2 Topic Center
- **What**: Centralized registry of topics, actions, metadata for Agentforce agents
- **When**: Customer is building multiple Agentforce agents that need to share / govern actions
- **Value**: Single pane of glass for action governance, versioning, reuse across agents

### 2.3 Intelligent Document Processing (IDP)
- **What**: AI-powered document parsing — classify document types, extract fields, route downstream
- **When**:
  - Invoice / claims / application form processing
  - Mixed structured + unstructured document intake
- **Strength**: Handles the last-mile messy document problem that pure LLMs struggle with at scale

### 2.4 MuleSoft for Agentforce (Agentforce Actions)
- **What**: Zero-to-low-code wrapping of any existing API as an Agentforce action
- **When**: Customer has legacy systems the agent needs to read/write against
- **Pattern**: Legacy API → MuleSoft wrapper (security, payload normalization) → Agentforce Action

### 2.5 Agent Fabric
- **What**: Centralized orchestration platform across AI agents, MCP servers, and LLM instances; cross-ecosystem governance umbrella. Components: Agent Registry (asset discovery), Agent Visualizer (topology), LLM Gateway (proxy)
- **When**: Customer has multiple agent platforms (Agentforce + Bedrock + Vertex AI + Copilot Studio) needing unified governance, OR plans MCP-based agent collaboration
- **Customer signals**: "agent sprawl", "no single view of agents in production", "MCP / A2A interop required", "govern multiple LLM providers"
- **GA Status**: Q1 2026 GA; CA Cloud + JP Cloud expansion Apr 29, 2026
- **Positioning**: Governance umbrella; sits ABOVE Agentforce 360 + non-Salesforce agent platforms

### 2.6 Agent Visualizer
- **What**: Visual graph of agent network — agents, brokers, MCP servers, Agentforce agents as nodes; relationships as edges; data flow layers for prod / sandbox; highlights governance gaps (which agents NOT behind Flex Gateway)
- **When**: Customer needs visibility into agent topology, MCP server throughput, business-group filtering, or governance posture audits
- **Customer signals**: "we don't know what agents we have", "compliance asking which agents touch PII", "MCP server inventory"
- **GA Status**: GA Feb 9, 2026 (advanced search by display name / asset type / platform; granular network filtering by business groups + environments)

### 2.7 Trusted Agent Identity
- **What**: Role-based agent response policies — agent responds differently based on caller identity / role; integrates with API Manager identity providers
- **When**: Multi-tenant agents, persona-aware responses, regulated industries with role-based data access (HIPAA minimum-necessary, FINRA suitability)
- **Customer signals**: "different agent answer for advisor vs. client", "enforce role-based responses", "agent policy by user attribute"
- **GA Status**: ⚠️ **PREVIEW / REGIONAL** — Canada Cloud + Japan Cloud only as of Apr 29, 2026; broader regional rollout in progress; verify per release notes

---

## 3. Salesforce Industries Accelerators

### 3.1 Accelerator for Healthcare & Life Sciences
- **Clinical**: HL7 FHIR APIs (Patient, Encounter, Condition, Observation, MedicationRequest), CDA exchange
- **Admin**: Eligibility (270/271), claims (837/835), prior auth, provider directory
- **Life Sciences**: Clinical trial systems integration, Veeva connectors, regulatory submission flows
- **When**: Payer, provider, med-tech, pharma customers

### 3.2 Accelerator for Financial Services
- **Banking**: Account aggregation, payments (ACH, wire, cards), onboarding, KYC
- **Wealth**: Portfolio data, custodian integration, advisor workflows
- **Insurance**: Quote-to-bind, claims FNOL, billing

### 3.3 Accelerator for Retail
- **Order management**: Cross-channel OMS patterns, inventory visibility
- **Commerce**: Salesforce B2C/B2B Commerce Cloud patterns
- **Loyalty**: Points accrual/burn, tier management

### 3.4 Accelerator for Utilities
- **Meter-to-cash**: CIS integration, reading → billing → payment
- **Outage**: OMS integration, customer notification
- **Customer service**: Service Cloud + CIS unified

### 3.5 Accelerator for Salesforce Industries (Cross-Vertical)
- **Pattern**: Industry-specific data models + pre-built APIs + OmniStudio integration
- **When**: Customer using Salesforce Industries clouds (Comms, Energy, Media, etc.)

### 3.6 Utilization Strategy
- **60 / 20 / 20 Rule** (typical): 60% reuse accelerator as-is, 20% customize, 20% build customer-specific
- **Always document the ratio** in the Supporting Doc accelerator matrix

---

## 4. Agentforce Platform

### 4.1 Agent Builder
- **What**: Declarative agent authoring — topics, actions, instructions, guardrails, test harness
- **Key concepts**:
  - **Agent** — the top-level persona with overall instructions
  - **Topic** — a scope the agent can handle (e.g., "Order Status Inquiry")
  - **Action** — what the agent can do (Apex, Flow, Prompt, MuleSoft, external)
  - **Guardrails** — instruction-level + policy-level constraints

### 4.2 Atlas Reasoning Engine
- **What**: Agentforce's reasoning layer — plans multi-step tasks, selects appropriate actions, handles tool use
- **When**: Tasks requiring planning / sequencing, not just single-shot retrieval

### 4.3 Actions
- **Apex Actions**: Invocable Apex methods
- **Flow Actions**: Invocable Flows
- **Prompt Actions**: Prompt Builder templates
- **MuleSoft Actions**: Any MuleSoft API wrapped via `MuleSoft for Agentforce`
- **External Actions**: REST APIs via OpenAPI/Swagger + authentication

### 4.4 Topics
- **What**: Grouping of actions + scope + instructions
- **Why**: Prevents agent drift — topic boundaries keep behavior predictable
- **Governance**: Topic owners, versioning, A/B testing

### 4.5 Prompt Builder
- **What**: Reusable prompt templates with merge fields bound to CRM / Data Cloud data
- **When**: Templated content generation (emails, summaries, responses) grounded in real data
- **Value**: Version control, testing harness, data grounding

### 4.6 Einstein Trust Layer
- **Capabilities**:
  - **Secure Data Retrieval** — only grounding on entitled data
  - **Dynamic Grounding** — context-aware retrieval
  - **Data Masking** — PII/PHI masking before LLM call
  - **Toxicity Detection** — response filtering
  - **Zero Retention** — LLM provider doesn't retain prompts/responses
  - **Audit Trail** — every prompt/response logged
- **When**: Always recommend for regulated industries and customer-facing agents

### 4.7 Data Cloud
- **What**: Real-time customer data platform — ingestion, identity resolution, calculated insights, segmentation, activation, vector retrieval
- **Key for agents**: Data Cloud is the **grounding fabric** — agents ground responses on unified customer data
- **Customer signals for Data Cloud recommendation**: "hallucinations blocked our pilot", "agent doesn't know our customer", "fragmented customer data"

### 4.8 Pre-Built Agentforce Agents
- **Agentforce for Service** — service agent (case deflection, resolution)
- **Agentforce for Sales** — SDR/AE augmentation, pipeline coaching
- **Agentforce for Commerce** — shopper assistance, merchandising
- **Agentforce for Marketing** — campaign ideation, content generation
- **When**: Faster ROI than custom-built agents; customize where needed

### 4.9 Hyperforce (Platform Substrate)
- **What**: Salesforce's cloud-native architecture / data center fabric — runtime substrate for Agentforce 360, Data 360, and all Salesforce clouds. Provides regional sovereign deployments (Canada Cloud, Japan Cloud, EU Cloud, Australia Cloud, India Cloud, US, Govt Cloud Plus, plus expanding regions)
- **When**: **Mandatory consideration for any customer with data residency, sovereign cloud, or FedRAMP requirements** — Phase 4A Feasibility "Residency" dimension references Hyperforce regional GA
- **Customer signals**: "data must stay in-region", "FedRAMP High", "GDPR strict residency", "sovereign cloud mandate", "Schrems II concerns"
- **GA Status**: GA in 17+ regions as of 2026; quarterly region-add cadence. Confirm specific region GA via `@Docs:salesforce-hyperforce` for the customer's required geography
- **Phase 7 hook**: §4.5 NFR Compliance Matrix "Data Residency" row MUST reference Hyperforce region for the customer's data domicile

### 4.10 AgentExchange (Partner Agent Marketplace)
- **What**: Salesforce's partner-curated, security-vetted AI agent marketplace; pre-built Agentforce solutions discoverable, deployable, and (for partners) monetizable
- **When**: Customer needs faster time-to-value via pre-built domain agents (HR, IT support, finance ops, industry-specific); reduce custom build for commodity agent use cases
- **Customer signals**: "don't want to build from scratch", "need an HR agent in 30 days", "specific industry agent (e.g., insurance claims triage)"
- **30+ launch partners**: AWS, Box, Cisco, Google Cloud, IBM, Notion, PayPal, Stripe, Teradata, WRITER, etc.
- **GA Status**: GA 2026; partner catalog growing — verify partner-specific certification via marketplace listing

---

## 5. Adjacent Automation

### 5.1 MuleSoft Composer
- **What**: Low-code, admin-friendly integration (Salesforce-native)
- **When**: Business user–owned integrations, simple connector chains
- **Boundary**: For production-grade enterprise integration → use Anypoint, not Composer

### 5.2 MuleSoft RPA
- **What**: Bot-driven automation across UIs and systems without APIs
- **When**: Legacy systems with no API surface, short-term automation before API modernization
- **Strategy**: Treat RPA as a bridge — plan API replacement downstream

---

## 6. Reference Architectures (Composed Patterns)

### 6.1 "Agentforce on Hardened API-Led"
```
User → Agentforce (Agent Builder + Atlas)
     → Topic Center (action catalog)
     → MuleSoft (API Manager + Flex Gateway + Runtime Fabric)
     → Systems (Salesforce + ERP + SaaS + Legacy)
     ↑ grounded by Data Cloud
     ↑ governed by Einstein Trust Layer
```

### 6.2 "Agent-First with AI Chain"
```
User → Agentforce
     → Actions call MuleSoft AI Chain flows directly
     → AI Chain orchestrates LLM + vector store + legacy API calls
     ↑ Einstein Trust Layer
```

### 6.3 "Event-Driven + Data Cloud Grounding"
```
Systems → events → Anypoint MQ → MuleSoft flows → Data Cloud
                                                → Agentforce (grounds on Data Cloud)
User → Agentforce → Actions (via MuleSoft)
```

---

## 7. Preview / Beta Watch List

_(Mark any recommendation using these with `⚠️ PREVIEW` + date assumption)_

- Emerging MuleSoft AI Chain connectors (new LLM providers come online frequently)
- Agentforce Atlas advanced reasoning features
- Data Cloud vector retrieval performance tuning knobs
- Topic Center cross-org federation (if in preview at recommendation time)
- Agent Observability / tracing features

_(Validate all "preview" flags against current Salesforce / MuleSoft release notes at the time of customer delivery.)_

---

## 8. Anti-Recommendations (What NOT to Propose)

| Anti-Pattern | Why |
|--------------|-----|
| RPA as long-term strategy | Should be a bridge to API modernization |
| Custom-built agent when Agentforce for Service/Sales/Commerce fits | Slower, more expensive, harder to maintain |
| MuleSoft Composer for enterprise mission-critical integration | Wrong tool class |
| LLM direct from Agent Builder without Trust Layer | Security / compliance risk |
| Bypassing API Manager for "speed" | Technical debt, governance debt |
| Recommending specific commercial terms / pricing / SKUs | Out of scope — defer to account team |

---

## 9. NFR Profile per Capability

> **Purpose:** Reference table for **Phase 4A Feasibility Validation** and **Supporting Doc §4.5 NFR Compliance Matrix**. Captures the enterprise non-functional posture of each major capability so the agent can answer: "is this capability viable for an enterprise customer with these compliance / residency / HA requirements?"
>
> **Refresh:** Validate against `docs.mulesoft.com` and `help.salesforce.com` release notes during Phase 2 Live Research. Status changes frequently — treat this as a baseline, not source of truth.
>
> **Legend:** ✅ supported / ⚠️ partial or with caveats / ❌ not supported / ❓ verify per release

### 9.1 MuleSoft Anypoint Platform

| Capability | Multi-Region | HA Pattern | Encryption-at-Rest | FedRAMP / Govt Cloud | Data Residency Options | Edition Floor | Notes |
|------------|--------------|-----------|--------------------|-----------------------|-----------------------|---------------|-------|
| Anypoint Runtime Fabric | ✅ | Active-Active (Kubernetes-native) | ✅ | ✅ (Anypoint Government Cloud) | US / EU / APAC; customer-deployed | Titanium | Self-managed K8s; broadest residency |
| CloudHub 2.0 | ✅ | Active-Passive default; Active-Active optional | ✅ | ⚠️ Partial (verify per region) | US / EU / APAC | Gold | Managed; faster onboarding |
| CloudHub 1.0 | ✅ | Active-Passive | ✅ | ⚠️ | US / EU / APAC | Gold | Sunset trajectory — recommend 2.0 for new |
| Anypoint Flex Gateway (Managed) | ✅ | Customer-controlled HA | ✅ | ✅ | Customer-deployed (any geo) | Platinum | Edge / DMZ / partner exposure |
| API Manager | ✅ | Multi-region control plane | ✅ | ⚠️ | US / EU / APAC | Gold | Policies enforced runtime-side |
| Anypoint MQ | ✅ | Active-Passive replication; FIFO single-region | ✅ | ⚠️ | US / EU / APAC | Platinum | FIFO is single-region |
| Anypoint Exchange | ✅ | Multi-region | ✅ | ⚠️ | US / EU | Gold | Asset catalog |
| DataGraph | ⚠️ Region-pinned | Active-Passive | ✅ | ❓ | US / EU | Titanium | Verify regional GA |
| Anypoint Code Builder | N/A (dev-time) | N/A | ✅ (project storage) | ❓ | US / EU | Gold | Developer IDE |
| Anypoint Visualizer | ✅ | Multi-region | ✅ | ⚠️ | US / EU | Titanium | Topology insight |
| Anypoint Monitoring | ✅ | Multi-region | ✅ | ⚠️ | US / EU | Titanium | Metrics + alerting |
| LLM Gateway (on Flex Gateway) | ✅ | Customer-controlled HA (inherits Flex Gateway) | ✅ | ❓ Verify per region | Customer-deployed | Platinum (Flex Gateway) | A2A/MCP/LLM Flex policies; Q1 2026 GA |

### 9.2 MuleSoft AI & Agentic

| Capability | Multi-Region | HA Pattern | Encryption-at-Rest | FedRAMP / Govt Cloud | Data Residency | Edition Floor | Notes |
|------------|--------------|-----------|--------------------|-----------------------|----------------|---------------|-------|
| MuleSoft AI Chain (Inference Connector) | ✅ via underlying LLM provider | Provider-dependent | ✅ | ⚠️ Provider-dependent | Provider-dependent | Anypoint Titanium recommended | LLM provider terms apply |
| MuleSoft AI Chain (Vector Connector) | ✅ via underlying vector store | Store-dependent | ✅ | ⚠️ | Store-dependent | Titanium | Pinecone / OpenSearch / etc. |
| Topic Center | ⚠️ Verify regional GA | Multi-region (where GA) | ✅ | ❓ | US / EU (GA) | Anypoint + Agentforce SKU | New product — verify regional rollout |
| Intelligent Document Processing (IDP) | ✅ | Multi-region | ✅ | ⚠️ | US / EU / APAC | Titanium | OCR + classification |
| MuleSoft for Agentforce (Actions) | ✅ via MuleSoft + Agentforce | Inherits both | ✅ | ⚠️ | Inherits both | Both platforms | Wrapper pattern |
| Agent Fabric | ⚠️ Regional GA expanding | Multi-region (control plane) | ✅ | ❓ | US / EU GA; CA / JP Apr 2026 | Anypoint + Agentforce | Governance umbrella |
| Agent Visualizer | ✅ | Multi-region | ✅ | ❓ | US / EU | Anypoint Titanium recommended | Topology insight |
| Trusted Agent Identity | ⚠️ **PREVIEW / REGIONAL** | Inherits API Manager | ✅ | ❓ | CA / JP only as of Apr 2026 | Anypoint + Agentforce | Verify regional rollout |

### 9.3 Agentforce Platform

| Capability | Multi-Region | HA Pattern | Encryption-at-Rest | FedRAMP / Govt Cloud | Data Residency | Edition Floor | Notes |
|------------|--------------|-----------|--------------------|-----------------------|----------------|---------------|-------|
| Agentforce Builder | ✅ | Salesforce platform HA | ✅ | ⚠️ Govt Cloud roadmap | US / EU / APAC / Govt (per region GA) | Agentforce SKU + applicable Cloud edition | Conversational IDE |
| Atlas Reasoning Engine | ✅ | Inherits platform HA | ✅ | ⚠️ | US / EU; expanding | Agentforce SKU | Multi-step planning |
| Agentforce for Service / Sales / Commerce | ✅ | Inherits platform HA | ✅ | ⚠️ | US / EU / APAC | Service / Sales / Commerce Cloud + Agentforce SKU | Pre-built |
| Agentforce Voice | ⚠️ Regional GA expanding | Inherits platform | ✅ | ❓ | US (initial) | Service Cloud Voice + Agentforce SKU | Verify regional GA |
| Multi-Agent Orchestration / Superagents | ⚠️ Preview / GA per region | Inherits platform | ✅ | ❓ | US (initial) | Agentforce SKU + applicable Cloud edition | Verify GA per release |
| Agentforce Observability | ✅ | Inherits platform | ✅ | ⚠️ | US / EU | Agentforce SKU | Traces + metrics |
| Agentforce Testing Center | ✅ | Inherits platform | ✅ | ⚠️ | US / EU | Agentforce SKU | Regression suite |
| Topics + Actions | ✅ | Inherits platform | ✅ | ⚠️ | US / EU / APAC | Agentforce SKU | Governance scope |
| Prompt Builder | ✅ | Inherits platform | ✅ | ⚠️ | US / EU / APAC | Agentforce SKU | Template binding |
| Einstein Trust Layer | ✅ | Inherits platform | ✅ (zero-retention option) | ⚠️ Govt Cloud per region | US / EU / APAC | Salesforce platform | PII masking, audit, toxicity |
| Hyperforce (substrate) | ✅ 17+ regions | Active-Active per region | ✅ | ✅ Govt Cloud Plus | US / EU / APAC / CA / JP / AU / IN / Govt | Salesforce platform | Underlies all Agentforce 360 + Data 360 |
| AgentExchange | ✅ | Salesforce platform HA | ✅ | ⚠️ Per-partner certification | US / EU / APAC | Agentforce SKU | Partner-vetted; per-listing varies |

### 9.4 Data 360 / Data Cloud

| Capability | Multi-Region | HA Pattern | Encryption-at-Rest | FedRAMP / Govt Cloud | Data Residency | Edition Floor | Notes |
|------------|--------------|-----------|--------------------|-----------------------|----------------|---------------|-------|
| Data Cloud Core | ✅ | Salesforce platform HA | ✅ | ⚠️ Govt Cloud roadmap | US / EU / APAC | Data Cloud SKU | Identity res + insights |
| Data Cloud Calculated Insights | ✅ | Inherits platform | ✅ | ⚠️ | US / EU / APAC | Data Cloud SKU | Pre-aggregated metrics |
| Data Cloud Vector Retrieval | ⚠️ Regional GA expanding | Inherits platform | ✅ | ❓ | US (initial), EU expanding | Data Cloud SKU | RAG grounding |
| Data Cloud Activations | ✅ | Inherits platform | ✅ | ⚠️ | US / EU / APAC | Data Cloud SKU | Activation to channels |

### 9.5 Cross-Cutting Notes

| Topic | Guidance |
|-------|----------|
| **Active-Active Upgrade** | When customer requires active-active multi-region (typical for Tier-0 services), confirm capability pattern in 9.1–9.4 explicitly supports it. CloudHub 2.0 active-active is opt-in; Anypoint MQ FIFO is single-region |
| **FedRAMP Customers** | Anypoint Government Cloud + Salesforce Government Cloud Plus required; verify each capability's Govt Cloud GA status separately — preview/beta features generally NOT available in Govt Cloud |
| **EU Data Residency** | Salesforce EU operating zone + Anypoint EU CloudHub region; verify Data Cloud + Agentforce EU GA per release |
| **Edition Floor** | Listed minimums — recommendations should not assume capability availability without confirming customer's licensed edition |
| **Preview / Beta** | Any capability flagged ⚠️ in "FedRAMP" or "Multi-Region" likely has a Preview / Beta status — cross-reference with §7 Preview / Beta Watch List |

---

> 🧞‍♂️ R-GENIE Cloud Success Architect Agent by Cheppali Shaik Sohail
> ✍️ Maintainer: Cheppali Shaik Sohail | v1.2.0 | 2026-05-02
> 🔧 NFR Profile per Capability section added by Cheppali Shaik Sohail via R-GENIE Agent Tuner | 2026-05-02
> 🔧 2026 capabilities (Agent Fabric / Agent Visualizer / LLM Gateway / Trusted Agent Identity / Hyperforce / AgentExchange) added by Cheppali Shaik Sohail via R-GENIE Agent Tuner | v1.4.0 | 2026-05-06
