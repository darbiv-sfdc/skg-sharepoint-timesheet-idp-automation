# HNK_ES_PRC_28210_SAPXH1_Salesforce_OrderAck - Shape Configurations

**Referenced from:** `../02_order_ack_technical_design.md` Section 3  
**Generated:** 2026-01-27

---

## 3.1 Process: HNK_ES_PRC_28210_SAPXH1_Salesforce_OrderAck - Shape Configurations

### Shape: Solace Connector for Listening Events (ID: shape1)
**Type:** start  
**Position:** x=48.0, y=48.0

| Setting | Value |
|---------|-------|
| **Action Type** | Listen |
| **Connection ID** | 7a48de43-042d-4caa-9c02-0acd3312ca79 |
| **Connector Type** | solacetpp-VMLLNA-solace-prod |
| **Operation ID** | dc201580-704c-42b7-91ed-87b1c923f572 |
| **Operation Name** | HNK_ES_OPR_SAP_Salesforce_Order |
| **Mode** | PERSISTENT_TRANSACTED |
| **Destination** | HNK/OTC/SalesOrderResponseB2B/ES/SF |
| **Batch Size** | 1 |
| **Receive Timeout** | 10000 ms |
| **Max Concurrent Executions** | 1 |
| **Request Profile Type** | xml |
| **Response Profile Type** | xml |
| **Tracking Field** | KeyTransactionDataID (from VBELN profile field) |

**Next Shape:** shape12

---

### Shape: Branch (ID: shape12)
**Type:** branch  
**Position:** x=240.0, y=48.0

| Setting | Value |
|---------|-------|
| **Number of Branches** | 4 |

**Branch Paths:**
- Path 1: shape37 (Set XOMI Properties-RECEIVE)
- Path 2: shape2 (Try/Catch)
- Path 3: shape19 (Exception Decision)
- Path 4: shape25 (Set XOMI properties-SENDTOSPLUNK)

---

### Shape: Set XOMI Properties-RECEIVE (ID: shape37)
**Type:** documentproperties  
**Position:** x=432.0, y=48.0

**Properties:**

| Property | Property ID | Source Type | Source Value |
|----------|-------------|-------------|--------------|
| DPP_FWK_BusinessProcess | process.DPP_FWK_BusinessProcess | crossref | Cross-reference HNK_GLO_CRT_XOMI_GetDetails, input InterfaceNumber=28210, output BusinessProcess |
| DPP_FWK_Subprocess | process.DPP_FWK_Subprocess | crossref | Cross-reference HNK_GLO_CRT_XOMI_GetDetails, input InterfaceNumber=28210, output SubProcess |
| DPP_FWK_EntityType | process.DPP_FWK_EntityType | static | SalesOrderSpain |
| DPP_FWK_EntityId | process.DPP_FWK_EntityId | profile + static | VBELN (profile) + "_" + ACKID (profile) |
| DPP_FWK_Stage | process.DPP_FWK_Stage | static | receive |
| DPP_FWK_Message | process.DPP_FWK_Message | static | Message from Solace XH1 to Salesforce |
| DPP_FWK_CountryCodeISO | process.DPP_FWK_CountryCodeISO | static | ES |
| DPP_FWK_LogXOMI | process.DPP_FWK_LogXOMI | definedparameter | From HNK_ES_PP_SAPXH1_Path property 28210_PP_FWK_LogXOMI |
| DPP_FWK_XOMIrouteKey | process.DPP_FWK_XOMIrouteKey | static | eventmessage |

**Next Shape:** shape15

---

### Shape: Set XOMI Receive Msg to Cache (ID: shape15)
**Type:** processroute  
**Position:** x=624.0, y=48.0

| Setting | Value |
|---------|-------|
| **Process Route ID** | resource::rout:3c52b458-1459-4908-96be-2a6aa498c8d0 |
| **Process Route Name** | [FWK] XOMI Processing |
| **Abort on Error** | false |
| **Wait for Completion** | true |
| **Route Parameter** | DPP_FWK_XOMIrouteKey (process property) |

**Next Shape:** shape14

---

### Shape: Terminate Data Flow (ID: shape14)
**Type:** stop  
**Position:** x=816.0, y=48.0

| Setting | Value |
|---------|-------|
| **Continue** | true |

**Next Shape:** END

---

### Shape: Try/Catch (ID: shape2)
**Type:** catcherrors  
**Position:** x=432.0, y=208.0

| Setting | Value |
|---------|-------|
| **Catch All** | true |
| **Retry Count** | 0 |

**Paths:**
- Try: shape3
- Catch: shape16

---

### Shape: Decision (ID: shape3)
**Type:** decision  
**Position:** x=624.0, y=208.0

| Setting | Value |
|---------|-------|
| **Comparison** | notequals |
| **Left Value** | Profile element: SKU;WEEK;YEAR;NOTUSED;VOLUME;CUSTOMERLEV2;DESACTION;PROMOVOL (profile HNK_GB_PRF_FF_XTEL_SAP_ForecastPromoVol, elementId=11) |
| **Right Value** | Static: empty string |

**Paths:**
- True: shape28
- False: shape8

---

### Shape: Branch (ID: shape28)
**Type:** branch  
**Position:** x=816.0, y=208.0

| Setting | Value |
|---------|-------|
| **Number of Branches** | 2 |

**Branch Paths:**
- Path 1: shape40 (SET property for token)
- Path 2: shape4 (HNK_ES_MAP_XML_JSON_SAP_SF_OrderCreation)

---

### Shape: SET property for token (ID: shape40)
**Type:** documentproperties  
**Position:** x=1008.0, y=208.0

**Properties:**

| Property | Property ID | Source Type | Source Value |
|----------|-------------|-------------|--------------|
| DPP_OAuthPath | process.DPP_OAuthPath | definedparameter | From HNK_ES_PPS_SAP_SF_B2BAsyncOrder property TokenPath |
| DPP_OAuthGrantType | process.DPP_OAuthGrantType | definedparameter | From HNK_ES_PPS_SAP_SF_OrderAck property grant_type |
| DPP_OAuthClientID | process.DPP_OAuthClientID | definedparameter | From HNK_ES_PPS_SAP_SF_B2BAsyncOrder property client_id |
| DPP_OAuthClientSecret | process.DPP_OAuthClientSecret | connector | Azure Key Vault GetSecret operation, input DDP_Key from defined parameter client_secret_alias |
| DPP_OAuthUserName | process.DPP_OAuthUserName | definedparameter | From HNK_ES_PPS_SAP_SF_B2BAsyncOrder property username |
| DPP_OAuthPWD | process.DPP_OAuthPWD | connector | Azure Key Vault GetSecret operation, input DDP_Key from defined parameter password_alias |

**Next Shape:** shape32

---

### Shape: Call Salesforce Token Process (ID: shape32)
**Type:** processcall  
**Position:** x=1200.0, y=208.0

| Setting | Value |
|---------|-------|
| **Process ID** | 36d64309-124c-49a0-8417-bf393a8c24b9 |
| **Process Name** | HNK_ES_SUB_28211_SF_TokenGeneration |
| **Abort on Error** | true |
| **Wait for Completion** | true |

**Next Shape:** shape4

---

### Shape: HNK_ES_MAP_XML_JSON_SAP_SF_OrderCreation (ID: shape4)
**Type:** map  
**Position:** x=1008.0, y=368.0

| Setting | Value |
|---------|-------|
| **Map ID** | 7795da3f-b322-4738-a8fd-636736ccf92a |
| **Map Name** | HNK_ES_MAP_XML_JSON_SAP_SF_OrderCreation |
| **Source Profile** | HNK_ES_PRF_XML_SAPXH1_SalesOrder (e360e4ae-df0d-44e7-b3c6-93114ba7989f) |
| **Target Profile** | HNK_ES_PRF_JSON_SF_SalesOrder_Ack (3898b817-d961-43ec-ab67-319dab8cc171) |
| **Optimize Execution Order** | true |

**Next Shape:** shape38

---

### Shape: HNK_ES_MAP_RemoveNull (ID: shape38)
**Type:** map  
**Position:** x=1200.0, y=368.0

| Setting | Value |
|---------|-------|
| **Map ID** | 2bdae992-5e41-44df-8744-23dc3e353065 |
| **Map Name** | HNK_ES_MAP_RemoveNull |
| **Source Profile** | HNK_ES_PRF_JSON_SF_SalesOrder_Ack (3898b817-d961-43ec-ab67-319dab8cc171) |
| **Target Profile** | HNK_ES_PRF_JSON_SF_SalesOrder_Ack (3898b817-d961-43ec-ab67-319dab8cc171) |
| **Optimize Execution Order** | true |

**Next Shape:** shape34

---

### Shape: set properties (ID: shape34)
**Type:** documentproperties  
**Position:** x=1392.0, y=368.0

**Properties:**

| Property | Property ID | Source Type | Source Value |
|----------|-------------|-------------|--------------|
| Authorization | dynamicdocument.Authorization | process | DPP_OAUTHCODE process property |
| DDP_PATH | dynamicdocument.DDP_PATH | definedparameter | From HNK_ES_PP_SAPXH1_Path property SF_SalesOrder_Path |

**Next Shape:** shape9

---

### Shape: Send Ack to SF (ID: shape9)
**Type:** connectoraction  
**Position:** x=1584.0, y=368.0

| Setting | Value |
|---------|-------|
| **Action Type** | Send |
| **Connection ID** | 20dc6304-3082-4adf-8b56-47001f46b6a0 |
| **Connector Type** | http |
| **Operation ID** | 18f5688a-ac6b-4936-b6e7-df69dc3ef292 |
| **Operation Name** | HNK_ES_OPR_Salesforce_OrderAck |
| **Method** | POST |
| **Content Type** | application/json |
| **Request Profile Type** | JSON |
| **Response Profile Type** | JSON |
| **Authorization Header** | From dynamic document property Authorization |
| **Path** | From dynamic document property DDP_PATH |

**Next Shape:** shape10

---

### Shape: Check status code (ID: shape10)
**Type:** decision  
**Position:** x=1776.0, y=368.0

| Setting | Value |
|---------|-------|
| **Comparison** | equals |
| **Left Value** | Track property: meta.base.applicationstatuscode |
| **Right Value** | Static: 200 |

**Paths:**
- True: shape11
- False: shape35

---

### Shape: Stop (ID: shape11)
**Type:** stop  
**Position:** x=1968.0, y=368.0

| Setting | Value |
|---------|-------|
| **Continue** | true |

**Next Shape:** END

---

### Shape: Exception? (ID: shape35)
**Type:** exception  
**Position:** x=1968.0, y=528.0

| Setting | Value |
|---------|-------|
| **Stop Process Return Single Doc** | false |
| **Stop Single Doc** | true |
| **Exception Message** | {1} (from meta.base.applicationstatusmessage) |

**Next Shape:** END

---

### Shape: Set AlertDetails (ID: shape16)
**Type:** documentproperties  
**Position:** x=624.0, y=848.0

**Properties:**

| Property | Property ID | Source Type | Source Value |
|----------|-------------|-------------|--------------|
| DPP_Exception | process.DPP_Exception | static | true |
| DPP_AlertMailSubject | process.DPP_AlertMailSubject | static | Error in Boomi Interface SAP XH1 to Salesforce Ack |
| DPP_AlertMailBody | process.DPP_AlertMailBody | static | Error during Process Execution |
| DDP_LogKey | dynamicdocument.DDP_LogKey | static | 1 |

**Next Shape:** shape17

---

### Shape: Send ErrMsg (ID: shape17)
**Type:** message  
**Position:** x=816.0, y=848.0

| Setting | Value |
|---------|-------|
| **Message Template** | `<ErrorMessage><MessageText>{1}</MessageText></ErrorMessage>` |
| **Parameter {1}** | Track property: meta.base.catcherrorsmessage |

**Next Shape:** shape18

---

### Shape: Cache ErrorMsg (ID: shape18)
**Type:** doccacheload  
**Position:** x=1008.0, y=848.0

| Setting | Value |
|---------|-------|
| **Document Cache ID** | 70586e06-2db1-4885-8331-88cd9bc539c9 |

**Next Shape:** END

---

### Shape: Exception? (ID: shape19)
**Type:** decision  
**Position:** x=432.0, y=1008.0

| Setting | Value |
|---------|-------|
| **Comparison** | equals |
| **Left Value** | Process property: DPP_Exception |
| **Right Value** | Static: true |

**Paths:**
- True: shape21
- False: shape20

---

### Shape: Set XOMI properties-ERROR (ID: shape21)
**Type:** documentproperties  
**Position:** x=624.0, y=1008.0

**Properties:**

| Property | Property ID | Source Type | Source Value |
|----------|-------------|-------------|--------------|
| DPP_FWK_Stage | process.DPP_FWK_Stage | static | process |
| DPP_FWK_Final | process.DPP_FWK_Final | static | true |
| DPP_FWK_XOMIrouteKey | process.DPP_FWK_XOMIrouteKey | static | movelogstoxomi |
| DPP_FWK_Status | process.DPP_FWK_Status | static | error |

**Next Shape:** shape23

---

### Shape: Set XOMI Process Msg to Cache (ID: shape23)
**Type:** processroute  
**Position:** x=816.0, y=1008.0

| Setting | Value |
|---------|-------|
| **Process Route ID** | resource::rout:3c52b458-1459-4908-96be-2a6aa498c8d0 |
| **Process Route Name** | [FWK] XOMI Processing |
| **Abort on Error** | false |
| **Wait for Completion** | true |
| **Route Parameter** | DPP_FWK_XOMIrouteKey (process property) |

**Next Shape:** shape24

---

### Shape: Set XOMI properties-SEND (ID: shape20)
**Type:** documentproperties  
**Position:** x=624.0, y=1168.0

**Properties:**

| Property | Property ID | Source Type | Source Value |
|----------|-------------|-------------|--------------|
| DPP_FWK_Stage | process.DPP_FWK_Stage | static | send |
| DPP_FWK_Final | process.DPP_FWK_Final | definedparameter | From HNK_ES_PP_SAPXH1_Path property 28210_PP_FWK_TransactionFinal |
| DPP_FWK_XOMIrouteKey | process.DPP_FWK_XOMIrouteKey | static | eventmessage |

**Next Shape:** shape22

---

### Shape: Set XOMI Send Msg to Cache (ID: shape22)
**Type:** processroute  
**Position:** x=816.0, y=1168.0

| Setting | Value |
|---------|-------|
| **Process Route ID** | resource::rout:3c52b458-1459-4908-96be-2a6aa498c8d0 |
| **Process Route Name** | [FWK] XOMI Processing |
| **Abort on Error** | false |
| **Wait for Completion** | true |
| **Route Parameter** | DPP_FWK_XOMIrouteKey (process property) |

**Next Shape:** shape24

---

### Shape: Terminate Data Flow (ID: shape24)
**Type:** stop  
**Position:** x=1008.0, y=1008.0

| Setting | Value |
|---------|-------|
| **Continue** | true |

**Next Shape:** END

---

### Shape: Set XOMI properties-SENDTOSPLUNK(Asynch Process) (ID: shape25)
**Type:** documentproperties  
**Position:** x=432.0, y=1328.0

**Properties:**

| Property | Property ID | Source Type | Source Value |
|----------|-------------|-------------|--------------|
| DPP_FWK_XOMIrouteKey | process.DPP_FWK_XOMIrouteKey | static | sendtosolace_asynch |
| DPP_FWK_NodeId | process.DPP_FWK_NodeId | execution | Node Id |
| DPP_FWK_MainProcessId | process.DPP_FWK_MainProcessId | execution | Process Id |

**Next Shape:** shape26

---

### Shape: Send Msg(s) to Solace (ID: shape26)
**Type:** processroute  
**Position:** x=624.0, y=1328.0

| Setting | Value |
|---------|-------|
| **Process Route ID** | resource::rout:3c52b458-1459-4908-96be-2a6aa498c8d0 |
| **Process Route Name** | [FWK] XOMI Processing |
| **Abort on Error** | false |
| **Wait for Completion** | true |
| **Route Parameter** | DPP_FWK_XOMIrouteKey (process property) |

**Next Shape:** shape27

---

### Shape: Terminate Data Flow (ID: shape27)
**Type:** stop  
**Position:** x=816.0, y=1328.0

| Setting | Value |
|---------|-------|
| **Continue** | true |

**Next Shape:** END

---

### Shape: Terminate Data Flow (ID: shape8)
**Type:** stop  
**Position:** x=816.0, y=688.0

| Setting | Value |
|---------|-------|
| **Continue** | true |

**Next Shape:** END

---

### Shape: Data Process (ID: shape36)
**Type:** dataprocess  
**Position:** x=48.0, y=1488.0

| Setting | Value |
|---------|-------|
| **Step 1: Search/Replace** | Find: "null,", Replace: "", Search Type: document |

**Next Shape:** unset

---

## 3.2 Process: HNK_ES_SUB_28211_SF_TokenGeneration - Shape Configurations

### Shape: Passthrough (ID: shape1)
**Type:** start  
**Position:** x=96.0, y=32.0

| Setting | Value |
|---------|-------|
| **Action Type** | Passthrough |

**Next Shape:** shape3

---

### Shape: Request Token (ID: shape3)
**Type:** message  
**Position:** x=336.0, y=32.0

| Setting | Value |
|---------|-------|
| **Message Template** | `grant_type={1}&client_id={2}&client_secret={3}&username={4}&password={5}` |
| **Parameter {1}** | Process property: DPP_OAuthGrantType |
| **Parameter {2}** | Process property: DPP_OAuthClientID |
| **Parameter {3}** | Process property: DPP_OAuthClientSecret |
| **Parameter {4}** | Process property: DPP_OAuthUserName |
| **Parameter {5}** | Process property: DPP_OAuthPWD |

**Next Shape:** shape7

---

### Shape: Set URL Path (ID: shape7)
**Type:** documentproperties  
**Position:** x=528.0, y=32.0

**Properties:**

| Property | Property ID | Source Type | Source Value |
|----------|-------------|-------------|--------------|
| DDP_PATH | dynamicdocument.DDP_PATH | process | DPP_OAuthPath process property |

**Next Shape:** shape2

---

### Shape: Call salesforce (ID: shape2)
**Type:** connectoraction  
**Position:** x=656.0, y=32.0

| Setting | Value |
|---------|-------|
| **Action Type** | Send |
| **Connection ID** | 20dc6304-3082-4adf-8b56-47001f46b6a0 |
| **Connector Type** | http |
| **Operation ID** | 5c4e4ad2-6310-466a-bc60-932654631400 |
| **Operation Name** | HNK_ES_OPR_SF_Common_Token |
| **Method** | POST |
| **Content Type** | application/x-www-form-urlencoded |
| **Request Profile Type** | NONE |
| **Response Profile Type** | JSON |
| **Path** | From dynamic document property DDP_PATH |

**Next Shape:** shape5

---

### Shape: Success? (ID: shape5)
**Type:** decision  
**Position:** x=912.0, y=32.0

| Setting | Value |
|---------|-------|
| **Comparison** | equals |
| **Left Value** | Track property: meta.base.applicationstatuscode |
| **Right Value** | Static: 200 |

**Paths:**
- True: shape10
- False: shape6

---

### Shape: Set Token (ID: shape10)
**Type:** documentproperties  
**Position:** x=1088.0, y=32.0

**Properties:**

| Property | Property ID | Source Type | Source Value |
|----------|-------------|-------------|--------------|
| DPP_OAUTHCODE | process.DPP_OAUTHCODE | static + profile | "Bearer " + access_token (from HNK_ES_PRF_JSON_SF_TokenResponse profile, element access_token) |

**Next Shape:** shape9

---

### Shape: Stop execution (ID: shape9)
**Type:** stop  
**Position:** x=1200.0, y=32.0

| Setting | Value |
|---------|-------|
| **Continue** | true |

**Next Shape:** END

---

### Shape: Stop the process execution (ID: shape6)
**Type:** exception  
**Position:** x=1088.0, y=160.0

| Setting | Value |
|---------|-------|
| **Stop Single Doc** | true |
| **Exception Message** | {1}: {2} |
| **Parameter {1}** | Track property: meta.base.applicationstatuscode |
| **Parameter {2}** | Track property: meta.base.applicationstatusmessage |

**Next Shape:** END

---
