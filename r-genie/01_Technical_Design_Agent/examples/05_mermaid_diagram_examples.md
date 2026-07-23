# Mermaid Diagram Examples V2

**Purpose:** Examples of 3 essential + 3 optional diagram types for technical designs.

---

## 📊 **V2 Diagram Structure**

### ✅ Essential Diagrams (Always in Main Document)

| # | Diagram Type | Mermaid Type | Purpose |
|---|--------------|--------------|---------|
| 1 | Integration Sequence | `sequenceDiagram` | Step-by-step flow interactions |
| 2 | Error Handling | `flowchart TD` | Error recovery strategies |
| 3 | Connector Pattern | `graph TB` | Connector & component layout |

### 📋 Optional Diagrams (Supplementary Document Only)

| # | Diagram Type | Mermaid Type | When to Include |
|---|--------------|--------------|-----------------|
| 4 | System Architecture | `graph TB` | Complex multi-system integrations |
| 5 | Business Process | `flowchart TD` | Business stakeholder documentation |
| 6 | Data Flow | `flowchart LR` | Complex transformation pipelines |

---

# ✅ ESSENTIAL DIAGRAMS

---

## 📊 **Essential 1: Integration Sequence Examples**

### Example 1A: Simple API Call

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant API as MuleSoft API
    participant Backend
    
    Client->>API: Request
    activate API
    API->>Backend: Forward
    Backend-->>API: Response
    API-->>Client: Response
    deactivate API
```

### Example 1B: With Validation and Error

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant API as MuleSoft API
    participant Backend
    
    Client->>API: Request
    activate API
    
    API->>API: Validate Request
    
    alt Invalid
        API-->>Client: 400 Bad Request
    else Valid
        API->>Backend: Process
        Backend-->>API: Result
        API-->>Client: 200 OK
    end
    
    deactivate API
```

### Example 1C: Parallel Calls

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant API as Process API
    participant SF as Salesforce
    participant DB as Database
    
    Client->>API: Get Customer 360
    activate API
    
    par Parallel Calls
        API->>SF: Get CRM Data
        SF-->>API: CRM Response
    and
        API->>DB: Get DB Data
        DB-->>API: DB Response
    end
    
    API->>API: Aggregate
    API-->>Client: Customer 360 View
    
    deactivate API
```

### Example 1D: Batch Processing

```mermaid
sequenceDiagram
    autonumber
    participant Scheduler
    participant Batch as Batch Flow
    participant Source as SFTP
    participant Target as Salesforce
    
    Scheduler->>Batch: Trigger
    activate Batch
    
    Batch->>Source: Fetch File
    Source-->>Batch: CSV Data
    
    loop For Each Batch (1000 records)
        Batch->>Batch: Transform
        Batch->>Target: Bulk Upsert
        Target-->>Batch: Result
    end
    
    Batch->>Batch: Generate Report
    deactivate Batch
```

---

## 📊 **Essential 2: Error Handling Examples**

### Example 2A: Basic Error Handling

```mermaid
flowchart TD
    START[Request] --> VALIDATE{Valid?}
    
    VALIDATE -->|No| ERR_400[400 Error]
    VALIDATE -->|Yes| PROCESS[Process]
    
    PROCESS --> RESULT{Success?}
    RESULT -->|Yes| SUCCESS[200 OK]
    RESULT -->|No| ERR_500[500 Error]
    
    style ERR_400 fill:#f44336,color:#fff
    style ERR_500 fill:#f44336,color:#fff
    style SUCCESS fill:#4caf50,color:#fff
```

### Example 2B: With Retry and Circuit Breaker

```mermaid
flowchart TD
    START[Request] --> CALL{External<br/>Call}
    
    CALL -->|Success| SUCCESS[Return Data]
    CALL -->|Timeout| RETRY{Retry<br/>< 3?}
    CALL -->|Error| CIRCUIT{Circuit<br/>Open?}
    
    RETRY -->|Yes| WAIT[Wait + Backoff]
    WAIT --> CALL
    RETRY -->|No| CIRCUIT
    
    CIRCUIT -->|Yes| FALLBACK[Use Fallback]
    CIRCUIT -->|No| TRIP[Trip Breaker]
    TRIP --> ERR_503[503 Unavailable]
    
    FALLBACK --> SUCCESS
    
    style SUCCESS fill:#4caf50,color:#fff
    style FALLBACK fill:#ff9800,color:#fff
    style ERR_503 fill:#f44336,color:#fff
```

### Example 2C: Batch Error Handling

```mermaid
flowchart TD
    START[Batch Start] --> RECORD{Process<br/>Record}
    
    RECORD -->|Success| NEXT[Next Record]
    RECORD -->|Validation Error| REJECT[Reject List]
    RECORD -->|System Error| RETRY{Retry?}
    
    RETRY -->|Yes| RECORD
    RETRY -->|No| FAILED[Failed List]
    
    REJECT --> NEXT
    FAILED --> NEXT
    
    NEXT --> MORE{More?}
    MORE -->|Yes| RECORD
    MORE -->|No| REPORT[Generate Report]
    
    style REJECT fill:#ff9800,color:#fff
    style FAILED fill:#f44336,color:#fff
```

---

## 📊 **Essential 3: Connector Pattern Examples**

### Example 3A: Connector Overview

```mermaid
graph TB
    subgraph "MuleSoft"
        HTTP[HTTP Listener<br/>:8081]
        
        subgraph "Connectors"
            SF[Salesforce]
            DB[Database]
            FILE[SFTP]
        end
        
        subgraph "Processing"
            DW[DataWeave]
        end
    end
    
    subgraph "External"
        SFDC[(Salesforce)]
        MYSQL[(MySQL)]
        SFTP_SRV[SFTP Server]
    end
    
    HTTP --> DW
    DW --> SF --> SFDC
    DW --> DB --> MYSQL
    DW --> FILE --> SFTP_SRV
    
    style HTTP fill:#4a90d9,color:#fff
    style SF fill:#00a1e0,color:#fff
    style DB fill:#f39c12,color:#fff
    style FILE fill:#27ae60,color:#fff
```

### Example 3B: Event Architecture

```mermaid
graph TB
    subgraph "Producers"
        P1[System A]
        P2[System B]
    end
    
    subgraph "MuleSoft"
        PUB[Publisher]
        TOPIC[Anypoint MQ]
        DLQ[Dead Letter Queue]
        CON[Consumer]
    end
    
    subgraph "Target"
        TARGET[(Database)]
    end
    
    P1 --> PUB
    P2 --> PUB
    PUB --> TOPIC
    TOPIC --> CON
    TOPIC -.->|Failed| DLQ
    CON --> TARGET
    
    style TOPIC fill:#9b59b6,color:#fff
    style DLQ fill:#e74c3c,color:#fff
```

### Example 3C: Full API-Led Pattern

```mermaid
graph TB
    subgraph "Experience Layer"
        EXP1[Web Exp API]
        EXP2[Mobile Exp API]
    end
    
    subgraph "Process Layer"
        PROC[Process API]
    end
    
    subgraph "System Layer"
        SYS1[SF SAPI]
        SYS2[SAP SAPI]
        SYS3[DB SAPI]
    end
    
    subgraph "Systems"
        SF[(Salesforce)]
        SAP[(SAP)]
        DB[(MySQL)]
    end
    
    EXP1 --> PROC
    EXP2 --> PROC
    PROC --> SYS1 --> SF
    PROC --> SYS2 --> SAP
    PROC --> SYS3 --> DB
    
    style EXP1 fill:#e8744f,stroke:#333,color:#fff
    style EXP2 fill:#e8744f,stroke:#333,color:#fff
    style PROC fill:#4a90d9,stroke:#333,color:#fff
    style SYS1 fill:#82c366,stroke:#333
    style SYS2 fill:#82c366,stroke:#333
    style SYS3 fill:#82c366,stroke:#333
```

---

# 📋 OPTIONAL DIAGRAMS (Supplementary Document)

---

## 📊 **Optional 4: System Architecture Examples**

### Example 4A: Simple Integration

```mermaid
graph TB
    subgraph "Source"
        SOURCE[Salesforce CRM]
    end
    
    subgraph "MuleSoft"
        API[System API]
        TRANSFORM[DataWeave]
    end
    
    subgraph "Target"
        TARGET[(MySQL Database)]
    end
    
    SOURCE --> API --> TRANSFORM --> TARGET
    
    style API fill:#4a90d9,stroke:#333,color:#fff
```

### Example 4B: API-Led Architecture

```mermaid
graph TB
    subgraph "Consumers"
        WEB[Web App]
        MOBILE[Mobile App]
    end
    
    subgraph "Experience Layer"
        EXP[Experience API]
    end
    
    subgraph "Process Layer"
        PROC[Process API]
    end
    
    subgraph "System Layer"
        SYS1[System API 1]
        SYS2[System API 2]
    end
    
    subgraph "Backend"
        BE1[(System 1)]
        BE2[(System 2)]
    end
    
    WEB --> EXP
    MOBILE --> EXP
    EXP --> PROC
    PROC --> SYS1 --> BE1
    PROC --> SYS2 --> BE2
    
    style EXP fill:#e8744f,stroke:#333,color:#fff
    style PROC fill:#4a90d9,stroke:#333,color:#fff
    style SYS1 fill:#82c366,stroke:#333
    style SYS2 fill:#82c366,stroke:#333
```

---

## 📊 **Optional 5: Business Process Examples**

### Example 5A: Order Processing

```mermaid
flowchart TD
    START([Order Received]) --> VALIDATE{Valid?}
    
    VALIDATE -->|No| REJECT[Reject]
    VALIDATE -->|Yes| INVENTORY{Stock?}
    
    INVENTORY -->|No| BACKORDER[Backorder]
    INVENTORY -->|Yes| PRICE[Calculate Price]
    
    PRICE --> PAYMENT{Payment OK?}
    PAYMENT -->|No| HOLD[Hold Order]
    PAYMENT -->|Yes| CONFIRM[Confirm Order]
    
    CONFIRM --> FULFILL[Fulfill]
    FULFILL --> SHIP[Ship]
    SHIP --> COMPLETE([Complete])
    
    style START fill:#4a90d9,color:#fff
    style COMPLETE fill:#4caf50,color:#fff
    style REJECT fill:#f44336,color:#fff
```

### Example 5B: Data Sync Process

```mermaid
flowchart TD
    START([Sync Start]) --> FETCH[Fetch Source Records]
    
    FETCH --> COMPARE{Compare<br/>with Target}
    
    COMPARE -->|New| INSERT[Insert]
    COMPARE -->|Changed| UPDATE[Update]
    COMPARE -->|Same| SKIP[Skip]
    COMPARE -->|Deleted| DELETE[Delete]
    
    INSERT --> LOG[Log Change]
    UPDATE --> LOG
    DELETE --> LOG
    SKIP --> NEXT[Next Record]
    
    LOG --> NEXT
    
    NEXT --> MORE{More?}
    MORE -->|Yes| COMPARE
    MORE -->|No| COMPLETE([Complete])
    
    style START fill:#4a90d9,color:#fff
    style COMPLETE fill:#4caf50,color:#fff
```

---

## 📊 **Optional 6: Data Flow Examples**

### Example 6A: Simple Transformation

```mermaid
flowchart LR
    subgraph "Input"
        A[Source Data<br/>JSON]
    end
    
    subgraph "Transform"
        B[Parse]
        C[Validate]
        D[Map Fields]
    end
    
    subgraph "Output"
        E[Target Data<br/>XML]
    end
    
    A --> B --> C --> D --> E
```

### Example 6B: Field Mapping Visualization

```mermaid
flowchart LR
    subgraph "Source Fields"
        S1[firstName]
        S2[lastName]
        S3[birthDate]
    end
    
    subgraph "Transformations"
        T1[Concatenate]
        T2[Calculate Age]
    end
    
    subgraph "Target Fields"
        D1[fullName]
        D2[age]
    end
    
    S1 --> T1
    S2 --> T1
    T1 --> D1
    
    S3 --> T2 --> D2
    
    style T1 fill:#82c366,stroke:#333
    style T2 fill:#82c366,stroke:#333
```

---

## 🎨 **Styling Reference**

### Color Palette

```
Experience API:    fill:#e8744f,color:#fff (Orange)
Process API:       fill:#4a90d9,color:#fff (Blue)
System API:        fill:#82c366,stroke:#333 (Green)
HTTP/Trigger:      fill:#4a90d9,color:#fff (Blue)
Salesforce:        fill:#00a1e0,color:#fff (SF Blue)
Database:          fill:#f39c12,color:#fff (Orange)
File/SFTP:         fill:#27ae60,color:#fff (Green)
Anypoint MQ:       fill:#9b59b6,color:#fff (Purple)
Email:             fill:#e74c3c,color:#fff (Red)
Success:           fill:#4caf50,color:#fff (Green)
Error:             fill:#f44336,color:#fff (Red)
Warning:           fill:#ff9800,color:#fff (Amber)
```

---

🧞‍♂️ **Mermaid Diagram Examples V2 - 3 Essential + 3 Optional!** ✨
