# 🧞‍♂️ **R-GENIE README AGENT V2 (05)**

**📄 Version:** v2.1  
**📅 Updated:** April 2026  
**👨‍💻 Author:** Cheppali Shaik Sohail  
**🎯 Purpose:** Generate professional documentation for MuleSoft applications with template-driven workflow

---

## ✨ **V2 FEATURES**

| Feature | Description |
|---------|-------------|
| **Template-First Approach** | Reads templates and examples before generation |
| **6-Phase Workflow** | Phases 0-5 with mandatory stop points and template parsing |
| **Quality Scoring** | 100-point documentation quality framework (90+ target) |
| **Mermaid Diagrams** | Mandatory flowchart diagrams (NO ASCII art) |
| **Examples** | Real-world API and batch project examples |
| **Templates** | Customize outputs, sections, terminology |

---

## 📁 **SYSTEM STRUCTURE**

```
05_ReadMe_Agent/
├── README.md                      # This file
├── ARCHITECTURE.md                # Workflow & architecture
├── 05_Production_Learnings.md     # Production insights
├── templates/
│   └── readme-style.yaml          # Customize outputs, sections, terminology
├── rules/                         # 📋 5 LEAN RULE FILES
│   ├── 05_ReadMe.mdc              # Main entry point
│   ├── 05-00_Template_Configuration.mdc  # Phase 0: Template-first approach
│   ├── 05-01_Phase_Orchestration.mdc     # Phase workflow & state
│   ├── 05-02_Guidance.mdc                # Phases 1-4: RISEN, extraction, Mermaid
│   └── 05-03_Mandatory_Stop_Points.mdc   # Always: Interactive enforcement
└── examples/
    ├── README.md                  # Examples index
    ├── 01_api_project_readme.md   # API project example
    └── 02_batch_project_readme.md # Batch project example
```

---

## 🎯 **WHAT IT DOES**

Generates complete, professional README documentation for your MuleSoft projects:
- **README.md** - Professional project documentation with all sections included

### **✨ Key Features:**
- ✅ **Complete Documentation** - All essential docs in one go
- 📊 **Dynamic Content** - Auto-generated from your project
- 🎨 **Professional Format** - Enterprise-ready presentation
- 🔗 **Embedded Diagrams** - Architecture visuals included

## 🚀 **HOW TO USE**

### **Quick Start:**
```bash
# Use with your complete MuleSoft project
@05_ReadMe.mdc @your-mulesoft-project/

# Get complete documentation package in 5-10 minutes
```

### **What You Need:**
- ✅ **Complete MuleSoft Application** - Your finished application code
- ✅ **Technical Design** (optional) - For architecture documentation
- ✅ **Test Results** (optional) - For quality metrics

### **What You Get:**
- 📄 **README.md** - Complete project documentation (always generated)

## 📊 **DOCUMENTATION SECTIONS**

> **📁 Single Source of Truth:** Section structure is defined in [`templates/readme-style.yaml`](templates/readme-style.yaml) and [`rules/05_ReadMe.mdc`](rules/05_ReadMe.mdc)

### **🏆 Generated README Includes:**

See **[`templates/readme-style.yaml`](templates/readme-style.yaml)** for customizable section configuration.

### **🎯 Professional Features:**
- Dynamic badges (MuleSoft version, project version, status)
- Mermaid architecture diagrams
- Code examples with syntax highlighting
- Table of contents with emoji navigation
- Concise, copy-paste ready examples

## 📋 **EXAMPLE OUTPUT**

> **� Reference Examples:** See [`examples/`](examples/) directory for complete, real-world examples.

| Example | Type | Description |
|---------|------|-------------|
| [`01_api_project_readme.md`](examples/01_api_project_readme.md) | API/REST | Experience API with endpoints |
| [`02_batch_project_readme.md`](examples/02_batch_project_readme.md) | Batch/Event | Scheduled batch processor |

### **🎯 What You Do Next:**
1. **Review Generated Docs** - Check for accuracy
2. **Customize if Needed** - Add project-specific details
3. **Commit to Repository** - Include in your project
4. **Share with Team** - Professional documentation ready

## 🔧 **TROUBLESHOOTING**

### **Common Questions:**

#### **🔴 "Documentation is too generic"**
✅ **Solution**: Provide more context in your project files (comments, technical design docs) for richer content generation

#### **🔴 "Missing deployment section"**  
✅ **Solution**: Include deployment configuration files (pom.xml, CloudHub configs) for accurate deployment section in README

## 💡 **TIPS FOR BETTER DOCS**

### **🎯 Quick Wins:**
1. **Include Technical Design** - Better architecture documentation
2. **Provide RAML Specs** - Complete API documentation
3. **Add Comments** - Richer explanations in generated docs
4. **Include Test Results** - Quality metrics and coverage

### **🏆 Best Practices:**
- ✅ Run after application is complete
- ✅ Include all configuration files
- ✅ Provide technical design document
- ✅ Review and customize generated content

## ⚡ **PERFORMANCE**

**Fast & Comprehensive:**
- ⏱️ **5-10 minutes** - Complete README documentation
- 📄 **Single File** - Comprehensive README.md with all sections
- 🎯 **Professional Quality** - Enterprise-ready output
- 🔄 **Regenerate Anytime** - Easy to update

## 🔗 **INTEGRATION**

### **Works With:**
- **03_App_Development_Agent** - Documents generated applications
- **04_MUnit_Agent** - Includes test coverage and results
- **06_Code_Review_Agent** - Incorporates quality metrics

### **Output Used By:**
- Development teams for onboarding
- Operations teams for reference
- Business stakeholders for understanding

---

## 🔗 **V2 RULE FILES**

| Rule | Purpose |
|------|---------|
| [`05_ReadMe.mdc`](rules/05_ReadMe.mdc) | Main entry point |
| [`05-00_Template_Configuration.mdc`](rules/05-00_Template_Configuration.mdc) | Phase 0: Template-first approach |
| [`05-01_Phase_Orchestration.mdc`](rules/05-01_Phase_Orchestration.mdc) | Phase workflow & state |
| [`05-02_Guidance.mdc`](rules/05-02_Guidance.mdc) | Phases 1-4: RISEN, extraction, Mermaid |
| [`05-03_Mandatory_Stop_Points.mdc`](rules/05-03_Mandatory_Stop_Points.mdc) | Always: Interactive enforcement |

**Total: 5 lean rule files** - See [`rules/INDEX.md`](rules/INDEX.md) for complete reference

### **V2 Key Enhancements:**
- 🎯 **Template-First**: Mandatory read of templates and examples before generation
- 🎨 **Mermaid Diagrams**: Required flowchart diagrams (ASCII art forbidden)
- 🛑 **Enhanced Stops**: Improved checkpoint messaging with clear wait states
- ✅ **Quality Target**: 90+ points (increased from 85+)

---

*🧞‍♂️ R-GENIE README Agent V2 - Template-Driven, Mermaid-Powered Documentation!* ✨

