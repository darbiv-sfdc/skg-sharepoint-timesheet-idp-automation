# Production Learnings - Technical Design Agent

**Last Updated**: 2026-01-10  
**Author**: Cheppali Shaik Sohail

---

## ✅ INTEGRATED LEARNINGS

> Integrated into rule files

| Learning | Target File | Date |
|----------|-------------|------|
| Template-first approach | `rules/01-00_Template_Configuration.mdc` | 2026-01-02 |
| Phase workflow patterns | `rules/01-01_Phase_Orchestration.mdc` | 2026-01-02 |
| RISEN framework | `rules/01-02_Guidance.mdc` | 2026-01-02 |
| Markdown table HTML breaks | `rules/01-02_Guidance.mdc` (Section 4) | 2026-01-04 |
| Sequence diagram organization | `rules/01-02_Guidance.mdc` (Section 3) | 2026-01-04 |
| Sequence diagram placement per flow | `rules/01-02_Guidance.mdc` (Section 3) | 2026-01-10 |

---

## 🆕 PENDING INTEGRATION

### 1. Architecture Options Before Proceeding 🆕 [Pending - 2026-01-01]

**Problem**: Agent proceeds to design without presenting options. User feedback: "should present approaches with recommendation then I decide"
**Solution**: At Phase 2, MUST present options with recommendation and WAIT for approval.

```
❌ BAD: Immediately generates architecture without consent
✅ GOOD: Present 🥇 RECOMMENDED + 🥈 ALTERNATIVE options, then WAIT
```

**Impact**: HIGH - Core workflow violation

**Status**: Rules already updated (01-01, 01-02, 01-03) ✅

---

### 2. Data Sample Request Before Mapping 🆕 [Pending - 2026-01-01]

**Problem**: Agent assumes sample data sufficient without confirming.
**Solution**: At Phase 3, MANDATORY data sample confirmation request.

**Impact**: MEDIUM - Ensures accurate mappings

---

### 3. Phase 2 Stop Point Violation 🆕 [Identified - 2026-01-04]

**Problem**: When user says "proceed" after Phase 1, agent immediately generates Phase 2 architecture without presenting options first. Violates mandatory stop point rules.

**Solution**: 
- "Proceed" = Start Phase 2, NOT approve architecture
- Phase 2 MUST: Present options → "Waiting for your decision..." → STOP → Wait for "approved"
- Add explicit checklist before generating Phase 2 content

**Impact**: CRITICAL - User loses control over architecture decisions

**Status**: 🆕 Identified - See `GAPS_ANALYSIS.md` for details

---

### 4. Insufficient Conversational Checkpoints 🆕 [Identified - 2026-01-04]

**Problem**: Agent completes phases without explicit review requests. Limited back-and-forth discussion. Document updates happen silently.

**Solution**: 
- After each phase: "✅ PHASE {N} COMPLETE - Review Required"
- Show what was completed
- Request explicit review before proceeding
- More "What do you think?" moments

**Impact**: MEDIUM - User feels less engaged, less opportunity for course correction

**Status**: 🆕 Identified - See `GAPS_ANALYSIS.md` for details

---

### 5. Data Sample Confirmation Missing 🆕 [Identified - 2026-01-04]

**Problem**: Even when data file exists in input folder, agent doesn't explicitly request confirmation before creating mappings.

**Solution**: 
- Always show what data was found
- Request explicit confirmation: "Is this the correct format?"
- Wait for user response before creating mappings

**Impact**: MEDIUM - May lead to incorrect mappings if assumptions wrong

**Status**: 🆕 Identified - See `GAPS_ANALYSIS.md` for details

---

### 6. Sequence Diagram Placement Per Flow 🆕 [Pending - 2026-01-10]

**Problem**: Agent created one combined sequence diagram covering all flows in section 3.2, instead of placing individual sequence diagrams immediately after each endpoint flow table as shown in examples.

**Solution**: In Phase 2, generate separate sequence diagram for each endpoint flow and place it immediately after its corresponding flow table (not in a separate section).

```markdown
❌ BAD:
#### POST /api/v1/products - Create Product
[Flow table]
#### PUT /api/v1/products/{productId} - Update Product
[Flow table]
### 3.2 Integration Sequence Diagram
[Combined diagram for all flows]

✅ GOOD:
#### POST /api/v1/products - Create Product
[Flow table]
**Sequence Diagram:**
[POST sequence diagram]
#### PUT /api/v1/products/{productId} - Update Product
[Flow table]
**Sequence Diagram:**
[PUT sequence diagram]
```

**Impact**: MEDIUM - Affects document readability and structure compliance with template guidance

**Status**: ✅ Integrated - See `rules/01-02_Guidance.mdc` (Section 3)

---

## Quick Template

```markdown
### {#}. {Title} 🆕 [Pending - YYYY-MM-DD]

**Problem**: {1-2 lines}
**Solution**: {1 line}

{Single BAD vs GOOD example}

**Impact**: {High/Medium/Low} - {reason}
```

---

## Learning Types → Target Files

| Type | Target |
|------|--------|
| Template config | `01-00_Template_Configuration.mdc` |
| Phase workflow | `01-01_Phase_Orchestration.mdc` |
| Design patterns | `01-02_Guidance.mdc` |
| Stop points | `01-03_Mandatory_Stop_Points.mdc` |

---

## Tracking

| Date | Learning | Status | Target |
|------|----------|--------|--------|
| 2026-01-02 | Initial setup | ✅ Integrated | Multiple |
| 2026-01-01 | Architecture options | 🆕 Pending | 01-01, 01-02, 01-03 |
| 2026-01-01 | Data sample request | 🆕 Pending | 01-02 |
| 2026-01-04 | Phase 2 stop point violation | 🆕 Identified | 01-03, 01-01 |
| 2026-01-04 | Conversational checkpoints | 🆕 Identified | 01-03 |
| 2026-01-04 | Data sample confirmation | 🆕 Identified | 01-01 |
| 2026-01-04 | Markdown table HTML breaks | ✅ Integrated | 01-02 (Section 4) |
| 2026-01-04 | Sequence diagram organization | ✅ Integrated | 01-02 (Section 3), templates/ |
| 2026-01-10 | Sequence diagram placement per flow | ✅ Integrated | 01-02 (Section 3) |

---

## References

- **Rules**: `rules/INDEX.md`
- **Architecture**: `ARCHITECTURE.md`
- **Templates**: `templates/`
- **Examples**: `examples/`

---

🧞‍♂️ *R-GENIE: Capture → Validate → Integrate*

