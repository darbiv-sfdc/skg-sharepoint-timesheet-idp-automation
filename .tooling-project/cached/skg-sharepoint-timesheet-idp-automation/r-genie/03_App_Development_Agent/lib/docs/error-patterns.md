# Build & Deployment Error Pattern Library

> **Source:** Consolidated from `03-07_Build_Error_Pattern_Library.mdc`
> **Purpose:** Error diagnosis and fix reference for Phase 3 & 4  
> **Author**: Cheppali Shaik Sohail

---

## 🎯 Error Diagnosis Methodology

1. **Capture error output** (full Maven/Studio error message)
2. **Match against patterns** in this library
3. **Identify error category** (DEPENDENCY, SYNTAX, CONFIG, etc.)
4. **Apply recommended fix**
5. **Validate fix** before re-running build
6. **Track fix** for iteration metrics

---

## 🔥 Maven Dependency Errors

### ERROR 1: Dependency Not Found

**Pattern:** `Could not find artifact`

```
[ERROR] Could not find artifact com.mulesoft.connectors:mule-custom-connector:jar:1.0.0 
in anypoint-exchange (https://maven.anypoint.mulesoft.com/api/v2/maven)
```

**Fix:**
```xml
<!-- Option 1: Check if artifact exists with different version -->
<dependency>
    <groupId>com.mulesoft.connectors</groupId>
    <artifactId>mule-custom-connector</artifactId>
    <version>1.0.1</version>
    <classifier>mule-plugin</classifier>
</dependency>

<!-- Option 2: Add required repository -->
<repository>
    <id>anypoint-exchange-v3</id>
    <name>Anypoint Exchange</name>
    <url>https://maven.anypoint.mulesoft.com/api/v3/maven</url>
</repository>
```

### ERROR 2: Version Conflict

**Pattern:** `version conflict`

**Fix:**
```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>conflicting.group</groupId>
            <artifactId>conflicting-artifact</artifactId>
            <version>desired.version</version>
        </dependency>
    </dependencies>
</dependencyManagement>
```

### ERROR 3: Missing Classifier

**Pattern:** `Missing classifier: mule-plugin`

**Fix:**
```xml
<dependency>
    <groupId>com.mulesoft.connectors</groupId>
    <artifactId>mule-http-connector</artifactId>
    <version>1.7.3</version>
    <classifier>mule-plugin</classifier> <!-- ADD THIS -->
</dependency>
```

---

## 🔧 XML Syntax Errors

### ERROR 4: Invalid XML Element

**Pattern:** `Unexpected element` or `Invalid content`

**Fix:**
1. Check element spelling
2. Verify namespace declaration
3. Ensure proper closing tags
4. Validate against schema

### ERROR 5: Missing Namespace

**Pattern:** `Cannot resolve symbol`

**Fix:**
```xml
<!-- Add missing namespace to root element -->
<mule xmlns:http="http://www.mulesoft.org/schema/mule/http"
      xmlns:db="http://www.mulesoft.org/schema/mule/db"
      xmlns:ee="http://www.mulesoft.org/schema/mule/ee/core">
```

---

## 🚀 Deployment Errors

### ERROR 6: CloudHub Deployment Failure

**Pattern:** `Deployment failed`

**Checklist:**
1. Verify application name is unique
2. Check worker size availability
3. Validate secure properties encryption
4. Confirm environment credentials

### ERROR 7: Property Not Found

**Pattern:** `Property not found: ${property.name}`

**Fix:**
1. Add property to environment YAML
2. Verify property file is included in build
3. Check property name spelling

### ERROR 8: Memory/Worker Issues

**Pattern:** `OutOfMemoryError` or `Worker limit exceeded`

**Fix:**
```yaml
# cloudhub-deployment.yaml
workers:
  amount: 1
  type: SMALL  # Try MEDIUM if needed
  
jvm:
  args: "-Xms512m -Xmx1024m"
```

---

## 📋 Quick Fix Reference

| Error Pattern | Category | Quick Fix |
|---------------|----------|-----------|
| `Could not find artifact` | DEPENDENCY | Check version, add repository |
| `Version conflict` | DEPENDENCY | Use dependencyManagement |
| `Missing classifier` | DEPENDENCY | Add `<classifier>mule-plugin</classifier>` |
| `Invalid XML` | SYNTAX | Validate against schema |
| `Missing namespace` | SYNTAX | Add xmlns declaration |
| `Property not found` | CONFIG | Add to environment YAML |
| `Deployment failed` | DEPLOY | Check credentials, app name |
| `OutOfMemoryError` | RESOURCE | Increase worker size |
