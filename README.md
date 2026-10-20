
# ProxyFlow

**Self-hosted API Gateway + Webhook Testing Studio**

Build, test, and mock APIs in one tool. No complexity, full control.

> **Before starting:** read [`Gateway.Api/PostgresSQLConfigGuide_LinuxBash`](Gateway.Api/PostgresSQLConfigGuide_LinuxBash) for PostgreSQL setup, development startup, and running the API in Docker.

---

## Schema

<img width="1266" height="658" alt="image" src="https://github.com/user-attachments/assets/2ebe302e-5f0b-46df-9488-c4e6c9284d12" />

---

## Why

Existing tools are fragmented:
- Postman → no live proxy
- ngrok → no request transformation
- Kong/Ocelot → overkill for development

ProxyFlow fixes this.

---

## What It Does

| Feature | What You Get |
|---------|---------------|
| Reverse proxy | Route traffic, modify requests/responses |
| Webhook catcher | Persistent storage, retries, payload inspection |
| Mock server | Static/dynamic responses, delay simulation |
| Scripting | JavaScript transformation on the fly |
| OpenAPI export | Generate spec from your routes |
| Live logs | Real-time filtering by path/method/status |

---

## Tech Stack

**Backend:** .NET 8 + YARP + EF Core + PostgreSQL + SignalR + Jint  
**Frontend:** React 18 + Vite + Tailwind + Monaco Editor  
**DevOps:** Docker Compose + GitHub Actions

## Demo

[Watch the ProxyFlow dashboard recording(NO VIDEO BUGS)](docs/demo-video/proxyflow-dashboard-demo.webm).

https://github.com/user-attachments/assets/4a0af711-59a1-4ce9-895a-8863a1ac470e




## Run in development

Start PostgreSQL in its database-only container and initialize its schema:

```bash
docker compose up -d postgres
docker compose exec -T postgres psql -U dbo -d proxyflow -v ON_ERROR_STOP=1 < Gateway.Api/Database/Models/Scripts/Script1.sql
docker compose exec -T postgres psql -U dbo -d proxyflow -v ON_ERROR_STOP=1 < Gateway.Api/Database/Models/Scripts/Script2.sql
```

For local development with the API running in a container, start both services:

```bash
ASPNETCORE_ENVIRONMENT=Development API_HOST_PORT=5025 docker compose up -d --build
```

To run the API directly on the host instead, use the connection string and command in the PostgreSQL guide (the Docker database is published on port `5433`). Start the React frontend in a separate terminal:

```bash
cd gateway-ui && npm install && npm run dev
```

Development browser URLs:

- **Frontend:** http://localhost:5173/
- **Backend API documentation (Swagger):** http://localhost:5025/swagger/index.html

Swagger and API documentation are available without a token. The log and methods APIs and SignalR logs hub remain protected by `[Authorize]`. Obtain a bearer token with `POST http://localhost:5025/api/Auth/GetToken` to call them. Sample product, order, employee, and post routes are also available on the backend.

For manual smoke tests, Python 3 was used to send sample API and webhook requests and check responses and saved logs. Python is not required to run the application.
