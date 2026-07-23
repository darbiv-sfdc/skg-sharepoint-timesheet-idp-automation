# MuleSoft Component Patterns Reference

> **Source:** Consolidated from `03-05_MuleSoft_Component_Reference.mdc`
> **Purpose:** Detailed component patterns for MuleSoft application generation  
> **Author**: Cheppali Shaik Sohail

---

## 📁 Project Structure Patterns

### Standard API Project Structure

```
{project-name}/
├── pom.xml
├── mule-artifact.json
├── src/
│   ├── main/
│   │   ├── mule/
│   │   │   ├── interface.xml                    # API interface flows
│   │   │   ├── global/
│   │   │   │   ├── global-config.xml           # Global configurations
│   │   │   │   └── global-error-handler.xml    # Error handling
│   │   │   ├── implementation/
│   │   │   │   ├── {endpoint-1}-impl.xml       # Endpoint implementations
│   │   │   │   └── {endpoint-2}-impl.xml
│   │   │   └── subflows/
│   │   │       ├── data-validation.xml         # Reusable subflows
│   │   │       └── logging-subflow.xml
│   │   └── resources/
│   │       ├── config/
│   │       │   ├── dev.yaml                    # Dev environment
│   │       │   ├── sit.yaml                    # SIT environment
│   │       │   ├── uat.yaml                    # UAT environment
│   │       │   └── prd.yaml                    # Production
│   │       ├── dw/
│   │       │   ├── {transformation-1}.dwl      # DataWeave files
│   │       │   └── {transformation-2}.dwl
│   │       └── api/
│   │           └── {api-name}.raml             # API specification
│   └── test/
│       ├── munit/
│       │   └── {flow-name}-test.xml
│       └── resources/
│           └── test-data/
└── docs/
    ├── README.md
    └── PROJECT_ARCHITECTURE.md
```

---

## 🌐 HTTP Connector Patterns

### HTTP Listener (API Endpoint)

```xml
<http:listener-config name="HTTP_Listener_Config" doc:name="HTTP Listener Config">
    <http:listener-connection host="0.0.0.0" port="${http.port}"/>
</http:listener-config>

<flow name="api-interface-flow">
    <http:listener doc:name="HTTP Listener" 
                   config-ref="HTTP_Listener_Config" 
                   path="${http.base.path}/*">
        <http:response statusCode="#[vars.httpStatus default 200]">
            <http:headers>#[vars.outboundHeaders default {}]</http:headers>
        </http:response>
        <http:error-response statusCode="#[vars.httpStatus default 500]">
            <http:body>#[payload]</http:body>
            <http:headers>#[vars.outboundHeaders default {}]</http:headers>
        </http:error-response>
    </http:listener>
    
    <apikit:router doc:name="APIkit Router" config-ref="api-config"/>
</flow>
```

### HTTP Request (Outbound Call)

```xml
<http:request-config name="HTTP_Request_Config" doc:name="HTTP Request Config">
    <http:request-connection host="${external.api.host}" 
                              port="${external.api.port}" 
                              protocol="HTTPS">
        <tls:context>
            <tls:trust-store path="${truststore.path}" password="${truststore.password}"/>
        </tls:context>
    </http:request-connection>
</http:request-config>

<http:request doc:name="External API Call" 
              config-ref="HTTP_Request_Config" 
              method="POST" 
              path="${external.api.path}">
    <http:headers>#[vars.outboundHeaders]</http:headers>
    <http:query-params>#[vars.queryParams default {}]</http:query-params>
</http:request>
```

---

## 🗄️ Database Connector Patterns

### Database Config

```xml
<db:config name="Database_Config" doc:name="Database Config">
    <db:generic-connection url="${db.url}" 
                           driverClassName="${db.driver}"
                           user="${db.user}" 
                           password="${db.password}">
        <db:pooling-profile maxPoolSize="10" minPoolSize="2"/>
    </db:generic-connection>
</db:config>
```

### Database Select

```xml
<db:select doc:name="Select Records" config-ref="Database_Config">
    <db:sql>SELECT * FROM ${table.name} WHERE status = :status</db:sql>
    <db:input-parameters>#[{'status': vars.statusFilter}]</db:input-parameters>
</db:select>
```

### Database Insert

```xml
<db:insert doc:name="Insert Record" config-ref="Database_Config">
    <db:sql>INSERT INTO ${table.name} (id, name, created_date) VALUES (:id, :name, :created)</db:sql>
    <db:input-parameters>#[{
        'id': payload.id,
        'name': payload.name,
        'created': now()
    }]</db:input-parameters>
</db:insert>
```

---

## 🔄 Error Handling Patterns

### Global Error Handler

```xml
<error-handler name="Global_Error_Handler">
    <on-error-propagate type="HTTP:UNAUTHORIZED, HTTP:FORBIDDEN">
        <ee:transform doc:name="401/403 Response">
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
    "error": {
        "code": error.errorType.identifier,
        "message": "Authentication or authorization failed",
        "correlationId": correlationId
    }
}]]></ee:set-payload>
            </ee:message>
            <ee:variables>
                <ee:set-variable variableName="httpStatus">401</ee:set-variable>
            </ee:variables>
        </ee:transform>
    </on-error-propagate>
    
    <on-error-propagate type="ANY">
        <ee:transform doc:name="500 Response">
            <ee:message>
                <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
    "error": {
        "code": "INTERNAL_ERROR",
        "message": "An unexpected error occurred",
        "correlationId": correlationId
    }
}]]></ee:set-payload>
            </ee:message>
            <ee:variables>
                <ee:set-variable variableName="httpStatus">500</ee:set-variable>
            </ee:variables>
        </ee:transform>
    </on-error-propagate>
</error-handler>
```

---

## 📝 Logging Patterns

### Structured Logging Subflow

```xml
<sub-flow name="log-request-subflow">
    <logger doc:name="Log Request" level="INFO" 
            message="#['Request received: ' ++ attributes.method ++ ' ' ++ attributes.requestPath]"/>
    <ee:transform doc:name="Capture Request">
        <ee:variables>
            <ee:set-variable variableName="requestTimestamp">#[now()]</ee:set-variable>
            <ee:set-variable variableName="correlationId">#[correlationId]</ee:set-variable>
        </ee:variables>
    </ee:transform>
</sub-flow>

<sub-flow name="log-response-subflow">
    <logger doc:name="Log Response" level="INFO" 
            message="#['Response: ' ++ vars.httpStatus as String ++ ' in ' ++ 
                      ((now() - vars.requestTimestamp) as Number {unit: 'milliseconds'}) as String ++ 'ms']"/>
</sub-flow>
```

---

## 🔐 Security Patterns

### Secure Properties Configuration

```yaml
# secure-config.yaml
http:
  port: "8081"
  
db:
  url: "![encrypted-value]"
  user: "![encrypted-value]"
  password: "![encrypted-value]"

api:
  client.id: "![encrypted-value]"
  client.secret: "![encrypted-value]"
```

### Secure Properties in Global Config

```xml
<secure-properties:config name="Secure_Properties_Config" 
                          file="config/${mule.env}.yaml" 
                          key="${mule.key}">
    <secure-properties:encrypt algorithm="Blowfish"/>
</secure-properties:config>
```
