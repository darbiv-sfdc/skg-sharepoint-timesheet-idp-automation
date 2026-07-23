%dw 2.0
// Transform Salesforce search response to customer response format
output application/json skipNullOn = "everywhere"
var records = vars.outputPayload.searchRecords default []
---
records map (item) -> {
    "customerId": item.record.CustomerId__c,
    "name": item.record.Name,
    "firstName": item.record.FirstName,
    "lastName": item.record.LastName
}
