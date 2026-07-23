# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **MuleSoft 4 application** that automates timesheet processing using **SharePoint integration** and **MuleSoft IDP (Intelligent Document Processing)**. The application:

1. Polls SharePoint for PDF files in an Inbound folder (scheduler-based)
2. Submits each PDF to MuleSoft IDP for extraction
3. Asynchronously polls IDP for completion using a persistent VM queue
4. Flattens extracted data to CSV and writes results back to SharePoint

**Runtime**: Mule 4.11.0 | **Java**: 17 | **Type**: Process API (Business Object layer)

## Architecture

### Flow Orchestration

The application uses a **two-flow async pattern**:

- **`scheduler-sharepoint-ingest-flow`** (`idp-ingest-flow.xml`) - Scheduled ingest that moves files `Inbound → Processing`, submits to IDP, and publishes tracking messages to a VM queue
- **`subscriber-vm-idp-result-flow`** (`idp-subscriber-flow.xml`) - VM consumer that polls IDP for results, handles state transitions (`SUCCEEDED`/`FAILED`/pending), and moves files to final destinations (`Output`/`Processed`/`Error`)

### SharePoint Folder Structure

Files flow through 5 folders in `Shared Documents/Manual Uploads/`:
- **Inbound** - Drop zone for raw PDFs
- **Processing** - Active files being processed (in-flight isolation)
- **Output** - CSV results (IDP extraction output)
- **Processed** - Archived source files (success)
- **Error** - Failed files (timeout, IDP failure, or processing errors)

### Key Components

- **IDP Connector** (`idp-timesheet-130`) - Custom connector for MuleSoft IDP action (version 1.3.0)
- **SharePoint Connector** - OAuth2 client credentials flow, file operations via server-relative URLs
- **VM Queue** - Persistent queue (`idp-timesheet-queue`) for async execution tracking
- **Groovy Scripting** - Sleep-based throttling in the poll loop (30s default via `vm.poll.sleepMillis`)

### Error Handling

- **Poison-pill deflection**: Per-file errors in the ingest flow use `on-error-continue` to prevent batch abort
- **Timeout protection**: Poll count tracked per execution; files moved to Error after `idp.action.max_checks` (default 20)
- **Best-effort recovery**: Failed file moves are wrapped in try/catch to avoid error handler recursion

## Directory Structure

```
src/main/
├── mule/
│   ├── api.xml                           # APIkit router + health check endpoints
│   ├── config/global.xml                 # All connector configs + property loading
│   ├── common/common.xml                 # Reusable error handling (imported)
│   └── implementation/
│       ├── idp-ingest-flow.xml           # Scheduler + IDP submit flow
│       ├── idp-subscriber-flow.xml       # VM consumer + IDP poll flow
│       └── skg-sharepoint-example.xml    # Example/template flow
└── resources/
    ├── properties/
    │   ├── common-properties.yaml        # Environment-independent properties
    │   ├── {env}-properties.yaml         # Per-environment config (dev/test/preprod/prod)
    │   └── secure/
    │       └── {env}-secure-properties.yaml  # Encrypted credentials
    ├── dw/
    │   └── idp-result-to-csv.dwl         # DataWeave transform for IDP JSON → CSV flattening
    └── api/                              # RAML specification (pulled from Exchange)
```

## Development Commands

### Build & Package
```bash
mvn clean package              # Build deployable JAR
mvn clean install             # Install to local Maven repo
```

### Run Locally
```bash
# In Anypoint Studio: Right-click project → Run As → Mule Application

# Set runtime properties via VM args or Run Configuration:
-Dmule.env=dev
-Dmule.secure.key=<encryption-key>
```

### Testing
```bash
# No MUnit tests defined yet
# Health checks available at:
curl http://localhost:8081/api/v1/health-check/liveliness-probe
curl http://localhost:8081/api/v1/health-check/readiness-probe
```

### Deployment
```bash
# Deploy to CloudHub via Anypoint Platform UI or CLI
# Runtime properties must include:
# - mule.env (dev/test/preprod/prod)
# - mule.secure.key (for decrypting secure properties)
```

## Configuration Management

### Property Resolution Order
1. `common-properties.yaml` (shared across all environments)
2. `${mule.env}-properties.yaml` (environment-specific)
3. `secure/${mule.env}-secure-properties.yaml` (encrypted via secure properties module)

### Critical Properties

**IDP Configuration** (`dev-properties.yaml`):
```yaml
idp:
  host: "idp-rt.eu-central-1.eu1.anypoint.mulesoft.com"
  protocol: "HTTPS"
  action.max_checks: "20"  # Poll timeout threshold
```

**SharePoint Paths** - All relative to `Shared Documents/Manual Uploads/`

**VM Queue** - Name: `idp-timesheet-queue`, Poll interval: `30000ms`

**Scheduler** - Cron: `0 0 0/1 * * ?` (hourly on the hour)

## Working with DataWeave

### Location
All DataWeave modules and transforms live in `src/main/resources/dw/`

### Key Transform
- **`idp-result-to-csv.dwl`** - Flattens nested IDP JSON response (`timeSheetData` array) into CSV rows with headers

### Best Practices
- Use external `.dwl` files for complex transformations (keep XML readable)
- Reference via `<ee:set-payload resource="dw/filename.dwl" />`
- Test transforms in Anypoint Studio's DataWeave playground before embedding

## Dependencies

### Custom/Internal Artifacts (from Exchange)
- `skg-common-parent-pom` (v1.0.1) - Parent POM with shared plugin configs
- `skg-idp-automation-template-papi` (v1.0.0) - RAML API specification
- `skg-health-check-app` - Reusable health check flows
- `skg-common-error-handling` - Centralized error handler templates
- `skg-dw-library-log-mapper` / `skg-dw-library-error-mapper` - DataWeave utility modules

### External Connectors
- **HTTP Connector** (v1.11.1)
- **SharePoint Connector** (v3.9.0) - OAuth2 + file operations
- **VM Connector** (v2.0.1) - Persistent queues
- **APIkit** (v1.11.11) - RAML-driven routing
- **Scripting Module** (v2.0.0) - Groovy for sleep/throttle logic
- **Secure Properties Module** - AES-encrypted property values

### Repository Configuration
All dependencies resolve via:
- **Anypoint Exchange**: `https://maven.eu1.anypoint.mulesoft.com/api/v3/maven`
- **MuleSoft Releases**: `https://repository.mulesoft.org/nexus/repository/releases/`

## R-GENIE Integration

This project includes **R-GENIE** (Rapid Generation Engineering for Intelligent Environments) - a Cursor-based AI agent framework for MuleSoft development located in `./r-genie/`. 

### Available Agents
- `00_Master_Orchestrator_System` - Coordinates all 5 development stages
- `01_Technical_Design_Agent` - Architecture and design decisions
- `02_API_Specification_Agent` - RAML/OAS generation
- `03_App_Development_Agent` - Flow implementation
- `03-01_Dataweave_Agent` - DataWeave transformation specialist
- `04_Munit_Agent` - Unit test generation
- `05_ReadMe_Agent` - Documentation generation
- `06_Code_Review_Agent` - Code quality analysis
- `07_Error_Analysis_Agent` - Error diagnosis and fixes

### Using R-GENIE with Claude Code
R-GENIE is designed for Cursor IDE. When working in Claude Code:
- Treat R-GENIE agent markdown files as **reference documentation** for MuleSoft patterns
- Agent rules and examples can inform code generation but don't execute the multi-agent orchestration
- For specific guidance, read relevant agent files (e.g., `r-genie/03-01_Dataweave_Agent/RULES.md` for DataWeave patterns)

## Common Tasks

### Adding a New Flow
1. Create XML in `src/main/mule/implementation/`
2. Define reusable sub-flows in `src/main/mule/common/` if needed
3. Add connector configs to `global.xml` if introducing new connections
4. Update properties files for any new configuration values
5. Reference error handler: `<error-handler ref="common-error-handling" />`

### Modifying IDP Integration
- IDP connector config: `global.xml` → `IDP___Timesheet___1_3_0_Config`
- Submit endpoint: `idp-timesheet-130:postdocumentactionexecution`
- Poll endpoint: `idp-timesheet-130:getdocumentactionexecution`
- Action metadata controlled by `idp.action.id` and `idp.action.version` properties

### Debugging VM Queue Issues
- Queue persistence configured in `global.xml` → `VM_Config`
- Message structure: `{executionId, fileName, processingUrl, pollCount}`
- Monitor via Anypoint Studio debugger breakpoints in `subscriber-vm-idp-result-flow`
- Poll throttle controlled by `vm.poll.sleepMillis` property

### Updating SharePoint Paths
1. Edit environment-specific properties file (e.g., `dev-properties.yaml`)
2. All paths are **relative** to `sharepoint.site.serverRelativePath`
3. File operations use **absolute server-relative URLs** constructed via property interpolation
4. OAuth config hardcoded in `global.xml` (client ID, tenant ID, key store)

## Code Conventions

### Logging
- Use custom log mapper: `CustomLogMapper::logger()` (imported from DataWeave library)
- Log format includes: `correlationId`, `status`, `message`, `payload` (DEBUG only)
- Prefix log messages by flow context: `[IDP-INGEST]`, `[IDP-SUBSCRIBER]`

### Variable Naming
- Execution tracking: `executionId`, `fileName`, `processingUrl`, `pollCount`
- File operations: `sourceUrl`, `processingUrl`, `outputBaseName`
- Correlation: `correlationId` (set from header `x-correlation-id` or auto-generated)

### Error Messages
- Include context: operation, file name, execution ID
- Use `error.description` for root cause details
- Severity levels: `ERROR` for failures, `WARN` for non-critical issues, `DEBUG` for requeue events

### Document IDs
All MuleSoft components have unique `doc:id` attributes following pattern:
- `a1000001-XXXX-4001-8001-<flow-specific-suffix>` (ingest flow)
- `b2000001-XXXX-4002-8002-<flow-specific-suffix>` (subscriber flow)

## Important Notes

- **Server-relative URLs**: SharePoint connector requires absolute paths from site root (e.g., `/sites/MulesoftProjectSite/Shared Documents/...`)
- **File isolation**: Moving files to Processing before IDP submission prevents duplicate processing on scheduler retries
- **Single consumer**: VM queue configured with `numberOfConsumers="1"` for ordered, single-replica processing
- **Sleep in Groovy**: Throttling uses `sleep()` via scripting module instead of scheduler delays (VM listener doesn't support built-in delays)
- **Flag parameter**: `flag="1"` in SharePoint file-move operations enables overwrite behavior
