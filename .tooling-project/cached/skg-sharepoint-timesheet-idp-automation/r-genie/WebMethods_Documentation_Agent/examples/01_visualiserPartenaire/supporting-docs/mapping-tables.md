# Psc0136visualiserPartenaireV4 — Mapping Tables

**Referenced from:** `../webmethods_specification_visualiserPartenaireREST.md` Sections 4, 7.5
**Generated:** 2026-04-13

---

## Mapping Table Convention

| Column | Description |
|--------|-------------|
| **#** | Sequential row number |
| **Source Field** | Field name in source document/pipeline |
| **Source Path** | Full pipeline path of source field |
| **Target Field** | Field name in target document/pipeline |
| **Target Path** | Full pipeline path of target field |
| **Type** | Direct / Conditional / Computed / Default |
| **Notes** | Transformation logic, conditions, or verification flags |

---

## 1. Mapping: pub.visualiserPartenaireREST — Request Extraction (MAP Step 1)

**Flow:** `pub.visualiserPartenaireREST`
**Step:** MAP step 1 — Extract Request
**Source:** Input pipeline (from WSDL-defined request)
**Target:** Local pipeline variables

| # | Source Field | Source Path | Target Field | Target Path | Type | Notes |
|---|-------------|-------------|--------------|-------------|------|-------|
| 1 | partnerId | /input/partnerId | partnerId | /local/partnerId | Direct | Primary lookup key |
| 2 | requestDate | /input/requestDate | requestDate | /local/requestDate | Direct | Optional — may be null |
| 3 | requestSource | /input/requestSource | requestSource | /local/requestSource | Direct | Calling system identifier |

`✅ Mapping 1: Request Extraction — 3/3 fields`

---

## 2. Mapping: priv.transformResponse — Backend to Output (MAP Steps)

**Flow:** `priv.transformResponse`
**Source:** Backend adapter response (`/local/partnerData/*`)
**Target:** Output contract (`pub.responseDocType`)

| # | Source Field | Source Path | Target Field | Target Path | Type | Notes |
|---|-------------|-------------|--------------|-------------|------|-------|
| 1 | PARTNER_ID | /local/partnerData/PARTNER_ID | partnerId | /output/partnerId | Direct | |
| 2 | PARTNER_NAME | /local/partnerData/PARTNER_NAME | partnerName | /output/partnerName | Direct | |
| 3 | PARTNER_TYPE | /local/partnerData/PARTNER_TYPE | partnerType | /output/partnerType | Direct | |
| 4 | ADDR_LINE_1 | /local/partnerData/ADDR_LINE_1 | addressLine1 | /output/address/line1 | Direct | Nested in address document |
| 5 | ADDR_LINE_2 | /local/partnerData/ADDR_LINE_2 | addressLine2 | /output/address/line2 | Direct | May be null |
| 6 | CITY | /local/partnerData/CITY | city | /output/address/city | Direct | |
| 7 | POSTAL_CODE | /local/partnerData/POSTAL_CODE | postalCode | /output/address/postalCode | Direct | |
| 8 | COUNTRY_CODE | /local/partnerData/COUNTRY_CODE | countryCode | /output/address/countryCode | Direct | ISO 3166-1 alpha-2 |
| 9 | STATUS | /local/partnerData/STATUS | status | /output/status | Conditional | Needs verification — mapping logic may apply transformation |
| 10 | LAST_UPDATED | /local/partnerData/LAST_UPDATED | lastUpdated | /output/lastUpdated | Computed | Needs verification — date format conversion may apply |

`✅ Mapping 2: Backend to Output — 10/10 fields`

---

## 3. Mapping: Error Response Construction

**Flow:** `pub.visualiserPartenaireREST`
**Step:** MAP step 4 — Build Error Response

| # | Source Field | Source Path | Target Field | Target Path | Type | Notes |
|---|-------------|-------------|--------------|-------------|------|-------|
| 1 | — | — | errorCode | /output/errorCode | Default | Value: "400" |
| 2 | — | — | errorMessage | /output/errorMessage | Default | Value: "Required field partnerId is missing" |

`✅ Mapping 3: Error Response — 2/2 fields`

---

## Summary

| Mapping | Source | Target | Fields | Status |
|---------|--------|--------|--------|--------|
| 1. Request Extraction | Input pipeline | Local variables | 3 | ✅ Complete |
| 2. Backend to Output | Adapter response | Output contract | 10 | ✅ Complete (2 need verification) |
| 3. Error Response | — (defaults) | Output pipeline | 2 | ✅ Complete |
| **Total** | | | **15** | **15/15 documented** |

> **Note:** This is a TEMPLATE example. In actual agent output, every mapping row from every MAP step and NDF signature would be documented — no placeholders. Uncertain mappings are flagged with "Needs verification".

---

> 🧞‍♂️ R-GENIE Agent Framework by Cheppali Shaik Sohail
> ✍️ Agent Author: MuleSoft PS EMEA | v1.0.0 | 2026-04-13
