# HNK_ES_PRC_28360_SAP_SFDC_NetListPrices - Shape Configurations

**Referenced from:** `../01_pricing_sync_technical_design.md` Section 3  
**Generated:** 2026-01-27

---

## 3.1 Process: HNK_ES_PRC_28360_SAP_SFDC_NetListPrices - Shape Configurations

### Shape: Listener (ID: shape1)
**Type:** start

| Setting | Value |
|---------|-------|
| **Action Type** | Listen |
| **Connector Type** | solacetpp-VMLLNA-solace-prod |
| **Connection ID** | `7a48de43-042d-4caa-9c02-0acd3312ca79` |
| **Operation ID** | `904153db-a6f2-4ad4-b0ca-1333a672d438` |
| **Allow Dynamic Credentials** | NONE |

### Shape: setting Opco, path and other properties (ID: shape2)
**Type:** documentproperties

| Property | Property ID | Source Type | Source Value |
|----------|-------------|------------|-------------|
| DDP_LogKey | dynamicdocument.DDP_LogKey | static | 0 |
| DPP_Opco | process.DPP_Opco | static | Spain |
| DPP_ProcessName | process.DPP_ProcessName | execution | Process Name |
| DPP_ExecutionID | process.DPP_ExecutionID | execution | Execution Id |
| DPP_ProcessID | process.DPP_ProcessID | execution | Process Id |
| DPP_DistributorID | process.DPP_DistributorID | profile | senderId (Root/Object/senderId) from profile `2c22d82b-41d8-4a0c-a099-5e7c3d4cb76c` |

### Shape: Set XOMI Properties (ID: shape4)
**Type:** documentproperties

| Property | Property ID | Source Type | Source Value |
|----------|-------------|------------|-------------|
| DPP_FWK_BusinessProcess | process.DPP_FWK_BusinessProcess | crossref | HNK_GLO_CRT_XOMI_GetDetails (InterfaceNumber=28360) → BusinessProcess |
| DPP_FWK_EntityType | process.DPP_FWK_EntityType | static | priceListItem |
| DPP_FWK_Subprocess | process.DPP_FWK_Subprocess | crossref | HNK_GLO_CRT_XOMI_GetDetails (InterfaceNumber=28360) → SubProcess |
| DPP_FWK_CountryCodeISO | process.DPP_FWK_CountryCodeISO | static | ES |
| DPP_FWK_LogXOMI | process.DPP_FWK_LogXOMI | crossref | HNK_GLO_CRT_XOMI_GetDetails (InterfaceNumber=28360) → LogFlag |

### Shape: Branch (ID: shape14)
**Type:** branch

| Branch | Target Shape | Description |
|--------|--------------|-------------|
| 1 | shape10 | Message Shape path |
| 2 | shape16 | Try/Catch path |
| 3 | shape26 | Exception decision path |
| 4 | shape30 | Async Solace path |

### Shape: Try/Catch (ID: shape16)
**Type:** catcherrors

| Setting | Value |
|---------|-------|
| **Catch All** | true |
| **Retry Count** | 3 |
| **Try Path** | shape35 (Process Call) |
| **Catch Path** | shape37 (set error msg) |

### Shape: Process Call (ID: shape35)
**Type:** processcall

| Setting | Value |
|---------|-------|
| **Process ID** | `481e74e4-11de-4756-89b2-722a5ab7dd35` |
| **Process Name** | HNK_ES_SUB_28351_SAP_SFDC_PriceBookEntry |
| **Abort on Error** | true |
| **Wait for Completion** | true |
| **Return Paths** | Error → shape25 |

### Shape: Exception? (ID: shape26)
**Type:** decision

| Setting | Value |
|---------|-------|
| **Comparison Type** | equals |
| **Left Value** | process.DPP_Exception |
| **Right Value** | static: "true" |
| **True Path** | shape22 (Set XOMI properties-ERROR) |
| **False Path** | shape21 (Set XOMI properties-SEND) |

### Shape: Set XOMI properties-SEND (ID: shape21)
**Type:** documentproperties

| Property | Property ID | Source Type | Source Value |
|----------|-------------|------------|-------------|
| DPP_FWK_Stage | process.DPP_FWK_Stage | static | send |
| DPP_FWK_Message | process.DPP_FWK_Message | static | Message from SAP to B2B - Processed Successfully |
| DPP_FWK_Final | process.DPP_FWK_Final | static | true |
| DPP_FWK_XOMIrouteKey | process.DPP_FWK_XOMIrouteKey | static | eventmessage |

### Shape: Set XOMI properties-ERROR (ID: shape22)
**Type:** documentproperties

| Property | Property ID | Source Type | Source Value |
|----------|-------------|------------|-------------|
| DPP_FWK_Stage | process.DPP_FWK_Stage | static | process |
| DPP_FWK_Message | process.DPP_FWK_Message | static | Message from SAP to B2B - Error in Boomi process |
| DPP_FWK_Final | process.DPP_FWK_Final | static | true |
| DPP_FWK_XOMIrouteKey | process.DPP_FWK_XOMIrouteKey | static | movelogstoxomi |
| DPP_FWK_Status | process.DPP_FWK_Status | static | error |
| DPP_ProcessName | process.DPP_ProcessName | execution | Process Name |
| DPP_ExecutionID | process.DPP_ExecutionID | execution | Execution Id |

### Shape: Set XOMI properties-SENDTOSPLUNK(Asynch Process) (ID: shape30)
**Type:** documentproperties

| Property | Property ID | Source Type | Source Value |
|----------|-------------|------------|-------------|
| DPP_FWK_XOMIrouteKey | process.DPP_FWK_XOMIrouteKey | static | sendtosolace_asynch |
| DPP_FWK_NodeId | process.DPP_FWK_NodeId | execution | Node Id |
| DPP_FWK_MainProcessId | process.DPP_FWK_MainProcessId | execution | Process Id |

### Shape: Send Msg(s) to Solace (ID: shape31)
**Type:** processroute

| Setting | Value |
|---------|-------|
| **Route ID** | resource::rout:3c52b458-1459-4908-96be-2a6aa498c8d0 |
| **Route Name** | [FWK] XOMI Processing |
| **Wait for Completion** | true |
| **Abort on Error** | false |
| **Route Parameter** | DPP_FWK_XOMIrouteKey |

---

## 3.2 Process: HNK_ES_SUB_28351_SAP_SFDC_PriceBookEntry - Shape Configurations

### Shape: Data from 28350 / 28360 (common sub process) (ID: shape1)
**Type:** start

| Setting | Value |
|---------|-------|
| **Action Type** | Passthrough |

### Shape: Convert to SF Format (ID: shape16)
**Type:** map

| Setting | Value |
|---------|-------|
| **Map ID** | `f114151e-bb42-49d3-b7f8-b2da80c2bfae` |
| **Map Name** | HNK_ES_MAP_JSON_XML_PriceBookEntry_Sync_c |

### Shape: Send to Salesforce (ID: shape17)
**Type:** connectoraction

| Setting | Value |
|---------|-------|
| **Action Type** | Send |
| **Connector Type** | salesforce |
| **Connection ID** | `061621cd-46f9-4984-9a5e-6373111aeb25` |
| **Operation ID** | `d9daa80d-36df-4fed-b5e5-ec901bcedb65` |
| **Request Profile** | `20c4a0c3-1428-456f-abf1-c453fec29910` (HNK_ES_PRF_XML_Bulk_SF_PricebookEntrySync_c_UPSERT_Request) |
| **Allow Dynamic Credentials** | NONE |

### Shape: ErrorExistInResponsePayload? (ID: shape7)
**Type:** decision

| Setting | Value |
|---------|-------|
| **Comparison Type** | wildcard |
| **Left Value** | current document |
| **Right Value** | static: "*statusCode*" |
| **True Path** | shape8 (Try Catch) |
| **False Path** | shape10 (Decision?) |

### Shape: Try Catch (ID: shape8)
**Type:** catcherrors

| Setting | Value |
|---------|-------|
| **Catch All** | false |
| **Retry Count** | 0 |
| **Try Path** | shape9 (sfdc response mapping) |
| **Catch Path** | shape5 (sfdc response mapping) |

### Shape: sfdc response mapping (ID: shape9, shape5)
**Type:** map

| Setting | Value |
|---------|-------|
| **Map ID** | `d64b02b3-a8da-45fb-9105-badba74ae85f` |
| **Map Name** | HNK_GLO_MAP_XML_FF_SFDC_PriceBookEntryBulk_Response_v1 |

### Shape: Combine,Replace (ID: shape4)
**Type:** dataprocess

| Step | Process Type | Name | Configuration |
|------|--------------|------|--------------|
| 1 | 9 (Combine) | Combine Documents | profileType: none |
| 2 | 1 (Search/Replace) | Search/Replace | texttofind: `&lt;\?xml.*\?&gt;`, replacewith: "" (empty), searchCharacterLimit: 1024 |

### Shape: Error (ID: shape6)
**Type:** returndocuments

| Setting | Value |
|---------|-------|
| **Label** | Error |

### Shape: Decision? (ID: shape10)
**Type:** decision

| Setting | Value |
|---------|-------|
| **Comparison Type** | equals |
| **Left Value** | meta.base.applicationstatuscode |
| **Right Value** | static: "503" |
| **True Path** | shape11 (Exception) |
| **False Path** | shape3 (Stop) |

### Shape: Exception (ID: shape11)
**Type:** exception

| Setting | Value |
|---------|-------|
| **Message** | Connection error while connecting to the SFDC |
| **Stop Process Return Single Doc** | false |
| **Stop Single Doc** | true |

---
