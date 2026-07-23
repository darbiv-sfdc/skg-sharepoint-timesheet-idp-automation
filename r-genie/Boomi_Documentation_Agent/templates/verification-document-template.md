# {Process Name} - Extraction Verification Report

**Purpose:** Line-by-line verification that EVERY element from input XML is documented  
**Input Folder:** `{input_folder_path}`  
**Output Document:** `boomi_design_{flow_name}.md`  
**Output Location:** `project/output_boomi/{flow_number}/`  
**Verification Date:** {date}

---

## Verification Summary

| Metric | Value | Status |
|--------|-------|--------|
| **Total XML Files** | {n} | ✅ All Processed |
| **Total Elements Extracted** | {n} | ✅ All Documented |
| **Verification Status** | PASSED | ✅ |

---

## File-by-File Detailed Verification

### File 1: `{uuid}.xml`

**Component:** {component_name}  
**Type:** {component_type}  
**File Size:** {size} bytes  
**Total Lines:** {n}

#### Root Element Extraction

| XML Attribute | XML Value | Documented Location | Status |
|---------------|-----------|---------------------|--------|
| `type` | {value} | Section 1.3, Row {n} | ✅ |
| `name` | {value} | Section 1.3, Row {n} | ✅ |
| `componentId` | {value} | Section 3.{x} Header | ✅ |
| `version` | {value} | Section 3.{x} Header | ✅ |
| `folderFullPath` | {value} | [Not required] | ➖ |
| `createdBy` | {value} | [Not required] | ➖ |
| `modifiedBy` | {value} | [Not required] | ➖ |

#### Description Element

| XML Element | Content | Documented Location | Status |
|-------------|---------|---------------------|--------|
| `bns:description` | {full text} | Section 1.1 | ✅ |

#### Process-Specific Elements (if type=process)

##### Shapes Inventory

| # | Shape ID | Shape Type | User Label | Doc Section | Doc Step | Status |
|---|----------|------------|------------|-------------|----------|--------|
| 1 | shape1 | start | {label} | 3.{x}.2 | Step 1 | ✅ |
| 2 | shape2 | documentproperties | {label} | 3.{x}.2 | Step 2 | ✅ |
| 3 | shape3 | decision | {label} | 3.{x}.2 | Step 3 | ✅ |

**Shape Count Verification:**
- XML `<shape>` elements: {n}
- Documented steps: {n}
- **Match:** ✅ YES / ❌ NO

##### Per-Shape Configuration Verification

###### Shape: {shape_id} (Type: {shapetype})

**XML Configuration Elements:**
```xml
<shape shapetype="{type}" name="{id}" userlabel="{label}">
  <configuration>
    {configuration content}
  </configuration>
  <dragpoints>
    <dragpoint toShape="{next}"/>
  </dragpoints>
</shape>
```

**Extraction Checklist:**
| XML Element/Attribute | XML Value | Documented | Location | Status |
|-----------------------|-----------|------------|----------|--------|
| `@shapetype` | {value} | ✅ | 3.{x}.2, Step {n}, Type column | ✅ |
| `@userlabel` | {value} | ✅ | 3.{x}.2, Step {n}, Label column | ✅ |
| `@name` | {value} | ✅ | 3.{x}.3, Shape header | ✅ |
| `configuration/...` | {details} | ✅ | 3.{x}.3, Config table | ✅ |
| `dragpoints/dragpoint/@toShape` | {value} | ✅ | 3.{x}.2, Step {n}, Next column | ✅ |

**[For documentproperties shape]**

| Property # | Property Name | Property ID | Value Type | Source | Documented | Status |
|------------|---------------|-------------|------------|--------|------------|--------|
| 1 | {name} | {id} | {type} | {source} | 3.{x}.3 Row 1 | ✅ |
| 2 | {name} | {id} | {type} | {source} | 3.{x}.3 Row 2 | ✅ |

**XML Property Count:** {n}  
**Documented Properties:** {n}  
**Match:** ✅

**[For decision shape]**

| Decision Element | XML Value | Documented | Location | Status |
|------------------|-----------|------------|----------|--------|
| `@comparison` | {value} | ✅ | 3.{x}.3, Comparison Type | ✅ |
| `decisionvalue[1]/@valueType` | {value} | ✅ | 3.{x}.3, Left Value Type | ✅ |
| `decisionvalue[1]/trackparameter/@propertyId` | {value} | ✅ | 3.{x}.3, Left Value | ✅ |
| `decisionvalue[2]/@valueType` | {value} | ✅ | 3.{x}.3, Right Value Type | ✅ |
| `decisionvalue[2]/staticproperty` | {value} | ✅ | 3.{x}.3, Right Value | ✅ |
| `dragpoint[@identifier='true']/@toShape` | {value} | ✅ | 3.{x}.3, True Path | ✅ |
| `dragpoint[@identifier='false']/@toShape` | {value} | ✅ | 3.{x}.3, False Path | ✅ |

**[For message shape]**

| Message Element | XML Value | Documented | Location | Status |
|-----------------|-----------|------------|----------|--------|
| `msgTxt` | {full template} | ✅ | 3.{x}.3, Template block | ✅ |
| `parametervalue[@key='0']/@valueType` | {value} | ✅ | 3.{x}.3, Param table Row 1 | ✅ |
| `parametervalue[@key='0']/trackparameter/@propertyId` | {value} | ✅ | 3.{x}.3, Param table Row 1 | ✅ |
| `parametervalue[@key='1']/@valueType` | {value} | ✅ | 3.{x}.3, Param table Row 2 | ✅ |

**XML Parameter Count:** {n}  
**Documented Parameters:** {n}  
**Match:** ✅

**[For processcall shape]**

| ProcessCall Element | XML Value | Documented | Location | Status |
|---------------------|-----------|------------|----------|--------|
| `@processId` | {uuid} | ✅ | 3.{x}.3, Process ID | ✅ |
| `@abort` | {true/false} | ✅ | 3.{x}.3, Abort on Error | ✅ |
| `@wait` | {true/false} | ✅ | 3.{x}.3, Wait for Completion | ✅ |
| `returnpaths/returnpath/@returnLabel` | {labels} | ✅ | 3.{x}.3, Return Paths | ✅ |

**[For connectoraction shape]**

| ConnectorAction Element | XML Value | Documented | Location | Status |
|-------------------------|-----------|------------|----------|--------|
| `@actionType` | {value} | ✅ | 3.{x}.3, Action Type | ✅ |
| `@connectorType` | {value} | ✅ | 3.{x}.3, Connector Type | ✅ |
| `@connectionId` | {uuid} | ✅ | 3.{x}.3, Connection ID | ✅ |
| `@operationId` | {uuid} | ✅ | 3.{x}.3, Operation ID | ✅ |

---

### File {n}: `{uuid}.xml` (Map Component)

**Component:** {map_name}  
**Type:** transform.map

#### Mapping Elements Inventory

| # | From Element | From Path | To Element | To Path | Function | Doc Row | Status |
|---|--------------|-----------|------------|---------|----------|---------|--------|
| 1 | {name} | {path} | {name} | {path} | Direct | 4.{x}.3 #1 | ✅ |
| 2 | {name} | {path} | {name} | {path} | Key:{n} | 4.{x}.3 #2 | ✅ |

**XML `<Mapping>` Count:** {n}  
**Documented Field Rows:** {n}  
**Match:** ✅

#### Per-Mapping Verification

##### Mapping #1

**XML:**
```xml
<Mapping>
  <fromElement profileId="{id}" elementId="{id}" name="{name}" namePath="{path}"/>
  <toElement profileId="{id}" elementId="{id}" name="{name}" namePath="{path}"/>
</Mapping>
```

| XML Attribute | XML Value | Documented | Location | Status |
|---------------|-----------|------------|----------|--------|
| `fromElement/@name` | {value} | ✅ | 4.{x}.3, Row 1, Source Field | ✅ |
| `fromElement/@namePath` | {value} | ✅ | 4.{x}.3, Row 1, Source Path | ✅ |
| `toElement/@name` | {value} | ✅ | 4.{x}.3, Row 1, Target Field | ✅ |
| `toElement/@namePath` | {value} | ✅ | 4.{x}.3, Row 1, Target Path | ✅ |

#### Function Elements Inventory

| # | Function Key | Function Type | Inputs | Outputs | Script Lines | Doc Section | Status |
|---|--------------|---------------|--------|---------|--------------|-------------|--------|
| 1 | {key} | {type} | {n} | {n} | {n} | 4.{x}.4 | ✅ |

**XML `<FunctionStep>` Count:** {n}  
**Documented Functions:** {n}  
**Match:** ✅

#### Per-Function Verification

##### Function: {function_name} (Key: {n})

**XML:**
```xml
<FunctionStep key="{n}" name="{name}" function="{type}">
  <Inputs>
    <Input key="0" name="{name}" .../>
  </Inputs>
  <Outputs>
    <Output key="0" name="{name}" .../>
  </Outputs>
  <Script><![CDATA[{code}]]></Script>
</FunctionStep>
```

| XML Element | XML Value | Documented | Location | Status |
|-------------|-----------|------------|----------|--------|
| `@key` | {value} | ✅ | 4.{x}.4, Function header | ✅ |
| `@name` | {value} | ✅ | 4.{x}.4, Function header | ✅ |
| `@function` | {value} | ✅ | 4.{x}.4, Type | ✅ |
| `Inputs/Input[1]/@key` | {value} | ✅ | 4.{x}.4, Inputs table | ✅ |
| `Inputs/Input[1]/@name` | {value} | ✅ | 4.{x}.4, Inputs table | ✅ |
| `Outputs/Output[1]/@key` | {value} | ✅ | 4.{x}.4, Outputs table | ✅ |
| `Outputs/Output[1]/@name` | {value} | ✅ | 4.{x}.4, Outputs table | ✅ |
| `Script` (complete) | {n} lines | ✅ | 4.{x}.4, Script Code block | ✅ |

**Script Line Count:** {n}  
**Documented Script Lines:** {n}  
**Match:** ✅

---

### File {n}: `{uuid}.xml` (Cross Reference)

**Component:** {crossref_name}  
**Type:** crossref

#### Column Verification

| # | Column Name | Column Type | Documented | Location | Status |
|---|-------------|-------------|------------|----------|--------|
| 1 | {name} | {type} | ✅ | 5.{x}, Columns table | ✅ |
| 2 | {name} | {type} | ✅ | 5.{x}, Columns table | ✅ |

**XML Column Count:** {n}  
**Documented Columns:** {n}  
**Match:** ✅

#### Row Data Verification

| Row # | Col1 Value | Col2 Value | Col3 Value | Documented | Status |
|-------|------------|------------|------------|------------|--------|
| 1 | {val} | {val} | {val} | 5.{x} or external file | ✅ |
| 2 | {val} | {val} | {val} | 5.{x} or external file | ✅ |

**XML Row Count:** {n}  
**Documented Rows:** {n}  
**Match:** ✅

---

### File {n}: `{uuid}.xml` (Connector Settings)

**Component:** {connector_name}  
**Type:** connector-settings

#### Settings Verification

| # | Setting Path | XML Value | Documented | Location | Status |
|---|--------------|-----------|------------|----------|--------|
| 1 | `@url` | {value or [ENCRYPTED]} | ✅ | 5.{x}, Base URL | ✅ |
| 2 | `AuthSettings/@user` | {value} | ✅ | 5.{x}, Username | ✅ |
| 3 | `AuthSettings/@password` | [ENCRYPTED] | ✅ | 5.{x}, Password | ✅ |

**XML Setting Count:** {n}  
**Documented Settings:** {n}  
**Match:** ✅

---

### File {n}: `{uuid}.xml` (Process Property)

**Component:** {property_set_name}  
**Type:** processproperty

#### Property Verification

| # | Property Key | Property Label | Default Value | Documented | Location | Status |
|---|--------------|----------------|---------------|------------|----------|--------|
| 1 | {key} | {label} | {value} | ✅ | 5.{x}, Properties table | ✅ |
| 2 | {key} | {label} | {value} | ✅ | 5.{x}, Properties table | ✅ |

**XML Property Count:** {n}  
**Documented Properties:** {n}  
**Match:** ✅

---

## Cross-Reference Verification

### Component ID Cross-References

Verify that all component IDs referenced in shapes are documented:

| Reference Type | Referenced ID | Component Name | Documented | Location | Status |
|----------------|---------------|----------------|------------|----------|--------|
| Connection | {uuid} | {name} | ✅ | 5.{x} | ✅ |
| Operation | {uuid} | {name} | ✅ | 5.{x} | ✅ |
| Process (call) | {uuid} | {name} | ✅ | 3.{x} | ✅ |
| Map | {uuid} | {name} | ✅ | 4.{x} | ✅ |
| CrossRef Table | {uuid} | {name} | ✅ | 5.{x} | ✅ |
| Property Set | {uuid} | {name} | ✅ | 5.{x} | ✅ |

---

## Final Verification Summary

### Element Count Matrix

| File | Component | Type | XML Elements | Documented | Match |
|------|-----------|------|--------------|------------|-------|
| {file1} | {name} | process | {n} shapes | {n} | ✅ |
| {file2} | {name} | map | {n} mappings | {n} | ✅ |
| {file3} | {name} | crossref | {n} rows | {n} | ✅ |
| ... | ... | ... | ... | ... | ... |

### Configuration Completeness Matrix

| Configuration Type | XML Count | Documented | Match |
|--------------------|-----------|------------|-------|
| Document property assignments | {n} | {n} | ✅ |
| Decision shape logic | {n} | {n} | ✅ |
| Message templates | {n} | {n} | ✅ |
| Process call settings | {n} | {n} | ✅ |
| Connector action details | {n} | {n} | ✅ |
| JavaScript functions | {n} | {n} | ✅ |
| Cross-ref table rows | {n} | {n} | ✅ |

### Verification Certification

```
╔═══════════════════════════════════════════════════════════════════════════╗
║              LINE-BY-LINE EXTRACTION VERIFICATION                         ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║  INPUT FILES VERIFIED                                                     ║
║  ───────────────────                                                      ║
║  ✅ {n} XML files processed                                               ║
║  ✅ Every file verified element-by-element                                ║
║                                                                           ║
║  ELEMENT EXTRACTION VERIFIED                                              ║
║  ──────────────────────────                                               ║
║  ✅ All {n} shapes verified with configuration details                    ║
║  ✅ All {n} mappings verified with source/target paths                    ║
║  ✅ All {n} functions verified with complete code                         ║
║  ✅ All {n} connectors verified with settings                             ║
║  ✅ All {n} properties verified with values                               ║
║  ✅ All {n} cross-ref rows verified                                       ║
║                                                                           ║
║  CROSS-REFERENCES VERIFIED                                                ║
║  ────────────────────────                                                 ║
║  ✅ All component ID references resolved                                  ║
║  ✅ All external component links documented                               ║
║                                                                           ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  VERIFICATION RESULT: ✅ PASSED                                           ║
║                                                                           ║
║  Every element from every input XML file has been verified                ║
║  against the documentation. No data loss detected.                        ║
║                                                                           ║
║  A developer can recreate exact functionality from the documentation.     ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

---

**Verification Performed:** {date}  
**Verified By:** Boomi Documentation Agent V2  
**Input Folder:** `{path}`  
**Output Document:** `boomi_design_{flow_name}.md`
