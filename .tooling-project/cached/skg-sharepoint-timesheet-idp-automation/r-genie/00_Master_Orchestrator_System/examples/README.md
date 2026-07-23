# 🧞‍♂️ R-GENIE Master Orchestrator - Examples

> **Purpose:** Pipeline workflow examples demonstrating R-GENIE orchestration  
> **Version:** 3.0.0  
> **Author**: Cheppali Shaik Sohail

---

## 📋 **Available Examples**

| Example | Description | Stages |
|---------|-------------|--------|
| [01_complete_pipeline_workflow.md](./01_complete_pipeline_workflow.md) | Full 7-stage pipeline with handoffs | All 7 stages |
| [02_selective_execution_workflow.md](./02_selective_execution_workflow.md) | Selective stage execution | Stages 3-7 |

---

## 🎯 **How to Use These Examples**

### **For Learning**
1. Read through each example to understand the workflow
2. Note the checkpoint interactions and handoff documents
3. Understand skip and stop patterns

### **For Reference**
1. Copy conversation patterns for your own workflows
2. Use as templates for similar projects
3. Reference for best practices

---

## 📊 **Pipeline Overview**

```mermaid
flowchart LR
    subgraph Complete_Pipeline
        S1["Stage 1<br/>Technical Design"]
        S2["Stage 2<br/>API Specification"]
        S3["Stage 3<br/>App Development"]
        S4["Stage 4<br/>DW Review"]
        S5["Stage 5<br/>MUnit Testing"]
        S6["Stage 6<br/>Documentation"]
        S7["Stage 7<br/>Code Review"]
    end

    S1 -->|📄| S2
    S2 -->|📄| S3
    S3 -->|📄| S4
    S4 -->|📄| S5
    S5 -->|📄| S6
    S6 -->|📄| S7

    style S1 fill:#4ECDC4,stroke:#45B7D1,color:#fff
    style S2 fill:#96CEB4,stroke:#85c7a8,color:#fff
    style S3 fill:#45B7D1,stroke:#3498db,color:#fff
    style S4 fill:#F39C12,stroke:#e67e22,color:#fff
    style S5 fill:#2ecc71,stroke:#27ae60,color:#fff
    style S6 fill:#FFEAA7,stroke:#fdcb6e,color:#333
    style S7 fill:#DDA0DD,stroke:#8e44ad,color:#fff
```

---

## 🔗 **Related Resources**

- `../rules/INDEX.md` - Rule navigation guide
- `../rules/00_Master_Orchestrator.mdc` - Main orchestration rules
- `../README.md` - Quick start guide

---

🧞‍♂️ **Learn from Examples, Orchestrate with Confidence!** ✨
