---
description: Comprehensive DataWeave Performance Optimization Rules and Enterprise Techniques
author: Cheppali Shaik Sohail
alwaysApply: false
---

# ⚡ **COMPREHENSIVE DATAWEAVE PERFORMANCE OPTIMIZATION EXCELLENCE**
*Complete Enterprise Performance Enhancement Techniques*

<!-- Q2hlcHBhbGlTaGFpa1NvaGFpbDE1MDgxOTkz -->
**📝 Enhanced by: R-GENIE Performance Analysis Engine + Official MuleSoft Guidelines**  
*⚡ Comprehensive performance optimization techniques from enterprise transformations and MuleSoft best practices*

**🚀 AUTOMATED PERFORMANCE ANALYSIS AVAILABLE:**
Use the R-GENIE Performance Analyzer for automated detection of optimization opportunities:
```bash
# 🚀 ENHANCED: Performance analysis with error handling
node r-genie/03-01_Dataweave_Agent/lib/scripts/03-01-24_Performance_Analyzer.js script.dwl
<!-- CS150893‌ -->

# 🛡️ GRACEFUL DEGRADATION: If analyzer fails, continue with manual optimization
if [ $? -ne 0 ]; then
    echo "⚠️ Performance analyzer encountered issues - applying manual optimization patterns"
    echo "📊 Refer to manual optimization guidelines below"
fi
```
**Features**: Import efficiency analysis, safe checking optimization, MuleSoft best practices validation, streaming recommendations, **graceful error handling**

**🔧 RECENT FIX**: Added missing `analyzeMuleSoftPerformance` method to resolve analyzer failures

## 📋 **PERFORMANCE OPTIMIZATION MASTERY**

### **🏢 MULESOFT RUNTIME PERFORMANCE BEST PRACTICES (OFFICIAL GUIDELINES)**

#### **🚀 MEMORY MANAGEMENT & STREAMING (PREVENT OOM ERRORS)**
```dataweave
// ✅ MULESOFT STREAMING PATTERNS (HANDLE LARGE DATASETS):

// 🎯 ENABLE STREAMING FOR LARGE DATASETS:
// Configure in flow: <ee:transform doc:name="Transform" streaming="true">
%dw 2.0
output application/json deferred=true
---
payload.largeDataset map ((item, index) -> {
    // Process items one by one without loading all into memory
    id: item.id,
    processedValue: item.value as Number default 0
})

// 🎯 CHUNKED PROCESSING FOR MASSIVE ARRAYS:
fun processInChunks(items: Array, chunkSize: Number): Array =
    items
    |> divideBy(chunkSize)                               // Split into manageable chunks
    |> map(
        $ map ((item, index) -> {
            // Process each chunk
            id: item.id,
            value: item.value as Number default 0
        })
    )
    |> flatten($)                                        // Flatten back to array

// 🎯 MEMORY-EFFICIENT AGGREGATIONS:
// ❌ MEMORY INTENSIVE: payload.items reduce (...)  // Loads all items
// ✅ MEMORY EFFICIENT: Use variables and filter first
summary: do {
    var validItems = payload.items filter ($ != null)
    var itemCount = sizeOf(validItems)
    ---
    {
        totalItems: itemCount,
        totalValue: if (itemCount > 0)
            validItems reduce ((item, acc = 0) -> acc + (item.value as Number default 0))
        else 0
    }
}
```

#### **⚡ CONNECTION & TIMEOUT OPTIMIZATION**
```dataweave
// ✅ MULESOFT CONNECTION EFFICIENCY PATTERNS:

// 🎯 TIMEOUT-AWARE TRANSFORMATIONS:
fun withTimeoutSafety(operation: () -> Any, timeoutMs: Number): Any =
    try {
        operation()
    } catch (error) {
        if (error.message contains "timeout")
            {
                timeoutOccurred: true,
                partialData: {},
                retryAfter: now() + |PT30S|
            }
        else
            error
    }

// 🎯 EFFICIENT EXTERNAL LOOKUPS:
// Batch multiple lookups instead of individual calls
enrichedData: do {
    var customerIds = payload.orders map ($.customerId)
    var uniqueIds = customerIds distinctBy ($)          // Remove duplicates first
    ---
    {
        orders: payload.orders map ((order, index) -> 
            order ++ {
                customerInfo: lookupCustomer(order.customerId)  // Cache this lookup
            }
        )
    }
}
```

#### **🗄️ MULESOFT CACHING STRATEGIES**
```dataweave
// ✅ CACHE-FRIENDLY TRANSFORMATION PATTERNS:

// 🎯 REFERENCE DATA CACHING:
// Use variables for frequently accessed reference data
%dw 2.0
var currencyRates = {
    "USD": 1.0,
    "EUR": 0.85,
    "GBP": 0.73
}
var taxRates = {
    "CA": 0.13,
    "US": 0.08,
    "EU": 0.20
}
output application/json
---
payload.orders map ((order, index) -> {
    // Use cached reference data instead of repeated lookups
    convertedTotal: order.total * currencyRates[order.currency],
    taxAmount: order.subtotal * taxRates[order.country]
})

// 🎯 COMPUTED VALUE CACHING:
// Cache expensive calculations using variables
orderSummary: do {
    var itemsTotal = sumBy(payload.items, $.price * $.quantity)
    var discountTotal = sumBy(payload.items, $.discount)
    var finalTotal = itemsTotal - discountTotal
    ---
    {
        subtotal: itemsTotal,
        discount: discountTotal,
        total: finalTotal,
        averageItemValue: if (sizeOf(payload.items) > 0) itemsTotal / sizeOf(payload.items) else 0
    }
}
```

#### **📊 MULESOFT MONITORING & METRICS**
```dataweave
// ✅ PERFORMANCE TRACKING IN TRANSFORMATIONS:
{
    transformedData: payload.data map ((item, index) -> {
        // Main transformation logic
        processedItem: item
    }),
    
    // Performance metrics for monitoring
    performanceMetrics: {
        processingStartTime: now(),
        inputRecordCount: sizeOf(payload.data default []),
        memoryUsageHint: "streaming_enabled",
        transformationVersion: "2.0.1"
    }
}
```

#### **🔄 MULESOFT ASYNCHRONOUS PROCESSING PATTERNS**
```dataweave
// ✅ ASYNC-SAFE TRANSFORMATIONS FOR NON-CRITICAL OPERATIONS:

// 🎯 BACKGROUND PROCESSING PATTERN:
// Use for logging, notifications, audit trails
backgroundTasks: do {
    var mainProcessing = payload.orders map ((order) -> {
        id: order.id,
        total: order.total,
        status: "processed"
    })
    
    var auditData = {
        timestamp: now(),
        recordCount: sizeOf(payload.orders),
        batchId: uuid()
    }
    ---
    {
        mainData: mainProcessing,         // Critical path
        auditTrail: auditData            // Async-friendly
    }
}

// 🎯 BATCH OPTIMIZATION PATTERN:
// Process independent operations in batches
fun optimizedBatchProcessing(items: Array, batchSize: Number = 100): Array =
    items
    |> divideBy(batchSize)
    |> map((batch, batchIndex) -> {
        batchId: batchIndex,
        items: batch map ((item) -> {
            processedItem: item.data,
            timestamp: now(),
            batchPosition: batchIndex
        })
    })
```

#### **🏗️ MULESOFT JVM & HEAP OPTIMIZATION (RUNTIME PERFORMANCE)**
```dataweave
// ✅ HEAP-CONSCIOUS TRANSFORMATION PATTERNS:

// 🎯 EARLY FILTERING TO REDUCE MEMORY FOOTPRINT:
fun memoryEfficientProcessing(largeDataset: Array): Object = do {
    // Filter early to reduce data volume
    var validRecords = largeDataset filter (
        $ != null and 
        $.status == "active" and 
        $.amount != null
    )
    
    // Process only what's necessary
    var processedData = validRecords map ((record) -> {
        id: record.id,
        amount: record.amount as Number default 0
    })
    
    ---
    {
        inputSize: sizeOf(largeDataset),
        processedSize: sizeOf(validRecords),
        memoryReduction: ((sizeOf(largeDataset) - sizeOf(validRecords)) / sizeOf(largeDataset)) * 100,
        results: processedData
    }
}

// 🎯 GARBAGE COLLECTION FRIENDLY PATTERNS:
// Minimize object creation in loops
fun gcOptimizedTransformation(items: Array): Array = 
    items reduce ((item, acc = []) -> 
        if (item.isValid)
            acc << {                     // Single object creation per valid item
                id: item.id,
                value: item.amount * item.quantity
            }
        else acc                         // No object creation for invalid items
    )
```

#### **🔗 MULESOFT CONNECTION POOLING & RESOURCE OPTIMIZATION**
```dataweave
// ✅ CONNECTION-EFFICIENT TRANSFORMATION PATTERNS:

// 🎯 BATCH EXTERNAL LOOKUPS (MINIMIZE CONNECTION OVERHEAD):
fun optimizedExternalLookups(orders: Array): Array = do {
    // Collect unique IDs for batch lookup
    var uniqueCustomerIds = orders map ($.customerId) distinctBy ($)
    var uniqueProductIds = orders flatMap ($.items map ($.productId)) distinctBy ($)
    
    // Single batch lookup call (vs multiple individual calls)
    var customerData = batchLookupCustomers(uniqueCustomerIds)
    var productData = batchLookupProducts(uniqueProductIds)
    
    ---
    orders map ((order) -> 
        order ++ {
            customerInfo: customerData[order.customerId],
            items: order.items map ((item) -> 
                item ++ {
                    productInfo: productData[item.productId]
                }
            )
        }
    )
}

// 🎯 TIMEOUT-RESILIENT PATTERNS:
fun resilientTransformation(payload: Object): Object = do {
    var coreData = {
        orderId: payload.order.id,
        amount: payload.order.total as Number default 0,
        timestamp: now()
    }
    
    var enrichmentData = try {
        // Potentially slow external call
        externalEnrichment(payload.order.id)
    } catch (error) {
        // Graceful degradation
        {
            enriched: false,
            fallbackReason: error.message,
            cacheRecommendation: true
        }
    }
    ---
    coreData ++ { enrichment: enrichmentData }
}
```

#### **📊 MULESOFT MONITORING & PERFORMANCE METRICS**
```dataweave
// ✅ PERFORMANCE INSTRUMENTATION PATTERNS:

// 🎯 BUILT-IN PERFORMANCE TRACKING:
fun instrumentedTransformation(data: Array): Object = do {
    var startTime = now()
    
    var results = data map ((item, index) -> {
        id: item.id,
        processedValue: item.value * 1.2,
        index: index
    })
    
    var endTime = now()
    var processingDuration = endTime - startTime
    
    ---
    {
        results: results,
        performance: {
            startTime: startTime,
            endTime: endTime,
            duration: processingDuration,
            itemsProcessed: sizeOf(data),
            itemsPerSecond: sizeOf(data) / (processingDuration.seconds as Number default 1),
            memoryEfficiency: "streaming_enabled"
        }
    }
}

// 🎯 LOAD BALANCING AWARE TRANSFORMATIONS:
fun loadBalancedProcessing(data: Array, instanceId: String): Object = do {
    var instanceHash = instanceId hashCode() % 10
    var dataPartition = data filter ((item, index) -> (index % 10) == instanceHash)
    
    ---
    {
        instanceId: instanceId,
        partition: instanceHash,
        dataSize: sizeOf(dataPartition),
        processedData: dataPartition map ((item) -> {
            id: item.id,
            processedBy: instanceId,
            value: item.amount
        })
    }
}
```

### **🚀 1. CORE OPTIMIZATION PRINCIPLES**

#### **🔄 MULESOFT LOOP & ITERATION OPTIMIZATION**
```dataweave
// ✅ PERFORMANCE-OPTIMIZED LOOP PATTERNS:

// 🎯 AVOID NESTED LOOPS (PERFORMANCE CRITICAL):
// ❌ O(n²) COMPLEXITY - AVOID:
nestedProcessing: payload.customers flatMap ((customer) ->
    payload.orders filter ($.customerId == customer.id) map ((order) -> {
        customerId: customer.id,
        orderData: order
    })
)

// ✅ O(n) COMPLEXITY - OPTIMIZED:
optimizedProcessing: do {
    var ordersByCustomer = payload.orders groupBy ($.customerId)
    ---
    payload.customers map ((customer) -> {
        customerId: customer.id,
        orders: ordersByCustomer[customer.id] default []
    })
}

// 🎯 USE REDUCE FOR ACCUMULATION (MEMORY EFFICIENT):
// ❌ MEMORY INTENSIVE:
var intermediate1 = payload.items map ($.amount)
var intermediate2 = intermediate1 filter ($ > 0)
var total = intermediate2 reduce ($ + $$)

// ✅ MEMORY EFFICIENT:
var optimizedTotal = payload.items reduce ((item, acc = 0) ->
    if (item.amount > 0) acc + item.amount else acc
)

// 🎯 EARLY TERMINATION PATTERNS:
fun findFirstMatch(items: Array, criteria: (item: Any) -> Boolean): Any =
    items reduce ((item, acc = null) ->
        if (acc != null) acc                    // Early termination
        else if (criteria(item)) item
        else null
    )
```

#### **⚡ MULESOFT FUNCTION-SPECIFIC PERFORMANCE PATTERNS**
```dataweave
// ✅ HIGH-PERFORMANCE FUNCTION USAGE:

// 🎯 DISTINCTBY VS UNIQUE PERFORMANCE:
// ✅ FAST: For simple values
uniqueIds: payload.customerIds distinctBy ($)

// ✅ FAST: For object deduplication with key
uniqueCustomers: payload.customers distinctBy ($.customerId)

// 🎯 SIZEBY VS MAP + SIZOF PERFORMANCE:
// ❌ SLOWER: Creates intermediate array
itemCount: sizeOf(payload.orders filter ($.status == "active"))

// ✅ FASTER: Direct counting
activeOrderCount: payload.orders reduce ((order, count = 0) ->
    if (order.status == "active") count + 1 else count
)

// 🎯 FLATTEN PERFORMANCE OPTIMIZATION:
// ❌ MULTIPLE INTERMEDIATE ARRAYS:
var step1 = payload.departments map ($.employees)
var step2 = step1 map ($ map ($.projects))
var allProjects = flatten(step2)

// ✅ SINGLE OPERATION:
var optimizedProjects = payload.departments 
    flatMap ($.employees flatMap ($.projects))

// 🎯 STRING CONCATENATION PERFORMANCE:
// ❌ SLOW: Multiple string operations
var fullName = customer.firstName ++ " " ++ customer.middleName ++ " " ++ customer.lastName

// ✅ FAST: Array join (for many strings)
var optimizedName = [customer.firstName, customer.middleName, customer.lastName] 
    filter ($ != null) joinBy " "
```

#### **📈 MULESOFT SCALABILITY & LOAD DISTRIBUTION**
```dataweave
// ✅ SCALABILITY-AWARE TRANSFORMATION PATTERNS:

// 🎯 HORIZONTAL SCALING PATTERNS:
fun scalableProcessing(data: Array, nodeId: String, totalNodes: Number): Object = do {
    var nodeIndex = nodeId as Number default 0
    var itemsPerNode = sizeOf(data) / totalNodes
    var startIndex = nodeIndex * itemsPerNode
    var endIndex = (nodeIndex + 1) * itemsPerNode
    var nodeData = data[startIndex to endIndex]
    
    ---
    {
        nodeId: nodeId,
        nodeIndex: nodeIndex,
        processedItems: sizeOf(nodeData),
        totalItems: sizeOf(data),
        loadPercentage: (sizeOf(nodeData) / sizeOf(data)) * 100,
        results: nodeData map ((item) -> {
            id: item.id,
            processedBy: nodeId,
            value: item.amount * 1.1
        })
    }
}

// 🎯 ADAPTIVE BATCH SIZING:
fun adaptiveBatchProcessing(data: Array, systemLoad: Number): Array = do {
    var batchSize = if (systemLoad > 80) 50         // High load: smaller batches
                   else if (systemLoad > 50) 100    // Medium load: medium batches  
                   else 200                         // Low load: larger batches
    
    ---
    data 
    |> divideBy(batchSize)
    |> map((batch, batchIndex) -> {
        batchId: batchIndex,
        batchSize: sizeOf(batch),
        systemLoad: systemLoad,
        items: batch map ($ ++ { batchProcessed: true })
    })
}

// 🎯 LOAD BALANCING WITH WORK DISTRIBUTION:
fun distributedProcessing(workItems: Array, availableWorkers: Array): Object = do {
    var workersLoad = availableWorkers map ((worker) -> {
        workerId: worker.id,
        currentLoad: worker.currentLoad,
        capacity: worker.capacity,
        availableCapacity: worker.capacity - worker.currentLoad
    })
    
    var sortedWorkers = workersLoad orderBy ($.availableCapacity) [-1 to 0]  // Desc order
    
    ---
    {
        totalWork: sizeOf(workItems),
        availableWorkers: sizeOf(availableWorkers),
        workDistribution: workItems reduce ((item, acc = {
            assignments: [],
            workerIndex: 0
        }) -> do {
            var selectedWorker = sortedWorkers[acc.workerIndex % sizeOf(sortedWorkers)]
            ---
            {
                assignments: acc.assignments << {
                    workItem: item.id,
                    assignedTo: selectedWorker.workerId,
                    workerLoad: selectedWorker.currentLoad
                },
                workerIndex: acc.workerIndex + 1
            }
        })
    }
}
```

#### **📊 IMPORT MINIMALISM (PERFORMANCE CRITICAL)**
```dataweave
// ❌ PERFORMANCE KILLERS:
import * from dw::core::Arrays     // Loads 50+ functions unnecessarily
import * from dw::core::Objects    // Loads 30+ functions unnecessarily
import * from dw::core::Strings    // Loads 25+ functions unnecessarily

// ✅ PERFORMANCE OPTIMIZED:
import divideBy from dw::core::Arrays    // Only specific function needed
import capitalize from dw::core::Strings // Only what's actually used
// Note: map, filter, reduce, sizeOf are BUILT-IN - no import needed

// 📊 TARGET: Import Efficiency ≥ 80% = (Functions Used ÷ Functions Imported) × 100
```

#### **🧠 SMART SAFE CHECKING (PERFORMANCE ENHANCEMENT)**
```dataweave
// ⚡ PERFORMANCE DECISION MATRIX:
// Guaranteed + Correct Type → Direct Access (FASTEST)
companyName: payload.company.name                    // String guaranteed

// Guaranteed + Type Conversion → Direct Convert (FAST)  
establishedDate: payload.company.establishedYear as Date

// Optional + Same Type → Null Check Only (MODERATE)
contactEmail: if (payload.contact != null) payload.contact.email else ""

// Optional + Type Conversion → Safe Function (SLOWER - only when necessary)
customerAge: safeNumber(payload.customer.age)       // May be string/null

// 📊 TARGET: Safe Check Efficiency ≥ 80% = (Necessary Checks ÷ Total Checks) × 100
```

---

### **⚡ 2. ADVANCED STREAMING & MEMORY OPTIMIZATION**

#### **🌊 STREAMING FOR LARGE DATASETS (MEMORY CRITICAL)**
```dataweave
// ✅ STREAMING ENABLED - Process large data without memory overload
%dw 2.0
output application/json deferred=true  // Enable lazy evaluation

// 🚀 STREAMING PIPELINE PATTERN
fun efficientLargeDataProcessing(data: Array): Array = 
    data
    |> filter (record) -> record.isValid           // Streaming filter (no intermediate arrays)
    |> map (record) -> {                           // Streaming transformation
        id: record.id,
        processedAmount: record.amount * exchangeRate,
        region: record.region
    }
    |> groupBy (record) -> record.region           // Streaming grouping
    |> mapObject ((records, region) -> {           // Process groups
        (region): {
            count: sizeOf(records),
            total: sumBy(records, $.processedAmount)
        }
    })

// ✅ CHUNKED PROCESSING - For extremely large datasets
fun processInChunks(largeDataset: Array, chunkSize: Number): Array =
    largeDataset
    |> divideBy(chunkSize)                         // Split into manageable chunks
    |> map (chunk) -> {                            // Process each chunk independently
        chunkId: uuid(),
        itemCount: sizeOf(chunk),
        processed: chunk map processRecord($),      // Process chunk in memory
        summary: {
            total: sumBy(chunk, $.amount),
            avg: avgBy(chunk, $.amount)
        }
    }
```

#### **💾 MEMORY CONSERVATION TECHNIQUES**
```dataweave
// ✅ AVOID UNNECESSARY OBJECT CREATION
// BAD: Creates multiple intermediate objects
var step1 = payload map (item) -> { id: item.id, name: item.name }
var step2 = step1 map (item) -> { item: item, metadata: getMetadata(item) }
var result = step2 map (item) -> finalTransform(item)

// GOOD: Single transformation pass (memory efficient)
var result = payload map (item) -> {
    id: item.id,
    name: item.name,
    metadata: getMetadata(item),
    finalData: finalTransform(item)
}

// ✅ STRING OPTIMIZATION
// BAD: Multiple concatenations create intermediate strings
var message = "Customer " ++ customer.name ++ " has " ++ customer.orderCount ++ " orders"

// GOOD: Array join for multiple strings (more efficient)
var message = ["Customer", customer.name, "has", customer.orderCount, "orders"] joinBy " "

// ✅ EFFICIENT ARRAY OPERATIONS  
// BAD: Creates intermediate filtered arrays
var activeCustomers = payload.customers filter ($.active == true)
var vipCustomers = activeCustomers filter ($.totalSpent > 10000)
var result = vipCustomers map processVipCustomer($)

// GOOD: Single filtering pass (memory efficient)
var result = payload.customers
    |> filter (customer) -> customer.active == true and customer.totalSpent > 10000
    |> map processVipCustomer($)
```

---

### **🎯 3. ALGORITHMIC COMPLEXITY OPTIMIZATION**

#### **📊 O(n) VS O(n²) OPTIMIZATION PATTERNS**
```dataweave
// ❌ O(n²) PERFORMANCE KILLERS (AVOID):
// BAD: Nested loops for lookups
var enrichedOrders = payload.orders map (order) -> {
    customerInfo: payload.customers filter ($.id == order.customerId)[0],  // O(n²)
    productInfo: payload.products filter ($.id == order.productId)[0]      // O(n²)
}

// ✅ O(n) OPTIMIZED PATTERNS (PREFERRED):
// GOOD: Create lookup tables once (O(n)), then use O(1) lookups
var customerLookup = payload.customers reduce ((customer, acc) -> 
    acc ++ { (customer.id): customer }                    // O(n) creation
)
var productLookup = payload.products reduce ((product, acc) -> 
    acc ++ { (product.id): product }                      // O(n) creation  
)

var enrichedOrders = payload.orders map (order) -> {
    customerInfo: customerLookup[order.customerId],       // O(1) lookup
    productInfo: productLookup[order.productId]           // O(1) lookup
}

// ✅ EFFICIENT AGGREGATION PATTERNS
// GOOD: Single-pass aggregation (O(n))
var metrics = payload.transactions reduce ((tx, acc) -> {
    count: acc.count + 1,
    total: acc.total + tx.amount,
    maxAmount: max([acc.maxAmount, tx.amount]),
    categories: if (acc.categories contains tx.category) 
                  acc.categories 
                else acc.categories ++ [tx.category]
})

// BAD: Multiple passes over same data (O(4n))
var count = sizeOf(payload.transactions)                  // Pass 1
var total = sumBy(payload.transactions, $.amount)         // Pass 2
var maxAmount = maxBy(payload.transactions, $.amount)     // Pass 3
var categories = payload.transactions distinctBy ($.category) // Pass 4
```

#### **🚀 ADVANCED PERFORMANCE PATTERNS**
```dataweave
// ✅ OPTIMIZED NESTED DATA PROCESSING
var departmentAnalysis = payload.departments map (dept) -> {
    deptId: dept.id,
    name: dept.name,
    
    // Single pass through employees for all metrics (efficient)
    employeeAnalysis: dept.employees reduce ((emp, acc) -> {
        totalEmployees: acc.totalEmployees + 1,
        totalSalary: acc.totalSalary + emp.salary,
        seniorCount: acc.seniorCount + (if (emp.level == "SENIOR") 1 else 0),
        juniorCount: acc.juniorCount + (if (emp.level == "JUNIOR") 1 else 0),
        avgSalary: (acc.totalSalary + emp.salary) / (acc.totalEmployees + 1)
    }),
    
    // Process projects with cached dept context
    projectSummary: {
        totalProjects: sizeOf(dept.projects),
        totalBudget: sumBy(dept.projects, $.budget),
        activeProjects: sizeOf(dept.projects filter ($.status == "ACTIVE"))
    }
}
```

---

### **🔄 4. LAZY EVALUATION & DEFERRED PROCESSING**

#### **⚡ CONDITIONAL EXPENSIVE OPERATIONS**
```dataweave
// ✅ LAZY EVALUATION - Compute only when needed
var analytics = {
    // Always computed (cheap operations)
    basicStats: {
        recordCount: sizeOf(payload.data),
        lastUpdated: now() as String
    },
    
    // Computed only if requested (expensive operations)
    advancedAnalytics: if (payload.includeAdvanced == true) {
        trendAnalysis: calculateTrends(payload.historicalData),    // Expensive
        predictions: generatePredictions(payload.data),           // Expensive
        correlations: calculateCorrelations(payload.metrics)      // Expensive
    } else null,
    
    // Computed only for specific user types (conditional processing)
    adminData: if (payload.user.role == "ADMIN") {
        sensitiveMetrics: calculateSensitiveMetrics(payload.data),
        auditTrail: generateAuditTrail(payload.operations)
    } else null
}

// ✅ DEFERRED EXPENSIVE LOOKUPS
fun optimizedCustomerEnrichment(orders: Array): Array = 
    orders map (order) -> {
        // Basic order info (always included)
        orderId: order.id,
        amount: order.amount,
        
        // Expensive enrichment only if needed
        customerDetails: if (order.includeCustomerDetails == true) 
            lookupCustomerDetails(order.customerId)  // Expensive external lookup
        else null,
        
        // Complex calculations only for large orders
        taxCalculation: if (order.amount > 1000)
            calculateComplexTax(order, customer.state)  // Complex calculation
        else order.amount * 0.08  // Simple calculation for small orders
    }
```

#### **🌊 STREAMING CHAIN OPTIMIZATION**
```dataweave
// ✅ OPTIMIZED STREAMING PIPELINE
%dw 2.0
output application/json deferred=true

fun efficientDataPipeline(rawData: Array): Object = do {
    // Create reusable lookup tables once (O(n))
    var customerLookup = payload.customers reduce ((c, acc) -> acc ++ { (c.id): c })
    var productLookup = payload.products reduce ((p, acc) -> acc ++ { (p.id): p })
    
    // Single streaming pipeline (memory efficient)
    var processedTransactions = rawData
        |> filter (tx) -> tx.status == "COMPLETED"              // Filter early
        |> filter (tx) -> tx.amount > 0                         // Reduce dataset size
        |> map (tx) -> {                                        // Transform reduced set
            txId: tx.id,
            amount: tx.amount,
            customer: customerLookup[tx.customerId],            // O(1) lookup
            product: productLookup[tx.productId],               // O(1) lookup
            enrichedData: enrichTransaction(tx)                 // Complex processing on smaller set
        }
        |> orderBy (tx) -> tx.amount                           // Sort final results
    
    ---
    {
        summary: {
            totalProcessed: sizeOf(processedTransactions),
            totalAmount: sumBy(processedTransactions, $.amount),
            processingDate: now() as String
        },
        transactions: processedTransactions
    }
}
```

---

### **📊 5. FUNCTION PERFORMANCE OPTIMIZATION**

#### **⚡ FUNCTION PERFORMANCE HIERARCHY**

| **Performance Tier** | **Functions** | **Use Cases** | **Performance** | **Memory** |
|----------------------|---------------|---------------|-----------------|------------|
| **⚡ Tier 1 (Built-in Operators)** | `+`, `-`, `*`, `/`, `==`, `!=`, `>`, `<` | Basic operations | **Fastest** | **Minimal** |
| **🚀 Tier 2 (Built-in Core)** | `map`, `filter`, `reduce`, `sizeOf`, `isEmpty` | Core transformations | **Fast** | **Low** |
| **⚙️ Tier 3 (Built-in Advanced)** | `groupBy`, `distinctBy`, `orderBy`, `sumBy`, `avgBy` | Aggregations | **Good** | **Moderate** |
| **🐌 Tier 4 (Imported Functions)** | `capitalize`, `divideBy`, `partition`, `abs` | Specialized ops | **Moderate** | **Higher** |
| **🐌 Tier 5 (Custom Functions)** | User-defined complex business logic | Business rules | **Slower** | **Variable** |

#### **🚀 OPTIMIZED AGGREGATION TECHNIQUES**
```dataweave
// ✅ BUILT-IN AGGREGATION FUNCTIONS (FASTEST)
var efficientMetrics = {
    total: sumBy(payload.items, $.amount),              // Optimized single-pass sum
    average: avgBy(payload.items, $.amount),            // Optimized single-pass average
    maximum: maxBy(payload.items, $.amount),            // Optimized single-pass max
    minimum: minBy(payload.items, $.amount),            // Optimized single-pass min
    count: sizeOf(payload.items)                        // O(1) size calculation
}

// ❌ AVOID: Manual reduce for standard aggregations (slower)
var inefficientMetrics = {
    total: payload.items reduce ((item, acc) -> acc + item.amount), // Slower than sumBy
    count: payload.items reduce ((item, acc) -> acc + 1)            // Slower than sizeOf
}

// ✅ EFFICIENT GROUPBY AGGREGATION
var categoryMetrics = payload.sales 
    |> groupBy ($.category)                         // Single grouping operation
    |> mapObject ((sales, category) -> {            // Process each group
        (category): {
            count: sizeOf(sales),                   // O(1) per group
            total: sumBy(sales, $.amount),          // Optimized aggregation
            avg: avgBy(sales, $.amount),            // Optimized aggregation
            topSale: maxBy(sales, $.amount)         // Optimized max
        }
    })
```

---

### **🧮 6. MATHEMATICAL & CONDITIONAL OPTIMIZATION**

#### **⚡ EFFICIENT CALCULATION PATTERNS**
```dataweave
// ✅ OPTIMIZED MATHEMATICAL OPERATIONS
var calculations = {
    // Use built-in math functions (optimized C implementations)
    sum: sumBy(payload.values, $),                          // Faster than manual reduce
    avg: avgBy(payload.values, $),                          // Faster than sum/count
    variance: payload.values 
        |> map (value) -> pow(value - avgValue, 2)
        |> reduce ((v, acc) -> acc + v) / sizeOf(payload.values),
    
    // Efficient range calculations
    range: maxBy(payload.values, $) - minBy(payload.values, $),
    
    // Optimized percentage calculations
    percentages: payload.values map (value) -> (value / total) * 100
}

// ✅ CONDITIONAL CALCULATION OPTIMIZATION
fun smartConditionalProcessing(records: Array, config: Object): Array = 
    records map (record) -> {
        basicInfo: {
            id: record.id,
            amount: record.amount
        },
        
        // Only calculate expensive fields if conditions met
        detailedAnalysis: if (record.amount > config.detailThreshold) {
            riskScore: calculateRiskScore(record),              // Expensive calculation
            recommendations: generateRecommendations(record),   // Expensive operation
            forecast: predictFutureValue(record)               // Expensive prediction
        } else {
            riskScore: "LOW",                                   // Simple default
            recommendations: [],                                // Empty array
            forecast: null                                      // Null for small amounts
        },
        
        // Early termination for invalid records
        processingResult: if (record.isValid == false) 
            "SKIPPED" 
        else processValidRecord(record)                        // Only process valid records
    }
```

---

### **🔄 7. ITERATION & LOOP OPTIMIZATION**

#### **⚡ EFFICIENT ITERATION PATTERNS**
```dataweave
// ✅ SINGLE-PASS MULTI-METRIC CALCULATION
fun singlePassAnalysis(data: Array): Object = 
    data reduce ((item, acc) -> {
        // Calculate all metrics in one pass
        count: acc.count + 1,
        sum: acc.sum + item.amount,
        max: max([acc.max, item.amount]),
        min: min([acc.min, item.amount]),
        categories: if (acc.categories contains item.category) 
                      acc.categories 
                    else acc.categories ++ [item.category],
        
        // Conditional aggregation in same pass
        highValueCount: acc.highValueCount + (if (item.amount > 1000) 1 else 0),
        lowValueSum: acc.lowValueSum + (if (item.amount <= 100) item.amount else 0)
    })

// ❌ AVOID: Multiple passes over same large dataset
var count = sizeOf(data)                                    // Pass 1
var sum = sumBy(data, $.amount)                            // Pass 2
var max = maxBy(data, $.amount)                            // Pass 3
var categories = data distinctBy ($.category)               // Pass 4
var highValueCount = sizeOf(data filter ($.amount > 1000)) // Pass 5
```

#### **🚀 NESTED ITERATION OPTIMIZATION**
```dataweave
// ✅ OPTIMIZED NESTED PROCESSING (Minimize inner loops)
var departmentReports = payload.departments map (dept) -> {
    deptInfo: {
        id: dept.id,
        name: dept.name
    },
    
    // Single pass through employees for all department metrics
    employeeMetrics: dept.employees reduce ((emp, acc) -> {
        totalEmployees: acc.totalEmployees + 1,
        totalSalary: acc.totalSalary + emp.salary,
        seniorCount: acc.seniorCount + (if (emp.level == "SENIOR") 1 else 0),
        avgSalary: (acc.totalSalary + emp.salary) / (acc.totalEmployees + 1),
        
        // Build salary ranges in same pass
        salaryRanges: acc.salaryRanges ++ [{
            range: if (emp.salary < 50000) "LOW" 
                  else if (emp.salary < 100000) "MID" 
                  else "HIGH"
        }]
    }),
    
    // Process projects with cached department context  
    projectSummary: {
        totalProjects: sizeOf(dept.projects),
        totalBudget: sumBy(dept.projects, $.budget),
        budgetUtilization: sumBy(dept.projects, $.budget) / dept.annualBudget
    }
}

// ❌ AVOID: Multiple nested iterations
var inefficientDeptReports = payload.departments map (dept) -> {
    deptInfo: dept,
    totalEmployees: sizeOf(dept.employees),                     // Iteration 1
    totalSalary: sumBy(dept.employees, $.salary),              // Iteration 2
    seniorCount: sizeOf(dept.employees filter ($.level == "SENIOR")), // Iteration 3
    avgSalary: avgBy(dept.employees, $.salary),                // Iteration 4
    totalProjects: sizeOf(dept.projects),                      // Iteration 5
    totalBudget: sumBy(dept.projects, $.budget)                // Iteration 6
}
```

---

### **📊 8. PRODUCTION PERFORMANCE VALIDATION**

#### **🛡️ COMPREHENSIVE PERFORMANCE QUALITY GATES**
```bash
✅ MANDATORY PERFORMANCE OPTIMIZATION VALIDATION:

🎯 IMPORT EFFICIENCY CHECK:
- [ ] VERIFY: No unnecessary "import *" statements
- [ ] VERIFY: Only specific functions imported if actually used
- [ ] VERIFY: Built-in functions (map, filter, reduce, sizeOf) not imported
- [ ] COUNT: Import statements ≤ 3 for optimal performance
- [ ] CALCULATE: Import Efficiency Score ≥ 80%

⚡ SAFE CHECKING EFFICIENCY CHECK:
- [ ] VERIFY: Safe functions only used for nullable/uncertain fields
- [ ] VERIFY: Direct field access for guaranteed data
- [ ] ANALYZE: Safe function call ratio ≤ 30% of total field access
- [ ] COUNT: Unnecessary safe checks eliminated  
- [ ] CALCULATE: Safe Check Efficiency Score ≥ 80%

🚀 ALGORITHMIC COMPLEXITY CHECK:
- [ ] VERIFY: No O(n²) nested loops unless business-critical
- [ ] VERIFY: Lookup tables used for repeated searches
- [ ] VERIFY: Single-pass aggregations where possible
- [ ] COUNT: Nested iterations ≤ 2 levels deep
- [ ] ANALYZE: Time complexity documented for complex operations

📊 MEMORY OPTIMIZATION CHECK:
- [ ] VERIFY: Streaming enabled for large datasets (>1MB)
- [ ] VERIFY: deferred=true for large outputs
- [ ] VERIFY: No unnecessary intermediate object creation
- [ ] VERIFY: Lazy evaluation used for conditional expensive operations
- [ ] COUNT: Variable reuse vs redundant calculations

🔄 EXECUTION OPTIMIZATION CHECK:
- [ ] VERIFY: Early termination patterns used where applicable  
- [ ] VERIFY: Conditional processing optimized (cheap checks first)
- [ ] VERIFY: Built-in aggregation functions preferred over custom reduce
- [ ] VERIFY: Filter operations occur before expensive transformations
- [ ] MEASURE: Execution time within performance targets (<30s)

📈 ADVANCED PERFORMANCE METRICS:
- Import Efficiency: (Used Functions ÷ Imported Functions) × 100 ≥ 80%
- Safe Check Efficiency: (Necessary Checks ÷ Total Checks) × 100 ≥ 80%
- Direct Access Ratio: (Direct Access ÷ Total Field Access) × 100 ≥ 70%
- Algorithmic Efficiency: (O(n) operations ÷ Total operations) × 100 ≥ 90%
- Memory Efficiency: (Streaming ops ÷ Large data ops) × 100 ≥ 80%
- Execution Efficiency: Transformation completes within target time
```

---

### **📈 9. PERFORMANCE MONITORING & ANALYSIS**

#### **🧪 PERFORMANCE MEASUREMENT UTILITIES**
```dataweave
// ✅ EXECUTION TIME MEASUREMENT
fun measureTransformationPerformance(operation: () -> Any): Object = do {
    var startTime = now()
    var result = operation()
    var endTime = now()
    var executionTime = (endTime - startTime) as Number
    ---
    {
        result: result,
        performanceMetrics: {
            executionTimeMs: executionTime,
            executionTimeSec: executionTime / 1000,
            timestamp: startTime as String,
            status: if (executionTime < 5000) "EXCELLENT" 
                   else if (executionTime < 15000) "GOOD"
                   else if (executionTime < 30000) "ACCEPTABLE"
                   else "NEEDS_OPTIMIZATION"
        }
    }
}

// ✅ MEMORY USAGE ESTIMATION
fun estimateMemoryUsage(dataSize: Number, operationType: String): Object = {
    inputSizeKB: dataSize / 1024,
    inputSizeMB: dataSize / (1024 * 1024),
    operationType: operationType,
    
    estimatedMemoryMultiplier: operationType match {
        case "streaming" -> 0.1          // 10% of input size
        case "single-pass" -> 1.0        // Same as input size  
        case "multi-pass" -> 2.5         // 2.5x input size
        case "nested-loops" -> 5.0       // 5x input size (avoid!)
        else -> 1.5
    },
    
    estimatedMemoryUsageMB: (dataSize / (1024 * 1024)) * 
        (operationType match {
            case "streaming" -> 0.1
            case "single-pass" -> 1.0
            case "multi-pass" -> 2.5
            case "nested-loops" -> 5.0
            else -> 1.5
        }),
    
    recommendation: if (dataSize > 10485760) "Use streaming with deferred=true"      // >10MB
                   else if (dataSize > 1048576) "Consider streaming"                // >1MB
                   else "Standard processing OK"                                    // <1MB
}
```

---

### **🎯 10. ENTERPRISE OPTIMIZATION PATTERNS**

#### **🏢 PRODUCTION-READY PERFORMANCE TEMPLATE**
```dataweave
%dw 2.0
output application/json deferred=true  // Enable streaming for production

// 🚀 MINIMAL IMPORTS - Only import what's actually used
import capitalize from dw::core::Strings  // Only if capitalize() called in script
// Note: map, filter, reduce, sizeOf, groupBy are built-in

// 💾 PERFORMANCE-OPTIMIZED VARIABLES (Cache expensive operations)
var exchangeRates = payload.config.exchangeRates    // Cache for reuse
var currentDate = now() as String                   // Generate once
var processingConfig = payload.settings             // Cache config access

// 🧠 SMART UTILITY FUNCTIONS (Only define if actually needed)
fun safeString(value: Any): String | Null = value as String default null  // Only for nullable fields

// ⚡ LOOKUP TABLE CREATION (O(n) setup for O(1) lookups)
var customerLookup = payload.customers reduce ((customer, acc) -> 
    acc ++ { (customer.id): customer }
)

---
{
    // 📊 METADATA (Direct access for guaranteed fields)
    metadata: {
        processedAt: currentDate,                           // Cached value
        totalRecords: sizeOf(payload.records),              // O(1) operation
        processingMode: "OPTIMIZED_STREAMING"
    },
    
    // 🌊 STREAMING PIPELINE (Memory efficient for large data)
    processedData: payload.records
        |> filter (record) -> record.isActive               // Filter early (reduce dataset)
        |> filter (record) -> record.amount > 0             // Further reduction
        |> map (record) -> {                                // Transform smaller dataset
            // Direct access for guaranteed fields (fastest)
            id: record.id,
            type: record.type,
            amount: record.amount,
            
            // O(1) lookup from cached table (efficient)
            customerInfo: customerLookup[record.customerId],
            
            // Conditional expensive calculation (lazy evaluation)
            riskAnalysis: if (record.amount > 10000) 
                calculateRiskScore(record)                   // Expensive - only for large amounts
            else "LOW_RISK",                                 // Simple default
            
            // Smart type conversion (only where needed)
            processedAmount: record.amount * exchangeRates[record.currency] // Cached rate
        }
        |> orderBy (record) -> record.amount,               // Sort final results
    
    // 📊 SINGLE-PASS SUMMARY (Efficient aggregation)
    summary: payload.records reduce ((record, acc) -> {
        totalAmount: acc.totalAmount + record.amount,
        recordCount: acc.recordCount + 1,
        maxAmount: max([acc.maxAmount, record.amount]),
        categoryCount: if (acc.categories contains record.category) 
                         acc.categoryCount 
                       else acc.categoryCount + 1
    })
}
```

---

## 🏆 **PERFORMANCE OPTIMIZATION SUCCESS METRICS**

### **📊 TARGET PERFORMANCE BENCHMARKS**

| **Metric** | **Minimum** | **Target** | **Excellent** | **Measurement Method** |
|------------|-------------|-----------|---------------|------------------------|
| **Import Efficiency** | 60% | 80% | 95% | (Used Functions ÷ Imported) × 100 |
| **Safe Check Efficiency** | 60% | 80% | 95% | (Necessary Checks ÷ Total) × 100 |
| **Direct Access Ratio** | 50% | 70% | 85% | (Direct Access ÷ Total Access) × 100 |
| **Execution Time** | <60s | <30s | <5s | DataWeave CLI execution measurement |
| **Memory Usage** | <1GB | <512MB | <128MB | Runtime memory consumption |
| **Algorithmic Efficiency** | 70% | 90% | 100% | (O(n) ops ÷ Total ops) × 100 |

### **🚀 OPTIMIZATION ACHIEVEMENT LEVELS**

**🥉 BRONZE (60-79% Performance Score):**
- Basic optimization applied
- Some unnecessary imports/checks eliminated
- Acceptable for development environments

**🥈 SILVER (80-89% Performance Score):**  
- Good optimization practices followed
- Most performance anti-patterns eliminated
- Suitable for staging/test environments

**🥇 GOLD (90-100% Performance Score):**
- Excellent optimization throughout
- Production-ready performance characteristics
- Enterprise-grade efficiency achieved

---

## 🧞‍♂️ **PERFORMANCE OPTIMIZATION INTEGRATION**

### **🔧 R-GENIE SYSTEM INTEGRATION**

#### **📋 AUTOMATED PERFORMANCE ANALYSIS**
```bash
# 🚀 PERFORMANCE ANALYZER TOOL (Created by R-GENIE) - Enhanced with error handling
if node lib/scripts/03-01-24_Performance_Analyzer.js script.dwl; then
    echo "✅ Automated performance analysis completed"
else
    echo "⚠️ Performance analyzer failed - applying manual optimization"
    # Continue with manual optimization patterns below
fi

# 📊 PERFORMANCE QUALITY GATE ENFORCEMENT (Always available)
validate_quality_gate "Performance Optimization" --minimum-score 80

# ⚡ MANUAL OPTIMIZATION FALLBACK
echo "📋 Applying manual performance optimization patterns..."
echo "🔍 Review import statements for efficiency"
echo "⚡ Check safe function usage patterns"  
echo "🚀 Validate streaming for large datasets"
```

#### **🚨 PERFORMANCE ANALYZER TROUBLESHOOTING**

**Common Issues and Solutions:**

1. **`analyzeMuleSoftPerformance is not a function` Error:**
   ```bash
   # ✅ FIXED: Method has been added to the analyzer (August 2025)
   # If you still see this error, ensure latest version is being used
   ```

2. **Performance Analyzer Fails to Start:**
   ```bash
   # 🛡️ FALLBACK: Use manual optimization guidelines below
   echo "⚠️ Using manual performance optimization approach"
   # Apply optimization patterns from sections below
   ```

**🎯 KEY PRINCIPLE: Performance analyzer failures do NOT prevent optimization - manual patterns below provide comprehensive guidance.**

#### **🎯 WORKFLOW INTEGRATION POINTS**

**Phase 5.5: Performance Optimization (NEW) - Insert after consent, before generation:**
```bash
1. Analyze required imports → minimize to essentials
2. Analyze input data guarantees → optimize safe checking
3. Analyze algorithmic complexity → optimize iteration patterns
4. Analyze memory requirements → enable streaming if needed
5. Generate performance recommendations → apply optimizations
6. Validate performance metrics → ensure targets met
7. Generate optimized script → production-ready performance
```

---

*🧞‍♂️ "Master these performance optimization techniques, and your DataWeave transformations shall execute with the speed of lightning and the efficiency of desert winds!"*

*Generated by R-GENIE Comprehensive Performance Optimization Engine*  
*📅 Enhanced: 2025-08-31*