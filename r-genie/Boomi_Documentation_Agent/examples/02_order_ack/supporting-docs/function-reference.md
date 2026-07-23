# HNK_ES_PRC_28210_SAPXH1_Salesforce_OrderAck - Function Reference

**Referenced from:** `../02_order_ack_technical_design.md` Section 4  
**Generated:** 2026-01-27

---

## Function Reference

### Function: HNK_HS_UDF_SalesOrderSimulate_ShipmentDate (Key: 6)

**Function ID:** `1ff4b0dc-4567-42ad-9e8c-d28095a74cf1`  
**Type:** User Defined Function  
**Description:** Check if the date value if current date.

**Inputs:**

| Key | Name | Data Type |
|-----|------|-----------|
| 1 | REQ_DATE | character |

**Outputs:**

None (function sets document property DDP_maxvalue)

**Function Steps (ordered by position):**

| Position | Step ID | Type | Name | Cache | Configuration |
|----------|---------|------|------|-------|---------------|
| 1 | 1 | DocumentPropertyGet | Get Document Property | ✅ | Property: dynamicdocument.DDP_maxvalue, Default: "0000-00-00" |
| 2 | 4 | DateFormat | Date Format | ✅ | Input Mask: yyyyMMdd, Output Mask: yyyy-MM-dd |
| 3 | 2 | Scripting | Scripting | ✅ | JavaScript: Compare input date with maxvalue, return greater value |
| 4 | 3 | DocumentPropertySet | Set Document Property | ✅ | Property: dynamicdocument.DDP_maxvalue |

**Step Input Mappings:**

| Step | Input | Source |
|------|-------|--------|
| Date Format | Date String | REQ_DATE (function input) |
| Scripting | input | Date Format Result |
| Scripting | maxvalue | Get Document Property output (DDP_maxvalue) |
| Set Document Property | DDP_maxvalue | Scripting output |

**Step Output Mappings:**

| Step | Output | Target |
|------|--------|--------|
| Get Document Property | DDP_maxvalue | Scripting step (maxvalue input) |
| Date Format | Result | Scripting step (input) |
| Scripting | output | Set Document Property step |
| Set Document Property | DDP_maxvalue | Document property (persisted) |

**Script Code:**

**Step 2 (Scripting):**
```javascript
if ( input > maxvalue )
{
output = input ;
}
else
{
output = maxvalue ;
}
```

**Logic:** This function compares an input date (REQ_DATE) with a maximum date value stored in document property DDP_maxvalue. The date is first formatted from yyyyMMdd to yyyy-MM-dd format. Then it compares the formatted date with the maxvalue and returns the greater value, updating the DDP_maxvalue document property for future comparisons.

---

## Map Function Steps

### Map: HNK_ES_MAP_XML_JSON_SAP_SF_OrderCreation

#### Function Step 1: Scripting (Key: 1, Position: 1)

**Type:** Scripting  
**Cache Enabled:** true  
**Cache Option:** none

**Inputs:**

| Key | Name | Source |
|-----|------|--------|
| 1 | Message | Profile: MESSAGE (Envelope/Body/ZHSP_FM_SALES_ORD_CREATE_DETResponse/MESSAGELOG/item/MESSAGE) |

**Outputs:**

| Key | Name | Target |
|-----|------|--------|
| 3 | messageText | Profile: orderMessageText |

**Script Code:**
```javascript
if (Message.startsWith("VBA"))
{
}
else
{
messageText = Message ;
}
```

**Logic:** Filters out messages starting with "VBA", otherwise passes the message through to messageText output.

---

#### Function Step 2: Scripting (Key: 2, Position: 2)

**Type:** Scripting  
**Cache Enabled:** true  
**Cache Option:** none  
**Is Reset:** false

**Inputs:**

| Key | Name | Source |
|-----|------|--------|
| 7 | Lifsk | Profile: LIFSK (Envelope/Body/ZHSP_FM_SALES_ORD_CREATE_DETResponse/LOG/LIFSK) |

**Outputs:**

| Key | Name | Target |
|-----|------|--------|
| 8 | deliveryBlock | Profile: fieldValue (deliveryBlock tagList) |

**Script Code:**
```javascript
if(Lifsk!=="")
{
deliveryBlock='Y';
}
else
{
deliveryBlock='N';
}
```

**Logic:** Sets deliveryBlock to 'Y' if LIFSK field is not empty, otherwise sets to 'N'.

---

#### Function Step 3: Scripting (Key: 3, Position: 3)

**Type:** Scripting  
**Cache Enabled:** true  
**Cache Option:** none  
**Is Reset:** false

**Inputs:**

| Key | Name | Source |
|-----|------|--------|
| 5 | Cmgst | Profile: CMGST (Envelope/Body/ZHSP_FM_SALES_ORD_CREATE_DETResponse/LOG/CMGST) |

**Outputs:**

| Key | Name | Target |
|-----|------|--------|
| 4 | creditBlock | Profile: fieldValue (creditBlock tagList) |

**Script Code:**
```javascript
if ( Cmgst == 'B' || Cmgst == 'C' )
creditBlock = 'Y' ;
else
creditBlock = 'N' ;
```

**Logic:** Sets creditBlock to 'Y' if CMGST field equals 'B' or 'C', otherwise sets to 'N'.

---

#### Function Step 6: HNK_HS_UDF_SalesOrderSimulate_ShipmentDate (Key: 6, Position: 6)

**Type:** User Defined Function  
**Function ID:** 1ff4b0dc-4567-42ad-9e8c-d28095a74cf1

**Inputs:**

| Key | Name | Source |
|-----|------|--------|
| 1 | REQ_DATE | Profile: EDATU (Envelope/Body/ZHSP_FM_SALES_ORD_CREATE_DETResponse/SCHEDULE/itemLog/EDATU) |

**Outputs:**

None (function sets document property, which is then used in mapping)

**Logic:** See function documentation above.

---

#### Function Step 7: Get Document Property (Key: 7, Position: 7)

**Type:** DocumentPropertyGet  
**Cache Enabled:** true

**Inputs:**

None

**Outputs:**

| Key | Name | Target |
|-----|------|--------|
| 3 | Dynamic Document Property - DDP_maxvalue | Function Step 2 (Scripting) input maxvalue |

**Configuration:**

| Setting | Value |
|---------|-------|
| **Property ID** | dynamicdocument.DDP_maxvalue |
| **Property Name** | Dynamic Document Property - DDP_maxvalue |
| **Default Value** | "" |
| **Persist** | false |

**Logic:** Retrieves the DDP_maxvalue document property for use in date comparison logic.

---
