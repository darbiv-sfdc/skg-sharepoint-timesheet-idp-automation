# Boomi Documentation Agent - Examples

This folder contains example output from the Boomi Documentation Agent V2.

Each example is organized in its own folder with a complete set of documentation including the main technical design document and all supporting documents.

---

## Example 1: Pricing Sync Integration (SAP to Salesforce)

**Location:** `01_pricing_sync/`

### Main Document
- `01_pricing_sync/01_pricing_sync_technical_design.md` - Main technical design document

### Supporting Documents (in `01_pricing_sync/supporting-docs/`)
- `component-inventory.md` - Complete component inventory (Section 1.3)
- `shape-configuration.md` - Detailed shape configurations (Section 3)
- `function-reference.md` - Transformation function documentation (Section 4)
- `profile-structures.md` - Profile field structures (Section 4)
- `connector-settings.md` - Connection and operation settings (Section 5)
- `verification-checklist.md` - Zero data loss verification (Section 6)

**Integration Details:**
- **Process:** HNK_ES_PRC_28360_SAP_SFDC_NetListPrices
- **Source:** SAP System (Price Data, EDM Format via APIC and Solace)
- **Target:** Salesforce (REST API Bulk API, XML)
- **Processing:** Event-driven (Solace listener)
- **Key Features:** Price book entry synchronization, bulk API operations, EDM to XML transformation

---

## Example 2: Order Acknowledgment Integration (SAP XH1 to Salesforce)

**Location:** `02_order_ack/`

### Main Document
- `02_order_ack/02_order_ack_technical_design.md` - Main technical design document

### Supporting Documents (in `02_order_ack/supporting-docs/`)
- `component-inventory.md` - Complete component inventory (Section 1.3)
- `shape-configuration.md` - Detailed shape configurations (Section 3)
- `function-reference.md` - Transformation function documentation (Section 4)
- `profile-structures.md` - Profile field structures (Section 4)
- `connector-settings.md` - Connection and operation settings (Section 5)
- `verification-checklist.md` - Zero data loss verification (Section 6)

**Integration Details:**
- **Process:** HNK_ES_PRC_28210_SAPXH1_Salesforce_OrderAck
- **Source:** SAP XH1 (Sales Order Acknowledgement XML via Solace)
- **Target:** Salesforce (REST API, JSON)
- **Processing:** Event-driven (Solace listener)
- **Key Features:** OAuth token generation, XML to JSON transformation, null value removal, XOMI framework integration

---

## Document Structure

Each example follows the modular output structure. When generating output, files are placed inside a flow-specific subfolder:

```
project/output_boomi/
└── {flow_number}/                               # Subfolder per Boomi flow (e.g., 13020)
    ├── boomi_design_{flow_name}.md        # Main document
    ├── supporting-docs/
    │   ├── component-inventory.md             # Section 1.3
    │   ├── shape-configuration.md             # Section 3
    │   ├── function-reference.md              # Section 4
    │   ├── profile-structures.md              # Section 4
    │   ├── connector-settings.md              # Section 5
    │   └── verification-checklist.md          # Section 6
    └── .boomi-state.json                      # State for resume
```

**Naming Convention:**
- **Subfolder:** `{flow_number}` — process number only (e.g., `13020`)
- **Main document:** `boomi_design_{flow_name}.md` — descriptive name (e.g., `boomi_design_13020_PRICE_LIST.md`)

The examples in this folder mirror the same structure:

## Key Style Elements

1. **Architecture Diagram**: Uses `graph TB` with layered subgraphs
2. **Flow Diagrams**: `flowchart TD` without custom colors
3. **Sequence Diagrams**: `sequenceDiagram` with autonumber
4. **Section Order**: Diagrams appear BEFORE step-by-step execution tables
5. **References**: Use blockquote format `> **📄 ...:** See [link]`
6. **No Colors**: Diagrams use default Mermaid styling

## Progressive Document Updates

The agent builds the document progressively:
- Phase 1: Sections 1-2 (Overview, Architecture)
- Phase 2: Section 3 (Flow Documentation)
- Phase 3: Sections 4-5 (Data Mappings, Connector Settings)
- Phase 4: Section 6 (Validation)

Large sections are moved to supporting documents and referenced from the main document.
