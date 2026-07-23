# 🧞‍♂️ Example 2: Selective Execution Workflow

> **Stages:** 3, 4, 5 (Skipping Design & App Dev)  
> **Use Case:** User has existing application, needs tests, docs, and review

---

## 📋 **Scenario**

User has an existing MuleSoft application and wants to generate tests, documentation, and perform code review.

---

## 💬 **Conversation Flow**

### **User Request**

\`\`\`
User: I have an existing MuleSoft application at project/my-existing-api/. 
I need to generate MUnit tests, documentation, and do a code review. 
Can you skip the design and development stages?
\`\`\`

### **🧞‍♂️ R-GENIE Response**

\`\`\`
🧞‍♂️ Understood! I'll start from Stage 3 using your existing application.

═══════════════════════════════════════════════════════════════
R-GENIE MASTER PIPELINE - SELECTIVE EXECUTION
═══════════════════════════════════════════════════════════════

📋 Stage 1: Technical Design    → ⏭️ SKIPPED (using existing app)
🏗️ Stage 2: App Development    → ⏭️ SKIPPED (using existing app)
🧪 Stage 3: MUnit Testing       → 🎯 START HERE
📚 Stage 4: Documentation       → ⏳ PENDING
🔍 Stage 5: Code Review         → ⏳ PENDING

📁 **Your Application:** project/my-existing-api/

═══════════════════════════════════════════════════════════════
🛑 **Before we begin, please confirm:**

1. Application path: project/my-existing-api/ (correct?)
2. Start from: Stage 3 - MUnit Testing (correct?)

Reply with:
- "proceed" - Start with Stage 3
- "change: [path]" - Use different application path
═══════════════════════════════════════════════════════════════
\`\`\`

### **User Confirms**

\`\`\`
User: proceed
\`\`\`

---

## 🧪 **Stage 3: MUnit Testing**

### **🧞‍♂️ R-GENIE Executes Stage 3**

\`\`\`
🧞‍♂️ ═══════════════════════════════════════════════════════════════
   STAGE 3: MUNIT TESTING - IN PROGRESS
   ═══════════════════════════════════════════════════════════════

   📋 Analyzing existing application...
   🔍 Detecting flow patterns...
   🧪 Generating test cases...
   🎭 Creating mock services...
   ✅ Running test suite...

   [Progress: ████████████████████ 100%]
\`\`\`

### **🛑 Checkpoint 3**

\`\`\`
═══════════════════════════════════════════════════════════════
🧞‍♂️ STAGE 3 COMPLETE: MUnit Testing
═══════════════════════════════════════════════════════════════

📋 **What I Created:**
- 8 MUnit test cases
- 3 mock service definitions
- 2 test data files

📊 **Coverage Report:**
- Line Coverage: 82%
- Flow Coverage: 88%
- Target: 80%+ ✅ ACHIEVED

✅ **Test Results:**
- Passed: 8
- Failed: 0
- Skipped: 0

📁 **Output:** project/my-existing-api/src/test/munit/

═══════════════════════════════════════════════════════════════
🛑 **What would you like to do?**

- "continue" - Proceed to Stage 4: Documentation
- "skip 5" - Skip to Stage 5: Code Review
- "run tests" - Execute test suite
- "stop" - End pipeline
═══════════════════════════════════════════════════════════════
\`\`\`

### **User Continues**

\`\`\`
User: continue
\`\`\`

---

## 📚 **Stage 4: Documentation**

### **🛑 Checkpoint 4**

\`\`\`
═══════════════════════════════════════════════════════════════
🧞‍♂️ STAGE 4 COMPLETE: Documentation
═══════════════════════════════════════════════════════════════

📋 **What I Created:**
- README.md (project overview, setup, usage)
- API_REFERENCE.md (endpoints, request/response)
- DEPLOYMENT.md (local & CloudHub deployment)

📁 **Output:** project/my-existing-api/docs/

═══════════════════════════════════════════════════════════════
🛑 **What would you like to do?**

- "continue" - Proceed to Stage 5: Code Review
- "show readme" - Display README
- "stop" - End pipeline
═══════════════════════════════════════════════════════════════
\`\`\`

### **User Continues**

\`\`\`
User: continue
\`\`\`

---

## 🔍 **Stage 5: Code Review**

### **🛑 Final Delivery**

\`\`\`
═══════════════════════════════════════════════════════════════
🎉 SELECTIVE PIPELINE COMPLETE!
═══════════════════════════════════════════════════════════════

📊 **Quality Score:** 86/100 - GOOD

| Category        | Score | Max |
|-----------------|-------|-----|
| Architecture    | 21    | 25  |
| Code Quality    | 22    | 25  |
| Security        | 17    | 20  |
| Performance     | 13    | 15  |
| Testing         | 8     | 10  |
| Documentation   | 5     | 5   |

✅ **Production Readiness:** READY

💡 **Improvement Suggestions:**
1. Add API Autodiscovery for Anypoint Platform integration
2. Consider centralizing error handling
3. Add more comprehensive logging

📁 **Deliverables:**
1. ⏭️ Technical Design (SKIPPED)
2. ⏭️ MuleSoft Application (EXISTING)
3. ✅ MUnit Test Suite (82% coverage)
4. ✅ Professional Documentation
5. ✅ Quality Assessment Report

📊 **Stages Executed:** 3 of 5

═══════════════════════════════════════════════════════════════
🧞‍♂️ Your selective pipeline wish has been GRANTED! ✨

What would you like to do next?
- "improve" - Address quality suggestions
- "done" - Complete this pipeline
═══════════════════════════════════════════════════════════════
\`\`\`

---

## 🎯 **Skip Patterns Demonstrated**

### **Available Skip Patterns**

| From | To | Use Case |
|------|-----|----------|
| Stage 1 | Stage 3 | Existing app, need tests |
| Stage 2 | Stage 4 | Skip testing, focus on docs |
| Stage 3 | Stage 5 | Skip docs, go to review |
| Any | Stage 5 | Just need code review |

### **How to Skip**

\`\`\`
User: "skip 3" - Skip to Stage 3
User: "skip 5" - Skip to Stage 5
User: "start from 4" - Start pipeline at Stage 4
\`\`\`

---

## 🎯 **Key Takeaways**

1. **Flexible Entry** - Start from any stage with existing artifacts
2. **Skip Options** - Skip stages at any checkpoint
3. **Path Validation** - Confirm application path before starting
4. **Clear Tracking** - Shows which stages were skipped vs executed
5. **Complete Delivery** - Summary shows all deliverables regardless of path

---

🧞‍♂️ **Selective Execution - Use What You Have, Build What You Need!** ✨
