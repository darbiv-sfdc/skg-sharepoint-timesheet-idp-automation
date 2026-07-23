---
description: Document BizTalk applications into a reproducible MuleSoft-migration design
---

# BizTalk Documentation Agent

Forensic, zero-assumption technical design from exported BizTalk applications — built for MuleSoft migration, with an explicit replication-gap report. 6-phase RGV workflow.

## Steps to Activate

**Step 1: Setup** *(Agent: attempt once. If the `.cursorignore` write is blocked, don't retry — ask the user to run it in their terminal and wait. Don't modify other lines.)*
```bash
mkdir -p project/input_biztalk project/output_biztalk && sed -i '' 's|^#/r-genie/|/r-genie/|; s|^/r-genie/BizTalk_Documentation_Agent/.*|#/r-genie/BizTalk_Documentation_Agent/|' .cursorignore
```

**Step 2: Activate Agent**
- Load agent rules: `@r-genie/BizTalk_Documentation_Agent/rules/BizTalk_Documentation.mdc`

**Step 3: Provide Inputs (User Action)**
- Place an exported BizTalk application in `project/input_biztalk/{app}/`
- Or reference a folder directly: `@path/to/biztalk-app-folder`

## Display
```
BIZTALK DOCUMENTATION AGENT V1.0 - ACTIVATED

🧞‍♂️ R-GENIE (AI-CodeMate) by Cheppali Shaik Sohail
✅ Ready | 🔄 Continuous Processing (count-verified micro-checkpoints)
📂 In: project/input_biztalk/ | Out: project/output_biztalk/

📥 HOW TO USE:
  • Folder: Place an exported BizTalk app in the input folder
  • Reference: @path/to/biztalk-app-folder
  • Artifacts: .odx .btm .xsl .xsd .btp .cs .btproj .sln

💡 WHAT IT DOES:
  • Phase 0: Discovery & Inventory — count artifacts, assembly-ref graph
  • Phase 1: Orchestrations — shapes, ports, filters, inline expressions
  • Phase 2: Schemas & Maps — all field links (.btm + .xsl)
  • Phase 3: Pipelines, Ports & Helpers — .btp stages + .cs helper logic
  • Phase 4: Replication Readiness — BizTalk→MuleSoft map + gap report
  • Phase 5: Validation & Certification — file-by-file reconciliation

🎯 OUTPUT:
  • Reproducible design doc + supporting docs
  • Per-orchestration Mermaid flows
  • Replication-gap report (what can't be rebuilt + why)
  • Zero-data-loss certification

⚙️ GENERAL:
  • One agent per chat — start a new chat with /use-XX for each task
  • Keep workspace clean — remove unrelated projects/files to improve focus
  • Optional: use a premium model (e.g., Claude Opus) at end of chat for forensic review

💡 LLM TIP: Use Claude Sonnet (Thinking) for standard tasks; Claude Opus (Thinking) for complex/premium tasks.
⚠️ DISCLAIMER: AI-generated output. Review and validate all content before use.

🚀 Provide a BizTalk application folder to begin documentation.
```

## Key Features

| Feature | Description |
|---------|-------------|
| **Zero Assumption** | Documents only what the source contains |
| **Replication-Gap Report** | Names exactly what cannot be rebuilt in MuleSoft + why |
| **RGV Enforced** | Count-verified shapes / map links / fields per section |
| **.btm + .xsl** | True map logic from both functoid graph and compiled transform |
| **UTF-16 Aware** | Correctly decodes BizTalk's UTF-16 artifacts |
| **Stateful / Resumable** | `.biztalk-state.json` supports resume across phases |

## Supported Artifacts

- Orchestrations (.odx)
- Maps (.btm + .xsl)
- Schemas (.xsd)
- Pipelines (.btp)
- Helpers (.cs)
- Projects / Solutions (.btproj / .sln)

## Output Structure

```
project/output_biztalk/{app_name}/
├── biztalk_design_{app_name}.md
├── supporting-docs/
│   ├── artifact-inventory.md
│   ├── orchestration-flows.md
│   ├── schema-structures.md
│   ├── map-mappings.md
│   ├── pipeline-helper-reference.md
│   ├── replication-gap-report.md
│   └── verification-checklist.md
└── .biztalk-state.json
```
