# 🧞‍♂️ R-GENIE Command Reference Guide

**Author**: Cheppali Shaik Sohail  
**Quick reference for all R-GENIE Cursor commands**

---

## ⚠️ **IMPORTANT: USER RESPONSIBILITY**

> **🔒 All AI-generated content requires human review and approval before use.**  
> Statements like "production-ready", "quality score", "enterprise-grade" are psychological prompts for AI accuracy - **not guarantees**.  
> **Always review, test, and approve all generated content before deployment.**

---

## 🚀 **ONE-CLICK AGENT ACTIVATION**

Load and enable agents instantly with all necessary files - no manual drag-and-drop needed!

### **Agent Activation Commands:**

| Command | Agent | What It Does |
|---------|-------|--------------|
| `/use-00-master-orchestrator` | Master Orchestrator | Creates dirs + Enables + Loads files (all 5 stages) |
| `/use-01-technical-design` | Technical Design | Creates dirs + Enables + Loads files |
| `/use-02-api-specification` | API Specification | Creates dirs + Enables + Loads files |
| `/use-03-app-development` | App Development | Creates dirs + Enables + Loads files |
| `/use-03-01-dataweave` | DataWeave | Creates dirs + Enables + Loads files |
| `/use-04-munit` | MUnit Testing | Creates dirs + Enables + Loads files |
| `/use-05-readme` | Documentation | Creates dirs + Enables + Loads files |
| `/use-06-code-review` | Code Review | Creates dirs + Enables + Loads files |
| `/use-07-error-analysis` | Error Analysis | Enables + Loads files (no dirs needed) |

**Benefits:**
- ✅ Instant activation - creates directories, enables, AND loads everything
- ✅ Complete context - never miss critical files
- ✅ Beginner friendly - no need to know file structure
- ✅ Production learnings included automatically

---

## ⚙️ **AGENT MANAGEMENT**

Control which agents are indexed by Cursor for background context.

### **Bulk Operations:**

| Command | Effect |
|---------|--------|
| `/enable-all-agents` | Enable all 9 agents for indexing (bulk enable) |
| `/disable-all-agents` | Disable all 9 agents from indexing (bulk disable) |
| `/show-agent-status` | Display current status of all agents |

**Note:** Use `/use-XX-agent` to enable and load specific agents, or use bulk commands for all agents at once.

---

## 📚 **PRODUCTION LEARNINGS**

Update agent knowledge base with production insights.

**Location:** Commands are organized in `update-agents/` subfolder.

| Command | Effect |
|---------|--------|
| `/update-agents/add-production-learnings` | Append new learnings to pending section |
| `/update-agents/integrate-production-learnings` | Integrate pending learnings into rule files |

**Note:** Both commands require explicit user approval before modifying any R-GENIE system files.

---

## 🔍 **DOCUMENTATION VERIFICATION**

Verify and update R-GENIE documentation against actual workspace state.

| Command | Effect |
|---------|--------|
| `/update-agents/documentation-verification-prompt` | Comprehensive verification and update of documentation files |

**Usage:**
```
/update-agents/documentation-verification-prompt [DOCUMENTATION_FILE_PATH]
```

**Example:**
```
/update-agents/documentation-verification-prompt docs/COMMAND_REFERENCE.md
/update-agents/documentation-verification-prompt README.md
```

**If no path provided, verifies all documentation files.**

---

## 📁 **PROJECT SETUP**

Initialize project workspace structure for R-GENIE workflows.

### **Automatic Directory Creation:**

**All `/use-XX-agent` commands automatically create their directories!** No separate setup needed.

### **Bulk Setup (Optional):**

| Command | Effect |
|---------|--------|
| `/create-project-directories` | Create all system-specific input/output folders at once (all 7 systems) |

**Note:** Individual directory creation commands have been merged into `/use-XX-agent` commands for a simpler workflow.

**Purpose:** Each agent command automatically sets up its required directory structure following R-GENIE workspace organization standards.

---

## 🎯 **COMMAND CATEGORIES**

### **📁 For Project Setup:**
```bash
/create-project-directories     # Create all system directories (bulk setup)
# Note: Individual /use-XX-agent commands auto-create their directories!
```

### **🚀 For Working With Agents (Most Common):**
```bash
/use-XX-agent-name           # One-click agent enable + load (recommended)
/show-agent-status          # Check which agents are active
```

### **⚙️ For Agent Management:**
```bash
/use-XX-agent-name          # Enable + load specific agent
/enable-all-agents          # Enable all 9 agents at once (bulk)
/disable-all-agents         # Disable all 9 agents at once (bulk)
```

### **🔄 For Maintenance:**
```bash
/update-agents/add-production-learnings   # Update knowledge base
/update-agents/integrate-production-learnings  # Integrate learnings into rules
/update-agents/documentation-verification-prompt  # Verify documentation accuracy
```

---

## 💡 **RECOMMENDED WORKFLOWS**

### **Workflow 1: Starting a New Project**
```bash
1. /use-00-master-orchestrator          # Creates dirs + Enables + Loads orchestrator
2. Share your requirements              # Start working immediately!
```

### **Workflow 2: Specific Task (e.g., DataWeave)**
```bash
1. /use-03-01-dataweave                 # Creates dirs + Enables + Loads agent
2. Share input/output samples           # Provide context
3. Request transformation               # Get result
```

### **Workflow 3: Debugging Issues**
```bash
1. /use-07-error-analysis               # Load error agent
2. Share error logs/stack trace         # Provide error
3. Receive root cause + solution        # Get fix
```

### **Workflow 4: Full Development Pipeline**
```bash
1. /use-00-master-orchestrator          # Everything in one command!
2. Follow 5-stage guided workflow       # Complete solution
```

---

## 🔑 **KEY FEATURES**

### **Unified Command Approach:**

**Single Command Does Everything:**
- `/use-XX-agent` - **Creates directories + Enables indexing + Loads all files**

| Feature | `/use-XX-agent` | `/disable-all-agents` |
|---------|------------------|----------------------|
| **Purpose** | Create dirs + Enable + Load agent NOW | Disable ALL agents from indexing |
| **Speed** | Immediate | Instant |
| **Directories** | Auto-creates input/output folders | N/A |
| **Files Loaded** | All (README, rules, learnings) | N/A |
| **Indexing** | Enables for Cursor indexing | Disables all from indexing |
| **When To Use** | Starting work with any agent | Done with all agents / reduce context |

**💡 Pro Tip:** 
- Use `/use-XX-agent` to enable and start working with any specific agent
- Use `/disable-all-agents` when you're done and want to reduce Cursor's context
- Use `/enable-all-agents` for full R-GENIE background awareness

---

## 📋 **QUICK REFERENCE CHART**

```
┌──────────────────────────────────────────────────────────────────┐
│                   R-GENIE COMMAND CATEGORIES                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🚀 ONE-CLICK ACTIVATION (Most Used)                            │
│     /use-XX-agent-name → Instant agent activation + loading     │
│                                                                  │
│  📁 PROJECT SETUP                                               │
│     /create-project-directories → All directories at once       │
│     (Note: /use-XX commands auto-create their directories!)     │
│                                                                  │
│  📊 STATUS & INFO                                               │
│     /show-agent-status → View all agent states                  │
│                                                                  │
│  ⚙️ BULK MANAGEMENT                                             │
│     /enable-all-agents → Enable all 9 agents                    │
│     /disable-all-agents → Disable all 9 agents                  │
│                                                                  │
│  📚 KNOWLEDGE (update-agents/)                                 │
│     /update-agents/add-production-learnings → Append to pending │
│     /update-agents/integrate-production-learnings → Integrate  │
│                                                                  │
│  🔍 DOCUMENTATION                                                │
│     /update-agents/documentation-verification-prompt → Verify  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🎓 **LEARNING PATH**

### **Beginner:**
Start with these commands:
1. `/use-01-technical-design` - Try a simple agent (auto-creates dirs!)
2. `/show-agent-status` - Understand what's available
3. `/use-00-master-orchestrator` - Complete workflow
4. `/disable-all-agents` - Clean up when done

### **Intermediate:**
Master these workflows:
1. Use specific agents for specific tasks
2. Combine agents for complex projects
3. Use bulk enable/disable for managing context

### **Advanced:**
Optimize your workflow:
1. Strategic use of enable-all vs individual agents
2. Production learnings updates
3. Custom workflows combining multiple agents

---

## 📊 **COMMAND SUMMARY**

**Total Commands: 16**

- **9 Agent Activation Commands** (`/use-XX-agent`)
- **3 Management Commands** (`/enable-all-agents`, `/disable-all-agents`, `/show-agent-status`)
- **3 Update Agents Commands** (`/update-agents/add-production-learnings`, `/update-agents/integrate-production-learnings`, `/update-agents/documentation-verification-prompt`) - Located in `update-agents/` subfolder
- **1 Project Setup Command** (`/create-project-directories`)

---

**🧞‍♂️ R-GENIE makes MuleSoft development faster, easier, and more intelligent!**

*For detailed documentation, see: [README.md](../README.md)*
