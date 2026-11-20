# `now-erp-overlay-app` Local Architecture

> **Global Ecosystem Role:** Powers **Lab 2 (`AI Agent ERP Overlay` — ServiceNow HITL)** on [`0trust.dev`](https://github.com/c2pig/0trust.dev/blob/main/docs/ECOSYSTEM_MAP.md).

```mermaid
flowchart LR
    Order["Paused ERP Order (BLOCKED)"] -->|"ServiceNow Flow"| Bedrock["AWS Bedrock (SigV4 Advisory Only)"]
    Bedrock -->|"Status Locked: PROCESSING"| Queue["Human Manager Approval Queue"]
    Queue -->|"Authenticated Callback"| Release["Order Released + sys_audit Trail"]
```

- **Related Docs**: [`docs/use-cases.md`](use-cases.md) · [`docs/er-diagram.svg`](er-diagram.svg)
- **Global Architecture**: [`0trust.dev/docs/labs/agentic-transaction.md`](https://github.com/c2pig/0trust.dev/blob/main/docs/labs/agentic-transaction.md)
