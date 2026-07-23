# HNK_ES_PRC_28360_SAP_SFDC_NetListPrices - Connector Settings

**Referenced from:** `../01_pricing_sync_technical_design.md` Section 5  
**Generated:** 2026-01-27

---

## 5. Connector Settings

### 5.1 Connection: HNK_GLO_CON_SOLACE_PUBSUB

**Connection ID:** `7a48de43-042d-4caa-9c02-0acd3312ca79`  
**Type:** Solace PubSub+ Platform — Partner Connector  
**Source File:** `7a48de43-042d-4caa-9c02-0acd3312ca79.xml`

| Setting | Value |
|---------|-------|
| **Username** | boomi-pubsub-user |
| **Password** | [ENCRYPTED] |
| **Message VPN** | heineken-dev |
| **SMF Host** | tcps://heineken-dev.messaging.solace.cloud |
| **API Token** | [ENCRYPTED] |
| **API Version** | v2.0 |
| **Custom Property: client_channel** | [ENCRYPTED] |

### 5.2 Connection: HNK_ES_CON_SFDC_BulkAPI

**Connection ID:** `061621cd-46f9-4984-9a5e-6373111aeb25`  
**Type:** Salesforce  
**Source File:** `061621cd-46f9-4984-9a5e-6373111aeb25.xml`

| Setting | Value |
|---------|-------|
| **URL** | https://heineken-eu2--sit.sandbox.my.salesforce.com/services/Soap/u/63.0 |
| **User** | boomi.user@heineken-eu2.com.sit |
| **Password** | [ENCRYPTED] |
| **Maximum Concurrent Connections** | 10 |

### 5.3 Operation: HNK_ES_OPR_Solace_List_Pricing

**Operation ID:** `904153db-a6f2-4ad4-b0ca-1333a672d438`  
**Type:** Solace PubSub+ Platform — Partner Connector (Listen)  
**Source File:** `904153db-a6f2-4ad4-b0ca-1333a672d438.xml`

| Setting | Value |
|---------|-------|
| **Operation Type** | Listen |
| **Mode** | PERSISTENT_TRANSACTED |
| **Destination** | HNK/COMMERCE/COMPETITIVEPRICE/ES/SALESFORCE |
| **Batch Size** | 1 |
| **Receive Timeout** | 10000 ms |
| **Maximum Concurrent Executions** | 1 |
| **Selector** | (empty) |
| **Topic Subscription** | (empty) |
| **Create Queue and Topic Subscription(s)** | false |
| **Return Application Errors** | false |
| **Track Response** | true |

### 5.4 Operation: HNK_ES_OPR_Bulk_SFDC_Upsert_PricebookEntrySync__c

**Operation ID:** `d9daa80d-36df-4fed-b5e5-ec901bcedb65`  
**Type:** Salesforce (Bulk API)  
**Source File:** `d9daa80d-36df-4fed-b5e5-ec901bcedb65.xml`

| Setting | Value |
|---------|-------|
| **Object Action** | upsert |
| **Object Name** | HNK_PricebookEntrySync__c |
| **External ID Field** | HNK_UniqueExternalId__c |
| **Use Bulk API** | true |
| **Bulk API Version** | v2 |
| **Batch Size** | 150 |
| **Batch Count** | 200 |
| **Request Profile** | `20c4a0c3-1428-456f-abf1-c453fec29910` (HNK_ES_PRF_XML_Bulk_SF_PricebookEntrySync_c_UPSERT_Request) |
| **Return Application Errors** | true |

**Salesforce Object Fields:**

| Field Name | Data Type | Custom | Enabled | Nillable |
|------------|-----------|--------|---------|----------|
| Id | character | false | true | false |
| OwnerId | reference | false | true | false |
| Name | character | false | true | true |
| CurrencyIsoCode | character | false | true | true |
| CreatedById | reference | false | true | false |
| LastModifiedById | reference | false | true | false |
| HNK_IsActive__c | boolean | false | true | false |
| HNK_Procesable__c | boolean | false | true | false |
| HNK_UniqueExternalId__c | character | true | true | true |
| HNK_UniqueExternalPriceBookId__c | character | false | true | true |
| HNK_UniqueExternalProduct2Id__c | character | false | true | true |
| HNK_UnitPrice__c | number | false | true | true |
| HNK_ValidFrom__c | date | false | true | true |
| HNK_ValidTo__c | date | false | true | true |

### 5.5 Cross Reference: HNK_GLO_CRT_XOMI_GetDetails

**Cross Ref ID:** `75d8a3ee-dcba-48e8-939e-5727aedd5bfb`  
**Source File:** `75d8a3ee-dcba-48e8-939e-5727aedd5bfb.xml`

**Note:** Cross-reference table contains 0 rows in export. Table is used for lookup operations in the process.

**Columns:** InterfaceNumber, BusinessProcess, SubProcess, LogFlag

**Usage:** Lookup by InterfaceNumber (28360) to retrieve BusinessProcess, SubProcess, and LogFlag values.

### 5.6 Cross Reference: HNK_GLO_CRT_GlobalSFDC

**Cross Ref ID:** `df5a5c72-2810-4a23-a0d7-e82fe31f63a8`  
**Source File:** `df5a5c72-2810-4a23-a0d7-e82fe31f63a8.xml`

**Note:** Cross-reference table contains 0 rows in export. Table is used for lookup operations in functions.

**Columns:** Opco, CountryCode

**Usage:** Lookup by Opco to retrieve CountryCode for ProductID generation.

---
