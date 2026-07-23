# MuleSoft Version Compatibility Reference

> **Source:** Consolidated from `03-06-01_Version_Compatibility_Reference.mdc`
> **Last Verified:** September 2025  
> **Author**: Cheppali Shaik Sohail

---

## 📊 Core Compatibility Matrix

| Mule Runtime | Support Status | MUnit Version | APIKit | DataWeave |
|--------------|----------------|---------------|--------|-----------|
| **4.9 (LTS)** | 📍 Active until Aug 2026 | 3.5.0 | 1.11.x | 2.8.0 |
| **4.8** | ⚠️ Extended until Jun 2025 | 3.2.0+ | 1.11.2 | 2.7.x |
| **4.6 (LTS)** | 📍 Extended until Feb 2026 | 3.0.x | 1.9.x | 2.5.x |

---

## 🔗 Core Connectors (Latest Versions)

| Connector | Version | Java 17 |
|-----------|---------|---------|
| HTTP Connector | 1.10.3 | ✅ |
| Database Connector | 1.14.16 | ✅ |
| File Connector | 1.5.0 | ✅ |
| SFTP Connector | 2.4.3 | ✅ |
| Salesforce Connector | 11.1.3 | ✅ |
| JMS Connector | 1.8.x | ✅ |
| VM Connector | 2.0.x | ✅ |

---

## 💾 POM.XML Quick Reference

```xml
<!-- Mule Runtime -->
<app.runtime>4.6.0</app.runtime>

<!-- Core Dependencies -->
<dependency>
    <groupId>org.mule.connectors</groupId>
    <artifactId>mule-http-connector</artifactId>
    <version>1.7.3</version>
    <classifier>mule-plugin</classifier>
</dependency>

<dependency>
    <groupId>org.mule.connectors</groupId>
    <artifactId>mule-db-connector</artifactId>
    <version>1.14.0</version>
    <classifier>mule-plugin</classifier>
</dependency>

<dependency>
    <groupId>org.mule.modules</groupId>
    <artifactId>mule-apikit-module</artifactId>
    <version>1.8.0</version>
    <classifier>mule-plugin</classifier>
</dependency>
```

---

## ☕ Java 17 Support

- **Mule Runtime 4.6.0+**: Full Java 17 support
- **Anypoint Studio 7.17+**: Java 17 compatible
- **All connectors listed above**: Java 17 compatible

---

## 🛡️ Support Level Legend

- 📍 **Active**: Full standard support with updates
- ⚠️ **Extended**: Security fixes only, upgrade recommended
- ❌ **Ended**: No support, immediate upgrade required
