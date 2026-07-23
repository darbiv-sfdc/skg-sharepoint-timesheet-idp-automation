# 📚 Production Learnings - App Development Agent

**Author**: Cheppali Shaik Sohail  
**Purpose**: Capture NEW reusable insights and best practices from real-world MuleSoft application development for future agent integration.

**Last Updated**: 2026-04-04

**New Learnings Captured**: 0 learnings pending integration

---

## ✅ **PREVIOUS LEARNINGS - INTEGRATION STATUS**

> **✨ Recent production learnings have been successfully integrated**  
> **📄 Location**: `rules/03-01_Guidance.mdc` (Version 2.0.0)  
> **📅 Integration Date**: 2026-01-10

**Integrated Learnings Include**:
- ✅ 🔧 IDE & Studio Integration - Anypoint Studio Project Configuration (Eclipse files)
- ✅ 🧩 Project Structure - Maven POM `<name>` Element Must Match `<artifactId>`
- ✅ 🎯 Build & Packaging - DataWeave and Scheduler Are Runtime Modules (Don't Declare as Dependencies)
- ✅ 🎯 Build & Packaging - Maven Plugin GroupId Must Be `org.mule.tools.maven`

**Where to Find Integrated Learnings**:
- **AI Agent Rules**: `rules/03_App_Development.mdc` - Main entry point
- **Phase Workflow**: `rules/03-00_Phase_Orchestration.mdc` - Phase orchestration process
- **Patterns & Guidance**: `rules/03-01_Guidance.mdc` - **Studio configuration integrated here**
- **Mandatory Stop Points**: `rules/03-02_Mandatory_Stop_Points.mdc` - Interactive workflow enforcement
- **System Documentation**: `README.md`
- **Detailed Docs**: `lib/docs/` - Component reference, error patterns, version compatibility

---

## 🆕 **NEW LEARNINGS - PENDING INTEGRATION**

> **This section is for capturing NEW production insights discovered after 2026-01-10**

*No pending learnings - All learnings have been integrated!*

---

---

### ~~1. Anypoint Studio Project Configuration~~ ✅ [INTEGRATED - 2026-01-10]

**Integrated To**: `rules/03-01_Guidance.mdc` → Section: "PROJECT STRUCTURE" → Subsection: "Eclipse/Studio Configuration Files"

**Summary**: Eclipse/Studio configuration files (`.project`, `.classpath`, `.settings/`) required to ensure projects open in Mule Perspective. Use `muleStudioBuilder` and `muleStudioNature` identifiers. Connector versions in `.classpath` must match POM dependencies exactly.

**See**: Complete learning details preserved in `rules/03-01_Guidance.mdc` for reference during application generation.

---

### ~~2. Maven POM `<name>` Element Must Match `<artifactId>`~~ ✅ [INTEGRATED - 2026-01-10]

**Integrated To**: `rules/03-01_Guidance.mdc` → Section: "PROJECT STRUCTURE" → Subsection: "POM `<name>` Element Must Match `<artifactId>`"

**Summary**: The `<name>` element in `pom.xml` must match the `<artifactId>` exactly for consistency with MuleSoft project conventions and to avoid potential IDE/build issues.

**See**: Complete learning details preserved in `rules/03-01_Guidance.mdc` for reference during application generation.

---

### ~~3. DataWeave and Scheduler Are Runtime Modules~~ ✅ [INTEGRATED - 2026-01-10]

**Integrated To**: `rules/03-01_Guidance.mdc` → Section: "POM.XML ESSENTIALS" → Subsection: "Common Dependencies" → "Runtime Modules - Do NOT Declare as Dependencies"

**Summary**: DataWeave (`ee:transform`) and Scheduler (`scheduler:scheduler`) are part of Mule Runtime 4.6+ and must not be declared as explicit dependencies. Adding them causes build failures when they require authentication or aren't available in public repositories.

**See**: Complete learning details preserved in `rules/03-01_Guidance.mdc` for reference during application generation.

---

### ~~4. Maven Plugin GroupId Must Be `org.mule.tools.maven`~~ ✅ [INTEGRATED - 2026-01-10]

**Integrated To**: `rules/03-01_Guidance.mdc` → Section: "POM.XML ESSENTIALS" → Subsection: "Maven Plugin Configuration"

**Summary**: The Mule Maven plugin must use groupId `org.mule.tools.maven` (NOT `org.apache.maven.plugins`) to prevent "Unresolveable build extension" errors.

**See**: Complete learning details preserved in `rules/03-01_Guidance.mdc` for reference during application generation.

---

## 📝 **HOW TO CONTRIBUTE NEW LEARNINGS**

### **Step 1: Document the Learning**

Use this template structure for each new learning:

```markdown
### [Learning Number]. [Clear, Descriptive Title]

**Issue**: [Describe the problem or challenge encountered]

**Example of Problem**:
```[language]
# ❌ BAD: [Show what went wrong]
[problematic code/configuration]
```

**Solution**: [Describe the correct approach]

**Example of Solution**:
```[language]
# ✅ GOOD: [Show the correct approach]
[corrected code/configuration]
```

**Benefits**:
- [Benefit 1]
- [Benefit 2]
- [Benefit 3]

**Context**: [When/where this was discovered, versions, environment, etc.]

**Impact**: [High/Medium/Low] - [Brief impact description]

---
```

### **Step 2: Flag for Integration**

Add this tag to new learnings: **`🆕 [Pending Integration - YYYY-MM-DD]`**

### **Step 3: Integration Process**

1. **Capture** - Document the learning in this file using the template
2. **Validate** - Test the solution in real-world scenarios
3. **Review** - Get team/peer feedback on the insight
4. **Integrate** - Add to `rules/03_App_Development.mdc` in appropriate section
5. **Update** - Move learning from "Pending" to "Integrated" status
6. **Clean** - Archive or remove from this file (keep as reference if needed)

### **Step 4: Where to Integrate in Rules File**

| Learning Type | Target Section in Rules File |
|---------------|------------------------------|
| Build & Packaging | Phase 4: Build & Fix → Maven Configuration |
| Connector Configuration | Phase 2: Design → Connector Requirements |
| Code Generation | Phase 3: Code Generation → XML Structure |
| Project Structure | Phase 3: Code Generation → File Organization |
| Configuration Management | Phase 3: Code Generation → Property Files |
| Performance & Optimization | Phase 3: Code Generation → Best Practices |
| IDE & Studio Integration | Phase 3: Code Generation → Project Files |
| Testing & Validation | Phase 5: Validation → MUnit Setup |
| Deployment | Phase 5: Validation → CloudHub Deployment |

---

## 📋 **LEARNING CATEGORIES**

Use these categories to organize new learnings:

### **🎯 Build & Packaging**
*Maven configuration, dependency resolution, JAR packaging, build errors and fixes*

### **🔌 Connector Configuration**
*Salesforce, Anypoint MQ, HTTP, Email, and other connector setup, version compatibility*

### **📊 Code Generation**
*XML configuration, DataWeave transformations, flow structure, error handling patterns*

### **🧩 Project Structure**
*Folder organization, file naming, resource placement, Maven project layout*

### **📁 Configuration Management**
*Property files, environment configs, secure properties, externalization patterns*

### **⚡ Performance & Optimization**
*Rate limiting, batch processing, memory management, throughput optimization*

### **🔧 IDE & Studio Integration**
*Anypoint Studio configuration, Eclipse project files, Canvas view, Mule Perspective, developer experience*

### **✅ Testing & Validation**
*MUnit configuration, test coverage, validation strategies, quality scoring*

### **🚀 Deployment**
*CloudHub configuration, runtime settings, deployment strategies, environment promotion*

---

## 💡 **TIPS FOR EFFECTIVE LEARNING CAPTURE**

### **DO** ✅
- ✅ Include specific error messages encountered
- ✅ Show concrete BAD vs GOOD examples
- ✅ Explain WHY, not just WHAT
- ✅ Add context about discovery (versions, environment, etc.)
- ✅ Keep examples concise but complete
- ✅ Reference specific versions of tools/frameworks
- ✅ Include file paths and line numbers when relevant
- ✅ Explain the business/technical impact

### **DON'T** ❌
- ❌ Add learnings without validation/testing
- ❌ Include vague or generic advice
- ❌ Skip the code/configuration examples
- ❌ Forget to update integration status
- ❌ Leave duplicate learnings across multiple categories
- ❌ Document personal preferences (focus on production-tested patterns)
- ❌ Include temporary workarounds (focus on proper solutions)

---

## 🎓 **LEARNING TEMPLATE - QUICK COPY**

Copy this template to add a new learning:

```markdown
### [#]. [Learning Title] 🆕 [Pending Integration - YYYY-MM-DD]

**Issue**: [Problem description]

**Solution**: [Correct approach]

```[language]
# ❌ BAD:
[problematic example]

# ✅ GOOD:
[correct example]
```

**Benefits**:
- [Benefit 1]
- [Benefit 2]
- [Benefit 3]

**Context**: [Discovery details - versions, environment, etc.]

**Impact**: [High/Medium/Low] - [Brief impact description]

---
```

---

## 📊 **INTEGRATION TRACKING**

| Date | Learning Title | Integrated By | Status | Rules Section |
|------|---------------|---------------|--------|---------------|
| 2026-01-10 | Anypoint Studio Project Configuration | R-GENIE | ✅ Integrated | 03-01_Guidance.mdc → PROJECT STRUCTURE |
| 2026-01-10 | Maven POM `<name>` Element Must Match `<artifactId>` | R-GENIE | ✅ Integrated | 03-01_Guidance.mdc → PROJECT STRUCTURE |
| 2026-01-10 | DataWeave and Scheduler Are Runtime Modules | R-GENIE | ✅ Integrated | 03-01_Guidance.mdc → POM.XML ESSENTIALS |
| 2026-01-10 | Maven Plugin GroupId Correction | R-GENIE | ✅ Integrated | 03-01_Guidance.mdc → POM.XML ESSENTIALS |
| 2026-04-04 | LLM gap: `<thinking>` blocks + Confidence + RGV | R-GENIE | ✅ Integrated | 03-00_Phase_Orchestration.mdc |
| 2026-04-04 | LLM gap: Evidence-Bound + Tree of Thought + Few-Shot | R-GENIE | ✅ Integrated | 03-01_Guidance.mdc |
| 2026-04-04 | LLM gap: Constitutional + Anti-Autopilot + Contradiction + Degradation + Sanitization | R-GENIE | ✅ Integrated | 03-02_Mandatory_Stop_Points.mdc |
| 2026-04-04 | LLM gap: RISEN Narrowing + Mandatory Behavior | R-GENIE | ✅ Integrated | 03_App_Development.mdc |

---

## 📚 **REFERENCE LINKS**

### **Agent Rules Files**:
- **Main Agent**: `rules/03_App_Development.mdc`
- **Phase Orchestration**: `rules/03-00_Phase_Orchestration.mdc`
- **Mandatory Stop Points**: `rules/03-08_Mandatory_Stop_Points.mdc`

### **Documentation Files**:
- **System Documentation**: `README.md`
- **Quick Start**: `03_Agent_Quick_Start.md`
- **How To Use**: `03_Agent_How_To_Use.md`
- **[Other relevant docs]**: `[filename].md`

### **Helper Libraries** (if applicable):
- **Helper Functions**: `lib/[helper-file].js`
- **Utilities**: `lib/[utility-file].js`

---

## 🧞‍♂️ **R-GENIE CONTINUOUS IMPROVEMENT**

*This file serves as the living knowledge base for R-GENIE App Development Agent. Every production insight captured here makes the system better for everyone.*

**Remember**: 
- 📝 Capture insights as soon as they're discovered
- ✅ Validate before documenting
- 🔄 Integrate promptly into agent rules
- 🧹 Keep this file clean and focused on NEW learnings
- 📊 Update integration tracking table when integrating

**Your contributions help R-GENIE serve users better!** ✨

---

*File Status: All learnings integrated - Ready for new captures*  
*Last Integrated: 2026-01-10 (4 learnings integrated)*  
*Next Review: When new production learnings are discovered*

