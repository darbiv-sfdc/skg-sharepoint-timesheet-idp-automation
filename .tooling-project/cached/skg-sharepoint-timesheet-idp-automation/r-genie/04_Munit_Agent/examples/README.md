# 🧞‍♂️ **MUNIT EXAMPLES DIRECTORY**

**📄 Source:** Extracted from `s-sfdc-commerce-mst-api-at` production project  
**🎯 Purpose:** Production-validated MUnit patterns used by AI for test generation  
**Author**: Cheppali Shaik Sohail

---

## 📁 **FILE OVERVIEW**

| File | Description | Key Patterns |
|------|-------------|--------------|
| `01_pom_configuration_example.xml` | Maven POM | MUnit plugin, dependencies, Java 17 |
| `02_munit_test_suite_example.xml` | Test suite | Success/failure patterns, spies, mocks |
| `03_test_data_examples.json` | Test data | Mock responses, input/output structures |
| `04_application_flow_example.xml` | Application flow | Testing strategy, doc:id targeting |
| `05_product_pricing_api_reference.xml` | **Production-validated** | **Schema-compliant, zero XML errors** |
| `06_product_pricing_api_test_data.json` | **Production-validated** | **File-based data, realistic structures** |

---

## 🎯 **KEY PATTERNS**

### **Doc:Name Schema Compliance** ⚠️ **CRITICAL**
```xml
<!-- ✅ REQUIRED: Declare doc namespace -->
<mule xmlns:doc="http://www.mulesoft.org/schema/mule/documentation" ...>

<!-- ❌ FORBIDDEN: doc:name on structural elements (causes 52+ XML errors) -->
<munit:behavior doc:name="forbidden">
<munit:execution doc:name="forbidden">
<munit:validation doc:name="forbidden">

<!-- ✅ ALLOWED: doc:name on components -->
<munit-tools:mock-when doc:name="Mock Salesforce" processor="salesforce:query">
<flow-ref doc:name="Call Flow" name="business-flow"/>
```

**Rules:** Declare `xmlns:doc`, NO doc:name on `behavior/execution/validation`, doc:name OK on processors/assertions.

### **Connector Mocking Patterns**
```xml
<!-- Salesforce -->
<munit-tools:mock-when processor="salesforce:upsert">
    <munit-tools:with-attributes>
        <munit-tools:with-attribute whereValue="doc-id-here" attributeName="doc:id"/>
    </munit-tools:with-attributes>
    <munit-tools:then-return>
        <munit-tools:payload value='{"successful": true}'/>
    </munit-tools:then-return>
</munit-tools:mock-when>

<!-- DataWeave Spy -->
<munit-tools:spy processor="ee:transform">
    <munit-tools:with-attributes>
        <munit-tools:with-attribute whereValue="doc-id-here" attributeName="doc:id"/>
    </munit-tools:with-attributes>
    <munit-tools:after-call>
        <munit-tools:assert-equals actual="#[payload]" 
            expected='#[MunitTools::getResourceAsString("test-data/output.json")]'/>
    </munit-tools:after-call>
</munit-tools:spy>
```

---

## ⚡ **BEST PRACTICES**

**✅ Do:**
- Use exact `doc:id` targeting (never processor names)
- Spy all DataWeave transformations
- Mock all external systems (Salesforce, Solace, HTTP)
- Use file-based test data (`MunitTools::getResourceAsString`)
- Declare `xmlns:doc` namespace

**❌ Don't:**
- Add `doc:name` to `munit:behavior/execution/validation`
- Use generic processor mocking
- Skip spy validation on transforms
- Test dependency flows (focus on business logic)

**🎯 Coverage Strategy:** 80% success tests, 20% failure tests, spy all transforms, mock all externals.

---

**🧞‍♂️ These examples provide production-validated patterns for error-free MUnit test generation.**
