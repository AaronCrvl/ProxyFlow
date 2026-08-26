## Real Case Scenario

- **Without ProxyFlow:**

        Client ──► Order API (port 5001) ──► Database

- **With ProxyFlow:**

        Client ──► ProxyFlow (port 5000) ──► Order API (port 5001) ──► Database
                    │
                    └── Logs to ProxyFlow's OWN database (separate)

## Architecture

                         ┌─────────────────┐
                         │   ProxyFlow     │  ← Separate app
                         │  (Standalone)   │
                         └───────┬─────────┘
                                 │
                 ┌───────────────┼───────────────┐
                 │               │               │
                 ▼               ▼               ▼
         ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
         │  Order API  │  │  User API   │  │ Payment API │
         │ (Your real  │  │ (Your real  │  │ (Your real  │
         │  service)   │  │  service)   │  │  service)   │
         └─────────────┘  └─────────────┘  └─────────────┘