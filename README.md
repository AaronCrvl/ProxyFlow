# ProxyFlow

**Self-hosted API Gateway + Webhook Testing Studio**

Build, test, and mock APIs in one tool. No complexity, full control.

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

---

## Quick Start

```bash
git clone https://github.com/yourusername/proxyflow.git
cd proxyflow
docker-compose up -d
open http://localhost:5173
