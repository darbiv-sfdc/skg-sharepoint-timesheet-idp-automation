# Customer System API - OpenAPI 3.0 Example

**API Layer:** System  
**Use Case:** Customer data CRUD operations  
**Auth:** API Key  
**Author**: Cheppali Shaik Sohail

---

## Structure

```
customer-system-api-oas/
├── customer-system-api.yaml         # Main OpenAPI specification
├── components/
│   ├── schemas/
│   │   ├── Customer.yaml            # Customer entity
│   │   ├── CustomerCreate.yaml      # Create request
│   │   ├── CustomerUpdate.yaml      # Update request
│   │   ├── CustomerList.yaml        # List response
│   │   ├── Address.yaml             # Address type
│   │   ├── Pagination.yaml          # Pagination type
│   │   └── Error.yaml               # RFC 7807 error
│   ├── parameters/
│   │   ├── page.yaml                # Page parameter
│   │   └── pageSize.yaml            # Page size parameter
│   ├── responses/
│   │   ├── BadRequest.yaml          # 400 response
│   │   └── NotFound.yaml            # 404 response
│   └── security/
│       └── api-key.yaml             # API Key scheme
└── examples/
    ├── requests/
    │   ├── create-customer.json
    │   └── update-customer.json
    └── responses/
        ├── customer.json
        ├── customer-list.json
        ├── error-400.json
        ├── error-404.json
        └── health.json
```

---

## Key Patterns Demonstrated

| Pattern | Implementation |
|---------|----------------|
| **Externalized Schemas** | `$ref: './components/schemas/...'` |
| **Reusable Parameters** | `$ref: './components/parameters/...'` |
| **Reusable Responses** | `$ref: './components/responses/...'` |
| **Security Schemes** | `$ref: './components/security/...'` |
| **RFC 7807 Errors** | All 5 required properties |

---

## RAML vs OpenAPI Comparison

| Aspect | RAML 1.0 | OpenAPI 3.0 |
|--------|----------|-------------|
| **File Extension** | `.raml` | `.yaml` |
| **Header** | `#%RAML 1.0` | `openapi: 3.0.3` |
| **Imports** | `!include`, `uses:` | `$ref:` |
| **Types Location** | `fragments/libraries/` | `components/schemas/` |
| **Traits** | `fragments/traits/` | Reuse via `$ref` |
| **Security** | `fragments/security-schemes/` | `components/securitySchemes/` |
| **Parameters** | Inline or traits | `components/parameters/` |
| **Best For** | MuleSoft projects | Cross-platform, Swagger |

---

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/customers` | List with pagination |
| POST | `/customers` | Create customer |
| GET | `/customers/{id}` | Get by ID |
| PUT | `/customers/{id}` | Update |
| DELETE | `/customers/{id}` | Delete |
| GET | `/health` | Health check |

---

## Usage

Use this example as a reference when generating OpenAPI specs. Compare with `customer-system-api/` (RAML) to understand format differences.
