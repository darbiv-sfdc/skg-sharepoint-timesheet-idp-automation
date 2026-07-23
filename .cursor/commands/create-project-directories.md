# Create Project Directories

Create the complete R-GENIE system-specific workspace structure.

## Purpose
Automatically create all required input and output directories for R-GENIE workflows.

## What This Does
- 📁 Creates system-specific input/output folder pairs
- 🎯 Follows R-GENIE workspace organization standards
- ✨ Sets up clean separation between user workspace and system files

## Execution Steps

### **Step 1: Create Project Directory Structure**

Execute the following directory creation:

```bash
mkdir -p project/input_01_design project/output_01_design \
         project/input_02_api project/output_02_api \
         project/input_03_app project/output_03_app \
         project/input_03_01_dataweave project/output_03_01_dataweave \
         project/input_04_munit project/output_04_munit \
         project/input_05_readme project/output_05_readme \
         project/input_06_review project/output_06_review
```

### **Step 2: Verify Directory Creation**

List the created directories to confirm successful creation.

### **Step 3: Display Directory Structure**

Show the complete directory tree:

```
project/
├── input_01_design/         # 📥 Design System - User Inputs
├── output_01_design/        # 📤 Design System - AI Outputs
├── input_02_api/           # 📥 API Specification - User Inputs
├── output_02_api/          # 📤 API Specification - AI Outputs
├── input_03_app/           # 📥 App Development - User Inputs
├── output_03_app/          # 📤 App Development - AI Outputs
├── input_03_01_dataweave/  # 📥 DataWeave Transformation - User Inputs
├── output_03_01_dataweave/ # 📤 DataWeave Transformation - AI Outputs
├── input_04_munit/         # 📥 MUnit Testing - User Inputs
├── output_04_munit/        # 📤 MUnit Testing - AI Outputs
├── input_05_readme/        # 📥 Documentation - User Inputs
├── output_05_readme/       # 📤 Documentation - AI Outputs
├── input_06_review/        # 📥 Code Review - User Inputs
└── output_06_review/       # 📤 Code Review - AI Outputs
```

### **Step 4: Provide Usage Instructions**

Display next steps:

```
✅ PROJECT DIRECTORIES CREATED SUCCESSFULLY

🎯 Usage Guidelines:

1. **Place Input Files**
   - Put your requirements/source files in appropriate input_XX/ folders
   - Example: Design requirements → project/input_01_design/

2. **Run R-GENIE Agents**
   - Use /use-XX-agent-name commands to activate agents
   - Example: /use-01-technical-design

3. **Receive Outputs**
   - AI-generated outputs automatically go to output_XX/ folders
   - Example: Design documents → project/output_01_design/

4. **Use @-mentions for Context**
   - @project/input_01_design/ - Give AI context of your input files
   - @project/output_01_design/ - Reference previous outputs

📚 System-Specific Folders:
  • 01: Technical Design System
  • 02: API Specification Agent
  • 03: App Development Agent
  • 03_01: DataWeave Transformation Agent
  • 04: MUnit Testing Agent
  • 05: ReadMe Documentation Agent
  • 06: Code Review Agent

🔗 Related Commands:
  • /show-agent-status - Check which agents are enabled
  • /use-00-master-orchestrator - Start with Master Orchestrator
  • /use-01-technical-design - Begin with Technical Design
```

## Important Notes

- ✅ **DO**: Use system-specific input_XX/output_XX folders
- ✅ **DO**: Keep user files separate from R-GENIE system files
- ❌ **DON'T**: Create input/output folders inside r-genie/ subsystems
- ❌ **DON'T**: Mix user content with system files

## Directory Safety

This command is safe to run multiple times - it will not overwrite existing files or directories.

