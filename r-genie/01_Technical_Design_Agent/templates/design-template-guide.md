# Technical Design Document Template Guide

**Purpose:** This guide explains what content goes in each section of a MuleSoft Technical Design Document and when to produce each section based on the `design-style.yaml` configuration.  
**Author**: Cheppali Shaik Sohail

---

## Document Structure Overview

The Technical Design Document follows a **5-section core structure** with optional **supplementary sections**:

### Core Sections (Always Generated - Phase 0-4)
1. **Project Overview** - Business context and requirements
2. **Technical Architecture** - Architecture pattern and connectors
3. **Flow Architecture** - Step-by-step flow design
4. **Field Mapping Tables** - Data transformation mappings
5. **Error Handling Strategy** - Error handling and retry patterns

### Supplementary Sections (Optional - Phase 5)
6. **Security Considerations** - Security details
7. **Performance & Monitoring** - Performance optimization and monitoring
8. **Configuration Files** - Environment-specific configs
9. **Additional Diagrams** - Extra architectural diagrams
10. **Deployment Guide** - Deployment procedures (typically excluded)

---

## Section-by-Section Guide

### 1. Project Overview
**When to Produce:** `include: true` (Always included)

**What Goes Here:**
- **1.1 Business Context**
  - Business drivers and objectives
  - Problem statement
  - Key stakeholders

- **1.2 Integration Scope**
  - Source systems and protocols
  - Target systems and protocols
  - Integration pattern (API-Led, Event-Driven, etc.)
  - Processing type (Real-time, Batch, Event-Driven)
  - Response time requirements

- **1.3 Volume and Performance Requirements**
  - Peak/average transaction volumes
  - Response time targets
  - Availability requirements
  - Resource constraints (vCore limits)

- **1.4 Key Functional Requirements**
  - Prioritized list of functional requirements (FR-01, FR-02, etc.)
  - Each requirement with ID, Priority, and Description

- **1.5 Non-Functional Requirements**
  - Performance metrics
  - Reliability requirements
  - Security requirements
  - Maintainability requirements

**Format:** Use tables for structured data (Integration Scope, Volume Requirements, Requirements lists)

---

### 2. Technical Architecture
**When to Produce:** `include: true` (Always included)

**What Goes Here:**
- **2.1 Architecture Pattern**
  - Selected pattern (System API, Process API, Experience API, Full API-Led, etc.)
  - Rationale for pattern selection
  - Layer breakdown (if multi-layer)

- **2.2 Processing Strategy**
  - Selected strategy (Real-time, Batch, Event-Driven, Hybrid)
  - Pattern details (Scatter-Gather, Publish-Subscribe, etc.)
  - Resource constraints
  - Justification for strategy choice
  - Key design decisions

- **2.3 Connector Summary**
  - Table listing all connectors used
  - Configuration details for each connector
  - Purpose of each connector

- **2.4 Connector Pattern Diagram** ⚠️ **DIAGRAM PLACEMENT**
  - **MUST be embedded here** (not in standalone section)
  - Mermaid diagram showing:
    - Connectors and their relationships
    - External systems
    - Flow between components
  - Use `graph TB` or `graph LR` format

**Format:** 
- Use tables for Connector Summary
- Use Mermaid code blocks for diagrams
- Include justification and rationale text

---

### 3. Flow Architecture
**When to Produce:** `include: true` (Always included)

**What Goes Here:**
- **3.1 Main Flow(s)**
  - Flow name
  - Step-by-step table with:
    - Step number
    - Component name
    - Action performed
    - Details/configuration
  - Multiple flows if needed (e.g., Order Creation Flow, Fulfillment Flow)

- **3.2 Error Handling Flow** (if separate from main flow)
  - Error handling flow name
  - Step-by-step error handling process

- **3.3 Processing Strategy Details** (if needed)
  - Detailed explanation of processing approach
  - Batch size, streaming details, etc.

- **3.4 Integration Sequence Diagram** ⚠️ **DIAGRAM PLACEMENT**
  - **MUST be embedded here** (not in standalone section)
  - Mermaid sequence diagram showing:
    - Participants (systems, APIs, flows)
    - Message flow between participants
    - Error paths (if applicable)
    - Timing notes
  - Use `sequenceDiagram` format with `autonumber`

**Format:**
- Use step-by-step tables for flows
- Use Mermaid sequence diagrams
- Include flow names and component details

---

### 4. Field Mapping Tables
**When to Produce:** `include: true` (Always included)

**What Goes Here:**
- **4.1 Source to Target Field Mapping**
  - Source format description
  - Target format description
  - Transformation description
  - Table with columns:
    - Source Field
    - Target Field
    - Transformation Logic
    - Validation Rules
    - Notes

- **4.2 Output File Structure** (for batch/file integrations)
  - File format details
  - Field descriptions

- **4.3 Lookup Tables** (if applicable)
  - Lookup table definitions
  - Mapping rules

- **4.4 Validation Rules**
  - Table listing validation rules
  - Error messages
  - HTTP status codes (for APIs)

**Format:**
- **CRITICAL:** NO DataWeave code in this section
- Use tables only
- Describe transformation logic in plain text
- Include validation rules and error handling

---

### 5. Error Handling Strategy
**When to Produce:** `include: true` (Always included)

**What Goes Here:**
- **5.1 Error Categories**
  - Table listing error categories:
    - Error Category
    - Error Type
    - Examples
    - Severity
    - Retry Strategy

- **5.2 Retry Patterns**
  - Table with retry configuration:
    - Error Type
    - Max Retries
    - Initial Delay
    - Backoff Strategy
    - Max Delay
  - Retry logic explanation

- **5.3 Error Notification Strategy** (if applicable)
  - Notification types
  - Recipients
  - Content templates

- **5.4 Error Handling Flow Details**
  - Global error handler description
  - Error handling approach
  - Partial failure handling

- **5.5 Error Handling Flow Diagram** ⚠️ **DIAGRAM PLACEMENT**
  - **MUST be embedded here** (not in standalone section)
  - Mermaid flowchart showing:
    - Error decision points
    - Retry logic
    - Error paths
    - Success paths
  - Use `flowchart TD` format with styling

- **5.6 Dead Letter Queue (DLQ) Strategy** (if applicable)
  - **ONLY include if DLQ is actually used**
  - DLQ configuration
  - DLQ processing procedures
  - **DO NOT include "Not Applicable" sections**

- **5.7 Error Recovery Procedures**
  - Table with recovery scenarios and actions

**Format:**
- Use tables for error categories and retry patterns
- Use Mermaid flowcharts for error handling flow
- Include detailed error handling logic

---

## Supplementary Sections (Phase 5)

### 6. Security Considerations
**When to Produce:** `include: true` in `supplementary` section

**What Goes Here:**
- Authentication mechanisms (OAuth 2.0, API Keys, etc.)
- Authorization and access control
- Data encryption (in transit, at rest)
- Secure credential management
- API security (rate limiting, OAuth scopes)

**Format:** Use subsections with detailed explanations

---

### 7. Performance & Monitoring
**When to Produce:** `include: true` in `supplementary` section

**What Goes Here:**
- Performance optimization techniques
- Connection pooling details
- Caching strategy
- Memory management
- Monitoring metrics and KPIs
- Logging strategy
- Alerting thresholds
- Health check endpoints (for APIs)

**Format:** Use subsections with metrics and strategies

---

### 8. Configuration Files
**When to Produce:** `include: true` in `supplementary` section

**What Goes Here:**
- Environment-specific YAML configuration files
- Dev, Test, Prod configurations
- Secure property placeholders
- Connection strings
- Endpoint URLs

**Format:** Use YAML code blocks with environment labels

---

### 9. Additional Diagrams
**When to Produce:** `include: true` in `supplementary` section

**What Goes Here:**
- System Architecture diagram
- Data Flow diagram
- Any other architectural diagrams not covered in core sections

**Format:** Use Mermaid diagrams

---

### 10. Deployment Guide
**When to Produce:** `include: false` (Typically excluded)

**What Goes Here:** (Only if explicitly requested)
- CloudHub configuration
- Deployment procedures
- Rollback procedures

---

## Diagram Placement Rules ⚠️

**CRITICAL:** Diagrams are **NOT** in a standalone "Essential Diagrams" section. They are embedded contextually:

1. **Connector Pattern Diagram** → Section 2.4 (Technical Architecture)
2. **Integration Sequence Diagram** → Section 3.4 (Flow Architecture)
3. **Error Handling Flow Diagram** → Section 5.5 (Error Handling Strategy)

**Rationale:** Diagrams should be near the content they illustrate for better readability.

---

## Section Inclusion Logic

### Core Sections (Phase 0-4)
- **Always generated** if `structure.sections[].include: true`
- These form the foundation of every design document
- Generated in sequence: Overview → Architecture → Flow → Mappings → Error Handling

### Supplementary Sections (Phase 5)
- **Only generated** when:
  1. User explicitly requests "all per template" OR
  2. User requests specific supplementary sections
- Check `structure.supplementary[].include` flag
- **DO NOT generate** sections where `include: false`

---

## Content Guidelines

### DO Include:
- ✅ Business context and requirements
- ✅ Technical architecture decisions with rationale
- ✅ Step-by-step flow tables
- ✅ Field mapping tables (NO code)
- ✅ Error handling strategies
- ✅ Diagrams embedded contextually
- ✅ Tables for structured data

### DO NOT Include:
- ❌ DataWeave code in Field Mapping Tables section
- ❌ Standalone "Essential Diagrams" section
- ❌ "Not Applicable" sections (e.g., DLQ when not used)
- ❌ Project management content (Next Steps, Timeline)
- ❌ Redundant sections (e.g., Business Context if already in Overview)
- ❌ Sections with `include: false` in template

---

## File Naming

**Pattern:** `{project}-technical-design.md`

**Example:** `inventory-sync-technical-design.md`

---

## Validation Checklist

Before finalizing a design document, verify:

- [ ] All sections with `include: true` are present
- [ ] No sections with `include: false` are present
- [ ] Diagrams are embedded contextually (not in standalone section)
- [ ] No DataWeave code in Field Mapping Tables
- [ ] No "Not Applicable" sections
- [ ] Section numbering is sequential
- [ ] All tables are properly formatted
- [ ] All Mermaid diagrams are valid syntax
- [ ] File name follows naming pattern

---

## Example Structure Reference

See the example design documents in `r-genie/01_Technical_Design_Agent/examples/`:
- `01_batch_file_integration_design.md` - Batch file integration pattern
- `02_real_time_api_design.md` - Real-time API pattern
- `03_event_driven_integration_design.md` - Event-driven pattern
- `04_multi_system_orchestration_design.md` - Multi-system orchestration pattern

These examples demonstrate the correct structure, formatting, and content for each section type.

