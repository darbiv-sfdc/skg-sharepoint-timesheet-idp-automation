# HNK_ES_PRC_28210_SAPXH1_Salesforce_OrderAck - Profile Structures

**Referenced from:** `../HNK_ES_PRC_28210_SAPXH1_Salesforce_OrderAck-technical-design.md` Section 4  
**Generated:** 2026-01-27

---

## Profile Inventory

| # | Profile ID | Name | Type | File | Fields |
|---|------------|------|------|------|--------|
| 1 | `e360e4ae-df0d-44e7-b3c6-93114ba7989f` | HNK_ES_PRF_XML_SAPXH1_SalesOrder | XML | `e360e4ae-df0d-44e7-b3c6-93114ba7989f.xml` | 27 fields |
| 2 | `3898b817-d961-43ec-ab67-319dab8cc171` | HNK_ES_PRF_JSON_SF_SalesOrder_Ack | JSON | `3898b817-d961-43ec-ab67-319dab8cc171.xml` | 18 fields |
| 3 | `58121f51-32c4-4d39-8df1-e20859aa5bb6` | HNK_ES_PRF_JSON_SF_TokenResponse | JSON | `58121f51-32c4-4d39-8df1-e20859aa5bb6.xml` | 7 fields |
| 4 | `024bed29-733b-4cf7-ab9c-e604cb93ef7e` | HNK_GB_PRF_FF_XTEL_SAP_ForecastPromoVol | Flat File | `024bed29-733b-4cf7-ab9c-e604cb93ef7e.xml` | 1 field |

---

## 1. Profile: HNK_ES_PRF_XML_SAPXH1_SalesOrder

**Profile ID:** `e360e4ae-df0d-44e7-b3c6-93114ba7989f`  
**Type:** XML  
**Source File:** `e360e4ae-df0d-44e7-b3c6-93114ba7989f.xml`  
**Strict Mode:** true  
**Encoding:** utf8  
**Usage:** Source profile for Map HNK_ES_MAP_XML_JSON_SAP_SF_OrderCreation, Request profile for Solace listener operation

### Structure Tree

```
Envelope (character, key=60, minOccurs=1, maxOccurs=1)
├── Header (character, key=61, minOccurs=0, maxOccurs=1)
│   └── CallerInformation (character, key=62, minOccurs=0, maxOccurs=1)
│       ├── Type (character, key=63, minOccurs=0, maxOccurs=1)
│       ├── Company (character, key=64, minOccurs=0, maxOccurs=1)
│       └── Sys (character, key=65, minOccurs=0, maxOccurs=1)
└── Body (character, key=66, minOccurs=0, maxOccurs=1)
    └── ZHSP_FM_SALES_ORD_CREATE_DETResponse (character, key=67, minOccurs=0, maxOccurs=1)
        ├── ACKID (character, key=68, minOccurs=0, maxOccurs=1)
        ├── LOG (character, key=69, minOccurs=0, maxOccurs=1)
        │   ├── VBELN (character, key=70, minOccurs=0, maxOccurs=1)
        │   ├── NETWR (character, key=71, minOccurs=0, maxOccurs=1)
        │   ├── MWSBK (character, key=72, minOccurs=0, maxOccurs=1)
        │   ├── TOTWR (character, key=73, minOccurs=0, maxOccurs=1)
        │   ├── EMPWR (character, key=74, minOccurs=0, maxOccurs=1)
        │   ├── LIFSK (character, key=75, minOccurs=0, maxOccurs=1)
        │   └── CMGST (character, key=76, minOccurs=0, maxOccurs=1)
        ├── MESSAGELOG (character, key=77, minOccurs=0, maxOccurs=1)
        │   └── item3 (character, key=78, minOccurs=0, maxOccurs=-1)
        │       ├── TYPE (character, key=79, minOccurs=0, maxOccurs=1)
        │       └── MESSAGE (character, key=80, minOccurs=0, maxOccurs=1)
        └── SCHEDULE (character, key=87, minOccurs=0, maxOccurs=1)
            └── itemLog (character, key=88, minOccurs=0, maxOccurs=-1)
                ├── VBELN (character, key=89, minOccurs=0, maxOccurs=1)
                ├── POSNR (character, key=90, minOccurs=0, maxOccurs=1)
                ├── MATNR (character, key=91, minOccurs=0, maxOccurs=1)
                └── EDATU (character, key=92, minOccurs=0, maxOccurs=1)
```

### Field Summary

| Level | Field Count | Types |
|-------|-------------|-------|
| Root | 1 | character |
| Arrays | 2 | repeating elements (item3, itemLog) |
| Objects | 3 | nested structures |
| Leaf Fields | 27 | character (all) |

### Field Details

| Key | Name | Path | Data Type | Min Occurs | Max Occurs | Mappable | Required |
|-----|------|------|-----------|------------|------------|----------|----------|
| 60 | Envelope | Envelope | character | 1 | 1 | ✅ | ✅ |
| 61 | Header | Envelope/Header | character | 0 | 1 | ✅ | ❌ |
| 62 | CallerInformation | Envelope/Header/CallerInformation | character | 0 | 1 | ✅ | ❌ |
| 63 | Type | Envelope/Header/CallerInformation/Type | character | 0 | 1 | ✅ | ❌ |
| 64 | Company | Envelope/Header/CallerInformation/Company | character | 0 | 1 | ✅ | ❌ |
| 65 | Sys | Envelope/Header/CallerInformation/Sys | character | 0 | 1 | ✅ | ❌ |
| 66 | Body | Envelope/Body | character | 0 | 1 | ✅ | ❌ |
| 67 | ZHSP_FM_SALES_ORD_CREATE_DETResponse | Envelope/Body/ZHSP_FM_SALES_ORD_CREATE_DETResponse | character | 0 | 1 | ✅ | ❌ |
| 68 | ACKID | Envelope/Body/ZHSP_FM_SALES_ORD_CREATE_DETResponse/ACKID | character | 0 | 1 | ✅ | ❌ |
| 69 | LOG | Envelope/Body/ZHSP_FM_SALES_ORD_CREATE_DETResponse/LOG | character | 0 | 1 | ✅ | ❌ |
| 70 | VBELN | Envelope/Body/ZHSP_FM_SALES_ORD_CREATE_DETResponse/LOG/VBELN | character | 0 | 1 | ✅ | ❌ |
| 71 | NETWR | Envelope/Body/ZHSP_FM_SALES_ORD_CREATE_DETResponse/LOG/NETWR | character | 0 | 1 | ✅ | ❌ |
| 72 | MWSBK | Envelope/Body/ZHSP_FM_SALES_ORD_CREATE_DETResponse/LOG/MWSBK | character | 0 | 1 | ✅ | ❌ |
| 73 | TOTWR | Envelope/Body/ZHSP_FM_SALES_ORD_CREATE_DETResponse/LOG/TOTWR | character | 0 | 1 | ✅ | ❌ |
| 74 | EMPWR | Envelope/Body/ZHSP_FM_SALES_ORD_CREATE_DETResponse/LOG/EMPWR | character | 0 | 1 | ✅ | ❌ |
| 75 | LIFSK | Envelope/Body/ZHSP_FM_SALES_ORD_CREATE_DETResponse/LOG/LIFSK | character | 0 | 1 | ✅ | ❌ |
| 76 | CMGST | Envelope/Body/ZHSP_FM_SALES_ORD_CREATE_DETResponse/LOG/CMGST | character | 0 | 1 | ✅ | ❌ |
| 77 | MESSAGELOG | Envelope/Body/ZHSP_FM_SALES_ORD_CREATE_DETResponse/MESSAGELOG | character | 0 | 1 | ✅ | ❌ |
| 78 | item3 | Envelope/Body/ZHSP_FM_SALES_ORD_CREATE_DETResponse/MESSAGELOG/item | character | 0 | -1 | ✅ | ❌ |
| 79 | TYPE | Envelope/Body/ZHSP_FM_SALES_ORD_CREATE_DETResponse/MESSAGELOG/item/TYPE | character | 0 | 1 | ✅ | ❌ |
| 80 | MESSAGE | Envelope/Body/ZHSP_FM_SALES_ORD_CREATE_DETResponse/MESSAGELOG/item/MESSAGE | character | 0 | 1 | ✅ | ❌ |
| 87 | SCHEDULE | Envelope/Body/ZHSP_FM_SALES_ORD_CREATE_DETResponse/SCHEDULE | character | 0 | 1 | ✅ | ❌ |
| 88 | itemLog | Envelope/Body/ZHSP_FM_SALES_ORD_CREATE_DETResponse/SCHEDULE/itemLog | character | 0 | -1 | ✅ | ❌ |
| 89 | VBELN | Envelope/Body/ZHSP_FM_SALES_ORD_CREATE_DETResponse/SCHEDULE/itemLog/VBELN | character | 0 | 1 | ✅ | ❌ |
| 90 | POSNR | Envelope/Body/ZHSP_FM_SALES_ORD_CREATE_DETResponse/SCHEDULE/itemLog/POSNR | character | 0 | 1 | ✅ | ❌ |
| 91 | MATNR | Envelope/Body/ZHSP_FM_SALES_ORD_CREATE_DETResponse/SCHEDULE/itemLog/MATNR | character | 0 | 1 | ✅ | ❌ |
| 92 | EDATU | Envelope/Body/ZHSP_FM_SALES_ORD_CREATE_DETResponse/SCHEDULE/itemLog/EDATU | character | 0 | 1 | ✅ | ❌ |

### Key Fields Used in Mappings

| Field | Key | Path | Used In Map |
|-------|-----|------|-------------|
| ACKID | 68 | Envelope/Body/ZHSP_FM_SALES_ORD_CREATE_DETResponse/ACKID | Map 4.1, Mapping #5 → referenceID |
| VBELN | 70 | Envelope/Body/ZHSP_FM_SALES_ORD_CREATE_DETResponse/LOG/VBELN | Map 4.1, Mapping #6 → orderNumber, Tracking field |
| NETWR | 71 | Envelope/Body/ZHSP_FM_SALES_ORD_CREATE_DETResponse/LOG/NETWR | Map 4.1, Mapping #7 → itemNetValue |
| MWSBK | 72 | Envelope/Body/ZHSP_FM_SALES_ORD_CREATE_DETResponse/LOG/MWSBK | Map 4.1, Mapping #8 → totalTaxAmount |
| TOTWR | 73 | Envelope/Body/ZHSP_FM_SALES_ORD_CREATE_DETResponse/LOG/TOTWR | Map 4.1, Mapping #9 → totalAmount |
| EMPWR | 74 | Envelope/Body/ZHSP_FM_SALES_ORD_CREATE_DETResponse/LOG/EMPWR | Map 4.1, Mapping #10 → conditionValue |
| LIFSK | 75 | Envelope/Body/ZHSP_FM_SALES_ORD_CREATE_DETResponse/LOG/LIFSK | Map 4.1, Mapping #12 → Function input (deliveryBlock) |
| CMGST | 76 | Envelope/Body/ZHSP_FM_SALES_ORD_CREATE_DETResponse/LOG/CMGST | Map 4.1, Mapping #11 → Function input (creditBlock) |
| MESSAGE | 80 | Envelope/Body/ZHSP_FM_SALES_ORD_CREATE_DETResponse/MESSAGELOG/item/MESSAGE | Map 4.1, Mapping #13 → Function input (messageText) |
| EDATU | 92 | Envelope/Body/ZHSP_FM_SALES_ORD_CREATE_DETResponse/SCHEDULE/itemLog/EDATU | Map 4.1, Mapping #14 → Function input (dateTimeTo) |

### Mapped Fields

| Field | Mapping # | Target Field |
|-------|-----------|--------------|
| ACKID | 5 | referenceID |
| VBELN | 6 | orderNumber |
| NETWR | 7 | itemNetValue |
| MWSBK | 8 | totalTaxAmount |
| TOTWR | 9 | totalAmount |
| EMPWR | 10 | conditionValue |
| LIFSK | 12 | Function: Scripting (key=2, input=7) → deliveryBlock |
| CMGST | 11 | Function: Scripting (key=3, input=5) → creditBlock |
| MESSAGE | 13 | Function: Scripting (key=1, input=1) → messageText |
| EDATU | 14 | Function: HNK_HS_UDF_SalesOrderSimulate_ShipmentDate (key=6, input=1) → dateTimeTo |

### Usage Notes

- **VBELN** (key=70): Used as tracking field (KeyTransactionDataID) in Solace listener operation
- **MESSAGELOG/item** (key=78): Repeating array element for multiple messages
- **SCHEDULE/itemLog** (key=88): Repeating array element for schedule information
- **Header fields** (keys 61-65): Not mapped but present in profile structure

### Namespaces

- Namespace 3: http://schemas.xmlsoap.org/soap/envelope/ (prefix: ns1)
- Namespace 4: http://www.sap.com/webas/712/soap/features/runtime/metering/ (prefix: ns2)
- Namespace 1: urn:sap-com:document:sap:rfc:functions (prefix: ns3)
- Namespace -1: Empty Namespace

---

## 2. Profile: HNK_ES_PRF_JSON_SF_SalesOrder_Ack

**Profile ID:** `3898b817-d961-43ec-ab67-319dab8cc171`  
**Type:** JSON  
**Source File:** `3898b817-d961-43ec-ab67-319dab8cc171.xml`  
**Strict Mode:** false  
**Usage:** Target profile for Map HNK_ES_MAP_XML_JSON_SAP_SF_OrderCreation, Source and Target profile for Map HNK_ES_MAP_RemoveNull, Request profile for Salesforce OrderAck operation

### Structure Tree

```
Root (character, key=1)
└── Object (key=2)
    └── salesOrder (character, key=3)
        └── Array (repeating, key=4)
            └── ArrayElement1 (character, key=5, minOccurs=0, maxOccurs=-1)
                └── Object (key=6)
                    ├── orderNumber (character, key=7)
                    ├── orderReferenceIDs (character, key=8)
                    │   └── Array (repeating, key=9)
                    │       └── ArrayElement1 (character, key=10, minOccurs=0, maxOccurs=-1)
                    │           └── Object (key=11)
                    │               ├── referenceID (character, key=12)
                    │               └── referenceSystem (character, key=13)
                    ├── orderMessages (character, key=14)
                    │   └── Array (repeating, key=15)
                    │       └── ArrayElement1 (character, key=16, minOccurs=0, maxOccurs=-1)
                    │           └── Object (key=17)
                    │               └── orderMessageText (character, key=18, required=true, minLength=0)
                    ├── deliveryDateTime (character, key=19)
                    │   └── Array (repeating, key=20)
                    │       └── ArrayElement1 (character, key=21, minOccurs=0, maxOccurs=-1)
                    │           └── Object (key=22)
                    │               └── dateTimeTo (character, key=23)
                    └── lineItems (character, key=24)
                        └── Array (repeating, key=25)
                            └── ArrayElement1 (character, key=26, minOccurs=0, maxOccurs=-1)
                                └── Object (key=27)
                                    ├── localFields (character, key=28)
                                    │   └── Array (repeating, key=29)
                                    │       └── ArrayElement1 (character, key=30, minOccurs=0, maxOccurs=-1)
                                    │           └── Object (key=31)
                                    │               ├── fieldName (character, key=32, qualifiers: deliveryBlock, creditBlock)
                                    │               └── fieldValue (character, key=33)
                                    ├── price (character, key=34)
                                    │   └── Object (key=35)
                                    │       ├── itemNetValue (character, key=36)
                                    │       ├── totalTaxAmount (character, key=37)
                                    │       └── totalAmount (character, key=38)
                                    └── priceConditions (character, key=39)
                                        └── Array (repeating, key=40)
                                            └── ArrayElement1 (character, key=41, minOccurs=0, maxOccurs=-1)
                                                └── Object (key=42)
                                                    ├── priceConditionType (character, key=43)
                                                    └── conditionValue (character, key=44)
```

### Field Summary

| Level | Field Count | Types |
|-------|-------------|-------|
| Root | 1 | character |
| Arrays | 5 | repeating elements |
| Objects | 6 | nested structures |
| Leaf Fields | 18 | character (all) |

### Field Details

| Key | Name | Path | Data Type | Min Occurs | Max Occurs | Mappable | Required |
|-----|------|------|-----------|------------|------------|----------|----------|
| 1 | Root | Root | character | - | - | ✅ | - |
| 2 | Object | Root/Object | - | - | - | ❌ | - |
| 3 | salesOrder | Root/Object/salesOrder | character | - | - | ✅ | - |
| 4 | Array | Root/Object/salesOrder/Array | - | - | - | ❌ | - |
| 5 | ArrayElement1 | Root/Object/salesOrder/Array/ArrayElement1 | character | 0 | -1 | ✅ | ❌ |
| 6 | Object | Root/Object/salesOrder/Array/ArrayElement1/Object | - | - | - | ❌ | - |
| 7 | orderNumber | Root/Object/salesOrder/Array/ArrayElement1/Object/orderNumber | character | - | - | ✅ | - |
| 8 | orderReferenceIDs | Root/Object/salesOrder/Array/ArrayElement1/Object/orderReferenceIDs | character | - | - | ✅ | - |
| 9 | Array | Root/Object/salesOrder/Array/ArrayElement1/Object/orderReferenceIDs/Array | - | - | - | ❌ | - |
| 10 | ArrayElement1 | Root/Object/salesOrder/Array/ArrayElement1/Object/orderReferenceIDs/Array/ArrayElement1 | character | 0 | -1 | ✅ | ❌ |
| 11 | Object | Root/Object/salesOrder/Array/ArrayElement1/Object/orderReferenceIDs/Array/ArrayElement1/Object | - | - | - | ❌ | - |
| 12 | referenceID | Root/Object/salesOrder/Array/ArrayElement1/Object/orderReferenceIDs/Array/ArrayElement1/Object/referenceID | character | - | - | ✅ | - |
| 13 | referenceSystem | Root/Object/salesOrder/Array/ArrayElement1/Object/orderReferenceIDs/Array/ArrayElement1/Object/referenceSystem | character | - | - | ✅ | - |
| 14 | orderMessages | Root/Object/salesOrder/Array/ArrayElement1/Object/orderMessages | character | - | - | ✅ | - |
| 15 | Array | Root/Object/salesOrder/Array/ArrayElement1/Object/orderMessages/Array | - | - | - | ❌ | - |
| 16 | ArrayElement1 | Root/Object/salesOrder/Array/ArrayElement1/Object/orderMessages/Array/ArrayElement1 | character | 0 | -1 | ✅ | ❌ |
| 17 | Object | Root/Object/salesOrder/Array/ArrayElement1/Object/orderMessages/Array/ArrayElement1/Object | - | - | - | ❌ | - |
| 18 | orderMessageText | Root/Object/salesOrder/Array/ArrayElement1/Object/orderMessages/Array/ArrayElement1/Object/orderMessageText | character | - | - | ✅ | ✅ |
| 19 | deliveryDateTime | Root/Object/salesOrder/Array/ArrayElement1/Object/deliveryDateTime | character | - | - | ✅ | - |
| 20 | Array | Root/Object/salesOrder/Array/ArrayElement1/Object/deliveryDateTime/Array | - | - | - | ❌ | - |
| 21 | ArrayElement1 | Root/Object/salesOrder/Array/ArrayElement1/Object/deliveryDateTime/Array/ArrayElement1 | character | 0 | -1 | ✅ | ❌ |
| 22 | Object | Root/Object/salesOrder/Array/ArrayElement1/Object/deliveryDateTime/Array/ArrayElement1/Object | - | - | - | ❌ | - |
| 23 | dateTimeTo | Root/Object/salesOrder/Array/ArrayElement1/Object/deliveryDateTime/Array/ArrayElement1/Object/dateTimeTo | character | - | - | ✅ | - |
| 24 | lineItems | Root/Object/salesOrder/Array/ArrayElement1/Object/lineItems | character | - | - | ✅ | - |
| 25 | Array | Root/Object/salesOrder/Array/ArrayElement1/Object/lineItems/Array | - | - | - | ❌ | - |
| 26 | ArrayElement1 | Root/Object/salesOrder/Array/ArrayElement1/Object/lineItems/Array/ArrayElement1 | character | 0 | -1 | ✅ | ❌ |
| 27 | Object | Root/Object/salesOrder/Array/ArrayElement1/Object/lineItems/Array/ArrayElement1/Object | - | - | - | ❌ | - |
| 28 | localFields | Root/Object/salesOrder/Array/ArrayElement1/Object/lineItems/Array/ArrayElement1/Object/localFields | character | - | - | ✅ | - |
| 29 | Array | Root/Object/salesOrder/Array/ArrayElement1/Object/lineItems/Array/ArrayElement1/Object/localFields/Array | - | - | - | ❌ | - |
| 30 | ArrayElement1 | Root/Object/salesOrder/Array/ArrayElement1/Object/lineItems/Array/ArrayElement1/Object/localFields/Array/ArrayElement1 | character | 0 | -1 | ✅ | ❌ |
| 31 | Object | Root/Object/salesOrder/Array/ArrayElement1/Object/lineItems/Array/ArrayElement1/Object/localFields/Array/ArrayElement1/Object | - | - | - | ❌ | - |
| 32 | fieldName | Root/Object/salesOrder/Array/ArrayElement1/Object/lineItems/Array/ArrayElement1/Object/localFields/Array/ArrayElement1/Object/fieldName | character | - | - | ✅ | - |
| 33 | fieldValue | Root/Object/salesOrder/Array/ArrayElement1/Object/lineItems/Array/ArrayElement1/Object/localFields/Array/ArrayElement1/Object/fieldValue | character | - | - | ✅ | - |
| 34 | price | Root/Object/salesOrder/Array/ArrayElement1/Object/lineItems/Array/ArrayElement1/Object/price | character | - | - | ✅ | - |
| 35 | Object | Root/Object/salesOrder/Array/ArrayElement1/Object/lineItems/Array/ArrayElement1/Object/price/Object | - | - | - | ❌ | - |
| 36 | itemNetValue | Root/Object/salesOrder/Array/ArrayElement1/Object/lineItems/Array/ArrayElement1/Object/price/Object/itemNetValue | character | - | - | ✅ | - |
| 37 | totalTaxAmount | Root/Object/salesOrder/Array/ArrayElement1/Object/lineItems/Array/ArrayElement1/Object/price/Object/totalTaxAmount | character | - | - | ✅ | - |
| 38 | totalAmount | Root/Object/salesOrder/Array/ArrayElement1/Object/lineItems/Array/ArrayElement1/Object/price/Object/totalAmount | character | - | - | ✅ | - |
| 39 | priceConditions | Root/Object/salesOrder/Array/ArrayElement1/Object/lineItems/Array/ArrayElement1/Object/priceConditions | character | - | - | ✅ | - |
| 40 | Array | Root/Object/salesOrder/Array/ArrayElement1/Object/lineItems/Array/ArrayElement1/Object/priceConditions/Array | - | - | - | ❌ | - |
| 41 | ArrayElement1 | Root/Object/salesOrder/Array/ArrayElement1/Object/lineItems/Array/ArrayElement1/Object/priceConditions/Array/ArrayElement1 | character | 0 | -1 | ✅ | ❌ |
| 42 | Object | Root/Object/salesOrder/Array/ArrayElement1/Object/lineItems/Array/ArrayElement1/Object/priceConditions/Array/ArrayElement1/Object | - | - | - | ❌ | - |
| 43 | priceConditionType | Root/Object/salesOrder/Array/ArrayElement1/Object/lineItems/Array/ArrayElement1/Object/priceConditions/Array/ArrayElement1/Object/priceConditionType | character | - | - | ✅ | - |
| 44 | conditionValue | Root/Object/salesOrder/Array/ArrayElement1/Object/lineItems/Array/ArrayElement1/Object/priceConditions/Array/ArrayElement1/Object/conditionValue | character | - | - | ✅ | - |

### Key Fields Used in Mappings

| Field | Key | Path | Used In Map |
|-------|-----|------|-------------|
| orderNumber | 7 | Root/Object/salesOrder/Array/ArrayElement1/Object/orderNumber | Map 4.1, Mapping #6 ← VBELN |
| referenceID | 12 | Root/Object/salesOrder/Array/ArrayElement1/Object/orderReferenceIDs/Array/ArrayElement1/Object/referenceID | Map 4.1, Mapping #5 ← ACKID |
| referenceSystem | 13 | Root/Object/salesOrder/Array/ArrayElement1/Object/orderReferenceIDs/Array/ArrayElement1/Object/referenceSystem | Map 4.1, Default value: SAP |
| orderMessageText | 18 | Root/Object/salesOrder/Array/ArrayElement1/Object/orderMessages/Array/ArrayElement1/Object/orderMessageText | Map 4.1, Mapping #1 ← Function output |
| dateTimeTo | 23 | Root/Object/salesOrder/Array/ArrayElement1/Object/deliveryDateTime/Array/ArrayElement1/Object/dateTimeTo | Map 4.1, Mapping #4 ← Function output |
| fieldName | 32 | Root/Object/salesOrder/Array/ArrayElement1/Object/lineItems/Array/ArrayElement1/Object/localFields/Array/ArrayElement1/Object/fieldName | Map 4.1, TagList qualifiers (deliveryBlock, creditBlock) |
| fieldValue | 33 | Root/Object/salesOrder/Array/ArrayElement1/Object/lineItems/Array/ArrayElement1/Object/localFields/Array/ArrayElement1/Object/fieldValue | Map 4.1, Mappings #2, #3 ← Function outputs |
| itemNetValue | 36 | Root/Object/salesOrder/Array/ArrayElement1/Object/lineItems/Array/ArrayElement1/Object/price/Object/itemNetValue | Map 4.1, Mapping #7 ← NETWR |
| totalTaxAmount | 37 | Root/Object/salesOrder/Array/ArrayElement1/Object/lineItems/Array/ArrayElement1/Object/price/Object/totalTaxAmount | Map 4.1, Mapping #8 ← MWSBK |
| totalAmount | 38 | Root/Object/salesOrder/Array/ArrayElement1/Object/lineItems/Array/ArrayElement1/Object/price/Object/totalAmount | Map 4.1, Mapping #9 ← TOTWR |
| priceConditionType | 43 | Root/Object/salesOrder/Array/ArrayElement1/Object/lineItems/Array/ArrayElement1/Object/priceConditions/Array/ArrayElement1/Object/priceConditionType | Map 4.1, Default value: empties |
| conditionValue | 44 | Root/Object/salesOrder/Array/ArrayElement1/Object/lineItems/Array/ArrayElement1/Object/priceConditions/Array/ArrayElement1/Object/conditionValue | Map 4.1, Mapping #10 ← EMPWR |

### Mapped Fields

| Field | Mapping # | Source Field |
|-------|-----------|--------------|
| orderNumber | 6 | VBELN |
| referenceID | 5 | ACKID |
| referenceSystem | - | Default: SAP |
| orderMessageText | 1 | Function: Scripting (key=1, output=3) |
| dateTimeTo | 4 | Function: Get Document Property (key=7, output=3) |
| fieldValue (deliveryBlock) | 2 | Function: Scripting (key=2, output=8) |
| fieldValue (creditBlock) | 3 | Function: Scripting (key=3, output=4) |
| itemNetValue | 7 | NETWR |
| totalTaxAmount | 8 | MWSBK |
| totalAmount | 9 | TOTWR |
| priceConditionType | - | Default: empties |
| conditionValue | 10 | EMPWR |

### Tag Lists

- **TagList 1** (elementKey=30, listKey=1): fieldName = "deliveryBlock" (for fieldValue mapping with tagListKey=1)
- **TagList 2** (elementKey=30, listKey=2): fieldName = "creditBlock" (for fieldValue mapping with tagListKey=2)

### Usage Notes

- **orderMessageText** (key=18): Required field (required=true), used to store order messages from SAP
- **localFields** (key=28): Repeating array with tag lists for conditional field mapping (deliveryBlock, creditBlock)
- **fieldName** (key=32): Has qualifiers (deliveryBlock, creditBlock) used in tag list mappings
- **priceConditions** (key=39): Repeating array for price condition information

---

## 3. Profile: HNK_ES_PRF_JSON_SF_TokenResponse

**Profile ID:** `58121f51-32c4-4d39-8df1-e20859aa5bb6`  
**Type:** JSON  
**Source File:** `58121f51-32c4-4d39-8df1-e20859aa5bb6.xml`  
**Strict Mode:** false  
**Usage:** Response profile for Salesforce OAuth token operation in sub-process HNK_ES_SUB_28211_SF_TokenGeneration

### Structure Tree

```
Root (character, key=1)
└── Object (key=2)
    ├── access_token (character, key=3)
    ├── instance_url (character, key=4)
    ├── id (character, key=5)
    ├── token_type (character, key=6)
    ├── issued_at (character, key=7)
    └── signature (character, key=8)
```

### Field Summary

| Level | Field Count | Types |
|-------|-------------|-------|
| Root | 1 | character |
| Objects | 1 | nested structure |
| Leaf Fields | 7 | character (all) |

### Field Details

| Key | Name | Path | Data Type | Mappable | Required |
|-----|------|------|-----------|----------|----------|
| 1 | Root | Root | character | ✅ | - |
| 2 | Object | Root/Object | - | ❌ | - |
| 3 | access_token | Root/Object/access_token | character | ✅ | - |
| 4 | instance_url | Root/Object/instance_url | character | ✅ | - |
| 5 | id | Root/Object/id | character | ✅ | - |
| 6 | token_type | Root/Object/token_type | character | ✅ | - |
| 7 | issued_at | Root/Object/issued_at | character | ✅ | - |
| 8 | signature | Root/Object/signature | character | ✅ | - |

### Key Fields Used in Mappings

| Field | Key | Path | Used In |
|-------|-----|------|---------|
| access_token | 3 | Root/Object/access_token | Sub-process shape10 (Set Token) → DPP_OAUTHCODE process property |

### Mapped Fields

| Field | Usage |
|-------|-------|
| access_token | Extracted from OAuth response and combined with "Bearer " prefix to set DPP_OAUTHCODE process property |

### Usage Notes

- **access_token** (key=3): Used to build Authorization header for Salesforce API calls
- Token is prefixed with "Bearer " before being stored in DPP_OAUTHCODE process property
- Other fields (instance_url, id, token_type, issued_at, signature) are present in response but not used in process

---

## 4. Profile: HNK_GB_PRF_FF_XTEL_SAP_ForecastPromoVol

**Profile ID:** `024bed29-733b-4cf7-ab9c-e604cb93ef7e`  
**Type:** Flat File  
**Source File:** `024bed29-733b-4cf7-ab9c-e604cb93ef7e.xml`  
**Strict Mode:** true  
**File Type:** delimited  
**Delimiter:** tab-delimited  
**Usage:** Used in main process shape3 (Decision) to check if FlatFile field is not empty

### Structure Tree

```
Record (key=1)
└── Elements (key=2)
    └── SKU;WEEK;YEAR;NOTUSED;VOLUME;CUSTOMERLEV2;DESACTION;PROMOVOL (character, key=13)
```

### Field Details

| Key | Name | Path | Data Type | Justification | Mandatory | Mappable |
|-----|------|------|-----------|---------------|-----------|----------|
| 1 | Record | Record | - | - | - | ❌ |
| 2 | Elements | Record/Elements | - | - | - | ❌ |
| 13 | SKU;WEEK;YEAR;NOTUSED;VOLUME;CUSTOMERLEV2;DESACTION;PROMOVOL | Record/Elements/SKU;WEEK;YEAR;NOTUSED;VOLUME;CUSTOMERLEV2;DESACTION;PROMOVOL | character | - | ❌ | ✅ |

### Configuration

- **File Type:** Delimited
- **Column Headers:** Yes
- **Delimiter:** Tab-delimited
- **Text Qualifier:** Not applicable
- **Escape Removal:** false
- **Use to Identify Format:** false
- **Validate Data:** false

### Usage Notes

- Used in decision shape3 to check if the FlatFile field is not equal to empty string
- Field name contains semicolon-separated column names: SKU, WEEK, YEAR, NOTUSED, VOLUME, CUSTOMERLEV2, DESACTION, PROMOVOL
- Decision logic: If field is not empty, continue processing; if empty, terminate data flow

---

## Profile Usage Summary

| Profile | Used In | Purpose |
|--------|---------|---------|
| HNK_ES_PRF_XML_SAPXH1_SalesOrder | Map 4.1 (Source), Solace Operation | Source XML structure from SAP XH1 |
| HNK_ES_PRF_JSON_SF_SalesOrder_Ack | Map 4.1 (Target), Map 4.2 (Source/Target), Salesforce Operation | Target JSON structure for Salesforce API |
| HNK_ES_PRF_JSON_SF_TokenResponse | Sub-process Token Generation | Salesforce OAuth token response structure |
| HNK_GB_PRF_FF_XTEL_SAP_ForecastPromoVol | Main Process Decision (shape3) | Decision logic to check if FlatFile field is populated |

---

**Total Profile Fields:** 53 fields across 4 profiles  
**Profile Types:** 1 XML, 2 JSON, 1 Flat File
