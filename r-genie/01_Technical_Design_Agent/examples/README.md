# 🧞‍♂️ Technical Design Examples V2

**Purpose:** Lean, developer-focused examples demonstrating the new streamlined design format.  
**Author**: Cheppali Shaik Sohail

---

## 🎯 **Key Changes**

> **SINGLE SOURCE**: See `../README.md` for complete changes
> **Key Changes**: Developer-essential content, 3 essential diagrams, field mapping tables (no code), optional supplementary

---

## 📚 **Available Examples**

| # | Example | Use Case | Focus |
|---|---------|----------|-------|
| 1 | [Batch File Integration](01_batch_file_integration_design.md) | SFTP → Salesforce bulk sync | Developer-essential |
| 2 | [Real-Time API](02_real_time_api_design.md) | Customer API with orchestration | Developer-essential |
| 3 | [Event-Driven Integration](03_event_driven_integration_design.md) | CDC-based sync | Developer-essential |
| 4 | [Multi-System Orchestration](04_multi_system_orchestration_design.md) | Order processing | Developer-essential |
| 5 | [Mermaid Diagram Examples](05_mermaid_diagram_examples.md) | 3 essential + 3 optional | Reference |

---

## 📋 **Lean Document Structure (6 Sections)**

Each example strictly follows the template structure from `design-style.yaml`:

```markdown
# Project Name - MuleSoft Technical Design

## 1. Project Overview (brief - 10 lines max)
   - Integration scope
   - Processing approach

## 2. Technical Architecture
   - Architecture pattern selected
   - Processing strategy
   - Connector summary

## 3. Flow Architecture
   - Step-by-step flow design

## 4. Essential Diagrams (3 diagrams)
   - Integration Sequence
   - Error Handling
   - Connector Pattern

## 5. Field Mapping Tables
   - Source-to-target mappings (NO DataWeave code)

## 6. Error Handling Strategy
   - Error categories
   - Retry patterns

---
**Version:** v2 | **Date:** {date} | **Status:** Ready for Implementation
```

**🚨 MAIN DOCUMENT = 6 SECTIONS ONLY**
- ❌ NO Configuration Files section (supplementary only)
- ❌ NO Implementation checklists
- ❌ NO Verbose document information sections
- ❌ NO Project management content

### **Supplementary Content (Phase 5 - On Request)**
```
output_01_design/
├── {project}-technical-design.md  (6 sections - main document)
├── config/                        (optional - generated on request)
│   ├── dev-config.yaml
│   ├── prod-config.yaml
│   └── secure-properties.yaml
└── {project}-supplementary.md     (optional - on request)
```

---

## 🔗 **Related Resources**

- [Rules Library](../rules/INDEX.md) - Complete rule file index
- [Architecture Patterns](../rules/01-02_Architecture_Patterns.mdc) - Pattern details
- [Diagram Reference](../rules/01-03_Diagram_Reference.mdc) - 3 essential + 3 optional diagrams

---

🧞‍♂️ **V2 - Lean Examples for Developer-Focused Designs!** ✨

