---
description: XML Processing Mastery - Multivalue Selectors and Troubleshooting Patterns
alwaysApply: false
---

# 🎯 **XML PROCESSING MASTERY**
*Enterprise-Grade XML Transformation Patterns*

<!-- Q2hlcHBhbGlTaGFpa1NvaGFpbDE1MDgxOTkz -->
## **🚨 XML ARRAY HANDLING - MULTIVALUE SELECTOR PRIORITY**

### **ALWAYS use multivalue selectors (.*) as FIRST CHOICE for XML arrays:**

```dataweave
// ✅ PREFERRED APPROACH - Multivalue Selector (XML-native)
payload.catalog.*product map (product) -> {
    id: product.@id,
    name: product.name,
    specs: product.specifications.*spec map (spec) -> {
        name: spec.@name,
        value: spec as String
    }
}

// ✅ ALTERNATIVE - XML Array Access Patterns
<!-- CS150893‌ -->
payload.orders.*order filter ($.@status == "ACTIVE")
payload.customers.*customer distinctBy ($.@id)
payload.inventory.*item orderBy ($.@priority)

// ❌ AVOID AS FIRST CHOICE - valuesOf() workaround (only if multivalue fails)
valuesOf(payload.catalog) map (product) -> { /* transformation */ }
```

---

## **🔧 XML STRUCTURE ANALYSIS PATTERNS**

### **XML Namespace & Attribute Handling**

#### **Namespace Access**
```dataweave
// ✅ NAMESPACE ACCESS
payload.order.@xmlns.ns0              // Namespace prefix access
payload.customer.@xmlns               // Default namespace
payload."ns1:product".@"ns1:id"      // Namespaced elements and attributes

// ✅ COMPLEX NAMESPACE HANDLING
payload."soap:Envelope"."soap:Body"."ns1:ProductResponse".*"ns1:Product"
```

#### **Attribute Extraction (ALWAYS use @)**
```dataweave
// ✅ ATTRIBUTE EXTRACTION PATTERNS
product.@id                          // Required: @ prefix for attributes
product.@category                    // Attribute access
product.price.@currency              // Nested attribute access
product.specifications.*spec.@name   // Array element attributes

// ✅ MULTIPLE ATTRIBUTE ACCESS
{
    productId: product.@id,
    category: product.@category,
    status: product.@status,
    version: product.@version
}

// ✅ CONDITIONAL ATTRIBUTE ACCESS
{
    id: product.@id,
    category: product.@category default "UNKNOWN",
    isActive: (product.@status default "INACTIVE") == "ACTIVE"
}
```

### **XML Array Detection & Transformation**

#### **Detect XML Arrays - Use multivalue selector first**
```dataweave
// ✅ XML ARRAY PATTERNS
payload.root.*items                  // Array of items
payload.catalog.*product            // Array of products  
payload.order.*lineItem             // Array of line items
payload.inventory.*stockItem         // Array of stock items
payload.configuration.*setting      // Array of settings

// ✅ NESTED XML ARRAY ACCESS
payload.orders.*order.*lineItem      // Nested arrays
payload.catalog.*category.*product   // Category products
payload.document.*section.*paragraph // Document structure
```

#### **Complex XML Array Mappings**
```dataweave
// ✅ COMPLEX XML TRANSFORMATION WITH INDEX
payload.orders.*order map (order, orderIndex) -> {
    orderId: order.@id,
    orderNumber: orderIndex + 1,
    customer: {
        id: order.customer.@id,
        name: order.customer.name,
        email: order.customer.email
    },
    items: order.items.*item map (item, itemIndex) -> {
        itemId: item.@id,
        position: itemIndex + 1,
        name: item.name,
        quantity: item.quantity as Number default null,
        price: item.price as Number default null,
        currency: item.price.@currency default "USD"
    },
    totals: {
        itemCount: sizeOf(order.items.*item),
        totalAmount: sumBy(order.items.*item, (item) -> 
            if (item.quantity != null and item.price != null) 
                (item.quantity as Number) * (item.price as Number) 
            else null
        )
    }
}
```

---

## **📊 XML-TO-OBJECT CONVERSION PATTERNS**

### **Specs/Attributes Array to Object (Common XML pattern)**

#### **Basic Specs Conversion**
```dataweave
// ✅ CONVERT XML SPECS TO OBJECT
fun convertXmlSpecsToObject(xmlSpecs: Any): Object = 
    xmlSpecs.*spec reduce (spec, acc = {}) -> 
        acc ++ { (spec.@name): spec as String }

// Usage Example:
{
    productId: product.@id,
    specifications: convertXmlSpecsToObject(product.specifications),
    features: convertXmlSpecsToObject(product.features)
}
```

#### **Advanced Specs Conversion with Types**
```dataweave
// ✅ TYPED SPECS CONVERSION
fun convertXmlSpecsTyped(xmlSpecs: Any): Object = 
    xmlSpecs.*spec reduce (spec, acc = {}) -> {
        var name = spec.@name
        var value = spec as String
        var dataType = spec.@type default "string"
        
        acc ++ { 
            (name): if (dataType == "number") 
                        (value as Number default null)
                    else if (dataType == "boolean")
                        (value as Boolean default false)
                    else value
        }
    }
```

### **XML Array to Key-Value Object**
```dataweave
// ✅ XML ARRAY TO KEY-VALUE OBJECT
fun xmlArrayToObject(xmlArray: Any, keyField: String, valueField: String): Object =
    xmlArray.*item reduce (item, acc = {}) ->
        acc ++ { (item.@(keyField)): item.@(valueField) }

// ✅ XML ARRAY TO OBJECT WITH TRANSFORMATION
fun xmlArrayToObjectTransformed(xmlArray: Any, keyField: String): Object =
    xmlArray.*item reduce (item, acc = {}) ->
        acc ++ { 
            (item.@(keyField)): {
                value: item as String,
                attributes: item.@ - keyField,  // All attributes except key
                hasChildren: sizeOf(item.*) > 0
            }
        }
```

### **Safe XML Element Access**
```dataweave
// ✅ SAFE XML VALUE EXTRACTION
fun safeXmlValue(element: Any): String = 
    if (element != null) element as String else ""

fun safeXmlNumber(element: Any): Number | Null = 
    if (element != null) 
        (element as String as Number default null) 
    else null

fun safeXmlBoolean(element: Any): Boolean = 
    if (element != null) 
        ((element as String) == "true") 
    else false

// ✅ SAFE XML ATTRIBUTE ACCESS
fun safeXmlAttribute(element: Any, attributeName: String): String =
    if (element != null and element.@(attributeName) != null)
        element.@(attributeName) as String
    else ""
```

---

## **🚨 XML PARSING TROUBLESHOOTING (Anti-Oscillation)**

### **Common XML Issues & Solutions**

#### **Issue 1: "Cannot coerce Object to Array" (XML single vs multiple elements)**
```bash
# PROBLEM: payload.catalog.product map (...)  # Fails when single product
❌ ERROR: Cannot coerce Object ({name: 'Laptop'...}) to Array

# SOLUTIONS:
✅ SOLUTION 1: payload.catalog.*product map (...)  # Always treats as array

✅ SOLUTION 2: Force array conversion
(payload.catalog.product match {
    case arr is Array -> arr
    case obj is Object -> [obj]
    else -> []
}) map (...)

✅ SOLUTION 3: Safe array access
fun toArray(value: Any): Array =
    value match {
        case arr is Array -> arr
        case obj is Object -> [obj]
        case null -> []
        else -> [value]
    }
```

#### **Issue 2: "You called the function 'map' with Object" (XML collapsed elements)**
```bash
# PROBLEM: payload.specifications.spec map (...)  # spec collapsed to single value
❌ ERROR: You called the function 'map' with these arguments: 1: Object

# SOLUTION: Use multivalue selector
✅ FIX: payload.specifications.*spec map (...)  # Proper multivalue selector
```

#### **Issue 3: Empty specs object (XML attribute values not captured)**
```bash
# PROBLEM: acc ++ { (spec.@name): spec }  # Gets element with attributes
❌ ISSUE: Only getting element structure, not text value

# SOLUTION: Extract text value
✅ FIX: acc ++ { (spec.@name): spec as String }  # Extracts text value
```

#### **Issue 4: Missing multiple products (XML duplicate keys collapsed)**
```bash
# PROBLEM: payload.catalog.product  # Only gets last product
❌ ISSUE: XML parser collapses duplicate keys to single value

# SOLUTION: Use multivalue selector
✅ FIX: payload.catalog.*product  # Gets all products as array
```

### **XML Debugging Pattern (When multivalue selector fails)**
```dataweave
// ✅ XML STRUCTURE DEBUG SCRIPT
%dw 2.0
output application/json
---
{
    "inputStructure": payload,
    "catalogType": typeOf(payload.catalog),
    "productsType": typeOf(payload.catalog.product),
    "multivalueProducts": payload.catalog.*product,
    "multivalueCount": sizeOf(payload.catalog.*product),
    "firstProductSpecs": payload.catalog.*product[0].specifications,
    "specsMultivalue": payload.catalog.*product[0].specifications.*spec,
    "specsAsObject": payload.catalog.*product[0].specifications.*spec reduce (spec, acc = {}) -> 
        acc ++ { (spec.@name): spec as String }
}
```

---

## **🔧 XML NORMALIZATION & VALIDATION PATTERNS**

### **Enhanced XML Normalization (Production-Grade)**

**XML Declaration Quote Normalization (Critical for Validation):**
```xml
<!-- ✅ DATAWEAVE STANDARD FORMAT (Preferred) -->
<?xml version='1.0' encoding='UTF-8'?>

<!-- ❌ COMMON VARIATIONS (Auto-normalized to DataWeave format) -->
<?xml version="1.0" encoding="UTF-8"?>
<?xml version="1.0" encoding='UTF-8'?>
<?xml version='1.0' encoding="UTF-8"?>
```

**Automated Normalization Features (DataWeave-Compatible):**
- ✅ **Quote Standardization**: Double quotes → Single quotes (DataWeave CLI format)
- ✅ **Whitespace Normalization**: Consistent element spacing
- ✅ **Encoding Consistency**: UTF-8 declaration standardization
- ✅ **Standalone Normalization**: Consistent standalone attribute formatting

---

## **⚡ XML-FIRST TRANSFORMATION STRATEGY**

### **Step-by-Step XML Approach (Mandatory for XML inputs)**

1. **XML Structure Analysis**: Use multivalue selectors to identify arrays
2. **Multivalue Mapping**: Apply `.*element` patterns for array processing  
3. **Attribute Extraction**: Use `@attribute` syntax for all attribute access
4. **XML Validation**: Leverage enhanced normalization for accurate comparison
5. **Fallback Patterns**: Only use `valuesOf()` if multivalue selectors fail
6. **XML Debugging**: Create structure debug script if transformation issues persist

### **Enterprise XML Patterns (Production-Tested)**

#### **Complete XML Transformation Template**
```dataweave
// ✅ COMPREHENSIVE XML TRANSFORMATION
%dw 2.0
output application/json

// XML-specific utility functions
fun extractXmlSpecs(specsElement: Any): Object = 
    specsElement.*spec reduce (spec, acc = {}) -> 
        acc ++ { (spec.@name): spec as String }

fun safeXmlNumber(value: Any): Number | Null = 
    if (value != null) (value as String as Number default null) else null

fun xmlBooleanToEnum(xmlBoolean: Any, trueValue: String, falseValue: String): String =
    if ((xmlBoolean as String) == "true") trueValue else falseValue

fun extractXmlMetadata(element: Any): Object = {
    hasAttributes: sizeOf(element.@) > 0,
    attributeCount: sizeOf(element.@),
    hasChildren: sizeOf(element.*) > 0,
    childCount: sizeOf(element.*),
    elementType: typeOf(element)
}

---
{
    // XML array processing with multivalue selector
    items: payload.root.*item map (item) -> {
        // Basic element data
        id: item.@id,
        name: item.name as String,
        category: item.@category,
        
        // Nested XML array processing
        specifications: extractXmlSpecs(item.specifications),
        
        // XML attribute with type conversion
        price: safeXmlNumber(item.price),
        currency: item.price.@currency default "USD",
        
        // XML boolean to enum conversion
        status: xmlBooleanToEnum(
            item.availability.inStock, 
            "AVAILABLE", 
            "UNAVAILABLE"
        ),
        
        // Complex nested structures
        variants: item.variants.*variant map (variant) -> {
            variantId: variant.@id,
            sku: variant.sku,
            attributes: extractXmlSpecs(variant.attributes),
            pricing: {
                basePrice: safeXmlNumber(variant.pricing.basePrice),
                salePrice: safeXmlNumber(variant.pricing.salePrice),
                currency: variant.pricing.@currency default "USD"
            }
        },
        
        // Metadata for debugging
        metadata: extractXmlMetadata(item)
    },
    
    // Summary information
    summary: {
        totalItems: sizeOf(payload.root.*item),
        categoryCounts: payload.root.*item groupBy ($.@category) 
            mapObject ((items, category) -> { (category): sizeOf(items) }),
        statusCounts: payload.root.*item groupBy (xmlBooleanToEnum($.availability.inStock, "AVAILABLE", "UNAVAILABLE"))
            mapObject ((items, status) -> { (status): sizeOf(items) })
    }
}
```

#### **Complex XML Namespace Handling**
```dataweave
// ✅ NAMESPACE-AWARE XML PROCESSING
%dw 2.0
output application/json

// Handle complex namespaced XML
fun extractNamespacedData(element: Any, namespace: String): Object = {
    element."$(namespace):*" reduce (child, acc = {}) -> {
        var localName = child.# as String splitBy ":" [-1]  // Get local name
        acc ++ { (localName): child as String }
    }
}

---
{
    envelope: {
        header: extractNamespacedData(payload."soap:Envelope"."soap:Header", "ns1"),
        body: payload."soap:Envelope"."soap:Body"."ns1:Response".*"ns1:Item" map (item) -> {
            id: item.@"ns1:id",
            data: extractNamespacedData(item, "ns1"),
            attributes: item.@ mapObject ((value, key) -> {
                (key as String): value as String
            })
        }
    }
}
```

---

## **🛡️ XML VALIDATION AND ERROR PREVENTION**

### **Pre-Processing XML Validation**
```dataweave
// ✅ XML STRUCTURE VALIDATION
fun validateXmlStructure(xmlData: Any): Object = {
    hasRootElement: xmlData != null,
    rootElementType: typeOf(xmlData),
    hasRequiredElements: xmlData.catalog != null and xmlData.catalog.*product != null,
    productCount: if (xmlData.catalog.*product != null) sizeOf(xmlData.catalog.*product) else 0,
    validationErrors: []  // Add specific validation logic
}

// ✅ SAFE XML PROCESSING WITH VALIDATION
fun processXmlSafely(xmlData: Any): Object = {
    var validation = validateXmlStructure(xmlData)
    
    if (validation.hasRootElement and validation.hasRequiredElements)
        processValidXml(xmlData)
    else {
        error: "Invalid XML structure",
        validation: validation,
        recommendations: [
            "Ensure XML has required root elements",
            "Check for missing catalog or product elements",
            "Validate XML structure before processing"
        ]
    }
}
```

### **XML Performance Optimization**
```dataweave
// ✅ OPTIMIZED XML PROCESSING
// Process large XML efficiently by avoiding repeated selections
var products = payload.catalog.*product

// ✅ BATCH PROCESS XML ELEMENTS
fun processXmlInBatches(xmlArray: Array, batchSize: Number): Array =
    xmlArray divideBy batchSize map (batch) ->
        batch map (item) -> processXmlItem(item)

// ✅ SELECTIVE XML FIELD EXTRACTION
fun extractRequiredXmlFields(xmlElement: Any): Object = {
    // Only extract needed fields to improve performance
    id: xmlElement.@id,
    name: xmlElement.name,
    // Skip unnecessary complex nested processing if not needed
}
```

---

## **💡 XML BEST PRACTICES SUMMARY**

### **🎯 Priority Order for XML Processing:**
1. **Multivalue Selectors First**: Always try `.*element` patterns first
2. **Attribute Access**: Use `@attribute` syntax for all attributes
3. **Type Conversion**: Always use `as String`, `as Number` with defaults
4. **Namespace Handling**: Use quoted syntax for namespaced elements
5. **Error Prevention**: Validate structure before processing
6. **Performance**: Cache XML selections and process in batches for large data

### **🚨 XML Anti-Patterns to Avoid:**
- Using `valuesOf()` as first choice for XML arrays
- Missing `@` prefix for attribute access
- Not using multivalue selectors for potentially multiple elements
- Ignoring namespace prefixes in element access
- Processing large XML without batching or caching

---

*This guide provides enterprise-tested XML processing patterns. Always prioritize multivalue selectors and proper attribute access for reliable XML transformations.*