# Boomi Documentation - Template Configuration Reference

**Purpose**: Supporting document format specifications for Boomi documentation output.  
**Author**: Cheppali Shaik Sohail  
**Version**: 4.0.0  
**Referenced by**: `rules/00_Phase_Orchestration.mdc`

---

## REQUIRED OUTPUT FILES

All files MUST be created inside `project/output_boomi/{flow_number}/`:

| # | File | Phase | Template Reference |
|---|------|-------|--------------------|
| 1 | `boomi_design_{flow_name}.md` | 0-5 | `examples/01_pricing_sync/01_pricing_sync_technical_design.md` |
| 2 | `supporting-docs/component-inventory.md` | 0 | `examples/01_pricing_sync/supporting-docs/component-inventory.md` |
| 3 | `supporting-docs/shape-configuration.md` | 1 | `examples/01_pricing_sync/supporting-docs/shape-configuration.md` |
| 4 | `supporting-docs/function-reference.md` | 3 | `examples/01_pricing_sync/supporting-docs/function-reference.md` |
| 5 | `supporting-docs/profile-structures.md` | 3 | `examples/01_pricing_sync/supporting-docs/profile-structures.md` |
| 6 | `supporting-docs/connector-settings.md` | 4 | `examples/01_pricing_sync/supporting-docs/connector-settings.md` |
| 7 | `supporting-docs/verification-checklist.md` | 5 | `examples/01_pricing_sync/supporting-docs/verification-checklist.md` |
| 8 | `.boomi-state.json` | 0-5 | JSON state tracking (6 phases) |

---

## MAIN DOCUMENT SECTION ORDER

### Header Format

```markdown
# {Process Name} - Boomi Technical Design

**Project:** {flow_name}  
**Process ID:** `{componentId}`  
**Processing:** Event-driven (Solace listener)  
**Source File:** `{uuid}.xml`  
**Generated:** {date}
```

### Section Structure

1. **Section 1: Overview** — 1.1 Process Description, 1.2 Integration Scope, 1.3 Component Inventory (reference)
2. **Section 2: Architecture** — 2.1 System Interaction Diagram (`graph TB`), 2.2 Process Hierarchy
3. **Section 3: Flow Documentation** — Per process: Flow Diagram, Sequence Diagram, Step-by-Step Execution, Shape Config (reference)
4. **Section 4: Data Mappings** — Per map: Field Mappings (ALL rows), Transformation Functions (reference), Default Values
5. **Section 5: Connector Settings** — Reference to supporting doc only
6. **Section 6: Gap Analysis** — Components referenced but NOT in export
7. **Section 7: Validation** — Reference to verification checklist only

---

## REFERENCE FORMAT

```markdown
> **{icon} {title}:** See [`supporting-docs/{file}`](supporting-docs/{file}) for {description}.
```

| Icon | Document |
|------|----------|
| 📦 | component-inventory.md |
| 📄 | shape-configuration.md, profile-structures.md |
| 📚 | function-reference.md |
| 🔌 | connector-settings.md |
| 📋 | verification-checklist.md |

---

## SUPPORTING DOCUMENT FORMATS

### component-inventory.md

```markdown
# {Process Name} - Component Inventory

**Referenced from:** `../boomi_design_{flow_name}.md` Section 1.3  
**Generated:** {date}

## Component Inventory

| # | File | Type | Name | ID | Elements |
|---|------|------|------|----|----------|

**Component Summary:**
- **Processes:** {n} (total shapes: {n})
- **Maps:** {n} (total mappings: {n})
- **Functions:** {n}
- **Connectors:** {n}
- **Operations:** {n}
- **Cross References:** {n}
- **Profiles:** {n}
```

### function-reference.md

```markdown
# {Process Name} - Function Reference

**Referenced from:** `../boomi_design_{flow_name}.md` Section 4  
**Generated:** {date}

### Function: {Function Name} (Key: {n})

**Function ID:** `{uuid}`  
**Type:** User Defined Function  
**Description:** {from bns:description}

**Inputs:**
| Key | Name | Source |
|-----|------|--------|

**Outputs:**
| Key | Name | Target |
|-----|------|--------|

**Function Steps:**
| Step | Type | Name | Configuration |
|------|------|------|---------------|

**Logic:** {description}
```

### profile-structures.md

```markdown
# {Process Name} - Profile Structures

**Referenced from:** `../boomi_design_{flow_name}.md` Section 4  
**Generated:** {date}

### Profile: {Profile Name}

**Profile ID:** `{uuid}`  
**Type:** {JSON/XML/FlatFile}

#### Structure Tree
(code block with tree visualization)

#### Field Details
| Key | Name | Path | Data Type | Mappable |
|-----|------|------|-----------|----------|
```

### connector-settings.md

```markdown
# {Process Name} - Connector Settings

**Referenced from:** `../boomi_design_{flow_name}.md` Section 5  
**Generated:** {date}

### Connection: {Name}
**Connection ID:** `{uuid}`  
**Type:** {type}
| Setting | Value |
|---------|-------|

### Operation: {Name}
**Operation ID:** `{uuid}`  
| Setting | Value |
|---------|-------|

### Cross-Reference: {Name}
**Table ID:** `{uuid}`  
**Columns:** {n}  **Rows:** {n}
| {Col1} | {Col2} | ... |
|---------|--------|-----|
```

### verification-checklist.md

```markdown
# {Process Name} - Zero Data Loss Verification Checklist

**Referenced from:** `../boomi_design_{flow_name}.md` Section 7  
**Generated:** {date}

## Shape Count Verification

| Process | XML Shapes | Documented | Status |
|---------|-----------|------------|--------|

## Mapping Count Verification

| Map | XML Mappings | Documented | Functions | Status |
|-----|-------------|------------|-----------|--------|

## File-by-File Reconciliation

| # | XML File | Component | Type | XML Elements | Documented | Status |
|---|----------|-----------|------|--------------|------------|--------|

## Count Summary

| Category | XML Count | Documented | Status |
|----------|-----------|------------|--------|

## Configuration Completeness

| Detail Type | Documented | Status |
|-------------|------------|--------|

## Zero Data Loss Certification

✅ All {n} XML files processed  
✅ All {n} shapes documented  
✅ All {n} mappings documented  
✅ All {n} functions documented  
✅ Zero data loss verified
```

### Gap Analysis (Section 6)

```markdown
## 6. Gap Analysis

### 6.1 Missing Profiles
| # | Component ID | Type | Referenced In | Impact |
|---|--------------|------|---------------|--------|

### 6.2 Missing Operations
(same table format)

### 6.3 Missing Document Cache
(same table format)

### 6.4 Missing Process Route
(same table format)

### 6.5 Impact Summary
- Bullet list of impact descriptions
```

---

## DIAGRAM SPECIFICATIONS

| Diagram | Type | Location | Style |
|---------|------|----------|-------|
| System Interaction | `graph TB` with subgraphs | Section 2.1 | No custom colors |
| Process Flow | `flowchart TD` | Section 3.x (BEFORE steps) | No custom colors |
| Sequence | `sequenceDiagram autonumber` | Section 3.x (BEFORE steps) | No custom colors |

---

---

## MICRO-CHECKPOINT FORMAT

After completing each section via the RGV loop (`@01_Guidance.mdc §1`), emit:

```
✅ {section}: {name} — {generated}/{expected} {type}
```

Examples:
```
✅ 3.1: HNK_US_PRC_12730 — 18/18 shapes
✅ 4.1: HNK_US_MAP_JSON_XML — 22/22 mappings
✅ Profile: JSON_Response — 49/49 fields
✅ Function: UDF_ProductID — 3/3 steps
✅ CrossRef: XOMI_Lookup — 7/7 rows
```

---

**V4.0** | Template Configuration Reference | 6-Phase RGV Architecture
