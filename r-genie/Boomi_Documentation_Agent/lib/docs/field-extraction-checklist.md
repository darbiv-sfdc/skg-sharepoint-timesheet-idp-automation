# Zero Data Loss Extraction Checklist V3.0

> **Purpose:** Ensure every element from Boomi XML is documented  
> **Principle:** Document what EXISTS, not what you ASSUME  
> **Version:** 4.0.0

---

## RGV Loop (Apply Per Section in Phases 1-4)

Defined in `@01_Guidance.mdc §1`. For EACH section:
- [ ] RE-READ relevant XML file(s) fresh
- [ ] INVENTORY: Count target elements, COMMIT to N
- [ ] GENERATE section content with exactly N items
- [ ] VERIFY: Count generated items = N
- [ ] FIX: If mismatch → RE-READ, find missing, fix
- [ ] CHECKPOINT: Emit micro-checkpoint with N/N counts

---

## Phase 0 - Discovery & Planning

### File Inventory
For EACH `.xml` file in input folder:

- [ ] Extract `componentId` from root element
- [ ] Extract `name` attribute
- [ ] Extract `type` attribute
- [ ] Extract `bns:description` if present
- [ ] Record file name → component mapping

### Component Classification
- [ ] Count: Processes (`type="process"`)
- [ ] Count: Maps (`type="transform.map"`)
- [ ] Count: Functions (`type="transform.function"`)
- [ ] Count: Connectors (`type="connector-settings"`)
- [ ] Count: Cross References (`type="crossref"`)
- [ ] Count: Process Properties (`type="processproperty"`)
- [ ] Count: Profiles (`type="profile.*"`)

### Save Counts
```
Total Files: ___
Processes: ___ (total shapes: ___)
Maps: ___ (total mappings: ___)
Connectors: ___
Cross Refs: ___ (total rows: ___)
Properties: ___
Profiles: ___
```

---

### Reading Plan (Build During Phase 0)
- [ ] List process XMLs with shape counts for Phase 1
- [ ] List map XMLs with mapping counts + related profiles/functions for Phase 2
- [ ] List profile XMLs with field counts for Phase 3
- [ ] List function XMLs with step counts for Phase 3
- [ ] List connector/operation/crossref XMLs for Phase 4

---

## Phase 1 - Flow Documentation (RGV per process)

### Per Process XML File

#### RGV: Inventory
- [ ] RE-READ process XML fresh (do NOT rely on Phase 0 context)
- [ ] Count `<shape>` elements in XML: ___
- [ ] COMMIT: "This process has ___ shapes. I will generate exactly ___ rows."

#### Per Shape Extraction
For EACH `<shape>` element:

**Base Attributes:**
- [ ] `shapetype` - Shape type
- [ ] `userlabel` - Display label
- [ ] `name` - Internal ID (e.g., shape1)

**Shape Configuration (by type):**

##### Start Shape
- [ ] `actionType` (Listen/Receive)
- [ ] `connectorType`
- [ ] `connectionId` (full UUID)
- [ ] `operationId` (full UUID)

##### Document Properties Shape
- [ ] Count of `<documentproperty>` elements
- [ ] Per property:
  - [ ] Property name
  - [ ] `propertyId`
  - [ ] `valueType` (static/crossref/track/etc.)
  - [ ] Source value/configuration

##### Decision Shape
- [ ] `comparison` type (equals/wildcard/contains)
- [ ] Left `<decisionvalue>`:
  - [ ] `valueType`
  - [ ] Value or property path
- [ ] Right `<decisionvalue>`:
  - [ ] `valueType`
  - [ ] Value or property path
- [ ] True path (`toShape` with identifier="true")
- [ ] False path (`toShape` with identifier="false")

##### Message Shape
- [ ] Full `<msgTxt>` content (EXACT text)
- [ ] Per `<parametervalue>`:
  - [ ] Parameter key ({0}, {1}, etc.)
  - [ ] `valueType`
  - [ ] Source property/value

##### Process Call Shape
- [ ] `processId` (full UUID)
- [ ] `abort` setting (true/false)
- [ ] `wait` setting (true/false)
- [ ] Per `<returnpath>`:
  - [ ] Return label
  - [ ] Target shape

##### Connector Action Shape
- [ ] `actionType` (Send/Get/Query)
- [ ] `connectorType`
- [ ] `connectionId` (full UUID)
- [ ] `operationId` (full UUID)

##### Branch Shape
- [ ] Per `<dragpoint>`:
  - [ ] Path identifier
  - [ ] Target shape

##### Try/Catch Shape
- [ ] Try path
- [ ] Catch path
- [ ] `catchAll` flag if present

##### Map Shape
- [ ] `mapId` reference

**Flow Sequence:**
- [ ] Per `<dragpoint>`:
  - [ ] `toShape` target

#### RGV: Verify
- [ ] Documented shapes: ___
- [ ] Match with COMMIT count: ✅ / ❌
- [ ] If mismatch → RE-READ, find missing, fix
- [ ] CHECKPOINT: `✅ 3.x: {name} — ___/___ shapes`

---

## Phase 2 - Mapping Documentation (RGV per map)

### Per Map XML File

#### RGV: Inventory
- [ ] RE-READ map XML fresh
- [ ] Count `<Mapping>` elements in XML: ___
- [ ] COMMIT: "This map has ___ mappings. I will generate exactly ___ rows."
- [ ] Count `<FunctionStep>` elements: ___
- [ ] RE-READ source profile XML (for source paths)
- [ ] RE-READ target profile XML (for target paths)
- [ ] RE-READ each referenced function XML

#### Per Mapping Extraction
For EACH `<Mapping>` element:

- [ ] `fromElement`:
  - [ ] `profileId`
  - [ ] `elementId`
  - [ ] `name`
  - [ ] `namePath` (full path)
- [ ] `toElement`:
  - [ ] `profileId`
  - [ ] `elementId`
  - [ ] `name`
  - [ ] `namePath` (full path)
- [ ] Function reference (if present):
  - [ ] `functionKey`

#### Per Function Extraction
For EACH `<FunctionStep>` element:

- [ ] `key` (function identifier)
- [ ] `name` (function name)
- [ ] `function` (function type)

**Inputs:**
- [ ] Per `<Input>`:
  - [ ] Input key
  - [ ] Input name
  - [ ] Source field/path

**Outputs:**
- [ ] Per `<Output>`:
  - [ ] Output key
  - [ ] Output name
  - [ ] Target field/path

**Configuration:**
- [ ] For Scripting: COMPLETE `<Script>` content
- [ ] For DateFormat: Input mask, Output mask
- [ ] For NumberFormat: Input mask, Output mask
- [ ] For Lookup: Lookup table reference

#### RGV: Verify
- [ ] Documented mappings: ___
- [ ] Match with COMMIT count: ✅ / ❌
- [ ] If mismatch → RE-READ map XML, find missing, fix
- [ ] CHECKPOINT: `✅ 4.x: {name} — ___/___ mappings`

---

## Phase 3 - Profile & Function Documentation (RGV per component)

### Per Profile XML File
- [ ] RE-READ profile XML fresh
- [ ] INVENTORY: Count `<DataElement>` fields: ___
- [ ] COMMIT: "This profile has ___ fields"
- [ ] GENERATE profile structure with ALL fields (mapped AND unmapped)
- [ ] VERIFY: Documented fields = ___ ✅ / ❌
- [ ] CHECKPOINT: `✅ Profile: {name} — ___/___ fields`

### Per Function XML File
- [ ] RE-READ function XML fresh
- [ ] INVENTORY: Count `<Step>` elements: ___, Inputs: ___, Outputs: ___
- [ ] GENERATE function documentation with complete scripts
- [ ] VERIFY: Step count matches ✅ / ❌
- [ ] CHECKPOINT: `✅ Function: {name} — ___/___ steps`

---

## Phase 4 - Connector & Cross-Ref Documentation (RGV per component)

### Per Connector/Operation
- [ ] RE-READ connector/operation XML fresh
- [ ] GENERATE settings documentation
- [ ] VERIFY: All settings captured

### Per Cross-Reference
- [ ] RE-READ crossref XML fresh
- [ ] INVENTORY: Count rows: ___
- [ ] GENERATE with ALL row data
- [ ] VERIFY: Documented rows = ___ ✅ / ❌
- [ ] CHECKPOINT: `✅ CrossRef: {name} — ___/___ rows`

---

## Phase 5 - Validation & Certification

### File-by-File Reconciliation

| # | XML File | Component | Type | XML Elements | Documented | Status |
|---|----------|-----------|------|--------------|------------|--------|
| 1 | | | | | | ☐ |
| 2 | | | | | | ☐ |
| 3 | | | | | | ☐ |

### Count Verification

| Category | XML Count | Documented | Match |
|----------|-----------|------------|-------|
| Processes | | | ☐ |
| Shapes (total) | | | ☐ |
| Maps | | | ☐ |
| Mappings (total) | | | ☐ |
| Functions | | | ☐ |
| Connectors | | | ☐ |
| Properties | | | ☐ |
| Cross Refs | | | ☐ |

### Configuration Completeness

| Detail Type | Expected | Documented | Match |
|-------------|----------|------------|-------|
| Start configs | | | ☐ |
| Decision logic | | | ☐ |
| Message templates | | | ☐ |
| Doc property assignments | | | ☐ |
| Process call settings | | | ☐ |
| Connector actions | | | ☐ |
| JavaScript code | | | ☐ |

---

## External File Triggers

| Content | Count | Threshold | Action |
|---------|-------|-----------|--------|
| Total mappings | ___ | >50 | Create `{process}-mappings.md` ☐ |
| Cross-ref rows | ___ | >20 | Create `{process}-lookup-tables.md` ☐ |
| JavaScript lines | ___ | >50 | Create `{process}-function-scripts.md` ☐ |
| Profile fields | ___ | >50 | Create `{process}-profile-structures.md` ☐ |

---

## Final Certification

```
╔═══════════════════════════════════════════════════════════════╗
║           ZERO DATA LOSS VERIFICATION                         ║
╠═══════════════════════════════════════════════════════════════╣
║  ☐ All XML files processed                                    ║
║  ☐ All shapes documented with configurations                  ║
║  ☐ All mappings documented at field level                     ║
║  ☐ All functions documented with complete code                ║
║  ☐ All connectors documented with settings                    ║
║  ☐ All properties documented with values                      ║
║  ☐ File-by-file reconciliation complete                       ║
║  ☐ External reference files created (if needed)               ║
╠═══════════════════════════════════════════════════════════════╣
║  RESULT: ☐ ZERO DATA LOSS - DOCUMENTATION COMPLETE            ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## Common Issues

| Issue | Solution |
|-------|----------|
| Shape count mismatch | Re-scan XML, find missing shapes |
| Mapping count mismatch | Check for nested mappings |
| Function not documented | May be embedded in map, extract separately |
| Missing configuration | Re-read shape XML, check `<configuration>` element |
| Cross-ref data missing | Check if separate XML file exists |

---

**Version:** 4.0.0 | 6-Phase RGV Architecture
