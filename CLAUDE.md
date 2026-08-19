# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **MuleSoft 4 application** that automates timesheet processing using **SharePoint integration** and **MuleSoft IDP (Intelligent Document Processing)**. The application:

1. Polls one or more SharePoint document libraries for PDF files in an Inbound folder (scheduler-based)
2. Submits each PDF to MuleSoft IDP for extraction
3. Asynchronously polls IDP for completion using a persistent VM queue
4. Flattens extracted data to CSV and writes results back to the file's own SharePoint document library

**Runtime**: Mule 4.11.0 | **Java**: 17 (implied by the runtime; not pinned explicitly in `pom.xml`) | **Type**: Process API (Business Object layer)

## Architecture

### Flow Orchestration

The application uses a **layered async pattern** with two entry points, a per-library orchestrator, a single-library worker, and an async consumer:

- **`scheduler-sharepoint-ingest-flow`** (`api.xml`) - Scheduled flow (cron-based) that invokes `sharepoint-ingest-subflow`
- **`trigger-ingest-flow`** (`api.xml`) - HTTP-triggered flow for manual/on-demand ingestion via `/trigger-ingest`, also invokes `sharepoint-ingest-subflow`
- **`sharepoint-ingest-subflow`** (`idp-ingest-flow.xml`) - Thin orchestrator invoked by both entry points above. Reads the configured document library list (`sharepoint.libraries`), and sequentially, for each one, sets `documentLibrary` and delegates to `sharepoint-ingest-single-library-subflow` via `<flow-ref>` (Mule sub-flows have no formal parameters — setting a variable immediately before the `flow-ref` is the standard way to pass a value into the next sub-flow, since it shares the caller's variable scope)
- **`sharepoint-ingest-single-library-subflow`** (`idp-ingest-flow.xml`) - Does the actual per-library work: lists PDFs in that library's Inbound folder, moves each `Inbound → Processing`, submits to IDP, and publishes a self-describing tracking message (including that library's own output/processed/error URLs) to the VM queue
- **`subscriber-vm-idp-result-flow`** (`idp-subscriber-flow.xml`) - VM consumer that polls IDP for results, handles state transitions (`SUCCEEDED`/`FAILED`/pending), and moves files to final destinations (`Output`/`Processed`/`Error`) **using the folder URLs carried in the message**, not a global lookup — this is what prevents one library's output from ever landing in another's folders

This split exists so `api.xml` never had to change when multi-library support was added: both entry points still call a sub-flow named `sharepoint-ingest-subflow` — only what that name resolves to changed (from a single-library scan to a per-library orchestrator).

### SharePoint Document Libraries & Folder Structure

The app processes an arbitrary list of **document libraries** under one SharePoint site (e.g. `EKN`, `FLEET`), configured as a JSON array string in `sharepoint.libraries` (see Critical Properties below). Every library shares the same fixed 5-folder convention, with leaf names configured once in `sharepoint.folder.*`:

- **01-Inbound** - Drop zone for raw PDFs
- **02-Processing** - Active files being processed (in-flight isolation)
- **03-Output** - CSV results (IDP extraction output)
- **04-Processed** - Archived source files (success)
- **99-Error** - Failed files (timeout, IDP failure, or processing errors)

Folder URLs are computed at runtime as `{sharepoint.site.serverRelativePath}/{libraryName}/{folderLeaf}` and are never hardcoded per-library — adding or removing a library is a property change only (edit the `sharepoint.libraries` JSON array; no flow changes needed), provided the same 5 subfolders exist under that library in SharePoint.

### Key Components

- **IDP Connector** (`idp-timesheet-140`) - Custom connector for MuleSoft IDP action (version 1.4.0). `idp-timesheet-140` is the XML namespace prefix / Exchange asset name ("IDP - Timesheet - 1.4.0"); the actual Maven coordinates in `pom.xml` are opaque Exchange-generated UUIDs, not a literal `idp-timesheet-140` artifactId
- **SharePoint Connector** - OAuth2 client credentials flow with JKS keystore, file operations via server-relative URLs (all connection params externalized to properties)
- **VM Queue** - Persistent queue (`idp-timesheet-queue`) for async execution tracking. Tracking messages are **self-describing per library**: `{executionId, fileName, documentLibrary, processingUrl, outputPath, processedPath, errorPath, pollCount}` — the subscriber resolves every destination folder from the message payload, never from a global property, which is what makes it safe for a single consumer to process files from multiple libraries without ever mixing their outputs
- **Groovy Scripting** - Sleep-based throttling in the poll loop (30s default via `vm.poll.sleepMillis`)
- **Secure Properties Module** - Encrypts sensitive credentials (SharePoint keystore password) using `![...]` wrapper syntax

### Job Logging (SharePoint list)

`sharepoint-ingest-single-library-subflow` writes one row per document-library run to a SharePoint list (`sharepoint.jobLogList.title` = `"Mule IDP Job Logs"`, a display name kept only for reference/logging) via `write-job-log-subflow` in `idp-job-logging-flow.xml`, using the `sharepoint:list-item-create` operation.

- **`listId` must be the list's GUID (`sharepoint.jobLogList.listId`), not its title**: the SharePoint connector's metadata-lookup GETs (fields, `ListItemEntityTypeFullName`) correctly URL-encode a title's spaces as `%20`, but the actual item-creation `POST .../lists/getbytitle('...')/Items` call encodes spaces as `+` instead - SharePoint's REST API takes that literally and 404s (`List 'Mule+IDP+Job+Logs' does not exist`) for any title containing spaces. Using the GUID (`_api/web/lists(guid'...')/Items`) sidesteps the encoding mismatch entirely. Get the GUID from the list's *List settings* page URL (`List=%7B<guid>%7D`) in the browser.
- **Every column value must be sent as the exact EDM type the SharePoint column expects**, or the create call fails with `400 InvalidClientQueryException: Cannot convert a primitive value to the expected type 'Edm.X'`:
  - `ExecutionTime` must be cast with `as String {format: ...}` (same as `Title`) - leaving it as a bare DataWeave `now()` passes a raw `java.time.ZonedDateTime` through `output application/java`, which the connector's Jackson mapper can't serialize (`jackson-datatype-jsr310` not registered) - fails before the HTTP call is even made.
  - `FilesProcessed`/`ErrorCount` must be cast `as String` - these list columns are "Single line of text", not Number, so sending the raw DataWeave numbers from `sizeOf(...)` trips the `Edm.String` conversion error above, this time from SharePoint itself (after the HTTP call is made).
- **Columns**: `Title` (`<documentLibrary>_<yyyy-MM-ddTHH:mm:ss>`), `ExecutionTime`, `SourceFolder` (documentLibrary), `ExecutionType` (`Scheduled`/`Manual`), `FilesProcessed`, `ErrorCount`, `Status` (`Success`/`Partial Success`/`Failed`), `Details` (file names / error messages)
- **`ExecutionType`** is set once, per entry point, in `api.xml` (`trigger-ingest-flow` → `"Manual"`, `scheduler-sharepoint-ingest-flow` → `"Scheduled"`) before the `flow-ref` into `sharepoint-ingest-subflow`, and carried through the whole call chain via shared sub-flow variable scope (same mechanism as `documentLibrary`)
- **Counts are derived from two vars reset at the top of `sharepoint-ingest-single-library-subflow` each run**: `vars.processedFiles` (array, appended on each successful per-file submission) and `vars.errorDetails` (array of `"<fileName> (<error>)"`, appended in the existing per-file `on-error-continue`) - `FilesProcessed`/`ErrorCount` are `sizeOf(...)` of these, not separate counters, so they can never drift out of sync with the arrays used to build `Details`
- **Library-level failures** (e.g. the Inbound folder listing itself throws, before any per-file work starts) are caught by an outer `try`/`on-error-continue` (`"Isolate Library-Level Errors"`) wrapping the whole body of `sharepoint-ingest-single-library-subflow`, which sets `vars.libraryStatus='Failed'` + `vars.libraryFailureReason` - this both logs a `Failed` row for that library **and** stops that failure from propagating up into `sharepoint-ingest-subflow`'s outer `foreach`, so other libraries still get processed. `write-job-log-subflow` always runs exactly once at the end of the sub-flow, using `vars.libraryStatus` if the outer handler set it, otherwise computing status from the processed/error counts.
- **Zero files in Inbound** still produces a row (`FilesProcessed=0`, `ErrorCount=0`, `Status=Success`, `Details="No files found"`) - this is a deliberate heartbeat, not a bug
- **Important limitation**: this log reflects IDP **submission** outcomes only - i.e. files successfully moved/read/accepted by `postdocumentactionexecution`. It does *not* reflect final IDP extraction success/failure, which is only known later, asynchronously, per file, in `subscriber-vm-idp-result-flow` (via the persistent VM queue). Cross-reference `executionId`/`fileName` between the two flows' log lines if you need the true end-to-end outcome of a specific file.
- The list write itself is best-effort (`try`/`on-error-continue` in `write-job-log-subflow`) - a SharePoint list outage must never fail the ingest run.

### Error Handling

- **Poison-pill deflection**: Per-file errors in `sharepoint-ingest-single-library-subflow` use `on-error-continue` to prevent one bad file from aborting the batch — including files in *other* libraries still to be processed by `sharepoint-ingest-subflow`'s outer loop
- **Timeout protection**: Poll count tracked per execution; files moved to Error after `idp.action.max_checks` (default 20)
- **Best-effort recovery**: Failed file moves are wrapped in try/catch to avoid error handler recursion
- **`common-error-handling` is external**: `<error-handler ref="common-error-handling" />` and the health-check flows (`health-liveness-probe`, `health-readiness-probe`) resolve from the `skg-common-error-handling` and `skg-health-check-app` Maven plugin dependencies via `<import file="common-error-handling.xml"/>` / `<import file="health-check.xml"/>` in `global.xml` — there are no local files by those names in `src/`

## Directory Structure

```
src/main/
├── mule/
│   ├── api.xml                           # APIkit router + health check endpoints + the two ingest entry points
│   ├── config/global.xml                 # All connector configs + property loading
│   ├── common/common.xml                 # NOT currently imported/used — leftover template subflows (save-input/clear-input)
│   └── implementation/
│       ├── idp-ingest-flow.xml           # sharepoint-ingest-subflow (per-library orchestrator) + sharepoint-ingest-single-library-subflow (worker)
│       ├── idp-subscriber-flow.xml       # VM consumer + IDP poll flow
│       ├── idp-job-logging-flow.xml      # write-job-log-subflow - writes one row per library-run to the SharePoint job-log list
│       └── skg-sharepoint-example.xml    # Example/template flow
└── resources/
    ├── properties/
    │   ├── common-properties.yaml        # Environment-independent properties
    │   ├── {env}-properties.yaml         # Per-environment config — only dev-properties.yaml is currently populated; test/prod are empty and preprod only sets HTTP/HTTPS ports
    │   └── secure/
    │       └── {env}-secure-properties.yaml  # Encrypted credentials
    ├── dw/
    │   └── idp-result-to-csv-v2.dwl       # DataWeave transform for IDP JSON → CSV flattening
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
# No MUnit tests defined yet, though MUnit tooling (munit-tools/munit-runner) is wired into the build
# src/test/munit/ exists but is empty

# Manual trigger for testing ingest flow (sweeps every library in sharepoint.libraries):
curl -X GET http://localhost:8081/trigger-ingest

# Health checks available at:
curl http://localhost:8081/api/v1/health-check/liveliness-probe
curl http://localhost:8081/api/v1/health-check/readiness-probe

# Hello endpoint (basic connectivity test):
curl http://localhost:8081/api/v1/hello
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

**Note**: `*-reprocessing-properties.yaml` files exist for all environments but contain Anypoint MQ and transaction reprocessing configuration not currently used by the IDP flows. These appear to be template artifacts for future enhancements.

### Critical Properties

**IDP Configuration** (`dev-properties.yaml`) — shared globally across every document library (same IDP action id/version regardless of which library a file came from):
```yaml
idp:
  host: "idp-rt.eu-central-1.eu1.anypoint.mulesoft.com"
  port: "443"
  protocol: "HTTPS"
  action:
    id: "idp-skg-salaries-pjc"         # IDP action identifier
    version: "1.0.0"                   # IDP action version
    max_checks: "20"                   # Poll timeout threshold
```

**SharePoint Configuration** (`dev-properties.yaml`):
```yaml
sharepoint:
  site:
    url: "https://skgtechoffice.sharepoint.com/sites/MulesoftProjectSite"
    serverRelativePath: "/sites/MulesoftProjectSite"
  tokenUrl: "https://login.microsoftonline.com/.../oauth2/v2.0/token"  # MS OAuth endpoint
  connection:
    clientId: "<client-id>"
    keyStoreAlias: "mule"
    keyStorePath: "skg-sp-server.jks"
    keyStoreType: "JKS"
    keyStorePassword: ${secure::sharepoint.connection.keyStorePassword}  # References secure props
    scope: "https://skgtechoffice.sharepoint.com/.default"
  # Document libraries to sweep, as a JSON array string (each entry is a library name/path
  # relative to the site root; every library shares the same folder.* convention below)
  libraries: '["EKN","FLEET"]'
  folder:
    source: "01-Inbound"
    processing: "02-Processing"
    output: "03-Output"
    processed: "04-Processed"
    error: "99-Error"
  filter:
    extension: "pdf"
  # SharePoint list receiving one row per document-library run (see "Job Logging" above)
  # title is a display name only (kept for reference/logging) - the flow writes using listId (GUID),
  # since the title-based lookup mis-encodes spaces on the item-create call (see "Job Logging" above)
  jobLogList:
    title: "Mule IDP Job Logs"
    listId: "89ac4892-b04b-41be-a251-f30603af4dad"
```

**SharePoint Secure Properties** (`secure/dev-secure-properties.yaml`):
```yaml
sharepoint:
  connection:
    keyStorePassword: "![<encrypted-value>]"  # Encrypted with mule.secure.key
```

**VM Queue** - Name: `idp-timesheet-queue`, Poll interval: `30000ms` (30 seconds), `numberOfConsumers="1"` — intentionally kept at 1 for now even though tracking messages are self-describing per library (see Important Notes)

**Scheduler** - Cron: `0 0 0/1 * * ?` (hourly on the hour), Initial state: `stopped` (dev environment - use HTTP `/trigger-ingest` for manual testing)

## Working with DataWeave

### Location
All DataWeave modules and transforms live in `src/main/resources/dw/`

### Active Transforms
- **`idp-result-to-csv-v2.dwl`** - Currently referenced by `idp-subscriber-flow.xml`. Flattens nested IDP JSON response (`timeSheetData` array) into CSV rows with headers, and additionally splits each day's `"HHMM-HHMM"` time-range string (`monTime`..`sunTime`) into `{day}StartHH`/`{day}StartMM`/`{day}EndHH`/`{day}EndMM` columns
- **`idp-result-to-csv.dwl`** - Original version (no HH/MM breakdown columns), kept for reference — not referenced by any flow
- **Versioning convention**: when enhancing this transform, add a new `-vN.dwl` file and repoint the `<ee:set-payload resource="..."/>` in `idp-subscriber-flow.xml` rather than editing in place, so prior versions remain available for comparison/rollback

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
- **Scripting Module** (v2.1.1) - Groovy for sleep/throttle logic
- **Secure Properties Module** - AES-encrypted property values
- **File Connector** (v1.5.3) - Local file operations (if needed)
- **OAuth Module** / **Sockets Connector** - Transitive support dependencies pulled in by the HTTP/SharePoint connectors, not directly configured in any flow

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
- For specific guidance, read the relevant agent's rules directory, e.g. `r-genie/03-01_Dataweave_Agent/rules/` (individual `.mdc` files: `03-01_Dataweave.mdc`, `03-01-01_Guidance.mdc`, `03-01-02_Mandatory_Stop_Points.mdc`, `03-01-00_Phase_Orchestration.mdc`, plus `INDEX.md`) — there is no single `RULES.md` per agent

### File Protection Rules (from `.cursor/rules/`)
These constraints are defined in five Cursor rule files (`alwaysApply: true`) and apply to all work in this repo:
- **`r-genie/` is READ-ONLY** (`r-genie-protection.mdc`) - Never modify files under `r-genie/` (core agent architecture). Exceptions require explicit command activation (`/add-production-learnings`, `/use-agent-tuner`, `/use-agent-builder`) with user approval.
- **Never `git push` without explicit user confirmation** ("yes" or "confirm") — same rule file.
- **Editable paths per the rule text**: `project/`, `.cursor/commands/` and `.cursor/rules/`, and root config files (`.cursorignore`, `README.md`). The rule does not explicitly call out `src/` — application development there is simply outside R-GENIE's protection scope, not something the rule affirmatively grants.
- **Write-protected files** (`cursorignore-execute-or-ask.mdc`): `.cursorignore`, `.vscode/**`, `.cursor/*.json`, `.git/config` — the Cursor IDE sandbox blocks agent writes. Attempt once; if blocked, hand the user a copy-paste command to run in their own terminal rather than retrying alternatives.
- **`workspace-organization.mdc`**: R-GENIE user work must go in system-specific `project/input_XX_*` / `project/output_XX_*` folders, never inside an `r-genie/{subsystem}/` folder.
- **`current-date-time-context.mdc`** / **`r-genie-persona.mdc`**: fetch current date/time before answering "latest info" queries; defines the R-GENIE assistant persona. Minor, but present.

Note: despite `README.md` being listed as an editable root file, no root `README.md` currently exists in this repo.

## Common Tasks

### Adding a New Flow
1. Create XML in `src/main/mule/implementation/`
2. Define reusable sub-flows in `src/main/mule/common/` if needed
3. Add connector configs to `global.xml` if introducing new connections
4. Update properties files for any new configuration values
5. Reference error handler: `<error-handler ref="common-error-handling" />`

### Modifying IDP Integration
- IDP connector config: `global.xml` → `IDP___Timesheet___1_4_0_Config`
- Submit endpoint: `idp-timesheet-140:postdocumentactionexecution` (multipart/form-data upload), called from `sharepoint-ingest-single-library-subflow`
- Poll endpoint: `idp-timesheet-140:getdocumentactionexecution` (returns execution status and extracted fields), called from `subscriber-vm-idp-result-flow`
- Action metadata controlled by `idp.action.id` and `idp.action.version` properties — currently **global**, shared by every document library; if a library ever needs a different IDP action, that would require carrying an action id/version through the VM message the same way `documentLibrary`/`outputPath`/etc. are carried today
- Credentials: Uses Anypoint platform client credentials (`anypoint.clientId` and `anypoint.clientSecret`)
- Namespace: `http://www.mulesoft.org/schema/mule/idp-timesheet-140`

### Adding or Removing a Document Library
- Edit the `sharepoint.libraries` JSON array string in `dev-properties.yaml` (e.g. `'["EKN","FLEET","NEWLIB"]'`) — no flow changes required, since `sharepoint-ingest-subflow` parses this list at runtime
- Ensure the new library has the same 5 subfolders in SharePoint (`01-Inbound` … `99-Error`, leaf names from `sharepoint.folder.*`)
- `sharepoint-ingest-subflow` processes libraries **sequentially** (not in parallel) — this is deliberate, to keep SharePoint/IDP submission load predictable

### Debugging VM Queue Issues
- Queue persistence configured in `global.xml` → `VM_Config`
- Message structure: `{executionId, fileName, documentLibrary, processingUrl, outputPath, processedPath, errorPath, pollCount}` — every destination folder is carried in the message itself, not resolved from a global property, so the subscriber can never write one library's output into another's folders regardless of message ordering or consumer count
- Monitor via Anypoint Studio debugger breakpoints in `subscriber-vm-idp-result-flow`
- Poll throttle controlled by `vm.poll.sleepMillis` property
- All ingest and subscriber log lines include the document library name directly in the message text (not just the conditional DEBUG payload), e.g. `(library: EKN)`, so errors/timeouts can be traced to a specific library without cross-referencing paths

### Updating SharePoint Configuration
1. **Connection params**: Edit `dev-properties.yaml` under `sharepoint.connection.*` (clientId, tokenUrl, keyStore settings)
2. **Secure credential**: Update `secure/dev-secure-properties.yaml` for `keyStorePassword` (must be encrypted with `![...]` wrapper)
3. **Document libraries & folder convention**: Edit `sharepoint.libraries` (which libraries to sweep) and `sharepoint.folder.*` (the shared subfolder leaf names) — see "Adding or Removing a Document Library" above
4. **File operations**: Use **absolute server-relative URLs** constructed via `sharepoint.site.serverRelativePath` + library name + folder leaf
5. **Critical**: `<secure-properties:config>` in `global.xml` **must load before** the SharePoint connector config (order matters for property resolution)

## Code Conventions

### Logging
- Use custom log mapper: `CustomLogMapper::logger()` (imported from DataWeave library)
- Log format includes: `correlationId`, `status`, `message`, `payload` (DEBUG only)
- Prefix log messages by flow context: `[IDP-INGEST]`, `[IDP-SUBSCRIBER]`
- Every ingest/subscriber log message includes the `documentLibrary` directly in the message text (e.g. `... (library: EKN)`), not only in the conditional DEBUG payload — this keeps per-library traceability visible at INFO/WARN/ERROR levels too

**Logger Pattern for HTTP-triggered flows:**
```xml
<!-- 1. Set correlationId immediately after HTTP listener -->
<set-variable value="#[attributes.headers.'x-correlation-id' default correlationId]" 
              doc:name="correlationId" variableName="correlationId"/>

<!-- 2. Log BEFORE any transforms (while attributes exists) -->
<logger level="INFO" doc:name="Logger" message="#[%dw 2.0
output application/json
var logPayload = { 
    &quot;method&quot;: attributes.method,
    &quot;endpoint&quot;: attributes.requestUri,
    &quot;queryParams&quot;: if (!isEmpty(attributes.queryParams)) attributes.queryParams else '',
    &quot;uriParams&quot;: if (!isEmpty(attributes.uriParams)) attributes.uriParams else '',
    &quot;payload&quot;: if (attributes.method != &quot;GET&quot;) payload else ''
}
var status = &quot;ok&quot;
var msg = &quot;Flow Name - START&quot;
---
CustomLogMapper::logger({
	correlationId: vars.correlationId,
	app: app,
	mule: mule,
	status: status,
	message: msg,
	(payload: logPayload) if (p('log.level') == &quot;DEBUG&quot;),		 
	env: p('mule.env')
})]"/>

<!-- 3. Then do transformations -->
<ee:transform>...</ee:transform>
```
**Key points:**
- Set `correlationId` variable first (from header or auto-generated)
- Log **before** `<ee:transform>` to capture HTTP `attributes` (method, URI, params)
- After transform, `attributes` is no longer available
- See `trigger-ingest-flow` in `api.xml` for reference implementation

### Variable Naming
- Execution tracking: `executionId`, `fileName`, `documentLibrary`, `processingUrl`, `pollCount`
- File operations: `sourceUrl`, `processingUrl`, `outputPath`, `processedPath`, `errorPath`, `outputBaseName`
- Correlation: `correlationId` (set from header `x-correlation-id` or auto-generated)
- Job logging: `executionType` (`Scheduled`/`Manual`, set once in `api.xml`), `processedFiles`/`errorDetails` (arrays reset per library run in `sharepoint-ingest-single-library-subflow`), `libraryStatus`/`libraryFailureReason` (set only on a library-level catastrophic failure)

### Error Messages
- Include context: operation, file name, document library, execution ID
- Use `error.description` for root cause details
- Severity levels: `ERROR` for failures, `WARN` for non-critical issues, `DEBUG` for requeue events

### Document IDs
`doc:id` conventions are **not fully consistent** across the codebase:
- `idp-subscriber-flow.xml` consistently follows `b2000001-<seq>-4002-8002-<mnemonic-suffix>`
- `idp-ingest-flow.xml` mixes plain random UUIDs (original elements) with newer structured-looking IDs added during the multi-library refactor — there's no single enforced pattern there. When adding elements to the ingest flow, either style is acceptable as long as the ID is unique within the file.

## Important Notes

- **Server-relative URLs**: SharePoint connector requires absolute paths from site root (e.g., `/sites/MulesoftProjectSite/EKN/01-Inbound/...`)
- **File isolation**: Moving files to Processing before IDP submission prevents duplicate processing on scheduler retries
- **Multi-library correctness over serialization, not ordering**: `sharepoint-ingest-subflow` sweeps configured libraries sequentially, but the guarantee against mixing library outputs comes from each VM message carrying its own `documentLibrary`/`outputPath`/`processedPath`/`errorPath` — not from message ordering. This is what makes it safe to raise `numberOfConsumers` above 1 later for throughput without introducing a mixing risk.
- **Single consumer**: VM queue currently configured with `numberOfConsumers="1"` — kept at 1 deliberately for now (simplicity, preserves existing ordering behavior); revisit only if one library's backlog starts delaying another's files
- **Sleep in Groovy**: Throttling uses `sleep()` via scripting module instead of scheduler delays (VM listener doesn't support built-in delays)
- **Flag parameter**: `flag="1"` in SharePoint file-move operations enables overwrite behavior
- **Secure properties syntax**: Encrypted values must use `![encrypted-value]` wrapper (not just base64 string)
- **Property loading order**: `<secure-properties:config>` must be defined before connectors that reference `${secure::*}` properties in `global.xml`
- **Committed plaintext credentials**: `src/main/resources/properties/dev-properties.yaml` currently has `anypoint.clientId`/`anypoint.clientSecret` checked in as plaintext (unlike `sharepoint.connection.keyStorePassword`, which correctly uses `${secure::*}`). Don't add further plaintext secrets there — flag it to the user rather than treating it as the pattern to follow
- **No Salesforce connector**: This is a pure IDP + SharePoint integration app; any Salesforce references are leftover template artifacts (cleaned up as of 2026-07-23)
- **Only `dev-properties.yaml` is populated**: `test-` and `prod-properties.yaml` are empty, and `preprod-properties.yaml` only sets HTTP/HTTPS ports — deploying to those environments today would fail on missing SharePoint/IDP/VM properties
