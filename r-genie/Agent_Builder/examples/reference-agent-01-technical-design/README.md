# 🧞‍♂️ R-GENIE Technical Design Agent V2

**Lean, Developer-Focused MuleSoft Technical Design Generation**

**👨‍💻 Author:** Cheppali Shaik Sohail

---

## 🎯 **Overview**

The Technical Design Agent V2 is an AI-powered system for generating **lean, developer-focused** MuleSoft technical design documents. It produces documents with only essential content for implementation - no arbitrary line limits, just what developers need.

### **Key Features**

| Feature | Description |
|---------|-------------|
| **Document Focus** | Developer-essential only |
| **Diagrams** | Essential + optional |
| **DataWeave** | Field mapping tables only |
| **Config Files** | Separate YAML files |
| **Deployment Config** | Optional (on request) |
| **Business Context** | Optional supplementary |
| **Project Templates** | Optional customization |

### **Capabilities**

| Capability | Description |
|---------|-------------|
| **🚨 Interactive Workflow** | Mandatory stop points - agent WAITS for user input |
| **6-Phase Workflow (Phases 0-5)** | Faster completion (~40 min vs ~55 min) |
| **Developer-Focused Output** | Only implementation-essential content |
| **Separate Config Files** | Actual YAML files in `config/` folder |
| **Optional Supplementary** | Business context, extra diagrams on request |
| **Field Mapping Tables** | No DataWeave code (developers write their own) |
| **📋 Project Templates** | Customize structure, naming, terminology per project |

### **🚨 Critical: Interactive Design Process**

The agent is designed to be **truly interactive**:
- **STOPS and WAITS** when questions are asked
- **NEVER proceeds assuming** answers to questions
- **REQUIRES user confirmation** at each phase gate
- **BLOCKS progression** until critical info is provided

### **🚨 Critical: Conversation vs Document Content**

| Content Type | Where It Goes | Examples |
|--------------|---------------|----------|
| **Brainstorming** | Chat only | Analysis, recommendations, alternatives, "Why?" |
| **Technical Decisions** | Document | Clean bullet points, tables, diagrams |

**The agent discusses and gets approval in conversation FIRST, then writes clean content to the document matching `examples/` format.**

---

## 🚀 **Quick Start**

### **1. Start a Design Session**

In your Cursor conversation:

```
@01_Technical_Design.mdc

I need a customer sync API that transfers data from Salesforce to MySQL daily.
```

### **2. Provide Requirements**

**Option A: Text Description**
```
Describe your integration requirements in natural language
```

**Option B: Screenshot**
```
Upload screenshots of requirements documents, diagrams, or specs
```

**Option C: Input Files**
```
Place files in project/input_01_design/:
- requirements.txt
- sample-data.json
- business-rules.md
```

### **3. Follow the Workflow**

The system will guide you through 6 phases (0-5):
0. Document Initialization + Template Parsing
1. Strategic Technical Analysis
2. MuleSoft Flow Architecture
3. Field Mappings & Error Handling
4. Config Files & Completion
5. Optional Supplementary (on request)

---

## 📁 **System Structure**

```
r-genie/01_Technical_Design_Agent/
├── README.md                              # This file
├── 01_Production_Learnings.md             # Production experience learnings
├── templates/                             # 📋 PROJECT TEMPLATES (optional)
│   └── design-style.yaml                  # Customize structure, naming, terminology
├── rules/                                 # 📋 6 LEAN RULE FILES
│   ├── INDEX.md                           # Rules index & quick reference
│   ├── 01_Technical_Design.mdc            # Main entry point
│   ├── 01-00_Template_Configuration.mdc   # Phase 0: Template-first approach
│   ├── 01-01_Phase_Orchestration.mdc      # Phase workflow & state management
│   ├── 01-02_Guidance.mdc                 # Phases 1-3: RISEN, patterns, diagrams, mappings
│   └── 01-03_Mandatory_Stop_Points.mdc    # Always: Interactive enforcement
└── examples/
    ├── README.md                          # Example index
    ├── 01_batch_file_integration_design.md
    ├── 02_real_time_api_design.md
    ├── 03_event_driven_integration_design.md
    ├── 04_multi_system_orchestration_design.md
    └── 05_mermaid_diagram_examples.md
```

---

## 📊 **Streamlined Workflow Phases**

### **Phase 0: Document Initialization**
- Creates lean document skeleton
- Validates requirements input
- Sets up project metadata

### **Phase 1: Strategic Technical Analysis**
- Deep requirement analysis
- Strategic recommendation presentation
- User validation of approach

### **Phase 2: MuleSoft Flow Architecture**
- API-Led connectivity pattern selection
- Processing strategy design
- Essential Diagram 1: Integration Sequence

### **Phase 3: Field Mappings & Error Handling**
- Real data sample collection
- Field mapping tables (**NO DataWeave code**)
- Error handling pattern design
- Essential Diagrams 2-3: Error Handling, Connector Pattern

### **Phase 4: Config Files & Completion**
- Generate separate config files in `output_01_design/config/`
- Add configuration reference section
- Prompt user for optional supplementary content

### **Phase 5: Optional Supplementary** (on request)
- Generate `{project}-supplementary.md` if requested
- Include business context, extra diagrams, deployment details



---

## 📋 **Rule Files Reference**

| Rule File | Purpose | When to Use |
|-----------|---------|-------------|
| `01_Technical_Design.mdc` | Main entry point | Starting any design |
| `01-00_Template_Configuration.mdc` | Template-first approach | Phase 0 |
| `01-01_Phase_Orchestration.mdc` | Phase workflow & state | All phases |
| `01-02_Guidance.mdc` | RISEN, patterns, diagrams, mappings | Phases 1-3 |
| `01-03_Mandatory_Stop_Points.mdc` | **CRITICAL** Interactive enforcement | ALWAYS |

---

## 📋 **Project Templates (Optional)**

Customize the design document style for your project. Templates are **optional** - if unconfigured, the agent uses the default R-GENIE style.

### **Template Location**

```
r-genie/01_Technical_Design_Agent/templates/
└── design-style.yaml          # Configuration file
```

### **What You Can Customize**

| Category | Options |
|----------|---------|
| **Structure** | Section names, ordering, include/exclude sections |
| **Naming** | File name patterns, heading style (Title Case vs Sentence case) |
| **Diagrams** | Which essential/optional diagrams to include |
| **Terminology** | Replace terms (e.g., "Flow" → "Process", "Connector" → "Adapter") |
| **Custom Sections** | Add project-specific sections |

### **Quick Setup**

**Option 1: Edit YAML Config**
```yaml
# templates/design-style.yaml
project_name: "ACME Corp"
terminology:
  "Connector": "Adapter"
  "Flow": "Process"
```

**Option 2: Use Examples as Reference**
The agent references `examples/` folder for formatting and style. Select matching example based on project type.

**Option 3: Use Defaults**
Leave templates unconfigured - agent uses default R-GENIE style automatically.

### **Template Processing**

During Phase 0, the agent:
1. Reads `templates/design-style.yaml`
2. If configured → Applies custom settings
3. If example document exists → Analyzes and mimics style
4. If unconfigured → Uses default R-GENIE style

**See:** `rules/01-00_Template_Configuration.mdc` for detailed configuration options.

---

## 📊 **3 Essential + 3 Optional Diagrams**

### **Essential Diagrams (Always in Main Document)**

| # | Diagram | Type | Phase |
|---|---------|------|-------|
| 1 | Integration Sequence | `sequenceDiagram` | Phase 2 |
| 2 | Error Handling | `flowchart TD` | Phase 3 |
| 3 | Connector Pattern | `graph TB` | Phase 3 |

### **Optional Diagrams (Supplementary Document)**

| # | Diagram | Type | When to Include |
|---|---------|------|-----------------|
| 4 | System Architecture | `graph TB` | Complex multi-system integrations |
| 5 | Business Process | `flowchart TD` | Business stakeholder docs |
| 6 | Data Flow | `flowchart LR` | Complex transformation pipelines |

---

## 🎯 **Decision Matrices**

The system includes 6 decision matrices:

1. **API-Led Connectivity Pattern** - When to use System/Process/Experience layers
2. **Processing Strategy** - Real-time vs Batch vs Event-driven
3. **Connector Selection** - Best connector by system type
4. **CloudHub Sizing** - vCore and worker recommendations
5. **Error Handling Strategy** - Retry and circuit breaker patterns
6. **Security Configuration** - Authentication and encryption choices

---

## 📁 **Examples**

| Example | Use Case | Key Patterns |
|---------|----------|--------------|
| Batch File Integration | SFTP → Salesforce sync | Batch processing, bulk API |
| Real-Time API | Customer API with orchestration | Real-time, API-Led |
| Event-Driven Integration | CDC-based sync | Anypoint MQ, events |
| Multi-System Orchestration | Order management | Full API-Led, complex flows |
| Mermaid Diagrams | All 6 diagram types | Visual templates |

---

## 📄 **Output Structure**

### **Primary Output: Developer-Focused Design Document**
```
{workspace}/project/output_01_design/{project-name}-technical-design.md
```

```markdown
# {Project Name} - MuleSoft Technical Design

## 1. Project Overview (brief)
## 2. Technical Architecture (pattern, strategy, connectors)
## 3. Flow Architecture (step-by-step design)
## 4. Essential Diagrams (3 diagrams)
## 5. Field Mapping Tables
## 6. Error Handling Strategy
## 7. Configuration Files (reference)
```

### **Config Files: Separate YAML Files**
```
{workspace}/project/output_01_design/config/
├── dev-config.yaml
├── test-config.yaml
├── prod-config.yaml
└── secure-properties.yaml
```

### **Optional Supplementary: Generated on Request**
```
{workspace}/project/output_01_design/{project-name}-supplementary.md
```
- Executive Summary & Business Context
- Detailed Requirements Tables
- Additional Diagrams (System Architecture, Business Process, Data Flow)
- CloudHub Deployment Configuration
- Deployment Procedures

---

## 🔄 **Iterative Refinement**

The system supports bounded iterations:

- **Architecture Refinement:** Max 3 iterations
- **Mapping Refinement:** Max 3 iterations
- **Diagram Refinement:** Max 2 iterations per diagram
- **Document Cleanup:** Max 2 iterations

Each iteration shows:
- What was changed
- What was approved
- What's next

---

## ⚠️ **Common Pitfalls**

The system helps avoid:

| Category | Pitfall |
|----------|---------|
| Architecture | Over-engineering, under-engineering |
| Performance | Sync calls in loops, memory issues |
| Security | Hardcoded credentials, exposed errors |
| Operations | Missing health checks, poor logging |
| Integration | Ignoring rate limits, tight coupling |

---

## 📈 **Version History**

| Version | Date | Changes |
|---------|------|---------|
| 2.0.0 | Jan 2026 | Developer-focused design, 3 essential diagrams, separate config files, project templates, lean 5-file architecture |

---

## 🔗 **Related Systems**

- **MUnit Agent V2** - Test generation for MuleSoft applications
- **App Development Agent** - MuleSoft application development
- **DataWeave Agent** - DataWeave transformation assistance
- **API Specification Agent** - RAML/OAS specification design

---

🧞‍♂️ **R-GENIE Technical Design System V2 - Lean, Developer-Focused Designs!** ✨
