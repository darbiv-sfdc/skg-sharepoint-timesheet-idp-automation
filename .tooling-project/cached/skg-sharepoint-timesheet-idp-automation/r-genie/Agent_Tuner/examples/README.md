# Agent Tuner - Examples

**Version:** 1.0.0  
**Author**: Cheppali Shaik Sohail

---

## What This Folder Contains

Examples of what a typical Agent Tuner customization session looks like for each agent type.

---

## Typical Customization Sessions

### Agent 01: Technical Design

**User provides:** Screenshot/image of their design template or a sample design document  
**Agent Tuner creates:**
1. Markdown example in `01_Technical_Design_Agent/examples/`
2. Template guide (`templates/design-template-guide.md`) built conversationally section-by-section
3. Style YAML (`templates/design-style.yaml`) auto-generated from template guide
4. Updated rules with project-specific behavioral guidance


### Agent 02: API Specification

**User provides:** Existing RAML or OpenAPI project with common traits/fragments  
**Agent Tuner creates:**
1. Example project folder in `02_API_Specification_Agent/examples/`
2. Updated Template Configuration with project-specific checklist
3. Updated Guidance with project-specific RAML/OAS patterns


### Agent 03: App Development

**User provides:** Reference MuleSoft project(s), common error handling, common components  
**Agent Tuner creates:**
1. Example project(s) in `03_App_Development_Agent/examples/` with `pattern.md`
2. Common modules in `examples/common-projects/`
3. Updated patterns index
4. Updated Guidance with project-specific patterns


### Agents 04-09

**User provides:** Example output, project-specific standards  
**Agent Tuner creates:**
1. Examples in target agent's `examples/` folder
2. Updated templates (if agent has them)
3. Updated rules with project-specific patterns


---

## Key Principles

1. **Backup first** — Every session starts with a timestamped backup
2. **Templates before rules** — Structural changes first, behavioral changes second
3. **Conversational** — Template guide built section-by-section with user input
4. **Architecture compliant** — All changes validated against `AGENT_ARCHITECTURE_STANDARD.md`
5. **Restorable** — Backup allows full rollback at any time
