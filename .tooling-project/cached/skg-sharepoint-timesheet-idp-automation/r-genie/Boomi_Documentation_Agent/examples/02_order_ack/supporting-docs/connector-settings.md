# HNK_ES_PRC_28210_SAPXH1_Salesforce_OrderAck - Connector Settings

**Referenced from:** `../02_order_ack_technical_design.md` Section 5  
**Generated:** 2026-01-27

---

## Connection: HNK_GLO_CON_SOLACE_PUBSUB

**Connection ID:** `7a48de43-042d-4caa-9c02-0acd3312ca79`  
**Connector Type:** solacetpp-VMLLNA-solace-prod  
**Source File:** `7a48de43-042d-4caa-9c02-0acd3312ca79.xml`

| Setting | Value |
|---------|-------|
| **Username** | boomi-pubsub-user |
| **Password** | [ENCRYPTED] |
| **Message VPN** | heineken-dev |
| **SMF Host** | tcps://heineken-dev.messaging.solace.cloud |
| **API Token** | [ENCRYPTED] |
| **Event Portal API Version** | v2.0 |
| **Custom Property: client_channel** | [ENCRYPTED] |

---

## Connection: HNK_ES_CON_HTTP_Salesforce

**Connection ID:** `20dc6304-3082-4adf-8b56-47001f46b6a0`  
**Connector Type:** http  
**Source File:** `20dc6304-3082-4adf-8b56-47001f46b6a0.xml`

| Setting | Value |
|---------|-------|
| **URL** | https://heinekensp--int.sandbox.my.salesforce.com |
| **Authentication Type** | NONE |
| **OAuth2 Grant Type** | password |
| **OAuth2 Client ID** | 3MVG9ZPHiJTk7yFzY8D3k.EJLaoBk5d96EA4fcoyc_KXjMQ8EPU1sYUe6bbt8L2w6jMzlvz0A5QqgmcTydm5m |
| **OAuth2 Client Secret** | [ENCRYPTED] |
| **OAuth2 Access Token** | [ENCRYPTED] |
| **OAuth2 Access Token URL** | https://heinekensp--b2bdistrib.my.salesforce.com/services/oauth2/token |
| **SSL Client Auth** | false |
| **Trust Server Cert** | false |

---

## Connection: HNK_GLO_CON_HTTP_AzureKeyVault

**Connection ID:** `ee348c0f-cafd-4bcd-a156-9fd170868319`  
**Connector Type:** http  
**Source File:** `ee348c0f-cafd-4bcd-a156-9fd170868319.xml`  
**Description:** CHG2268041 - for credentials renewal - Azure App name -> HEI_EI_APIC_AKV

| Setting | Value |
|---------|-------|
| **URL** | https://hei-gis-sb-d-azwe-kv-01.vault.azure.net |
| **Authentication Type** | OAUTH2 |
| **OAuth2 Grant Type** | client_credentials |
| **OAuth2 Client ID** | df499147-1dda-4007-a8bb-38e66068fcd6 |
| **OAuth2 Client Secret** | [ENCRYPTED] |
| **OAuth2 Access Token Key** | 7BB7ECBF-380B-49C1-B724-5C6275AF0C55 |
| **OAuth2 Access Token Endpoint** | https://login.microsoftonline.com/66e853de-ece3-44dd-9d66-ee6bdf4159d4/oauth2/v2.0/token |
| **OAuth2 Scope** | https://vault.azure.net/.default |
| **SSL Client Auth** | false |
| **Trust Server Cert** | false |

---

## Operation: HNK_ES_OPR_SAP_Salesforce_Order

**Operation ID:** `dc201580-704c-42b7-91ed-87b1c923f572`  
**Connection ID:** `7a48de43-042d-4caa-9c02-0acd3312ca79`  
**Connector Type:** solacetpp-VMLLNA-solace-prod  
**Source File:** `dc201580-704c-42b7-91ed-87b1c923f572.xml`

| Setting | Value |
|---------|-------|
| **Operation Type** | Listen |
| **Mode** | PERSISTENT_TRANSACTED |
| **Destination** | HNK/OTC/SalesOrderResponseB2B/ES/SF |
| **Batch Size** | 1 |
| **Receive Timeout** | 10000 ms |
| **Max Concurrent Executions** | 1 |
| **Request Profile Type** | xml |
| **Response Profile Type** | xml |
| **Return Application Errors** | false |
| **Track Response** | true |
| **Archiving Enabled** | false |

**Tracking Configuration:**

| Field ID | Field Name | Source |
|----------|------------|--------|
| 25961 | KeyTransactionDataID | Profile: VBELN (HNK_ES_PRF_XML_SAPXH1_SalesOrder, elementId=70) |

---

## Operation: HNK_ES_OPR_Salesforce_OrderAck

**Operation ID:** `18f5688a-ac6b-4936-b6e7-df69dc3ef292`  
**Connection ID:** `20dc6304-3082-4adf-8b56-47001f46b6a0`  
**Connector Type:** http  
**Source File:** `18f5688a-ac6b-4936-b6e7-df69dc3ef292.xml`

| Setting | Value |
|---------|-------|
| **Method** | POST |
| **Content Type** | application/json |
| **Request Profile Type** | JSON |
| **Response Profile Type** | JSON |
| **Follow Redirects** | true |
| **Return Errors** | true |
| **Return Responses** | true |
| **Return MIME Response** | false |
| **MIME Passthrough** | false |
| **Archiving Enabled** | false |

**Request Headers:**

| Header Name | Source |
|-------------|--------|
| Authorization | Dynamic document property: Authorization (isVariable=true) |
| Content-Type | Static: application/json |

**Path Elements:**

| Element | Source |
|---------|--------|
| DDP_PATH | Dynamic document property: DDP_PATH (isVariable=true) |

---

## Operation: HNK_ES_OPR_SF_Common_Token

**Operation ID:** `5c4e4ad2-6310-466a-bc60-932654631400`  
**Connection ID:** `20dc6304-3082-4adf-8b56-47001f46b6a0`  
**Connector Type:** http  
**Source File:** `5c4e4ad2-6310-466a-bc60-932654631400.xml`

| Setting | Value |
|---------|-------|
| **Method** | POST |
| **Content Type** | application/x-www-form-urlencoded |
| **Request Profile Type** | NONE |
| **Response Profile Type** | JSON |
| **Follow Redirects** | true |
| **Return Errors** | true |
| **Return Responses** | true |
| **Return MIME Response** | false |
| **MIME Passthrough** | false |
| **Archiving Enabled** | false |

**Path Elements:**

| Element | Source |
|---------|--------|
| DDP_PATH | Dynamic document property: DDP_PATH (isVariable=true) |

---

## Operation: HNK_GLO_OPR_HTTP_AzureKeyVault_GetSecret

**Operation ID:** `9cfa39e6-3330-4709-b0b7-523f1c83ca51`  
**Connection ID:** `ee348c0f-cafd-4bcd-a156-9fd170868319`  
**Connector Type:** http  
**Source File:** `9cfa39e6-3330-4709-b0b7-523f1c83ca51.xml`

| Setting | Value |
|---------|-------|
| **Method** | GET |
| **Content Type** | text/plain |
| **Request Profile Type** | NONE |
| **Response Profile Type** | JSON |
| **Response Profile ID** | e8791a12-4857-48a2-b20e-de64a3515c42 |
| **Follow Redirects** | false |
| **Return Errors** | false |
| **Return MIME Response** | false |
| **MIME Passthrough** | false |
| **Archiving Enabled** | false |

**Path Elements:**

| Element | Source |
|---------|--------|
| secrets/ | Static |
| DDP_Key | Dynamic document property: DDP_Key (isVariable=true) |
| ?api-version=7.2 | Static |

---

## Cross-Reference: HNK_GLO_CRT_XOMI_GetDetails

**Cross-Reference ID:** `75d8a3ee-dcba-48e8-939e-5727aedd5bfb`  
**Source File:** `75d8a3ee-dcba-48e8-939e-5727aedd5bfb.xml`

**Column Headers:**

| Column Index | Column Name |
|--------------|-------------|
| 0 | InterfaceNumber |
| 1 | BusinessProcess |
| 2 | SubProcess |
| 3 | LogFlag |
| 4 | FinalFlag |

**Usage in Process:**
- Used in shape37 (Set XOMI Properties-RECEIVE) to lookup BusinessProcess and SubProcess for InterfaceNumber=28210

**Sample Rows (first 20):**

| InterfaceNumber | BusinessProcess | SubProcess | LogFlag | FinalFlag |
|-----------------|-----------------|------------|---------|-----------|
| 00100 | Commerce | PI_ListenerStatus | true | true |
| 00110 | Commerce | PI_ResumeListener | true | true |
| 03560 | IT | DeadLetter | true | true |
| 05030 | Supply Chain | O2IMaintenance | true | true |
| 05055 | Commerce | Salesorder | true | true |
| 05060 | commerce | Sales Order | true | true |
| 05350 | Commerce | Stock | true | true |
| 05350 | Commerce | StockUpdate | true | true |
| 05410 | Finance | Remittance | true | true |
| 05420 | Finance | Remittance | true | true |
| 05430 | procurement | O2IMaximoUpdate | true | true |
| 05450 | Procurement | Contract | true | true |
| 05460 | Procurement | Contract_Put | true | true |
| 05470 | Procurement | Companies | true | true |
| 05480 | Procurement | Purchase Requisition | true | true |
| 05481 | Procurement | Purchase Requisition | true | true |
| 05490 | Procurement | Goods Issue | true | true |
| 05500 | Procurement | Stock Adjustments | true | true |
| 05510 | Procurement | Item and Inventory | true | true |
| 05520 | Procurement | Purchase Order | true | true |

**Note:** This cross-reference table contains many rows (hundreds). The process uses InterfaceNumber=28210 to lookup BusinessProcess and SubProcess values for XOMI framework logging.

---
