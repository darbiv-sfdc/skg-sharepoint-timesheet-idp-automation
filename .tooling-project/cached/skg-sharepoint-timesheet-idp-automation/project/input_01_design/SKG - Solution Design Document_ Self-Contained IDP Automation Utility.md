# **SKG \- Solution Design Document: Self-Contained IDP Automation Utility**

## **Document Control**

| Metadata Field | Description |
| :---- | :---- |
| **Project Name** | SKG Intelligent Document Automation |
| **Application Name** | idp-document-automation-template |
| **Target Audience** | Platform Administrators, Integration Architects, and Developers |
| **Deployment Model** | CloudHub 2.0 Private Space (Strictly **1 Replica**) |
| **Design Schema** | Single Application per Dedicated IDP Action |

## 

## **1\. Business and Solution Context**

The idp-document-automation-template is a self-contained integration component designed to automate document ingestion and data extraction for SKG. Each deployed instance of this application is dedicated exclusively to processing a single MuleSoft Intelligent Document Processing (IDP) action mapped to an explicit Microsoft SharePoint directory structure.  
To handle high volumes of documents efficiently without causing worker thread starvation or memory crashes, the architecture utilizes an asynchronous, decoupled integration pattern. Because external cloud message brokers are excluded from the current licensing scope, this design implements the pattern using MuleSoft’s native, persistent **VM Queues** with built-in state-tracking and loop counters to ensure automated recovery.

### **Key Capabilities**

* **Isolated Scheduled Ingestion:** Periodically polls a dedicated SharePoint directory for newly uploaded source documents.  
* **Immediate State Isolation:** Transitions files to a temporary workspace to prevent duplicate processing by subsequent scheduler runs.  
* **Asynchronous Execution Tracking:** Hands off tracking coordinates to an on-disk persistent queue, liberating ingestion threads instantly.  
* **State-Aware Polling Loop:** Monitors document extraction progress using a non-blocking loop configuration featuring technical timeout thresholds.  
* **Automated Reconciliation:** Transforms successful text extractions into target CSV files, archives the isolated files, and routes system errors cleanly.

## **2\. Technical Architecture & Configuration Strategy**

### **Deployment Topology & Sizing**

* **Integration Layer:** Process / Utility Layer.  
* **Runtime Platform:** CloudHub 2.0 Private Space.  
* **Scale Constraints:** **1 Replica** (Recommended: 0.1 or 0.2 vCore based on document weight). *Note: Persistent VM queues on CloudHub 2.0 are bound to local worker storage and cannot replicate state across instances. A single-worker limit is mandatory to prevent data isolation gaps.*

### **Externalized Properties (**config-production.yaml**)**

YAML

```

idp:
  action:
    id: "idp-skg-salaries-pjc"       # Mapped IDP Action UUID
    version: "1.0.0"                 # Target version in Exchange
    max_checks: "20"                 # Max retry poll loops before timing out

sharepoint:
  site:
    url: "https://skg.sharepoint.com/sites/Timesheets"
  path:
    source: "Shared Documents/Manual Uploads/Inbound"
    processing: "Shared Documents/Manual Uploads/Processing"
    output: "Shared Documents/Manual Uploads/Output"
    processed: "Shared Documents/Manual Uploads/Processed"
    error: "Shared Documents/Manual Uploads/Error"
  filter:
    extension: "pdf"                 # Target file restriction

scheduler:
  cron: "0 0/1 * 1/1 * ? *"          # e.g., Triggers every 1 hour

```

### **🔒 Security Requirement**

All sensitive target credentials, SharePoint client IDs, and client secrets **must** be managed via the MuleSoft Secure Configuration Properties extension. Raw, plain-text strings are prohibited within application properties or logs.

## **3\. Core Integration Flows**

### **Flow 1:** scheduler-sharepoint-ingest-flow

This flow scans the inbound SharePoint directory, isolates the source files to ensure processing idempotency, delivers them to the IDP engine, and terminates the active ingestion thread.

```

[Mule Scheduler]
       │
       ▼
[SharePoint: List Folder] ── (Filter by sharepoint.filter.extension)
       │
       ▼
[For Each Scope] ── (Sequential Processing Loop)
       │
       ├──► [SharePoint: Move File] ──► (Inbound to Processing Directory)
       │
       ├──► [MuleSoft IDP: Submit Document] ──► (Returns: idpExecutionId)
       │
       └──► [VM Connector: Publish] ──► (Queue: idp-timesheet-queue)

```

1. **Trigger:** Activated via the Mule Scheduler according to the scheduler.cron configuration.  
2. **Directory Discovery:** Queries sharepoint.path.source to compile a metadata list of matching files.  
3. **Sequential Throttling:** Iterates over files using a standard For Each loop. Sequential execution acts as a natural throttling mechanism, controlling disk backpressure on fractional vCores.  
4. **Idempotency Isolation:** Immediately moves the current file from sharepoint.path.source to sharepoint.path.processing. This guarantees that if the next scheduler execution triggers while this batch is still running, no duplicate files will be read.  
5. **IDP Ingestion:** Streams the file payload from the processing folder directly to the MuleSoft IDP Action endpoint.  
6. **Queue Handoff:** Extracts the resulting idpExecutionId and publishes a structured JSON tracking payload to the persistent VM queue (idp-timesheet-queue).

JSON

```

{
  "executionId": "ec76f45a-a205-44a9-9a0c-af46abbd2208",
  "fileName": "timesheet_01.pdf",
  "sourcePath": "Shared Documents/Manual Uploads/Processing/timesheet_01.pdf",
  "pollCount": 0
}

```

### **Flow 2:** subscriber-vm-queue-flow

An asynchronous subscriber flow responsible for tracking completion states in FIFO order and executing terminal file movements.

```

[VM Listener] ── (Queue: idp-timesheet-queue | Manual ACK | Max Concurrency = 1)
       │
       ▼
[Choice Router: Max Poll Check]
       │
       ├──► [pollCount > idp.action.max_checks] ──► (Timeout / System Error Path)
       │
       └──► [Default: Proceed]
                 │
                 ▼
   [MuleSoft IDP: Get Execution Status]
                 │
                 ▼
          [Choice Router]
                 │
                 ├──► [SUCCEEDED] ──► (Transform to CSV, Upload, Move to Processed, ACK)
                 │
                 ├──► [FAILED]    ──► (Move to Error folder, ACK)
                 │
                 └──► [IN_PROGRESS] ─► (Java Sleep 30s, Increment pollCount, Re-Publish, ACK)

```

1. **Trigger:** Triggered asynchronously by a VM Listener assigned to idp-timesheet-queue running in **Manual Acknowledgement (ACK)** mode. Max Concurrency is explicitly locked to **1** to guarantee strict sequential FIFO processing.  
2. **Timeout Validation:** Inspects the incoming pollCount. If pollCount exceeds idp.action.max\_checks (e.g., 20 checks × 30s \= 10 minutes), the document is declared technically frozen. It is moved directly to the SharePoint error folder, an alert is logged, and the message is **ACKed** to clear the queue.  
3. **Status Evaluation:** Issues a GET request to the IDP getDocumentActionExecution endpoint using the executionId.  
4. **State Routing:**  
   * SUCCEEDED**:** DataWeave maps the raw IDP JSON output into the target CSV template. The SharePoint connector writes the CSV to sharepoint.path.output and transfers the source document out of sharepoint.path.processing into sharepoint.path.processed. An explicit **ACK** removes the item from the queue.  
   * FAILED**:** Captures error details, reroutes the source document to sharepoint.path.error for business reconciliation, and explicitly **ACKs** the tracking payload.  
   * IN\_PROGRESS**:** To avoid high-CPU spinning retry loops, a light Java or Scripting sleep wrapper pauses the thread execution for 30 seconds. A DataWeave transformation increments the pollCount field by 1, and the updated tracking payload is re-published to the tail of the VM queue. An explicit **ACK** closes the current transaction safely.

## **4\. Error Handling & Application Recovery**

### **Poison Pill Deflector**

To protect the runtime from unprocessable data payloads, any structural exception or mapping failure encountered within Flow 2 is intercepted by an On Error Continue block. The application will log a severe transaction alert, attempt to move the source file out of the processing workspace into sharepoint.path.error, and force an explicit **ACK** to terminate the poison payload.

### **App Crash / Worker Reboot Recovery**

Because the VM queue configuration is flagged as **Persistent**, messages are mirrored to the worker's underlying disk space.

* If a CloudHub worker crashes or reboots mid-transaction, the messages are completely preserved.  
* Upon runtime recovery, the VM Listener automatically restarts, consumes the trapped execution IDs, and queries the IDP for status updates.  
* Because uncompleted transactions remain cleanly contained in the sharepoint.path.processing folder, they are safely shielded from duplicate processing loops.

### **Missing Document Resiliency (Ghost Files)**

If a user manually removes or modifies a document within the SharePoint file system while it is actively being parsed by the IDP engine, the final file-move operation will throw a SHAREPOINT:NOT\_FOUND exception. The application handles this scenario via dedicated error mapping: it will still successfully generate and publish the processed data extraction output, log a warning regarding the missing source file, and **ACK** the VM payload to prevent queue stagnation.  
Now that the foundational architecture for the single application design is fully finalized and hardened with recovery features, would you like to explore how we can transition this setup into the **Dynamic Routing Architecture** to process multiple IDP paths inside a single application space later on?  
