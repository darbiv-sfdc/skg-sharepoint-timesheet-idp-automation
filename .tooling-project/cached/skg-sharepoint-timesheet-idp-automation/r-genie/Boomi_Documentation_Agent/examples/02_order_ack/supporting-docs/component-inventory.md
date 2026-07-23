# HNK_ES_PRC_28210_SAPXH1_Salesforce_OrderAck - Component Inventory

**Referenced from:** `../02_order_ack_technical_design.md` Section 1.3  
**Generated:** 2026-01-27

---

## Component Inventory

| # | File | Type | Name | ID | Elements |
|---|------|------|------|----|----------|
| 1 | `171fae98-c932-46b6-9fca-12ddc8cde07b.xml` | process | HNK_ES_PRC_28210_SAPXH1_Salesforce_OrderAck | `171fae98-c932-46b6-9fca-12ddc8cde07b` | 31 shapes |
| 2 | `36d64309-124c-49a0-8417-bf393a8c24b9.xml` | process | HNK_ES_SUB_28211_SF_TokenGeneration | `36d64309-124c-49a0-8417-bf393a8c24b9` | 8 shapes |
| 3 | `7795da3f-b322-4738-a8fd-636736ccf92a.xml` | transform.map | HNK_ES_MAP_XML_JSON_SAP_SF_OrderCreation | `7795da3f-b322-4738-a8fd-636736ccf92a` | 12 mappings |
| 4 | `2bdae992-5e41-44df-8744-23dc3e353065.xml` | transform.map | HNK_ES_MAP_RemoveNull | `2bdae992-5e41-44df-8744-23dc3e353065` | 14 mappings |
| 5 | `1ff4b0dc-4567-42ad-9e8c-d28095a74cf1.xml` | transform.function | HNK_HS_UDF_SalesOrderSimulate_ShipmentDate | `1ff4b0dc-4567-42ad-9e8c-d28095a74cf1` | 4 steps |
| 6 | `7a48de43-042d-4caa-9c02-0acd3312ca79.xml` | connector-settings | HNK_GLO_CON_SOLACE_PUBSUB | `7a48de43-042d-4caa-9c02-0acd3312ca79` | 1 connector |
| 7 | `20dc6304-3082-4adf-8b56-47001f46b6a0.xml` | connector-settings | HNK_ES_CON_HTTP_Salesforce | `20dc6304-3082-4adf-8b56-47001f46b6a0` | 1 connector |
| 8 | `ee348c0f-cafd-4bcd-a156-9fd170868319.xml` | connector-settings | HNK_GLO_CON_HTTP_AzureKeyVault | `ee348c0f-cafd-4bcd-a156-9fd170868319` | 1 connector |
| 9 | `dc201580-704c-42b7-91ed-87b1c923f572.xml` | connector-action | HNK_ES_OPR_SAP_Salesforce_Order | `dc201580-704c-42b7-91ed-87b1c923f572` | 1 operation |
| 10 | `18f5688a-ac6b-4936-b6e7-df69dc3ef292.xml` | connector-action | HNK_ES_OPR_Salesforce_OrderAck | `18f5688a-ac6b-4936-b6e7-df69dc3ef292` | 1 operation |
| 11 | `5c4e4ad2-6310-466a-bc60-932654631400.xml` | connector-action | HNK_ES_OPR_SF_Common_Token | `5c4e4ad2-6310-466a-bc60-932654631400` | 1 operation |
| 12 | `9cfa39e6-3330-4709-b0b7-523f1c83ca51.xml` | connector-action | HNK_GLO_OPR_HTTP_AzureKeyVault_GetSecret | `9cfa39e6-3330-4709-b0b7-523f1c83ca51` | 1 operation |
| 13 | `75d8a3ee-dcba-48e8-939e-5727aedd5bfb.xml` | crossref | HNK_GLO_CRT_XOMI_GetDetails | `75d8a3ee-dcba-48e8-939e-5727aedd5bfb` | Multiple rows |
| 14 | `e360e4ae-df0d-44e7-b3c6-93114ba7989f.xml` | profile.xml | HNK_ES_PRF_XML_SAPXH1_SalesOrder | `e360e4ae-df0d-44e7-b3c6-93114ba7989f` | 27 fields |
| 15 | `3898b817-d961-43ec-ab67-319dab8cc171.xml` | profile.json | HNK_ES_PRF_JSON_SF_SalesOrder_Ack | `3898b817-d961-43ec-ab67-319dab8cc171` | 18 fields |
| 16 | `58121f51-32c4-4d39-8df1-e20859aa5bb6.xml` | profile.json | HNK_ES_PRF_JSON_SF_TokenResponse | `58121f51-32c4-4d39-8df1-e20859aa5bb6` | 7 fields |
| 17 | `024bed29-733b-4cf7-ab9c-e604cb93ef7e.xml` | profile.flatfile | HNK_GB_PRF_FF_XTEL_SAP_ForecastPromoVol | `024bed29-733b-4cf7-ab9c-e604cb93ef7e` | 1 field |
| 18 | `141acaa9-cde1-4212-9b1c-aac53e04e93b.xml` | processproperty | HNK_ES_PPS_SAP_SF_B2BAsyncOrder | `141acaa9-cde1-4212-9b1c-aac53e04e93b` | Multiple properties |

**Component Summary:**
- **Processes:** 2 (total shapes: 39)
- **Maps:** 2 (total mappings: 26)
- **Functions:** 1 (4 steps)
- **Connectors:** 3
- **Operations:** 4
- **Cross References:** 1
- **Profiles:** 4 (1 XML, 2 JSON, 1 Flat File, total fields: 53)
- **Process Properties:** 1

> **📄 Complete profile structures:** See [`profile-structures.md`](profile-structures.md) for detailed field structures, hierarchies, and usage of all 4 profiles.

---
