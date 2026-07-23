# Examples — BizTalk Documentation Agent

The single canonical output example. Use it to benchmark the **structure, conciseness, and completeness profile** of generated docs (Example-Anchored Conciseness — see `02_Guidance.mdc §7`).

> **⚠️ Match `01_oracle_changepo/` EXACTLY.** It is the canonical full anchor — same headers, section order, table columns, reference blockquotes, and certification box. Only the extracted values change between apps.

| Example | Source app | Role | Demonstrates |
|---------|-----------|------|--------------|
| `01_oracle_changepo/` | `biztalk/Simple/VenOracle/VenOracle._ChangePO` | **Canonical full anchor** | Main doc + **all 7 supporting docs**: locked headers/columns, icon reference blockquotes, `.btm`↔`.xsl` CustomXSLT divergence, verbatim expression blocks, gap register + Tree-of-Thought, ASCII certification box |

**What good output looks like:**
- Every shape and map link documented with source citation (counts verified, N/N).
- `.btm` + `.xsl` both consulted for map logic; CustomXSLT divergence flagged.
- Absent external assemblies (`VenEdi.Schemas`, `Venture.Utilities*`, OAGIS-057 schema) flagged 🔴 GAP — never invented.
- Replication verdicts (🟢/🟡/🔴) per construct, with a gap register naming reason + recommended MuleSoft action.
- Every reference uses the blockquote + icon format (📦 🔀 🗂️ 🔗 🧩 🚧 📋).
- Structure identical to the canonical example — complete, not padded.
