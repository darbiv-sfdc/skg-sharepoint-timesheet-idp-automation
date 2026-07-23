# HNK_ES_PRC_28360_SAP_SFDC_NetListPrices - Profile Structures

**Referenced from:** `../01_pricing_sync_technical_design.md` Section 4  
**Generated:** 2026-01-27

---

## Profile Inventory

| # | Profile ID | Name | Type | File | Fields |
|---|------------|------|------|------|--------|
| 1 | `2c22d82b-41d8-4a0c-a099-5e7c3d4cb76c` | HNK_GLO_PRF_JSON_APIC_Header_Req | JSON | `2c22d82b-41d8-4a0c-a099-5e7c3d4cb76c.xml` | 2 fields |
| 2 | `de5f027a-d00e-4c37-a3af-22ae69f72ce4` | HNK_ES_PRF_JSON_PricingRequest | JSON | `de5f027a-d00e-4c37-a3af-22ae69f72ce4.xml` | 49 fields |
| 3 | `20c4a0c3-1428-456f-abf1-c453fec29910` | HNK_ES_PRF_XML_Bulk_SF_PricebookEntrySync_c_UPSERT_Request | XML | `20c4a0c3-1428-456f-abf1-c453fec29910.xml` | 15 fields |
| 4 | `a02caced-3ade-4943-a726-6d11da4860dd` | HNK_GLO_PRF_XML_HNK_PriceBookEntrySync_c_Response | XML | `a02caced-3ade-4943-a726-6d11da4860dd.xml` | 12 fields |
| 5 | `13c3ea7e-a80c-4dd1-a7fb-22bfca6657cf` | HNK_GLO_PRF_FF_SFDC_Errors | Flat File | `13c3ea7e-a80c-4dd1-a7fb-22bfca6657cf.xml` | 1 field |

---

## 1. Profile: HNK_GLO_PRF_JSON_APIC_Header_Req

**Profile ID:** `2c22d82b-41d8-4a0c-a099-5e7c3d4cb76c`  
**Type:** JSON  
**Source File:** `2c22d82b-41d8-4a0c-a099-5e7c3d4cb76c.xml`  
**Strict Mode:** false  
**Usage:** Used in main process shape2 (documentproperties) to extract senderId from message headers

### Structure Tree

```
Root (character, key=1)
└── Object (key=2)
    ├── senderId (character, key=3, required)
    └── receiverId (character, key=4, required)
```

### Field Details

| Key | Name | Path | Data Type | Required | Mappable |
|-----|------|------|-----------|----------|----------|
| 1 | Root | Root | character | - | ✅ |
| 2 | Object | Root/Object | - | - | ❌ |
| 3 | senderId | Root/Object/senderId | character | ✅ | ✅ |
| 4 | receiverId | Root/Object/receiverId | character | ✅ | ✅ |

---

## 2. Profile: HNK_ES_PRF_JSON_PricingRequest

**Profile ID:** `de5f027a-d00e-4c37-a3af-22ae69f72ce4`  
**Type:** JSON  
**Source File:** `de5f027a-d00e-4c37-a3af-22ae69f72ce4.xml`  
**Strict Mode:** false  
**Usage:** Source profile for Map HNK_ES_MAP_JSON_XML_PriceBookEntry_Sync_c

### Structure Tree

```
Root (character, key=1)
└── Array (repeating, key=2)
    └── ArrayElement1 (character, key=3, minOccurs=0, maxOccurs=-1)
        └── Object (key=4)
            ├── name (character, key=5)
            ├── priceListKey (character, key=6)
            ├── status (character, key=7)
            ├── description (character, key=8)
            ├── validFrom (character, key=9)
            ├── validTo (character, key=10)
            ├── currencyKey (character, key=11)
            ├── distributorKey (character, key=12)
            ├── priority (number, key=13)
            ├── salesArea (character, key=14)
            │   └── Object (key=15)
            │       └── salesOrganization (character, key=16)
            ├── priceListType (character, key=17)
            ├── priceListItems (character, key=18)
            │   └── Array (repeating, key=19)
            │       └── ArrayElement1 (character, key=20, minOccurs=0, maxOccurs=-1)
            │           └── Object (key=21)
            │               ├── status (character, key=22)
            │               ├── localFields (character, key=23)
            │               │   └── Array (repeating, key=24)
            │               │       └── ArrayElement1 (character, key=25, minOccurs=0, maxOccurs=-1)
            │               │           └── Object (key=26)
            │               │               ├── fieldName (character, key=27)
            │               │               └── fieldValue (character, key=28)
            │               ├── currencyKey (character, key=29)
            │               ├── localMaterialId (character, key=30)
            │               ├── globalMaterialId (character, key=31)
            │               ├── globalTradeItemNumber (character, key=32)
            │               ├── unitOfMeasure (character, key=33)
            │               ├── unitPrice (number, key=34)
            │               ├── validFrom (character, key=35)
            │               ├── validTo (character, key=36)
            │               ├── relatedTo (character, key=37)
            │               │   └── Array (repeating, key=38)
            │               │       └── ArrayElement1 (character, key=39, minOccurs=0, maxOccurs=-1)
            │               │           └── Object (key=40)
            │               │               ├── relationType (character, key=41)
            │               │               └── relationKey (character, key=42)
            │               └── priceListItemType (character, key=43)
            └── relatedTo (character, key=44)
                └── Array (repeating, key=45)
                    └── ArrayElement1 (character, key=46, minOccurs=0, maxOccurs=-1)
                        └── Object (key=47)
                            ├── relationType (character, key=48)
                            └── relationKey (character, key=49)
```

### Field Summary

| Level | Field Count | Types |
|-------|-------------|-------|
| Root | 1 | character |
| Arrays | 4 | repeating elements |
| Objects | 5 | nested structures |
| Leaf Fields | 49 | character (45), number (4) |

### Key Fields Used in Mappings

| Field | Key | Path | Used In Map |
|-------|-----|------|-------------|
| status | 22 | Root/Array/ArrayElement1/Object/priceListItems/Array/ArrayElement1/Object/status | Map 4.1, Mapping #1 |
| unitPrice | 34 | Root/Array/ArrayElement1/Object/priceListItems/Array/ArrayElement1/Object/unitPrice | Map 4.1, Mapping #2 |
| priceListKey | 6 | Root/Array/ArrayElement1/Object/priceListKey | Map 4.1, Mapping #4, #6 |
| salesOrganization | 16 | Root/Array/ArrayElement1/Object/salesArea/Object/salesOrganization | Map 4.1, Mapping #5, #7 |
| localMaterialId | 30 | Root/Array/ArrayElement1/Object/priceListItems/Array/ArrayElement1/Object/localMaterialId | Map 4.1, Mapping #9, #10 |
| validFrom | 35 | Root/Array/ArrayElement1/Object/priceListItems/Array/ArrayElement1/Object/validFrom | Map 4.1, Mapping #12 |
| validTo | 36 | Root/Array/ArrayElement1/Object/priceListItems/Array/ArrayElement1/Object/validTo | Map 4.1, Mapping #14 |

---

## 3. Profile: HNK_ES_PRF_XML_Bulk_SF_PricebookEntrySync_c_UPSERT_Request

**Profile ID:** `20c4a0c3-1428-456f-abf1-c453fec29910`  
**Type:** XML  
**Source File:** `20c4a0c3-1428-456f-abf1-c453fec29910.xml`  
**Strict Mode:** true  
**Encoding:** utf8  
**Usage:** Target profile for Map HNK_ES_MAP_JSON_XML_PriceBookEntry_Sync_c, Request profile for Salesforce Bulk API operation

### Structure Tree

```
HNK_PricebookEntrySync__c (character, key=1, minOccurs=0, maxOccurs=-1)
├── Id (character, key=2, minOccurs=0, maxOccurs=1)
├── OwnerId (character, key=3, minOccurs=0, maxOccurs=1)
├── Name (character, key=4, minOccurs=0, maxOccurs=1)
├── CurrencyIsoCode (character, key=5, minOccurs=0, maxOccurs=1)
├── CreatedById (character, key=6, minOccurs=0, maxOccurs=1)
├── LastModifiedById (character, key=7, minOccurs=0, maxOccurs=1)
├── HNK_IsActive__c (character, key=8, minOccurs=0, maxOccurs=1)
├── HNK_Procesable__c (character, key=9, minOccurs=0, maxOccurs=1)
├── HNK_UniqueExternalId__c (character, key=10, minOccurs=0, maxOccurs=1)
├── HNK_UniqueExternalPriceBookId__c (character, key=11, minOccurs=0, maxOccurs=1)
├── HNK_UniqueExternalProduct2Id__c (character, key=12, minOccurs=0, maxOccurs=1)
├── HNK_UnitPrice__c (number, key=13, minOccurs=0, maxOccurs=1)
├── HNK_ValidFrom__c (datetime, key=14, minOccurs=0, maxOccurs=1, format: yyyy-MM-dd)
└── HNK_ValidTo__c (datetime, key=15, minOccurs=0, maxOccurs=1, format: yyyy-MM-dd)
```

### Field Details

| Key | Name | Path | Data Type | Format | Min Occurs | Max Occurs | Mappable |
|-----|------|------|-----------|--------|------------|------------|----------|
| 1 | HNK_PricebookEntrySync__c | HNK_PricebookEntrySync__c | character | - | 0 | -1 | ✅ |
| 2 | Id | HNK_PricebookEntrySync__c/Id | character | - | 0 | 1 | ✅ |
| 3 | OwnerId | HNK_PricebookEntrySync__c/OwnerId | character | - | 0 | 1 | ✅ |
| 4 | Name | HNK_PricebookEntrySync__c/Name | character | - | 0 | 1 | ✅ |
| 5 | CurrencyIsoCode | HNK_PricebookEntrySync__c/CurrencyIsoCode | character | - | 0 | 1 | ✅ |
| 6 | CreatedById | HNK_PricebookEntrySync__c/CreatedById | character | - | 0 | 1 | ✅ |
| 7 | LastModifiedById | HNK_PricebookEntrySync__c/LastModifiedById | character | - | 0 | 1 | ✅ |
| 8 | HNK_IsActive__c | HNK_PricebookEntrySync__c/HNK_IsActive__c | character | - | 0 | 1 | ✅ |
| 9 | HNK_Procesable__c | HNK_PricebookEntrySync__c/HNK_Procesable__c | character | - | 0 | 1 | ✅ |
| 10 | HNK_UniqueExternalId__c | HNK_PricebookEntrySync__c/HNK_UniqueExternalId__c | character | - | 0 | 1 | ✅ |
| 11 | HNK_UniqueExternalPriceBookId__c | HNK_PricebookEntrySync__c/HNK_UniqueExternalPriceBookId__c | character | - | 0 | 1 | ✅ |
| 12 | HNK_UniqueExternalProduct2Id__c | HNK_PricebookEntrySync__c/HNK_UniqueExternalProduct2Id__c | character | - | 0 | 1 | ✅ |
| 13 | HNK_UnitPrice__c | HNK_PricebookEntrySync__c/HNK_UnitPrice__c | number | - | 0 | 1 | ✅ |
| 14 | HNK_ValidFrom__c | HNK_PricebookEntrySync__c/HNK_ValidFrom__c | datetime | yyyy-MM-dd | 0 | 1 | ✅ |
| 15 | HNK_ValidTo__c | HNK_PricebookEntrySync__c/HNK_ValidTo__c | datetime | yyyy-MM-dd | 0 | 1 | ✅ |

### Mapped Fields

| Field | Mapping # | Source Field |
|-------|-----------|--------------|
| HNK_IsActive__c | 1 | status |
| HNK_UnitPrice__c | 2 | unitPrice |
| HNK_UniqueExternalPriceBookId__c | 3 | Function: HNK_ES_UDF_Pricebook2id |
| HNK_UniqueExternalId__c | 8 | Function: HNK_ES_UDF_ConcatUniqueExternalpricebookEntryId |
| HNK_UniqueExternalProduct2Id__c | 11 | Function: HNK_ES_UDF_ProductID |
| HNK_ValidFrom__c | 13 | Function: HNK_ES_UDF_Date (output=1) |
| HNK_ValidTo__c | 15 | Function: HNK_ES_UDF_Date (output=2) |

---

## 4. Profile: HNK_GLO_PRF_XML_HNK_PriceBookEntrySync_c_Response

**Profile ID:** `a02caced-3ade-4943-a726-6d11da4860dd`  
**Type:** XML  
**Source File:** `a02caced-3ade-4943-a726-6d11da4860dd.xml`  
**Strict Mode:** true  
**Encoding:** utf8  
**Usage:** Source profile for Map HNK_GLO_MAP_XML_FF_SFDC_PriceBookEntryBulk_Response_v1

### Structure Tree

```
HNK_PricebookEntrySync__c (character, key=2, minOccurs=1, maxOccurs=1)
├── Success (character, key=3, minOccurs=0, maxOccurs=1)
├── Error (character, key=4, minOccurs=0, maxOccurs=1)
│   ├── statusCode (character, key=5, minOccurs=0, maxOccurs=1)
│   └── message (character, key=6, minOccurs=0, maxOccurs=1)
└── Fields (character, key=7, minOccurs=0, maxOccurs=1)
    ├── HNK_IsActive__c (character, key=9, minOccurs=0, maxOccurs=1)
    ├── HNK_Procesable__c (character, key=13, minOccurs=0, maxOccurs=1)
    ├── HNK_UniqueExternalId__c (character, key=10, minOccurs=0, maxOccurs=1)
    ├── HNK_UniqueExternalPriceBookId__c (character, key=8, minOccurs=0, maxOccurs=1)
    ├── HNK_UniqueExternalProduct2Id__c (character, key=11, minOccurs=0, maxOccurs=1)
    └── HNK_UnitPrice__c (character, key=12, minOccurs=0, maxOccurs=1)
```

### Field Details

| Key | Name | Path | Data Type | Min Occurs | Max Occurs | Mappable |
|-----|------|------|-----------|------------|------------|----------|
| 2 | HNK_PricebookEntrySync__c | HNK_PricebookEntrySync__c | character | 1 | 1 | ✅ |
| 3 | Success | HNK_PricebookEntrySync__c/Success | character | 0 | 1 | ✅ |
| 4 | Error | HNK_PricebookEntrySync__c/Error | character | 0 | 1 | ✅ |
| 5 | statusCode | HNK_PricebookEntrySync__c/Error/statusCode | character | 0 | 1 | ✅ |
| 6 | message | HNK_PricebookEntrySync__c/Error/message | character | 0 | 1 | ✅ |
| 7 | Fields | HNK_PricebookEntrySync__c/Fields | character | 0 | 1 | ✅ |
| 8 | HNK_UniqueExternalPriceBookId__c | HNK_PricebookEntrySync__c/Fields/HNK_UniqueExternalPriceBookId__c | character | 0 | 1 | ✅ |
| 9 | HNK_IsActive__c | HNK_PricebookEntrySync__c/Fields/HNK_IsActive__c | character | 0 | 1 | ✅ |
| 10 | HNK_UniqueExternalId__c | HNK_PricebookEntrySync__c/Fields/HNK_UniqueExternalId__c | character | 0 | 1 | ✅ |
| 11 | HNK_UniqueExternalProduct2Id__c | HNK_PricebookEntrySync__c/Fields/HNK_UniqueExternalProduct2Id__c | character | 0 | 1 | ✅ |
| 12 | HNK_UnitPrice__c | HNK_PricebookEntrySync__c/Fields/HNK_UnitPrice__c | character | 0 | 1 | ✅ |
| 13 | HNK_Procesable__c | HNK_PricebookEntrySync__c/Fields/HNK_Procesable__c | character | 0 | 1 | ✅ |

### Usage Notes

- **statusCode** (key=5): Used in sub-process decision shape7 to detect errors (`ErrorExistInResponsePayload?`)
- **Success/Error** fields: Used to determine processing path in sub-process
- **Fields**: Contains the actual data fields returned from Salesforce Bulk API

---

## 5. Profile: HNK_GLO_PRF_FF_SFDC_Errors

**Profile ID:** `13c3ea7e-a80c-4dd1-a7fb-22bfca6657cf`  
**Type:** Flat File  
**Source File:** `13c3ea7e-a80c-4dd1-a7fb-22bfca6657cf.xml`  
**Strict Mode:** true  
**File Type:** delimited  
**Delimiter:** star-delimited  
**Usage:** Target profile for Map HNK_GLO_MAP_XML_FF_SFDC_PriceBookEntryBulk_Response_v1

### Structure Tree

```
Record (key=1)
└── Elements (key=2)
    └── Error (character, key=3)
```

### Field Details

| Key | Name | Path | Data Type | Justification | Mandatory | Mappable |
|-----|------|------|-----------|---------------|-----------|----------|
| 1 | Record | Record | - | - | - | ❌ |
| 2 | Elements | Record/Elements | - | - | - | ❌ |
| 3 | Error | Record/Elements/Error | character | left | ❌ | ✅ |

### Configuration

- **File Type:** Delimited
- **Column Headers:** Not used
- **Delimiter:** Star-delimited (`*`)
- **Text Qualifier:** Not applicable
- **Escape Removal:** false

### Usage Notes

- Used to format Salesforce Bulk API error responses as flat file output
- Single field profile for error message extraction
- Output format: star-delimited flat file

---

## Profile Usage Summary

| Profile | Used In | Purpose |
|---------|---------|---------|
| HNK_GLO_PRF_JSON_APIC_Header_Req | Main Process (shape2) | Extract senderId from Solace message headers |
| HNK_ES_PRF_JSON_PricingRequest | Map 4.1 (Source) | Source JSON structure from SAP/APIC |
| HNK_ES_PRF_XML_Bulk_SF_PricebookEntrySync_c_UPSERT_Request | Map 4.1 (Target), Salesforce Operation | Target XML structure for Salesforce Bulk API |
| HNK_GLO_PRF_XML_HNK_PriceBookEntrySync_c_Response | Map 4.2 (Source) | Salesforce Bulk API response structure |
| HNK_GLO_PRF_FF_SFDC_Errors | Map 4.2 (Target) | Flat file error output format |

---

**Total Profile Fields:** 79 fields across 5 profiles  
**Profile Types:** 3 JSON, 2 XML, 1 Flat File
