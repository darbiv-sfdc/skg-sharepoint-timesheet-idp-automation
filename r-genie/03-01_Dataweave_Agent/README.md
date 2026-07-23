# 🧞‍♂️ R-GENIE DataWeave Intelligence Agent V2

**Production-Ready DataWeave Transformation Development**

**👨‍💻 Author:** Cheppali Shaik Sohail

---

## 🎯 **Overview**

The DataWeave Intelligence Agent V2 is R-GENIE's most sophisticated component for generating **production-ready DataWeave transformations**. It provides intelligent automation through **specialized scripts/tools**, **smart auto-routing**, and **enterprise-grade validation**.

### **Key Capabilities**

| Capability | Description |
|------------|-------------|
| **Specialized Tools** | Streamlined development, validation, and infrastructure pipeline |
| **Smart Auto-Routing** | 95% confidence scenario detection with automatic workflow selection |
| **Production Safety** | Zero runtime crashes through quality gates and MuleSoft best practices |
| **Domain Intelligence** | Business context awareness (ECOMMERCE, HEALTHCARE, FINANCIAL) |
| **Function Library** | Comprehensive DataWeave function recommendations |
| **File Processing** | Excel → JSON conversion for AI analysis |

### **🚨 Critical: Interactive Workflow**

The agent is designed to be **truly interactive**:
- **STOPS and WAITS** when questions are asked
- **NEVER proceeds assuming** answers to questions
- **REQUIRES user confirmation** at each phase gate

---

## 🚀 **Quick Start**

### **1. Start a DataWeave Session**

```
@03-01_Dataweave.mdc

I need a DataWeave transformation that maps customer orders from Salesforce JSON to MySQL format.
```

### **2. Provide Input Materials**

| Input Type | Location |
|------------|----------|
| **Sample Data** | `project/input_03_01_dataweave/input.json` |
| **Expected Output** | `project/input_03_01_dataweave/expected.json` |
| **Mapping Sheet** | `project/input_03_01_dataweave/mapping.xlsx` (optional) |
| **Requirements** | `project/input_03_01_dataweave/requirements.txt` (optional) |

### **3. Follow the Workflow**

The system guides you through 5 phases (0-4):
0. Scenario Detection & Routing
1. Requirements Analysis
2. DataWeave Script Generation
3. Validation Suite
4. Performance Optimization

---

## 📁 **System Structure**

```
r-genie/03-01_Dataweave_Agent/
├── README.md                              # This file
├── ARCHITECTURE.md                        # Technical architecture
├── 03-01_Production_Learnings.md          # Critical production insights
├── rules/                                 # 📋 4-FILE ARCHITECTURE
│   ├── INDEX.md                           # Rules index & quick reference
│   ├── 03-01_Dataweave.mdc                # Main entry point (RISEN framework)
│   ├── 03-01-00_Phase_Orchestration.mdc   # Phase workflow & checkpoints
│   ├── 03-01-01_Guidance.mdc              # Patterns, tools, functions
│   └── 03-01-02_Mandatory_Stop_Points.mdc # Interactive enforcement
├── lib/                                   # 🔧 SPECIALIZED TOOLS
│   ├── scripts/                           # Orchestration (Enhanced Suite, Performance)
│   ├── processors/                        # Analysis & validation
│   ├── utilities/                         # File processing & infrastructure
│   ├── docs/                              # Detailed reference documentation
│   └── deprecated/                        # Archived tools
└── validation/                            # Validation scripts
```

---

## 📊 **Workflow Phases**

### **Phase 0: Scenario Detection & Routing**
- Detects input file types and complexity
- Routes to optimal workflow (Single, Multi-Example, Multi-Input, Mapping-Only)
- Configures validation pipeline

### **Phase 1: Requirements Analysis**
- Domain detection (ECOMMERCE, HEALTHCARE, FINANCIAL)
- Function recommendations
- XML context awareness
- Structure compatibility analysis

### **Phase 2: DataWeave Script Generation** (User-driven)
- Production-ready transformation code
- Safe defaults strategy (natural null for display, safe defaults for arithmetic)
- MuleSoft naming conventions
- No hardcoded values

### **Phase 3: Validation Suite**
- Error detection before CLI execution
- Platform-aware CLI validation
- Security scanning (98/100 scoring)
- Output accuracy verification

### **Phase 4: Performance Optimization**
- Import efficiency analysis
- Safe checking optimization
- Streaming recommendations for large datasets
- MuleSoft best practices alignment



---

## 🔧 **Tools Reference (Streamlined)**

### **Essential** - Core Workflow
| Tool | Purpose |
|------|---------|
| `03-01-01_Enhanced_Suite.js` | Smart auto-routing orchestrator |
| `03-01-02_Requirements_Analyzer.js` | Domain intelligence |
| `03-01-06_CLI_Validator.js` | Platform-aware CLI execution |
| `03-01-16_Quality_Gates.js` | Production safety |

### **Supporting** - Used by Enhanced Suite
| Tool | Purpose |
|------|---------|
| `03-01-04_Error_Detector.js` | Proactive error prevention |
| `03-01-05_Security_Scanner.js` | Security & compliance |
| `03-01-12_Output_Validator.js` | Deep accuracy comparison |
| `03-01-24_Performance_Analyzer.js` | MuleSoft optimization |

### **Specialized** - Scenario-Specific
| Tool | Purpose |
|------|---------|
| `03-01-03_Scenario_Detector.js` | Workflow routing (95% confidence) |
| `03-01-07_Multi_Example_Validator.js` | Pattern consistency |
| `03-01-08_Multi_Input_Validator.js` | Complex integration |
| `03-01-13_Excel_Converter.js` | Excel → JSON+CSV |
| `03-01-15_Mapping_Analyzer.js` | Field relationship analysis |

### **Infrastructure** - Core Dependencies
| Tool | Purpose |
|------|---------|
| `03-01-18_Config_Manager.js` | Configuration management |
| `03-01-19_Error_Handler.js` | Standardized error handling |
| `03-01-20_Unified_Logger.js` | Structured logging |
| `03-01-21_File_Utils.js` | Async file operations |

---

## 🎯 **Smart Auto-Routing Scenarios**

| Scenario | Trigger | Pipeline |
|----------|---------|----------|
| **Single Example** | 1 input/output pair | Syntax → CLI → Security |
| **Multi-Example** | Multiple input/output pairs | Consistency → Pattern → Quality |
| **Multi-Input** | Multiple source files | Cross-reference → Integration |
| **Mapping-Only** | Mapping sheet without samples | Field analysis → Synthetic generation |

---

## 📄 **Output Structure**

```
project/output_03_01_dataweave/
├── generated-scripts/
│   └── main-transformation.dwl    # Production-ready script
├── analysis-reports/
│   ├── requirements-analysis.json # Domain intelligence
│   ├── scenario-detection.json    # Routing decisions
│   └── quality-assessment.json    # Quality metrics
└── validation-results/
    └── validation-results.txt     # Validation summary
```

---

## ⚠️ **File Processing Strategy**

| File Type | Cursor Readable? | Action |
|-----------|------------------|--------|
| **Excel (.xlsx)** | ❌ Binary | Convert to JSON+CSV |
| **XML (.xml)** | ✅ Text | Use directly |
| **JSON (.json)** | ✅ Text | Use directly |
| **CSV (.csv)** | ✅ Text | Use directly |

---

## 📈 **Version History**

| Version | Date | Changes |
|---------|------|---------|
| v2 | Jan 2026 | Concise documentation, architectural alignment, specialized tools, smart auto-routing |
| 1.0.0 | Aug 2025 | Initial release |

---

## 🔗 **Related Systems**

- **Technical Design Agent** - MuleSoft technical design generation
- **API Specification Agent** - RAML/OAS specification design
- **MUnit Agent** - Test generation for MuleSoft applications

---

🧞‍♂️ **R-GENIE DataWeave Intelligence Agent V2 - Production-Ready Transformations!** ✨
