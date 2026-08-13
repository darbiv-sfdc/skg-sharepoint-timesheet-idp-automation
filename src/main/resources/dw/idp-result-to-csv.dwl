%dw 2.0
output application/csv header=true
// Flatten a single IDP execution result into CSV rows:
// one row per timeSheetData line-item, repeating document/header fields.
// If timeSheetData is empty, emit a single header-only row.
var doc = payload
var headerFields = {
  id: doc.id,
  documentName: doc.documentName,
  status: doc.status,
  lastName: doc.fields.lastName.value,
  firstName: doc.fields.firstName.value,
  fullName: doc.fields.fullName.value,
  employeeID: doc.fields.employeeID.value,
  timeSheet: doc.fields.timeSheet.value,
  dateFrom: doc.fields.dateFrom.value,
  dateTo: doc.fields.dateTo.value,
  tableStructure: doc.fields.tableStructure.value
}
var lineItems = doc.tables.timeSheetData default []
var emptyLine = {
  projectCode: null, tradeCode: null, description: null,
  monTime: null, tueTime: null, wedTime: null, thuTime: null,
  friTime: null, satTime: null, sunTime: null
}
---
if (sizeOf(lineItems) == 0)
  [ headerFields ++ emptyLine ]
else
  lineItems map (row) -> headerFields ++ {
    projectCode: row.projectCode.value,
    tradeCode: row.tradeCode.value,
    description: row.description.value,
    monTime: row.monTime.value,
    tueTime: row.tueTime.value,
    wedTime: row.wedTime.value,
    thuTime: row.thuTime.value,
    friTime: row.friTime.value,
    satTime: row.satTime.value,
    sunTime: row.sunTime.value
  }
