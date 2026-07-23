# HNK_ES_PRC_28360_SAP_SFDC_NetListPrices - Component Inventory

**Referenced from:** `../01_pricing_sync_technical_design.md` Section 1.3  
**Generated:** 2026-01-27

---

## Component Inventory

| # | File | Type | Name | ID | Elements |
|---|------|------|------|----|----------|
| 1 | `2429a385-bf85-46d6-906e-cbf936da85db.xml` | process | HNK_ES_PRC_28360_SAP_SFDC_NetListPrices | `2429a385-bf85-46d6-906e-cbf936da85db` | 24 shapes |
| 2 | `481e74e4-11de-4756-89b2-722a5ab7dd35.xml` | process | HNK_ES_SUB_28351_SAP_SFDC_PriceBookEntry | `481e74e4-11de-4756-89b2-722a5ab7dd35` | 12 shapes |
| 3 | `f114151e-bb42-49d3-b7f8-b2da80c2bfae.xml` | transform.map | HNK_ES_MAP_JSON_XML_PriceBookEntry_Sync_c | `f114151e-bb42-49d3-b7f8-b2da80c2bfae` | 15 mappings |
| 4 | `d64b02b3-a8da-45fb-9105-badba74ae85f.xml` | transform.map | HNK_GLO_MAP_XML_FF_SFDC_PriceBookEntryBulk_Response_v1 | `d64b02b3-a8da-45fb-9105-badba74ae85f` | 7 mappings |
| 5 | `132bd81b-f396-419c-9553-37474e1278ef.xml` | transform.function | HNK_ES_UDF_ProductID | `132bd81b-f396-419c-9553-37474e1278ef` | 1 function |
| 6 | `7a866fc6-f9de-48be-aa72-1c0dc2e89249.xml` | transform.function | HNK_ES_UDF_Pricebook2id | `7a866fc6-f9de-48be-aa72-1c0dc2e89249` | 1 function |
| 7 | `b8e6b9ac-727f-481a-b64c-2325d5f452cb.xml` | transform.function | HNK_ES_UDF_Date | `b8e6b9ac-727f-481a-b64c-2325d5f452cb` | 1 function |
| 8 | `be2c04e3-7502-4ec8-8458-130abd54ce1a.xml` | transform.function | HNK_ES_UDF_ConcatUniqueExternalpricebookEntryId | `be2c04e3-7502-4ec8-8458-130abd54ce1a` | 1 function |
| 9 | `7a48de43-042d-4caa-9c02-0acd3312ca79.xml` | connector-settings | HNK_GLO_CON_SOLACE_PUBSUB | `7a48de43-042d-4caa-9c02-0acd3312ca79` | 1 connector |
| 10 | `061621cd-46f9-4984-9a5e-6373111aeb25.xml` | connector-settings | HNK_ES_CON_SFDC_BulkAPI | `061621cd-46f9-4984-9a5e-6373111aeb25` | 1 connector |
| 11 | `904153db-a6f2-4ad4-b0ca-1333a672d438.xml` | connector-action | HNK_ES_OPR_Solace_List_Pricing | `904153db-a6f2-4ad4-b0ca-1333a672d438` | 1 operation |
| 12 | `d9daa80d-36df-4fed-b5e5-ec901bcedb65.xml` | connector-action | HNK_ES_OPR_Bulk_SFDC_Upsert_PricebookEntrySync__c | `d9daa80d-36df-4fed-b5e5-ec901bcedb65` | 1 operation |
| 13 | `75d8a3ee-dcba-48e8-939e-5727aedd5bfb.xml` | crossref | HNK_GLO_CRT_XOMI_GetDetails | `75d8a3ee-dcba-48e8-939e-5727aedd5bfb` | 0 rows |
| 14 | `df5a5c72-2810-4a23-a0d7-e82fe31f63a8.xml` | crossref | HNK_GLO_CRT_GlobalSFDC | `df5a5c72-2810-4a23-a0d7-e82fe31f63a8` | 0 rows |
| 15 | `2c22d82b-41d8-4a0c-a099-5e7c3d4cb76c.xml` | profile.json | HNK_GLO_PRF_JSON_APIC_Header_Req | `2c22d82b-41d8-4a0c-a099-5e7c3d4cb76c` | 2 fields |
| 16 | `de5f027a-d00e-4c37-a3af-22ae69f72ce4.xml` | profile.json | HNK_ES_PRF_JSON_PricingRequest | `de5f027a-d00e-4c37-a3af-22ae69f72ce4` | 49 fields |
| 17 | `20c4a0c3-1428-456f-abf1-c453fec29910.xml` | profile.xml | HNK_ES_PRF_XML_Bulk_SF_PricebookEntrySync_c_UPSERT_Request | `20c4a0c3-1428-456f-abf1-c453fec29910` | 15 fields |
| 18 | `a02caced-3ade-4943-a726-6d11da4860dd.xml` | profile.xml | HNK_GLO_PRF_XML_HNK_PriceBookEntrySync_c_Response | `a02caced-3ade-4943-a726-6d11da4860dd` | 12 fields |
| 19 | `13c3ea7e-a80c-4dd1-a7fb-22bfca6657cf.xml` | profile.flatfile | HNK_GLO_PRF_FF_SFDC_Errors | `13c3ea7e-a80c-4dd1-a7fb-22bfca6657cf` | 1 field |

**Component Summary:**
- **Processes:** 2 (total shapes: 36)
- **Maps:** 2 (total mappings: 22)
- **Functions:** 4
- **Connectors:** 2
- **Operations:** 2
- **Cross References:** 2
- **Profiles:** 5 (3 JSON, 2 XML, 1 Flat File, total fields: 79)

> **📄 Complete profile structures:** See [`profile-structures.md`](profile-structures.md) for detailed field structures, hierarchies, and usage of all 5 profiles.

---
