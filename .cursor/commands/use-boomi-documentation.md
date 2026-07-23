---
description: Document Boomi processes from XML exports with zero data loss
---

# Boomi Documentation Agent (08)

Comprehensive Boomi process documentation with 5-phase workflow.

## Steps to Activate

**Step 1: Setup** *(Agent: attempt once. If the `.cursorignore` write is blocked, don't retry — ask the user to run it in their terminal and wait. Don't modify other lines.)*
```bash
mkdir -p project/input_08_boomi project/output_08_boomi && sed -i '' 's|^#/r-genie/|/r-genie/|; s|^/r-genie/08_Boomi_Documentation_Agent/.*|#/r-genie/08_Boomi_Documentation_Agent/|' .cursorignore
```

**Step 2: Activate Agent**
- Load agent rules: `@r-genie/08_Boomi_Documentation_Agent/rules/08_Boomi_Documentation.mdc`

**Step 3: Provide Inputs (User Action)**
- Place Boomi process XML export files in `project/input_08_boomi/`
- Or reference a folder directly: `@path/to/boomi-export-folder`

## Display
```
BOOMI DOCUMENTATION AGENT V1.0 (08) - ACTIVATED

✅ Ready | 🔄 Continuous Processing (No User Stops)
📂 In: project/input_08_boomi/ | Out: project/output_08_boomi/

📥 HOW TO USE:
  • Folder: Place Boomi XML exports in input folder
  • Reference: @path/to/boomi-export-folder
  • Files: Component XMLs from Boomi export

💡 WHAT IT DOES:
  • Phase 0: Component Discovery - Inventory all XMLs
  • Phase 1: Process Flow - Extract shapes, branches, paths
  • Phase 2: Profiles/Connectors - Document all configurations
  • Phase 3: Mappings - Field-by-field transformation tables
  • Phase 4: Assembly - Complete document + diagrams + gaps

🎯 OUTPUT:
  • Complete design document with ALL process details
  • Mermaid diagrams (flow, sequence, error handling)
  • Gap analysis for missing/incomplete elements

⚙️ GENERAL:
  • One agent per chat — start a new chat with /use-XX for each task
  • Keep workspace clean — remove unrelated projects/files to improve focus
  • Optional: use a premium model (e.g., Claude Opus) at end of chat for forensic review

💡 LLM TIP: Use Claude Sonnet (Thinking) for standard tasks; Claude Opus (Thinking) for complex/premium tasks.
⚠️ DISCLAIMER: AI-generated output. Review and validate all content before use.

🚀 Provide Boomi export folder to begin documentation.
```

## Key Features

| Feature | Description |
|---------|-------------|
| **Zero Data Loss** | Captures every field, mapping, configuration |
| **Self-Review** | Validates each phase before proceeding |
| **Gap Detection** | Highlights missing or incomplete elements |
| **No User Stops** | Continuous autonomous processing |
| **Comprehensive Output** | Complete design document with diagrams |

## Supported Component Types

- Process (main and sub-processes)
- XML Profiles
- JSON Profiles
- Flat File Profiles
- Maps (field mappings)
- Connectors and Operations

## Output Structure

```
project/output_08_boomi/
└── {process-name}-design-document.md
    ├── Process Overview
    ├── Component Inventory
    ├── Process Flow Architecture
    ├── Connector Configurations
    ├── Profile Definitions
    ├── Field Mapping Tables
    ├── Error Handling Strategy
    ├── Sub-Process References
    ├── Diagrams (4 types)
    └── Gap Analysis
```
