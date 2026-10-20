# Sprint 1 — Sprint Review

## Branch
- `ProxyCore`

## Pull request
- [#2 — Sprint 1 - Proxy Core](https://github.com/AaronCrvl/ProxyFlow/pull/2), merged into `master` on 2026-06-09.
- Source branch `ProxyCore` ended at `c32b8be`; the PR contains seven commits and states a working reverse proxy with a log viewer as its deliverable.

## Goal
- Deliver a working reverse proxy that records requests and displays them in a React dashboard.

## Summary of changes
- **Gateway:** configured YARP reverse-proxy routing and request-logging middleware.
- **Persistence:** stored request logs in PostgreSQL through Entity Framework Core.
- **Frontend:** created a React/Vite log viewer with filtering and pagination.
- **Authentication:** added authentication middleware. The PR plan describes API-key validation from configuration; it does not document JWT usage.
- **Packaging and tests:** added Docker support for the backend and PostgreSQL, and middleware tests. The PR does not report a coverage percentage or test-run result.

## Retrospective — What went well
- The PR record confirms that the reverse-proxy and log-viewer deliverable was merged.

## Retrospective — What to improve
- No retrospective notes or measured follow-up items are recorded in the PR.

## Action items
- No owner-and-due-date action items are recorded in the PR.

## Next sprint focus
- The next sprint is documented in [Sprint 2](Sprint2.md).