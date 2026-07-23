---
description: Comprehensive DataWeave Function Reference - Enterprise Library
author: Cheppali Shaik Sohail
alwaysApply: false
---

# 📚 **DATAWEAVE FUNCTION REFERENCE**
*Comprehensive Enterprise Function Library (No Web Search Needed)*

<!-- Q2hlcHBhbGlTaGFpa1NvaGFpbDE1MDgxOTkz -->
## **Overview**
This reference provides complete DataWeave function coverage for enterprise transformations. Import the appropriate modules and use these production-tested patterns for optimal performance and reliability.

> **📋 Note:** This reference includes both **standard DataWeave built-in functions** and **custom R-GENIE enterprise patterns**. Custom functions are marked with `// CUSTOM:` comments where applicable. Standard built-in functions work out of the box; custom patterns require implementation in your DataWeave script.

---

## **📦 IMPORT STATEMENTS**
```dataweave
// Standard imports for enhanced functionality
import * from dw::core::Arrays
import * from dw::core::Objects
<!-- CS150893‌ -->
import * from dw::core::Strings
import * from dw::core::Numbers
```

---

## **🔤 ARRAY FUNCTIONS (dw::core::Arrays)**

### **Modern Array Operations (DataWeave 2.0+)**
```dataweave
// Remove duplicates by field
distinctBy((item) -> item.id)

// Group by field value
groupBy((item) -> item.category)

// Sort by field (ascending)
orderBy((item) -> item.timestamp)

// Sort by field (descending)
orderBy((item) -> -item.timestamp)

// Split into two arrays based on condition
partition((item) -> item.active)

// Split array at specific index
splitAt(index)

// Extract array portion by range
slice(start, end)

// Count occurrences by condition
countBy((item) -> item.status)

// Split into chunks of specified size
divideBy(size)

// Combine two arrays element by element
zip(array2)

// Check if any element matches condition
some((item) -> item.status == "ACTIVE")

// Check if all elements match condition
every((item) -> item.validated == true)

// Find first element matching condition
find((item) -> item.id == "TARGET_ID")

// Check if array contains specific element
contains(targetValue)

// Get maximum value by field
maxBy((item) -> item.amount)

// Get minimum value by field
minBy((item) -> item.amount)
```

### **Advanced Array Processing**
```dataweave
// Flatten nested arrays
flatten(nestedArray)

// Reduce array to single value with accumulator
reduce((item, acc = 0) -> acc + item.value)

// Sum array elements by field
sumBy((item) -> item.amount)

// Average of array elements by field
avgBy((item) -> item.score)

// Join array elements with separator
joinBy(separator)

// Remove null/empty elements
filter((item) -> item != null and item != "")

// Transform with index
map((item, index) -> { position: index, data: item })
```

---

## **🗂️ OBJECT FUNCTIONS (dw::core::Objects)**

### **Object Manipulation Utilities**
```dataweave
// Convert object to key-value pairs array
entriesOf(payload.data)
// Returns: [{"key": "field1", "value": "value1"}, ...]

// Extract all values as array
valuesOf(payload.data)
// Returns: ["value1", "value2", ...]

// Extract all keys as array  
keysOf(payload.data)
// Returns: ["field1", "field2", ...]

// Transform object entries
mapObject((value, key) -> {
    (upper(key)): value
})

// Filter object fields by condition
filterObject((value, key) -> value != null)

// Combine objects (right takes precedence)
mergeWith(object2)

// Remove specific fields
removeKeys(["unwanted", "fields"])

// Check if object has specific key
hasKey("fieldName")

// CUSTOM: Get nested value safely with default (implement in script)
getValue("nested.field.path", defaultValue)

// CUSTOM: Convert object to different structure (implement in script)
transform(object, (value, key) -> {
    (camelize(key)): value
})
```

### **Object Construction Patterns**
```dataweave
// Dynamic object construction
{
    (if (condition) "conditionalField" else null): value,
    ...baseObject,
    newField: calculatedValue
}

// Object from array with key mapping
arrayData reduce (item, acc = {}) -> 
    acc ++ { (item.id): item.name }

// CUSTOM: Nested object flattening (see implementation below)
flattenObject(nestedObject, separator = ".")

// CUSTOM: Object field renaming (implement in script)
renameKeys(object, mappingObject)
```

---

## **🔤 STRING FUNCTIONS (dw::core::Strings)**

### **String Processing Functions**
```dataweave
// Remove leading/trailing whitespace
trim(payload.name)

// Convert to uppercase
upper(payload.code)

// Convert to lowercase
lower(payload.email)

// Capitalize first letter of each word
capitalize(payload.title)

// Convert snake_case to camelCase
camelize(payload.field_name)

// Convert camelCase to snake_case
underscore(payload.fieldName)

// Make word plural
pluralize(payload.item)

// Make word singular
singularize(payload.items)

// Check if string starts with substring
startsWith(prefix)

// Check if string ends with substring
endsWith(suffix)

// Check if string contains substring
contains(substring)

// Replace all occurrences
replace(searchString, replacement)

// Split string by delimiter
splitBy(delimiter)

// Left pad string to length
leftPad(targetLength, padCharacter)

// Right pad string to length
rightPad(targetLength, padCharacter)

// Extract substring
substring(startIndex, endIndex)

// Repeat string n times
repeat(count)
```

### **String Validation & Formatting**
```dataweave
// Check if string is empty or whitespace
isEmpty(value)

// Check if string matches pattern
matches(regexPattern)

// Extract matches from regex
scan(regexPattern)

// URL encode string
urlEncode(value)

// URL decode string
urlDecode(value)

// Base64 encode
toBase64(value)

// Base64 decode
fromBase64(encodedValue)

// Generate UUID
uuid()

// Format string with parameters
format(template, parameters)
```

---

## **🔢 NUMBER FUNCTIONS (dw::core::Numbers)**

### **Numeric Operations and Formatting**
```dataweave
// Round to specified decimal places
round(amount, precision)

// Round up to nearest integer
ceil(amount)

// Round down to nearest integer
floor(amount)

// Get absolute value
abs(amount)

// Get maximum of multiple values
max([amount1, amount2, amount3])

// Get minimum of multiple values
min([amount1, amount2, amount3])

// Generate random integer up to max
randomInt(max)

// Convert to binary representation
toBinary(number)

// Convert to hexadecimal
toHex(number)

// Convert to octal
toOctal(number)

// Parse number from string with default
parseNumber(stringValue, defaultValue)

// Check if value is a number
isNumber(value)

// Check if number is integer
isInteger(number)

// Check if number is decimal
isDecimal(number)
```

### **Advanced Numeric Operations**
> **Note:** Functions marked `CUSTOM:` are R-GENIE enterprise patterns - implement in your script or use as templates.

```dataweave
// CUSTOM: Calculate percentage (implement in script)
percentage(part, total)

// Built-in: Calculate power
pow(base, exponent)

// Built-in: Calculate square root
sqrt(number)

// CUSTOM: Format currency (implement in script)
formatCurrency(amount, currency)

// CUSTOM: Round to currency precision (implement in script)
roundCurrency(amount)

// CUSTOM: Safe division with default (implement in script)
safeDivide(dividend, divisor, defaultValue)

// CUSTOM: Clamp number between min and max (implement in script)
clamp(value, minValue, maxValue)

// CUSTOM: Linear interpolation between two values (implement in script)
lerp(start, end, factor)
```

---

## **⏰ DATE AND TIME FUNCTIONS**

### **Date Manipulation (dw::core::Dates)**
> **Note:** Some helper functions require `import * from dw::core::Periods` for period arithmetic.

```dataweave
// Built-in: Current date/time
now()

// CUSTOM: Parse date from string (use date coercion: dateString as Date {format: "..."})
parseDate(dateString, format)

// CUSTOM: Format date to string (use: date as String {format: "..."})
formatDate(date, format)

// Built-in: Add time to date (use period arithmetic: date + |P1D|)
addDays(date, days)
addHours(date, hours)
addMinutes(date, minutes)

// CUSTOM: Calculate difference between dates (implement using period subtraction)
daysBetween(startDate, endDate)
hoursBetween(startDate, endDate)

// Built-in: Extract date components (use date.year, date.month, etc.)
year(date)
month(date)
day(date)
hour(date)
minute(date)
second(date)

// CUSTOM: Start/end of time periods (implement in script)
startOfDay(date)
endOfDay(date)
startOfMonth(date)
endOfMonth(date)
```

---

## **🛠️ UTILITY FUNCTIONS**

### **Type Checking and Conversion**
```dataweave
// Built-in: Check data types
typeOf(value)
isArray(value)
isObject(value)
isString(value)
isNumber(value)
isBoolean(value)
isNull(value)

// R-GENIE CUSTOM PATTERNS: Safe type conversions - define these in your script
// For display fields
fun safeDisplayString(value: Any): String | Null = value as String default null
fun safeDisplayNumber(value: Any): Number | Null = value as Number default null

// For calculation fields  
fun safeCalculationNumber(value: Any): Number = value as Number default 0
fun safeCalculationBoolean(value: Any): Boolean = value as Boolean default false
fun safeCalculationDate(value: Any): Date = value as Date default now()
fun safeArray(value: Any): Array = value as Array default []
fun safeObject(value: Any): Object = value as Object default {}

// CUSTOM: Conditional type conversion (implement in script)
conditionalConvert(value, targetType, condition)
```

### **Error Handling and Validation**
```dataweave
// Built-in: Try operation with fallback
try(() -> riskyOperation) otherwise fallbackValue

// CUSTOM: Validate and transform (implement in script)
validate(value, validationFunction, errorMessage)

// CUSTOM: Assert condition (implement in script)
assert(condition, errorMessage)

// Built-in: Log value for debugging (DataWeave 2.4+)
log(value, level)

// Built-in: Trace execution flow
trace(value, messagePrefix)
```

---

## **🎯 COMMON ENTERPRISE PATTERNS**

> **📋 All patterns in this section are R-GENIE custom implementations.** Copy these function definitions into your DataWeave script to use them. These are battle-tested patterns from real enterprise transformations.

### **Currency Conversion**
```dataweave
fun convertCurrency(amount: Number, fromRate: Number, toRate: Number): Number =
    (amount * toRate) / fromRate

fun safeCurrencyConversion(amount: Any, exchangeRates: Object, 
                          fromCurrency: String, toCurrency: String): Number =
    if (amount != null and exchangeRates[fromCurrency] != null and exchangeRates[toCurrency] != null)
        convertCurrency(amount as Number, exchangeRates[fromCurrency], exchangeRates[toCurrency])
    else 0
```

### **Data Validation Utilities**
```dataweave
fun validateEmail(email: String): Boolean =
    email matches /^[^\s@]+@[^\s@]+\.[^\s@]+$/

fun validatePhone(phone: String): Boolean =
    phone matches /^\+?[\d\s\-\(\)]{10,}$/

fun validateRequired(value: Any, fieldName: String): Any =
    if (value != null and value != "")
        value
    else
        error("Required field missing: " ++ fieldName)

fun sanitizeString(input: String): String =
    input 
    |> trim($)
    |> replace($, /[<>\"'&]/, "")
```

### **Object Transformation Patterns**
```dataweave
fun normalizeKeys(obj: Object): Object =
    obj mapObject ((value, key) -> {
        (lower(key)): value
    })

fun flattenObject(obj: Object, prefix: String = ""): Object =
    obj reduce ((value, key, acc = {}) ->
        if (value is Object)
            acc ++ flattenObject(value, prefix ++ key ++ ".")
        else
            acc ++ { (prefix ++ key): value }
    )

fun buildObjectFromPath(path: String, value: Any): Object =
    path splitBy "." reduce (key, acc = value) -> { (key): acc }
```

---

## **💡 PERFORMANCE BEST PRACTICES**

### **Optimization Tips**
1. **Use specific imports**: Import only needed functions to reduce memory overhead
2. **Prefer built-in functions**: Use `sumBy`, `maxBy`, `minBy` instead of manual reduce operations
3. **Cache calculations**: Store complex calculations in variables for reuse
4. **Use lazy evaluation**: Functions are only executed when their result is needed
5. **Minimize object creation**: Reuse objects where possible in loops
6. **Use pattern matching**: More efficient than multiple conditional checks

### **Memory-Efficient Patterns**
```dataweave
// Good: Efficient chaining
payload.items 
    filter ($.active == true) 
    map ($.amount)
    sumBy ($)

// Better: Single-pass processing
payload.items reduce ((item, acc = 0) ->
    if (item.active == true) acc + item.amount else acc
)

// Best: Using built-in aggregation
payload.items 
    filter ($.active == true)
    sumBy ($.amount)
```

---

*This reference covers the most commonly used DataWeave functions for enterprise transformations. For specialized functions or advanced use cases, consult the official MuleSoft DataWeave documentation.*