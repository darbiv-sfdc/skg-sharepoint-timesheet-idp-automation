%dw 2.0
output application/csv header=true
// Flatten a single IDP execution result into CSV rows:
// one row per timeSheetData line-item, repeating document/header fields.
// In addition to the raw monTime..sunTime strings, each day's "HHMM-HHMM"
// value is split into separate start/end hour and minute columns.
// If timeSheetData is empty, emit a single header-only row.
var timesheetData = payload.tables.timeSheetData default []
var fields = payload.fields default {}
fun cleanText(text) = if (text == null) null else (text replace "\n" with " " replace "\r" with " " replace "\\" with "")
fun parseTime(timeStr) =
  if (timeStr == null or timeStr == "")
    {startHH: "", startMM: "", endHH: "", endMM: ""}
  else do {
    var cleaned = timeStr replace " " with ""
    var parts = cleaned splitBy "-"
    var startTime = parts[0] default ""
    var endTime = parts[1] default ""
    ---
    {
      startHH: if (sizeOf(startTime) >= 4) startTime[0 to 1] else "",
      startMM: if (sizeOf(startTime) >= 4) startTime[2 to 3] else "",
      endHH: if (sizeOf(endTime) >= 4) endTime[0 to 1] else "",
      endMM: if (sizeOf(endTime) >= 4) endTime[2 to 3] else ""
    }
  }
---
if (sizeOf(timesheetData) == 0)
  [{
    id: payload.id,
    documentName: payload.documentName,
    status: payload.status,
    message: "No timesheet data available"
  }]
else
  timesheetData map (row) -> do {
    var monParsed = parseTime(cleanText(row.monTime.value))
    var tueParsed = parseTime(cleanText(row.tueTime.value))
    var wedParsed = parseTime(cleanText(row.wedTime.value))
    var thuParsed = parseTime(cleanText(row.thuTime.value))
    var friParsed = parseTime(cleanText(row.friTime.value))
    var satParsed = parseTime(cleanText(row.satTime.value))
    var sunParsed = parseTime(cleanText(row.sunTime.value))
    ---
    {
      id: payload.id,
      documentName: payload.documentName,
      status: payload.status,
      lastName: cleanText(fields.lastName.value),
      firstName: cleanText(fields.firstName.value),
      fullName: cleanText(fields.fullName.value),
      employeeID: cleanText(fields.employeeID.value),
      timeSheet: cleanText(fields.timeSheet.value),
      dateFrom: cleanText(fields.dateFrom.value),
      dateTo: cleanText(fields.dateTo.value),
      tableStructure: cleanText(fields.tableStructure.value),
      projectCode: cleanText(row.projectCode.value),
      tradeCode: cleanText(row.tradeCode.value),
      description: cleanText(row.description.value),
      monTime: cleanText(row.monTime.value),
      tueTime: cleanText(row.tueTime.value),
      wedTime: cleanText(row.wedTime.value),
      thuTime: cleanText(row.thuTime.value),
      friTime: cleanText(row.friTime.value),
      satTime: cleanText(row.satTime.value),
      sunTime: cleanText(row.sunTime.value),
      monStartHH: monParsed.startHH,
      monStartMM: monParsed.startMM,
      monEndHH: monParsed.endHH,
      monEndMM: monParsed.endMM,
      tueStartHH: tueParsed.startHH,
      tueStartMM: tueParsed.startMM,
      tueEndHH: tueParsed.endHH,
      tueEndMM: tueParsed.endMM,
      wedStartHH: wedParsed.startHH,
      wedStartMM: wedParsed.startMM,
      wedEndHH: wedParsed.endHH,
      wedEndMM: wedParsed.endMM,
      thuStartHH: thuParsed.startHH,
      thuStartMM: thuParsed.startMM,
      thuEndHH: thuParsed.endHH,
      thuEndMM: thuParsed.endMM,
      friStartHH: friParsed.startHH,
      friStartMM: friParsed.startMM,
      friEndHH: friParsed.endHH,
      friEndMM: friParsed.endMM,
      satStartHH: satParsed.startHH,
      satStartMM: satParsed.startMM,
      satEndHH: satParsed.endHH,
      satEndMM: satParsed.endMM,
      sunStartHH: sunParsed.startHH,
      sunStartMM: sunParsed.startMM,
      sunEndHH: sunParsed.endHH,
      sunEndMM: sunParsed.endMM
    }
  }
