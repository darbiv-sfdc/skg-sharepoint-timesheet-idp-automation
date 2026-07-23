# Replication-Gap Report — VenOracle._ChangePO

> Phase 4. BizTalk → MuleSoft mapping + every replication gap with reason and recommended action.

## BizTalk → MuleSoft construct mapping

| BizTalk Construct | MuleSoft Equivalent | Verdict |
|-------------------|---------------------|---------|
| `ReceiveOracleDoc_Port` (logical one-way receive, XmlDocument) | Listener source (File/SFTP/HTTP/DB) per actual binding | 🟡 (adapter binding not in export) |
| Orchestration `ProcessChangePOIncoming` | Mule flow | 🟢 |
| Receive (Activate) | Flow trigger | 🟢 |
| VariableAssignment "RuntimeEnv and ver" (ConfigHelper + EventLog) | `${runtimeEnv}` property + `<logger>` | 🟡 (helper source absent) |
| Decision "XML to ORAChgPO?" (`count(...)!=0`) | `<choice>` with `sizeOf(...) > 0` / payload check | 🟢 |
| Terminate "Not CHANGE_PO_006" | `<raise-error>` / flow stop | 🟢 |
| Construct + `xpath` extract `msgORAChgPO` | DataWeave / `read()` of inbound XML | 🟢 |
| Construct + Transform (Map_ORAChgPO_to_Email) | `<ee:transform>` (XSLT portable, or rewrite in DataWeave) | 🟢 |
| MessageAssignment_1 (config To/Cc override + Subject prefix) | DataWeave + `${EmailRecipientTo}` / `${EmailRecipientCc}` | 🟡 (helper + config absent) |
| Call `SendEmail` | Email connector `<email:send>` | 🟡 (helper source absent) |
| Message type `Venture.Utilities.Email.Email` | DataWeave-built payload / Email connector model | 🟡 (type source absent) |
| Schema `CHANGE_PO_006` (OAGIS 057) | DataWeave type / XSD validation | 🔴 (external schema body absent) |

## Gap register

| # | Artifact | Gap | Why not replicable | Recommended MuleSoft action |
|---|----------|-----|--------------------|-----------------------------|
| 1 | `VenOracle.Schemas._057_change_po_006` | Full source schema (OAGIS CHANGE_PO_006) body absent | `.xsd` is only a wrapper that imports the type from an external assembly not in export | Obtain the OAGIS 057 `CHANGE_PO_006` XSD from the BizTalk team; use it for XSD validation + as DataWeave input type. Fields-in-use already recovered in `schema-structures.md` |
| 2 | `Venture.Utilities.Email.Email` | Target message type body absent | External .NET class; only the used shape is known | Model the email payload (`Subject`, `Body`, `SendTo`, `SendCc`) directly in DataWeave / Email connector |
| 3 | `Venture.Utilities.ConfigHelper` | Helper logic absent | External assembly; `GetNameValueFileSectionHandlerKey` body not in export | Replace with Mule property placeholders / Secure Properties for `VenOracleSettings` keys (`RuntimeEnv`, `EmailRecipientTo`, `EmailRecipientCc`) |
| 4 | `Venture.Utilities.Email.SendEmail` | Helper logic absent | External assembly; SMTP/send logic not in export | Use Email connector `<email:send>`; SMTP host/credentials must come from the BizTalk team |
| 5 | Receive adapter binding | Physical port binding absent | Not exported (lives in BizTalk binding file) | Confirm inbound transport (Oracle/File/SFTP/HTTP) with the BizTalk team to pick the Mule listener |
| 6 | Receive pipeline | No `.btp`; pipeline not confirmed | Binding not in export | Assume XML receive; validate against schema once obtained |
| 7 | `VenOracleSettings` config values | `[ENV]` values absent | Environment-specific config not exported | Supply per-environment properties |
| 8 | Hard-coded recipient lists (map links 9-10) | Behavior nuance | Map sets them but orchestration overwrites with config | In Mule, drive recipients from config only; the map constants are dead values at runtime |

## Tree-of-Thought — map rebuild approach

The transform is a CustomXSLT (XSLT 1.0).
- **Branch A — reuse the `.xsl` directly** in `<ee:transform>` (Mule supports XSLT): fastest, preserves exact output, but the hard-coded recipient constants are redundant (overwritten downstream).
- **Branch B — rewrite in DataWeave**: cleaner, drops the dead recipient constants, easier to maintain; small re-test cost.
- **Chosen: B** — recipients come from config anyway, the Body/Subject formatting is simple string concatenation + one line loop, and DataWeave keeps the Mule app consistent. Keep the `.xsl` as the reference for exact text/labels.
