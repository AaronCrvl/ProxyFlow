# Sprint 2 — Sprint Review

## Branch
- `WebHook`

## Pull requests
- [#3 — Sprint 2 - WebHook and Data Retrieving Tests](https://github.com/AaronCrvl/ProxyFlow/pull/3), merged into `master` on 2026-09-30.
- Source branch `WebHook` ended at `980aa3c`; the PR contains four commits and describes webhook setup/features, UI features, export, and integration tests.
- [#4 — New Features](https://github.com/AaronCrvl/ProxyFlow/pull/4) was also merged from `WebHook` on 2026-09-30. It is a related follow-up, not a sprint-numbered PR; its scope is recorded separately below.
- PR #4's source commit is `33899d4`.

## Goal
- Expand the gateway with webhook and sample data-retrieval scenarios, then expose request and webhook activity through the UI.

## Summary of changes
- **Webhook and sample routes:** added a webhook receiver and sample product, order, employee, and post endpoints for exercising request and data-retrieval flows.
- **Log data:** extended request-log data with response details and service origin, and added API support to retrieve logs by origin.
- **API discovery:** added an endpoint that lists available API methods.
- **Dashboard:** added API/webhook log views, filtering, pagination, and webhook retry/cURL-export interactions.
- **Database and documentation:** added PostgreSQL schema/configuration material and architecture notes. The PR describes integration tests but does not report their run results.

## Related follow-up — PR #4
- Added a logs table with method, path, status, duration, and timestamp columns.
- Added filtering by method, status code, and path, plus a request detail view for headers and bodies.
- The PR is associated with the same `WebHook` branch but was titled “New Features,” rather than being explicitly numbered as a sprint.

## Retrospective — What went well
- The `WebHook` branch delivered the webhook/data-retrieval scope in PR #3 and a dashboard follow-up in PR #4; both PRs were merged.

## Retrospective — What to improve
- No sprint retrospective notes or measured follow-up items are recorded in PR #3 or PR #4.

## Action items
- No owner-and-due-date action items are recorded in these PRs.

## Next sprint focus
- Sprint 3 moved the dashboard toward real-time log updates and polished loading, empty, and theme states; see [Sprint 3](Sprint3.md).
