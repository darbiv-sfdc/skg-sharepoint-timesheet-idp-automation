# Customer System API - Complete RAML Example

**API Layer:** System  
**Use Case:** Customer data CRUD operations  
**Auth:** API Key  
**Author**: Cheppali Shaik Sohail

---

## Structure

```
customer-system-api/
├── customer-system-api.raml     # Main RAML specification
├── fragments/
│   ├── libraries/
│   │   ├── common-types.raml    # Data types (Customer, Address, etc.)
│   │   └── error-types.raml     # RFC 7807 error types
│   ├── security-schemes/
│   │   └── api-key-auth.raml    # API Key security scheme
│   └── traits/
│       ├── pageable.raml        # Pagination trait
│       └── trackable.raml       # Correlation ID trait
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
| **Externalized Examples** | `!include examples/...` |
| **Security via !include** | `!include fragments/security-schemes/...` |
| **Modular Types** | Libraries in `fragments/libraries/` |
| **Traits** | Pagination, tracking in `fragments/traits/` |
| **RFC 7807 Errors** | All 5 required properties |

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

Use this example as a reference when generating System APIs. Match this structure exactly for consistency.
