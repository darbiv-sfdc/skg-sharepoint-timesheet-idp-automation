# 🧞‍♂️ R-GENIE App Development Agent - Rules Index

> **Version:** v2.1 (Lean 4-File Architecture)  
> **Purpose:** Navigation guide for App Development Agent  
> **Last Updated:** April 2026  
> **Author**: Cheppali Shaik Sohail

---

## 📋 **4-File Architecture** (Consistent with R-GENIE Agents)

| # | File | Purpose | Priority |
|---|------|---------|----------|
| 1 | `03_App_Development.mdc` | **MAIN ENTRY POINT** - Identity, workflow overview | HIGHEST |
| 2 | `03-00_Phase_Orchestration.mdc` | Phase workflow, checkpoints, state management | HIGH |
| 3 | `03-01_Guidance.mdc` | Patterns, components, errors, quick reference | HIGH |
| 4 | `03-02_Mandatory_Stop_Points.mdc` | Interactive enforcement, stop points | HIGHEST |

---

## 🎯 **Quick Reference**

| Need | Reference |
|------|-----------|
| Start app development | `@03_App_Development.mdc` |
| Phase workflow details | `@03-00_Phase_Orchestration.mdc` |
| Patterns, components & errors | `@03-01_Guidance.mdc` |
| Stop point enforcement | `@03-02_Mandatory_Stop_Points.mdc` |

---

## 📚 **Detailed Documentation** (lib/docs/)

For comprehensive reference beyond the essentials in Guidance:

| Document | Content |
|----------|---------|
| `component-reference.md` | All MuleSoft connector patterns |
| `error-patterns.md` | Build/deploy error fixes |
| `version-compatibility.md` | MuleSoft version reference |

---

## 🎯 **Rule Dependency Map**

```mermaid
graph TD
    subgraph "4-File Lean Architecture"
        MAIN[03_App_Development.mdc<br/>🧞‍♂️ Main Entry Point]
        PHASE[03-00_Phase_Orchestration.mdc<br/>📊 Phase Workflow]
        GUIDE[03-01_Guidance.mdc<br/>📚 Patterns & Reference]
        STOPS[03-02_Mandatory_Stop_Points.mdc<br/>🛑 User Checkpoints]
    end
    
    subgraph "Detailed Docs (lib/docs/)"
        COMP[component-reference.md]
        ERRORS[error-patterns.md]
    end
    
    MAIN --> PHASE
    PHASE --> STOPS
    PHASE --> GUIDE
    GUIDE --> COMP
    GUIDE --> ERRORS
    
    style MAIN fill:#e74c3c,stroke:#c0392b,color:#fff
    style PHASE fill:#3498db,stroke:#2980b9,color:#fff
    style GUIDE fill:#27ae60,stroke:#1e8449,color:#fff
    style STOPS fill:#e67e22,stroke:#d35400,color:#fff
```

---

## 📊 **Development Workflow**

```mermaid
flowchart LR
    P0[Phase 0<br/>Requirements] --> P1[Phase 1<br/>Design]
    P1 --> P2[Phase 2<br/>Generate]
    P2 --> P3[Phase 3<br/>Build]
    P3 --> P4[Phase 4<br/>Deploy]
    P4 --> P5[Phase 5<br/>Validate]
    
    style P0 fill:#3498db,color:#fff
    style P1 fill:#3498db,color:#fff
    style P2 fill:#e67e22,color:#fff
    style P3 fill:#e67e22,color:#fff
    style P4 fill:#9b59b6,color:#fff
    style P5 fill:#27ae60,color:#fff
```

---

## 🔄 VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| v2.1 | Apr 2026 | LLM behavioral gap countermeasures: `<thinking>` blocks, Confidence Calibration, RGV, Evidence-Bound, Tree of Thought, Few-Shot, Constitutional Principles, Anti-Autopilot, Contradiction Handling, Graceful Degradation, Input Sanitization |
| v2 | Jan 2026 | Lean 4-File Architecture, consolidated guidance |

---

🧞‍♂️ **App Development Agent V2.1 - Lean 4-File Architecture** ✨

