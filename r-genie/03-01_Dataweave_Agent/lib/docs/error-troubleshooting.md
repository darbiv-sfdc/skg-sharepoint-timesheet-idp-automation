---
description: Comprehensive Error Patterns and Troubleshooting Solutions for DataWeave
author: Cheppali Shaik Sohail
alwaysApply: false
---

# 🚨 **ERROR PATTERNS & TROUBLESHOOTING**
*Comprehensive Error Detection and Resolution Guide*

<!-- Q2hlcHBhbGlTaGFpa1NvaGFpbDE1MDgxOTkz -->
## **🔧 COMPREHENSIVE ERROR PATTERN DETECTION**

### **🚨 CRITICAL COMPILATION ERRORS**

#### **Reserved Keyword Errors (Auto-fix required)**
```bash
# RESERVED KEYWORD COMPILATION ERRORS
<!-- CS150893‌ -->
ERROR: "Invalid field name identifier. Reason: The name `type` is a reserved word"
✅ FIX: payload.type → payload."type"

ERROR: "Invalid field name identifier. Reason: The name `input` is a reserved word"  
✅ FIX: item.input → item."input"

ERROR: "Invalid field name identifier. Reason: The name `output` is a reserved word"
✅ FIX: data.output → data."output"

ERROR: "Invalid field name identifier. Reason: The name `var` is a reserved word"
✅ FIX: config.var → config."var"

ERROR: "Invalid field name identifier. Reason: The name `case` is a reserved word"
✅ FIX: field.case → field."case"

# COMPLETE RESERVED WORDS LIST:
if, else, unless, using, as, is, null, true, false, default, case,
fun, input, output, ns, type, import, var, and, or, throw, do, for,
yield, enum, private, async
```

#### **Payload Access Errors**
```bash
ERROR: "Unable to resolve reference of: `payload`"  
✅ FIX: Move payload access inside main transformation block (after ---)

ERROR: "Missing Expression" with functions
✅ FIX: sizeOf(payload.items) not payload.items sizeOf

ERROR: "Cannot resolve variable: payload" 
✅ FIX: Ensure payload access is after --- separator in script
```

#### **Function Syntax Errors**
```bash
ERROR: "Missing Expression at the end of input"
✅ FIX: Check for missing closing brackets, parentheses, or incomplete expressions

ERROR: "Invalid input '}', expected EOF"
✅ FIX: Extra closing bracket - check bracket matching

ERROR: "Unexpected token"
✅ FIX: Check for typos in function names, missing commas, or syntax errors
```

---

## **🚨 XML TRANSFORMATION ERRORS (CRITICAL FOR XML INPUTS)**

### **XML Array Errors (Multivalue selector issues)**

#### **Cannot Coerce Object to Array**
```bash
ERROR: "Cannot coerce Object ({name: 'Laptop'...}) to Array" 
CAUSE: Using single element selector when XML has only one element
❌ PROBLEM: payload.catalog.product map (...) 
✅ FIX: payload.catalog.*product map (...)  # Always treats as array

# ALTERNATIVE SOLUTIONS:
✅ SOLUTION 2: Force array conversion
(payload.catalog.product match {
    case arr is Array -> arr
    case obj is Object -> [obj]
    else -> []
}) map (...)

✅ SOLUTION 3: Safe array utility function
fun toSafeArray(value: Any): Array =
    value match {
        case arr is Array -> arr
        case obj is Object -> [obj]
        case null -> []
        else -> [value]
    }
```

#### **Function Called with Object Instead of Array**
```bash
ERROR: "You called the function 'map' with these arguments: 1: Object"
CAUSE: XML element collapsed to single value instead of array
❌ PROBLEM: payload.specifications.spec map (...)
✅ FIX: payload.specifications.*spec map (...)  # Proper multivalue selector

ERROR: "Cannot call 'filter' on Object"
CAUSE: Missing multivalue selector for XML array
❌ PROBLEM: payload.orders.order filter (...)
✅ FIX: payload.orders.*order filter (...)
```

#### **Cannot Resolve Field Errors**
```bash
ERROR: "Cannot resolve field 'spec' of Object {spec: 'Intel i7'}"
CAUSE: Missing multivalue selector for XML repeated elements
❌ PROBLEM: xmlElement.spec
✅ FIX: xmlElement.*spec

ERROR: "Cannot resolve field '@id' of String"
CAUSE: Missing @ prefix for XML attribute access
❌ PROBLEM: element.id (when trying to access attribute)
✅ FIX: element.@id

ERROR: "Cannot resolve field 'id' of Object"  
CAUSE: Wrong attribute access syntax
❌ PROBLEM: element.id (should be attribute)
✅ FIX: element.@id
```

### **XML Specs/Array to Object Errors**

#### **Empty Specs Object Creation**
```bash
ERROR: "Empty specs object created but input has data"
CAUSE: Not extracting text value from XML elements
❌ PROBLEM: acc ++ { (spec.@name): spec }  # Gets element with attributes
✅ FIX: acc ++ { (spec.@name): spec as String }  # Extracts text value

ERROR: "Specs object contains XML structure instead of values"
CAUSE: Not converting XML element to primitive value
❌ PROBLEM: { (spec.@name): spec }
✅ FIX: { (spec.@name): spec as String }
```

#### **Missing Multiple Elements**
```bash
ERROR: "Only getting first spec instead of all specs"
CAUSE: XML duplicate keys collapsed to single element
❌ PROBLEM: element.specifications.spec
✅ FIX: element.specifications.*spec

ERROR: "Only getting last product when multiple exist"
CAUSE: XML parser collapses duplicate keys
❌ PROBLEM: payload.catalog.product  # Only gets last product
✅ FIX: payload.catalog.*product  # Gets all products as array
```

### **XML Namespace and Attribute Errors**

#### **Namespace Access Issues**
```bash
ERROR: "Cannot resolve field 'ns1:product'"
CAUSE: Namespace syntax not quoted
❌ PROBLEM: payload.ns1:product
✅ FIX: payload."ns1:product"

ERROR: "Cannot resolve field 'xmlns:ns1'"
CAUSE: Incorrect namespace attribute access
❌ PROBLEM: element.xmlns:ns1
✅ FIX: element.@xmlns.ns1
```

#### **Attribute Access Problems**
```bash
ERROR: "Cannot resolve field '@id' when @ is missing"
CAUSE: Forgot @ prefix for attribute
❌ PROBLEM: product.id (when id is an attribute)
✅ FIX: product.@id

ERROR: "Cannot resolve field 'currency' on Number"
CAUSE: Accessing attribute on converted value
❌ PROBLEM: (item.price as Number).@currency
✅ FIX: var price = item.price; { amount: price as Number, currency: price.@currency }
```

---

## **🚨 CLI VALIDATION & EXECUTION ERRORS**

### **CLI Command Format Errors**

#### **Input Parameter Format Issues**
```bash
ERROR: "Value for option '--input' should be in KEY=VALUE format but was payload"
CAUSE: Missing equals sign in input parameter
❌ WRONG: dw run -f "script.dwl" -i payload input.json
✅ CORRECT: dw run -f "script.dwl" -i=payload=input.json

ERROR: "The script and file parameters are mutually exclusive, but one is required"
CAUSE: Mixing file parameter with inline script
❌ WRONG: dw run -f "script.dwl" "inline script"
✅ CORRECT: dw run -f "script.dwl" -i=payload=input.json

ERROR: "Unable to parse empty input, while reading `payload` as Json"
CAUSE: Missing input parameter entirely
❌ WRONG: dw run -f "script.dwl"
✅ CORRECT: dw run -f "script.dwl" -i=payload=input.json
```

#### **File Path Resolution Issues**
```bash
ERROR: "FileNotFoundException: input.json"
CAUSE: Relative path not found (especially on Windows)
❌ PROBLEMATIC: dw run -f "script.dwl" -i=payload=input.json
✅ RELIABLE: dw run -f "script.dwl" -i=payload="C:\full\absolute\path\input.json"

ERROR: "The system cannot find the file specified"
CAUSE: Windows PowerShell path resolution issues
❌ WRONG: Using relative paths in PowerShell
✅ FIX: Use absolute paths with proper escaping

ERROR: "Permission denied accessing file"
CAUSE: File permissions or locked file
✅ FIX: Check file permissions, close file in editors, run as administrator if needed
```

#### **CLI Environment Issues**
```bash
ERROR: "dw: command not found"
CAUSE: DataWeave CLI not installed or not in PATH
✅ FIX: Install DataWeave CLI and ensure it's in system PATH

ERROR: "dw returned non-zero exit code"
CAUSE: CLI execution failed
✅ FIX: Check CLI help with 'dw help run' and verify command syntax

ERROR: "CLI timeout or hanging"
CAUSE: Infinite loop or performance issue in script
✅ FIX: Add timeout commands (timeout 30s on Linux/Mac, Measure-Command on Windows)
```

### **DO Block Syntax Errors (Anti-oscillation patterns)**

#### **DO Block Structure Issues**
```bash
ERROR: "Invalid input ';', expected '}' for the do block"
CAUSE: Using semicolons in DataWeave (not needed)
❌ PROBLEM: var amount = 100;
✅ FIX: var amount = 100  # Remove semicolons

ERROR: "Invalid input '{', expected '}' for the do block" 
CAUSE: Missing --- separator in do block
❌ PROBLEM: 
do {
    var data = payload
    { result: data }
}
✅ FIX:
do {
    var data = payload
    ---
    { result: data }
}

ERROR: "Unable to resolve reference of: `payload`" (in do blocks)
CAUSE: Scope resolution issues in do block
✅ FIX: Switch to direct transformation approach without do blocks
```

#### **Scope and Variable Issues**
```bash
ERROR: "Variable 'varName' is already defined"
CAUSE: Duplicate variable declaration
❌ PROBLEM: Multiple var declarations with same name
✅ FIX: Use unique variable names or nested scopes

ERROR: "Cannot resolve variable: varName"
CAUSE: Variable scope or declaration issues
✅ FIX: Ensure variable is declared before use and in correct scope
```

---

## **🚨 HARDCODING DETECTION PATTERNS**

### **Automatic Detection Patterns**
```javascript
// FORBIDDEN PATTERNS (Auto-detect and flag for consent check):
PATTERN: /:\s*\d+(?:\.\d+)?\s*[,}]/g        // Numeric hardcoding
EXAMPLE: "amount": 100.50, "count": 5

PATTERN: /:\s*"[^"]*"\s*[,}]/g              // String hardcoding  
EXAMPLE: "status": "COMPLETED", "type": "PREMIUM"

PATTERN: /\[\s*\{[^}]*"[^"]*"[^}]*\}\s*\]/g // Object array hardcoding
EXAMPLE: [{"id": 1}, {"id": 2}]

PATTERN: /netChangeUSD:\s*\d+/g             // Summary value hardcoding
EXAMPLE: netChangeUSD: 745

// CONSENT VALIDATION PATTERNS:
PATTERN: /\/\/ HARDCODED:/g                 // Check for consent documentation
PATTERN: /\/\/ ✅ APPROVED/g                // Check for approval documentation
PATTERN: /User approved|User consent|Business constant/g // Consent indicators

// REQUIRED PATTERNS (Auto-validate presence):
PATTERN: /payload\./g                       // Dynamic payload access
PATTERN: /map\s*\(/g                        // Array transformation  
PATTERN: /sumBy\s*\(/g                      // Aggregation functions
PATTERN: /default\s+/g                      // Safe access patterns
```

### **Hardcoding Error Messages**
```bash
ERROR: "Hardcoded values detected without user consent"
CAUSE: Static values found in transformation without approval
✅ FIX: Ask user for explicit consent or make values dynamic

ERROR: "Business logic contains static calculations"
CAUSE: Summary calculations use hardcoded values
✅ FIX: Calculate from input data or get user approval for constants

ERROR: "Array contains hardcoded objects"
CAUSE: Static object arrays in transformation
✅ FIX: Generate objects from input data or get user consent

ERROR: "Shortcut hardcoding to match expected output detected"
CAUSE: Values hardcoded to force 100% accuracy instead of fixing business logic
✅ FIX: Analyze business logic differences, continue dynamic refinement
❌ FORBIDDEN: Hardcoding specific values from expected output without consent

ERROR: "Refinement-first protocol violation"
CAUSE: Jumped to hardcoding without exhausting dynamic approaches
✅ FIX: Continue iterative refinement, debug business logic calculations
❌ FORBIDDEN: Bypassing mandatory refinement-first protocol
```

---

## **🚨 XML-SPECIFIC REQUIRED PATTERNS (For XML inputs)**

### **XML Pattern Validation**
```javascript
// XML-SPECIFIC REQUIRED PATTERNS:
PATTERN: /\.\*\w+/g                         // Multivalue selectors (.*element)
PATTERN: /@\w+/g                           // XML attribute access (@attribute)
PATTERN: /as String/g                      // XML text value extraction

// XML ANTI-PATTERNS (Auto-detect and suggest alternatives):
PATTERN: /valuesOf\([^)]*catalog[^)]*\)/g   // valuesOf on XML structures
PATTERN: /payload\.\w+\.product(?!\.\*)/g   // Missing multivalue selector for products
PATTERN: /payload\.\w+\.spec(?!\.\*)/g     // Missing multivalue selector for specs
```

### **XML Anti-Pattern Error Messages**
```bash
ERROR: "Using valuesOf() for XML array processing"
CAUSE: valuesOf() used instead of multivalue selectors

ERROR: "XML validation failing on formatting differences"
CAUSE: XML declaration quote style mismatch (single vs double quotes)
✅ FIX: Enhanced normalization automatically handles quote standardization
NOTE: XML declarations are now auto-normalized to DataWeave format: version="1.0" → version='1.0'

ERROR: "XML encoding inconsistencies detected"
CAUSE: Mixed quote styles in XML declarations
✅ FIX: Apply enhanced XML normalization patterns for DataWeave-compatible formatting
❌ PROBLEM: valuesOf(payload.catalog) map (...)
✅ FIX: payload.catalog.*product map (...)

ERROR: "Missing multivalue selector for XML array"
CAUSE: Direct element access instead of .*element
❌ PROBLEM: payload.items.item map (...)
✅ FIX: payload.items.*item map (...)

ERROR: "XML attribute access missing @ prefix"
CAUSE: Trying to access attribute like regular field
❌ PROBLEM: product.id (when id is attribute)
✅ FIX: product.@id
```

---

## **🛡️ CLI TROUBLESHOOTING PATTERNS (ANTI-OSCILLATION CRITICAL)**

### **🚨 MANDATORY QUALITY GATE CHECKS DURING TROUBLESHOOTING**

**Before each troubleshooting attempt, run these quality gates:**

```bash
# QUALITY GATE ENFORCEMENT DURING REFINEMENT
validate_refinement_approach() {
    echo "🛡️ REFINEMENT QUALITY GATE CHECK:"
    echo "1. ✅ Am I following dynamic-first approach?"
    echo "2. ✅ Have I analyzed business logic differences?"
    echo "3. ✅ Am I avoiding shortcut hardcoding?"
    echo "4. ✅ Have I documented this refinement attempt?"
    echo "5. ✅ Am I fixing root cause vs. symptoms?"
    
    echo "❌ FORBIDDEN DURING REFINEMENT:"
    echo "   - Hardcoding values to match expected output"
    echo "   - Skipping business logic analysis"
    echo "   - Taking shortcuts to force 100% match"
    
    echo "✅ REQUIRED DURING REFINEMENT:"
    echo "   - Dynamic calculation improvements"
    echo "   - Business logic debugging"
    echo "   - Root cause analysis of differences"
}

# Run this before EVERY refinement iteration
validate_refinement_approach
```

### **CLI Anti-Oscillation Strategy**
**If CLI commands fail after 3 attempts with same error:**

#### **Step 1: Switch to Absolute File Paths**
```bash
# ESPECIALLY IMPORTANT ON WINDOWS
❌ PROBLEMATIC: dw run -f "script.dwl" -i=payload=input.json
✅ RELIABLE: dw run -f "script.dwl" -i=payload="C:\full\absolute\path\input.json"

# LINUX/MAC ABSOLUTE PATHS
✅ RELIABLE: dw run -f "script.dwl" -i=payload="/full/absolute/path/input.json"
```

#### **Step 2: Try Alternative Input Methods**
```bash
# LITERAL INPUT METHOD
✅ ALTERNATIVE: dw run -f "script.dwl" -li payload='{"data": "value"}'

# FILE INPUT WITH DIFFERENT SYNTAX
✅ ALTERNATIVE: dw run -f "script.dwl" --input payload=input.json

# PARAMETER-BASED CONTEXT
✅ ALTERNATIVE: dw run -f "script.dwl" \
  -i=payload="input.json" \
  -p batchId="BATCH_001" \
  -p environment="DEV"
```

#### **Step 3: Check CLI Installation and Help**
```bash
# VERIFY CLI INSTALLATION
dw --version
dw help validate
dw help run

# TEST BASIC CLI FUNCTIONALITY
echo '{"test": "value"}' | dw 'payload.test'
```

#### **Step 4: Platform-Specific Timeout Protection**
```bash
# LINUX/MAC TIMEOUT
timeout 30s dw run -f "script.dwl" -i=payload="input.json" -o "output.json"

# WINDOWS POWERSHELL TIMEOUT
Measure-Command { dw run -f "script.dwl" -i=payload="input.json" -o "output.json" }
```

### **CLI Error Pattern Recognition**
```bash
# CLI EXECUTION PATTERNS
if dw validate -f "script.dwl" -i payload; then
    echo "✅ Syntax validation PASSED"
else
    echo "❌ Syntax validation FAILED - applying fixes"
    # Apply specific syntax fixes based on error messages
fi

# RUNTIME ERROR DETECTION
if dw run -f "script.dwl" -i=payload="input.json" -o "output.json"; then
    echo "✅ Execution PASSED"
else
    echo "❌ Execution FAILED - analyzing runtime errors"
    # Apply runtime fixes based on error patterns
fi
```

---

## **🏢 MULESOFT RUNTIME FAILURE PREVENTION BEST PRACTICES**
*Enterprise-Grade Production Safety Patterns*

### **🛡️ CRITICAL RUNTIME FAILURE PREVENTION (MULESOFT OFFICIAL GUIDANCE)**

#### **🚨 NULL SAFETY & TYPE COERCION (PREVENT 90% OF RUNTIME FAILURES)**
```dataweave
// ❌ RUNTIME FAILURE PATTERNS (CRASH IN PRODUCTION):
payload.customer.age as Number                    // ❌ NPE if age is null
payload.order.total * 1.1                        // ❌ NPE if total is null  
payload.items[0].price                            // ❌ Array bounds if empty
payload.config.timeout as Date                   // ❌ Type conversion crash

// ✅ MULESOFT SAFE PATTERNS (PRODUCTION-HARDENED):
payload.customer.age as Number default 0         // ✅ Safe type coercion
(payload.order.total default 0) * 1.1           // ✅ Safe arithmetic
payload.items[0].price default null              // ✅ Safe array access
payload.config.timeout as Date default now()    // ✅ Safe date conversion

// 🎯 MULESOFT DEFAULT OPERATOR PATTERNS:
field as Number default 0                        // Arithmetic operations
field as String default ""                       // String concatenation  
field as Date default now()                      // Date calculations
field as Boolean default false                   // Boolean logic
field as Array default []                        // Array operations
```

#### **⚡ SAFE NAVIGATION & ERROR HANDLING**
```dataweave
// ✅ MULESOFT TRY-CATCH PATTERN (GRACEFUL DEGRADATION):
try {
    complexTransformation: payload.data.items map ((item, index) -> {
        processedValue: item.value as Number * item.multiplier,
        calculatedField: item.base + item.adjustment
    })
} catch (error) {
    fallbackData: {
        error: "Transformation failed: " ++ error.description,
        timestamp: now(),
        originalPayload: payload
    }
}

// ✅ CONDITIONAL SAFE ACCESS:
customerInfo: if (payload.customer != null and payload.customer.profile != null)
    payload.customer.profile
else {
    defaultProfile: {
        name: "Unknown",
        status: "inactive",
        created: now()
    }
}

// ✅ ARRAY SAFE PROCESSING:
items: if (payload.items != null and sizeOf(payload.items) > 0)
    payload.items map ((item, index) -> {
        id: item.id default ("ITEM_" ++ index),
        value: item.value as Number default 0
    })
else []
```

#### **🔒 INPUT VALIDATION & SANITIZATION (PREVENT INJECTION ATTACKS)**
```dataweave
// ✅ MULESOFT INPUT VALIDATION FUNCTIONS:
fun validateEmail(email: String): Boolean =
    if (email != null and sizeOf(email) > 0)
        email matches /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    else false

fun sanitizeInput(input: String): String =
    if (input != null)
        input
        |> trim($)
        |> replace($, /[<>\"'&]/, "")              // Remove injection chars
        |> replace($, /script|javascript/i, "")    // Remove script patterns
    else ""

fun validateNumericRange(value: Number, min: Number, max: Number): Number =
    if (value != null and value >= min and value <= max) 
        value
    else 
        error("Value " ++ value as String ++ " outside range [" ++ min ++ ", " ++ max ++ "]")

// 🎯 USAGE IN TRANSFORMATIONS:
customerEmail: if (validateEmail(payload.customer.email))
    payload.customer.email
else error("Invalid email format: " ++ payload.customer.email)

userInput: sanitizeInput(payload.userInput),
quantity: validateNumericRange(payload.quantity as Number default 1, 1, 1000)
```

#### **💾 MEMORY & STREAM MANAGEMENT (PREVENT OOM ERRORS)**
```dataweave
// ✅ MULESOFT STREAMING BEST PRACTICES:

// 🎯 LARGE DATASET PROCESSING (STREAMING):
// Enable streaming mode for large datasets in flow configuration
// Use chunked processing for massive arrays

fun processLargeDataset(items: Array): Array =
    items 
    |> filter($ != null)                          // Filter nulls first
    |> take(1000)                                 // Limit processing size
    |> map($ default {})                          // Safe mapping

// 🎯 MEMORY-EFFICIENT AGGREGATIONS:
itemsSummary: {
    totalCount: sizeOf(payload.items default []),
    validItems: sizeOf(payload.items filter ($ != null) default []),
    totalValue: sumBy(payload.items default [], $.value as Number default 0)
}

// ❌ AVOID MEMORY LEAKS:
// Don't create unnecessary large objects in memory
// Don't duplicate large datasets unnecessarily
// Use variables for complex calculations to avoid recomputation
```

#### **🔄 CONNECTION & RETRY PATTERNS (FAULT TOLERANCE)**
```dataweave
// ✅ MULESOFT FAULT-TOLERANT PATTERNS:

// 🎯 TIMEOUT HANDLING IN TRANSFORMATIONS:
fun withTimeout(operation: () -> Any, timeoutSeconds: Number): Any =
    try {
        operation()
    } catch (error) {
        if (error.message contains "timeout")
            { error: "Operation timed out", timestamp: now() }
        else
            error
    }

// 🎯 GRACEFUL DEGRADATION PATTERN:
enrichedData: try {
    // Attempt to enrich with external data
    payload ++ {
        enrichment: externalDataLookup(payload.id)
    }
} catch (error) {
    // Fallback to basic data without enrichment
    payload ++ {
        enrichment: null,
        processingNote: "External enrichment unavailable"
    }
}

// 🎯 CIRCUIT BREAKER SIMULATION:
serviceData: if (payload.useExternalService default true)
    try {
        callExternalService(payload.request)
    } catch (error) {
        log("External service failed, using cached data")
        getCachedData(payload.request.id)
    }
else 
    getCachedData(payload.request.id)
```

#### **📊 PERFORMANCE MONITORING & METRICS**
```dataweave
// ✅ MULESOFT PERFORMANCE TRACKING:
{
    processedData: payload.data map ((item, index) -> {
        // Main transformation
        id: item.id,
        processedValue: item.value as Number default 0
    }),
    
    // Performance metrics embedded in response
    metadata: {
        processingTime: now(),
        itemCount: sizeOf(payload.data default []),
        errors: 0,  // Increment in catch blocks
        version: "1.0.0"
    }
}
```

### **🚨 PRODUCTION DEPLOYMENT CHECKLIST (MULESOFT STANDARDS)**

#### **Pre-Production Validation**
```bash
✅ MULESOFT PRODUCTION READINESS CHECKLIST:

🛡️ RUNTIME SAFETY:
- [ ] All type coercions include default operators
- [ ] All array access is bounds-checked
- [ ] All null references are handled gracefully
- [ ] All external data access includes error handling

🔒 SECURITY VALIDATION:
- [ ] No hardcoded credentials or sensitive data
- [ ] Input validation for all user-provided data
- [ ] SQL injection prevention patterns applied
- [ ] XSS prevention in string outputs

⚡ PERFORMANCE VALIDATION:
- [ ] Memory usage tested with realistic data volumes
- [ ] Streaming enabled for large datasets
- [ ] Connection pooling configured appropriately
- [ ] Timeout values set for all external calls

🔄 FAULT TOLERANCE:
- [ ] Retry mechanisms configured for transient failures
- [ ] Circuit breaker patterns implemented
- [ ] Graceful degradation paths defined
- [ ] Comprehensive error logging implemented

📊 MONITORING & OBSERVABILITY:
- [ ] Structured logging with correlation IDs
- [ ] Performance metrics collection enabled
- [ ] Health check endpoints implemented
- [ ] Alert thresholds configured
```

---

## **💡 DEBUGGING AND DIAGNOSTIC PATTERNS**

### **DataWeave Debug Script Template**
```dataweave
// ✅ COMPREHENSIVE DEBUG SCRIPT
%dw 2.0
output application/json
---
{
    "inputAnalysis": {
        "payloadType": typeOf(payload),
        "payloadSize": sizeOf(payload),
        "rootKeys": keysOf(payload),
        "firstLevelStructure": payload mapObject ((value, key) -> {
            (key): typeOf(value)
        })
    },
    "xmlAnalysis": if (typeOf(payload) == "Object" and payload.catalog != null) {
        "catalogType": typeOf(payload.catalog),
        "productAccessDirect": payload.catalog.product,
        "productAccessMultivalue": payload.catalog.*product,
        "productCount": sizeOf(payload.catalog.*product),
        "firstProductStructure": if (sizeOf(payload.catalog.*product) > 0) 
            payload.catalog.*product[0] mapObject ((value, key) -> { (key): typeOf(value) })
            else null
    } else null,
    "errorDiagnostics": {
        "hasReservedKeywords": payload keysOf() filter ($ in ["type", "input", "output", "var", "case"]),
        "hasNullValues": payload valuesOf() filter ($ == null),
        "hasEmptyValues": payload valuesOf() filter ($ == "")
    }
}
```

### **Error Recovery Functions**
```dataweave
// ✅ SAFE ACCESS FUNCTIONS
fun safeAccess(obj: Object, path: String, defaultValue: Any = null): Any =
    try(obj[path]) otherwise defaultValue

fun safeArrayAccess(arr: Any, index: Number, defaultValue: Any = null): Any =
    if (isArray(arr) and sizeOf(arr) > index and index >= 0)
        arr[index]
    else defaultValue

fun safeXmlAccess(element: Any, selector: String): Any =
    try(element.*$(selector)) otherwise []

// ✅ ERROR HANDLING WRAPPER
fun executeWithErrorHandling(operation: () -> Any, errorMessage: String): Object =
    try({
        success: true,
        result: operation(),
        error: null
    }) otherwise {
        success: false,
        result: null,
        error: errorMessage,
        timestamp: now()
    }
```

---

## **🎯 ERROR RESOLUTION WORKFLOW**

### **Systematic Error Resolution Process**
1. **Identify Error Category**: Compilation, CLI, XML, or Runtime
2. **Apply Category-Specific Fixes**: Use patterns from this guide
3. **Test Incrementally**: Fix one error at a time
4. **Validate Changes**: Run CLI validation after each fix
5. **Document Resolution**: Record successful fix patterns
6. **Prevent Recurrence**: Update validation checks

### **Error Priority Handling**
1. **Critical**: Compilation errors (syntax, reserved keywords)
2. **High**: CLI validation failures
3. **Medium**: Runtime errors (null pointer, type conversion)
4. **Low**: Performance optimizations

---

*This comprehensive error guide covers all known DataWeave error patterns with proven solutions. Always apply fixes systematically and validate changes incrementally.*