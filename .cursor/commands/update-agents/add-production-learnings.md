# Add Production Learnings

Capture reusable insights from conversation and append to agent's `XX_Production_Learnings.md`.

> **This workflow CAPTURES only.** Use `/integrate-production-learnings` to move into rule files.

---

## Agent Mapping

| Agent | File |
|-------|------|
| `00_Master_Orchestrator_System` | `00_Production_Learnings.md` |
| `01_Technical_Design_Agent` | `01_Production_Learnings.md` |
| `02_API_Specification_Agent` | `02_Production_Learnings.md` |
| `03_App_Development_Agent` | `03_Production_Learnings.md` |
| `03-01_Dataweave_Agent` | `03-01_Production_Learnings.md` |
| `04_Munit_Agent` | `04_Production_Learnings.md` |
| `05_ReadMe_Agent` | `05_Production_Learnings.md` |
| `06_Code_Review_Agent` | `06_Production_Learnings.md` |
| `07_Error_Analysis_Agent` | `07_Production_Learnings.md` |

---

## Steps

### 1. Analyze Conversation

Extract **reusable** insights:
- Error patterns + fixes (with error message)
- Best practices discovered
- Edge cases worth documenting

**Exclude**: Project-specific details, temporary workarounds, obvious patterns.

### 2. Confirm ⛔ MANDATORY STOP

```
📋 LEARNINGS FOUND

1. **{Title}**: {One-line summary}
2. **{Title}**: {One-line summary}

✅ approve | ❌ reject | ✏️ modify
```

**Wait for approval.**

### 3. Append (After Approval)

Add to `## 🆕 PENDING INTEGRATION`:

```markdown
### {#}. {Title} 🆕 [Pending - YYYY-MM-DD]

**Problem**: {1-2 lines}
**Solution**: {1 line}

```language
❌ BAD:
{minimal failing example}

✅ GOOD:
{minimal working example}
```

**Impact**: {High/Medium/Low} - {reason}
```

### 4. Report

```
✅ Added "{title}" to `r-genie/{agent}/XX_Production_Learnings.md`
```

---

🧞‍♂️ **R-GENIE: Learning Capture**
