# Production Learnings - DataWeave Agent

**Last Updated**: 2026-04-04  
**Author**: Cheppali Shaik Sohail

---

## ✅ Critical Learnings Summary

| # | Learning | Impact | Solution |
|---|----------|--------|----------|
| 1 | Module Import/Export Pattern | Blocked execution | Match import pattern to export type |
| 2 | Async/Await Hanging | Process hangs | Add `async` declaration + `process.exit(0)` |
| 3 | CLI Execution Block Missing | Process hangs | Add `if (require.main === module)` handler |
| 4 | Safe Defaults Strategy | Runtime crashes | Natural null for display, safe defaults for arithmetic |
| 5 | Unnecessary Default Null | Code bloat | Use natural DataWeave null behavior |
| 6 | Binary vs Text Files | Unnecessary conversions | Convert binary only (Excel) |
| 7 | MuleSoft Runtime Safety | Production failures | Comprehensive input validation + try-catch |

---

## 🚨 Learning Details

### #1: Module Import/Export Pattern
**Problem**: `PreValidationPipeline is not a constructor`

```javascript
// ❌ BAD: Destructuring import for default export
const { PreValidationPipeline } = require('../processors/03-01-10_Pre_Validation.js');

// ✅ GOOD: Direct import for default export
const PreValidationPipeline = require('../processors/03-01-10_Pre_Validation.js');
```

### #2: Async/Await Hanging
**Problem**: Command hangs indefinitely

```javascript
// ❌ BAD: Missing async
function parseDataFile(filePath) {
    return handleExcelFile(filePath);  // Returns Promise, not awaited
}

// ✅ GOOD: Proper async/await
async function parseDataFile(filePath) {
    return await handleExcelFile(filePath);
}
```

### #3: CLI Execution Block
**Problem**: Script exports functions but never executes them

```javascript
// ✅ GOOD: Add CLI handler
if (require.main === module) {
    (async () => {
        const result = await validateScript(process.argv[2]);
        console.log(result.report);
        process.exit(result.success ? 0 : 1);
    })();
}
```

### #4: Safe Defaults Strategy
**Problem**: `default null` causes arithmetic crashes

```dataweave
// ❌ BAD: null in arithmetic
var price = item.price as Number default null
var total = price * quantity  // null * 5 = CRASH

// ✅ GOOD: Context-aware defaults
// Display fields: natural null
customerName: customer.name  // Natural null when missing

// Arithmetic fields: safe defaults
var price = item.price as Number default 0
var total = price * quantity  // 0 * 5 = 0 (safe)
```

### #5: File Processing Strategy
**Problem**: Converting text files unnecessarily

| File Type | Cursor Readable? | Action |
|-----------|------------------|--------|
| Excel (.xlsx) | ❌ Binary | Convert to JSON+CSV |
| XML, JSON, CSV | ✅ Text | Use directly |

---

## 📋 Integration Status

| Learning | Target Rule |
|----------|-------------|
| DataWeave functions | `03-01-01_Functions_Reference.mdc` |
| XML processing | `03-01-02_XML_Processing.mdc` |
| Error troubleshooting | `03-01-03_Error_Troubleshooting.mdc` |
| Quality & security | `03-01-05_Quality_Security.mdc` |
| Performance | `03-01-08_Performance_Optimization.mdc` |

---

## 🆕 Pending Integration

*No new learnings pending.*

> **V2.1 Integration (2026-04-04)**: LLM behavioral gap countermeasures integrated across all rule files — `<thinking>` blocks, Confidence Calibration, RGV, Evidence-Bound, Tree of Thought, Few-Shot, Constitutional Principles, Anti-Autopilot, Contradiction Handling, Graceful Degradation, Input Sanitization.

---

## Quick Template

```markdown
### #{N}. {Title} 🆕 [Pending - YYYY-MM-DD]

**Problem**: {1-2 lines}
**Solution**: {1 line}

{BAD vs GOOD example}

**Impact**: {High/Medium/Low}
```

---

🧞‍♂️ *R-GENIE: Capture → Validate → Integrate*
