# HNK_ES_PRC_28360_SAP_SFDC_NetListPrices - Function Reference

**Referenced from:** `../01_pricing_sync_technical_design.md` Section 4  
**Generated:** 2026-01-27

---

## Function Reference

### Function: HNK_ES_UDF_Pricebook2id (Key: 7)

**Function ID:** `7a866fc6-f9de-48be-aa72-1c0dc2e89249`  
**Type:** User Defined Function  
**Description:** pricebook2id : SalesOrg + distributorKey+ priceListKey

**Inputs:**

| Key | Name | Source |
|-----|------|--------|
| 1 | PricelistKey | Root/Array/ArrayElement1/Object/priceListKey |
| 2 | salesorg | Root/Array/ArrayElement1/Object/salesArea/Object/salesOrganization |

**Outputs:**

| Key | Name | Target |
|-----|------|--------|
| 1 | Pricbookid | HNK_PricebookEntrySync__c/HNK_UniqueExternalPriceBookId__c |

**Function Steps:**

| Step | Type | Name | Configuration |
|------|------|------|---------------|
| 1 | PropertyGet | Get Dynamic Process Property | Property: DPP_DistributorID |
| 2 | StringSplit | String Split | Delimiter: "-", Outputs: Appid, distid |
| 3 | StringConcat | String Concat | Delimiter: "-", Inputs: Country_code (default: ESID), Distribut_id, PriceListkey |

**Logic:** Concatenates SalesOrg (Country code), Distributor ID (from process property), and PriceListKey with "-" delimiter.

---

### Function: HNK_ES_UDF_ConcatUniqueExternalpricebookEntryId (Key: 9)

**Function ID:** `be2c04e3-7502-4ec8-8458-130abd54ce1a`  
**Type:** User Defined Function  
**Description:** HNK_UniqueExternalPriceBookEntryId__c : SalesOrg + distributorKey+priceListKey + localMaterialId

**Inputs:**

| Key | Name | Source |
|-----|------|--------|
| 1 | local_,material_id | Root/Array/ArrayElement1/Object/priceListItems/Array/ArrayElement1/Object/localMaterialId |
| 2 | pricelist_key | Root/Array/ArrayElement1/Object/priceListKey |
| 3 | salesorg | Root/Array/ArrayElement1/Object/salesArea/Object/salesOrganization |

**Outputs:**

| Key | Name | Target |
|-----|------|--------|
| 1 | pricebook_entryid | HNK_PricebookEntrySync__c/HNK_UniqueExternalId__c |

**Function Steps:**

| Step | Type | Name | Configuration |
|------|------|------|---------------|
| 1 | PropertyGet | Get Dynamic Process Property | Property: DPP_DistributorID |
| 2 | StringSplit | String Split | Delimiter: "-", Outputs: Appid, distid |
| 3 | StringConcat | String Concat | Delimiter: "-", Inputs: Countrycode (default: ESID), distributer_id, Pricelistkey, Local_material_id |

**Logic:** Concatenates SalesOrg (Country code), Distributor ID (from process property), PriceListKey, and LocalMaterialId with "-" delimiter.

---

### Function: HNK_ES_UDF_ProductID (Key: 10)

**Function ID:** `132bd81b-f396-419c-9553-37474e1278ef`  
**Type:** User Defined Function

**Inputs:**

| Key | Name | Source |
|-----|------|--------|
| 1 | Local_material_ID | Root/Array/ArrayElement1/Object/priceListItems/Array/ArrayElement1/Object/localMaterialId |

**Outputs:**

| Key | Name | Target |
|-----|------|--------|
| 1 | ProductID | HNK_PricebookEntrySync__c/HNK_UniqueExternalProduct2Id__c |

**Function Steps:**

| Step | Type | Name | Configuration |
|------|------|------|---------------|
| 1 | PropertyGet | Get Dynamic Process Property | Property: DPP_DistributorID |
| 2 | PropertyGet | Get Dynamic Process Property | Property: DPP_Opco |
| 3 | CrossRefLookup | Cross Reference Lookup | Table: HNK_GLO_CRT_GlobalSFDC (df5a5c72-2810-4a23-a0d7-e82fe31f63a8), Input: Opco, Output: CountryCode |
| 4 | StringConcat | String Concat | Delimiter: "-", Inputs: Countrycode, Local_materialid |

**Logic:** Gets Opco from process property, looks up CountryCode from cross-reference table, then concatenates CountryCode and LocalMaterialId with "-" delimiter.

---

### Function: HNK_ES_UDF_Date (Key: 11)

**Function ID:** `b8e6b9ac-727f-481a-b64c-2325d5f452cb`  
**Type:** User Defined Function

**Inputs:**

| Key | Name | Source |
|-----|------|--------|
| 1 | validFrom | Root/Array/ArrayElement1/Object/priceListItems/Array/ArrayElement1/Object/validFrom |
| 2 | validTo | Root/Array/ArrayElement1/Object/priceListItems/Array/ArrayElement1/Object/validTo |

**Outputs:**

| Key | Name | Target |
|-----|------|--------|
| 1 | valid_From | HNK_PricebookEntrySync__c/HNK_ValidFrom__c |
| 2 | valid_To | HNK_PricebookEntrySync__c/HNK_ValidTo__c |

**Function Steps:**

| Step | Type | Name | Configuration |
|------|------|------|---------------|
| 1 | DateFormat | Date Format | Input Mask: yyyy-MM-dd'T'HH:mm:ss, Output Mask: yyyy-MM-dd |
| 2 | DateFormat | Date Format | Input Mask: yyyy-MM-dd'T'HH:mm:ss, Output Mask: yyyy-MM-dd |

**Logic:** Formats both validFrom and validTo dates from ISO datetime format (yyyy-MM-dd'T'HH:mm:ss) to date-only format (yyyy-MM-dd).

---

### Function: HNK_GLO_UDF_PriceBulk_RemoveUnnecessaryErrors (Key: 2)

**Function ID:** `17dfc69b-708f-4623-9497-00b088a7abd8`  
**Type:** User Defined Function  
**Note:** Function definition not found in export files. Function is referenced but XML file is missing.

**Inputs:**

| Key | Name | Source |
|-----|------|--------|
| 1 | Message | HNK_PricebookEntrySync__c/Error/message |
| 2 | statusCode | HNK_PricebookEntrySync__c/Error/statusCode |
| 3 | PBE | HNK_PricebookEntrySync__c/Fields/HNK_UniqueExternalId__c |
| 4 | PB2 | HNK_PricebookEntrySync__c/Fields/HNK_UniqueExternalPriceBookId__c |
| 5 | PD | HNK_PricebookEntrySync__c/Fields/HNK_UniqueExternalProduct2Id__c |
| 6 | success | HNK_PricebookEntrySync__c/Success |

**Outputs:**

| Key | Name | Target |
|-----|------|--------|
| 1 | O/p | Record/Elements/Error |

**Purpose:** Processes Salesforce Bulk API response to format error messages, filtering unnecessary errors based on success status and error details.

---
