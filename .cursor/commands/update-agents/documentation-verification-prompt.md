# 📋 Documentation Standards & Verification

Enforce documentation standards and verify R-GENIE documentation quality.

---

## Usage

```
@documentation-verification-prompt.md [DOCUMENTATION_FILE_PATH]
```

**Examples:**
```
@documentation-verification-prompt.md r-genie/03_App_Development_Agent/README.md
@documentation-verification-prompt.md r-genie/04_Munit_Agent/ARCHITECTURE.md
```

**If no path provided:** Verify all agent README.md and ARCHITECTURE.md files.

---

# 📐 DOCUMENTATION STANDARDS

These standards **MUST** be enforced in all R-GENIE documentation.

---

## 1. NO NUMERIC COUNTS ❌

**Problem:** Numeric counts become outdated and require constant maintenance.

**Forbidden Patterns:**
```markdown
❌ "15 specialized tools"
❌ "45+ error patterns"
❌ "135+ function library"
❌ "50+ patterns"
❌ "8 error fixes"
```

**Correct Patterns:**
```markdown
✅ "Specialized tools"
✅ "Error patterns"
✅ "Function library"
✅ "Error fixes"
```

**Exception:** Phase counts (e.g., "6-Phase Pipeline") are acceptable when they define workflow structure.

---

## 2. CONCISE EXPLANATIONS 📝

**Problem:** Verbose documentation is hard to maintain and read.

**Rules:**
- **One sentence per concept** - If it needs more, use bullet points
- **Tables over paragraphs** - For comparisons, features, references
- **No redundant phrases** - Cut filler words

**Forbidden Patterns:**
```markdown
❌ "This agent is designed to provide comprehensive..."
❌ "The system has the capability to..."
❌ "It should be noted that..."
```

**Correct Patterns:**
```markdown
✅ "Generates production-ready MuleSoft applications."
✅ "Supports template-driven generation."
```

---

## 3. NO REDUNDANT CONTENT 🔄

**Problem:** Same information in multiple places leads to inconsistency.

**Rules:**
- **Single source of truth** - Define once, reference elsewhere
- **README.md** - High-level overview, quick start, usage
- **ARCHITECTURE.md** - Technical details, workflow steps, flow diagrams
- **No duplication** - If content exists in one file, don't repeat in another

**Structure:**
| File | Content |
|------|---------|
| `README.md` | Overview, capabilities, quick start, usage examples |
| `ARCHITECTURE.md` | Workflow steps, flow diagram, technical details |
| `rules/INDEX.md` | Rule file navigation only |

---

## 4. CONSISTENT STRUCTURE 🏗️

**All agent documentation MUST follow this structure:**

### README.md Structure:
```markdown
# Agent Name
**Author:** | **Version:** | **Purpose:**

## Overview (1-2 sentences)
## Key Capabilities (table format)
## Quick Start
## System Structure (directory tree)
## Usage Examples
## Related Systems
```

### ARCHITECTURE.md Structure:
```markdown
# Agent Name - Architecture
**Author:**

## Overview (1 paragraph max)
## Workflow Steps (What/How/Why for each phase)
## Flow Diagram (Mermaid stateDiagram-v2)
```

---

## 5. ACCURATE CLAIMS ✅

**Problem:** Feature claims become outdated.

**Rules:**
- **Verify before documenting** - Check actual files/directories
- **No aspirational content** - Only document what exists
- **Cross-reference consistency** - Same claim must match across all files

**Verification Required:**
- Rule file counts match actual `rules/` directory
- Tool/script counts match actual `lib/` directory
- Phase counts match actual workflow implementation
- File paths exist in workspace

---

## 6. NO HARDCODED PATHS �️

**Problem:** Absolute paths break across environments.

**Forbidden:**
```markdown
❌ /Users/username/project/...
❌ C:\Users\...
```

**Correct:**
```markdown
✅ project/input_03_app/
✅ r-genie/03_App_Development_Agent/
```

---

# 🔍 VERIFICATION PROCESS

When invoked with a documentation file, execute these steps:

---

## PHASE 1: READ & ANALYZE

1. **Read the target file completely**
2. **Identify violations** of each standard above
3. **List all issues** with line numbers

---

## PHASE 2: VERIFY CLAIMS

For each claim in the documentation:

### 2.1 Rule File Claims
```bash
# Verify rule file count
ls -la r-genie/{AGENT}/rules/*.mdc | wc -l
```
- Compare claimed count vs actual
- Check if Template_Configuration.mdc exists (5-file vs 4-file)

### 2.2 Directory Structure Claims
- Verify `lib/`, `examples/`, `templates/` directories exist
- Count actual files/subdirectories
- Compare with documentation claims

### 2.3 Phase/Workflow Claims
- Read main rule file (e.g., `03_App_Development.mdc`)
- Count actual phases defined
- Compare with README/ARCHITECTURE claims

### 2.4 Cross-File Consistency
- Compare README.md claims with ARCHITECTURE.md
- Ensure phase counts, capabilities match
- Flag any inconsistencies

---

## PHASE 3: APPLY FIXES

### Priority Order:
1. **Critical** - Inaccurate claims, broken paths
2. **Major** - Numeric counts, redundant content
3. **Minor** - Formatting, conciseness

### Fix Rules:
- Use exact string replacement
- Preserve markdown formatting
- Remove numeric counts entirely (don't just update numbers)
- Consolidate redundant content (keep in appropriate file only)

---

## PHASE 4: VALIDATE

1. **Re-read fixed file**
2. **Confirm all standards met**
3. **Generate summary report**

---

# 📊 VERIFICATION REPORT

```
═══════════════════════════════════════════════════════════════
📋 DOCUMENTATION VERIFICATION COMPLETE
═══════════════════════════════════════════════════════════════

📄 File: [file path]

STANDARDS CHECK:
├─ No Numeric Counts:     [✅ PASS / ❌ FAIL - X violations]
├─ Concise Explanations:  [✅ PASS / ❌ FAIL - X violations]
├─ No Redundant Content:  [✅ PASS / ❌ FAIL - X violations]
├─ Consistent Structure:  [✅ PASS / ❌ FAIL - X violations]
├─ Accurate Claims:       [✅ PASS / ❌ FAIL - X violations]
└─ No Hardcoded Paths:    [✅ PASS / ❌ FAIL - X violations]

FIXES APPLIED: [count]
├─ [description of fix 1]
├─ [description of fix 2]
└─ [description of fix N]

STATUS: [✅ COMPLIANT / ⚠️ FIXED / ❌ ISSUES REMAIN]
═══════════════════════════════════════════════════════════════
```

---

# 🎯 QUICK REFERENCE

## What to Check

| Standard | Grep Pattern | Action |
|----------|--------------|--------|
| Numeric counts | `\d+ tools\|\d+ patterns\|\d+\+ function` | Remove numbers |
| Verbose phrases | `"designed to"\|"capability to"\|"should be noted"` | Simplify |
| Duplicate content | Compare README vs ARCHITECTURE | Consolidate |
| Broken paths | File path references | Verify exist |
| Outdated claims | Feature counts, phase counts | Verify against code |

## Common Fixes

| Issue | Before | After |
|-------|--------|-------|
| Numeric count | "15 specialized tools" | "Specialized tools" |
| Verbose | "This agent is designed to generate..." | "Generates..." |
| Duplicate | Same content in README and ARCHITECTURE | Keep in one, reference other |
| Wrong phase count | "5-Phase Pipeline" (but 6 phases exist) | "6-Phase Pipeline" |

---

**🧞‍♂️ R-GENIE: Clean, accurate, maintainable documentation!**
