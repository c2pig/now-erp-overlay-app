# Agent & Contributor Instructions (`now-erp-overlay-app`)

## Two-Way Architecture Diagram Sync

This repository powers **Lab 2 (`AI Agent ERP Overlay` — ServiceNow HITL & Bedrock Advisory)** on [`0trust.dev`](https://github.com/c2pig/0trust.dev/blob/main/docs/ECOSYSTEM_MAP.md).

Whenever you modify ServiceNow Fluent code, tables, or flows:
1. **Local Sync**: Update [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) in the same Pull Request (enforced by [`.github/workflows/diagram-check.yml`](.github/workflows/diagram-check.yml)).
2. **Global Sync**: If ERP order schemas, Bedrock advisory contracts, or HITL callback endpoints change, also update `docs/labs/agentic-transaction.md` and `docs/diagrams/platform_capability_zoomin.svg` in [`c2pig/0trust.dev`](https://github.com/c2pig/0trust.dev).
