# Order-to-cash use cases

Scope `x_ent_erp_ovl`. One app holds five stages. A person queues the audit from a `BLOCKED` row. The stage flow looks up `x_ent_erp_ovl_customer_metrics` by `customer_id` and calls **Invoke Bedrock Credit Audit**. The model only advises. The flow never sets `RELEASED`.

`POST /api/x_ent_erp_ovl/v1/agent-callback` is the only release. The header `X-Agent-Callback-Token` must match `x_ent_erp_ovl.callback_token`. `APPROVED` sets `RELEASED`. `DENIED` sets `BLOCKED`. A missing `process` means `credit`.

Every stage row stores a correlation id. `x_ent_erp_ovl_audit_events` records `BUTTON`, `BEDROCK_RESULT`, and `CALLBACK`. `BEDROCK_RESULT` stores `x-amzn-requestid` as `aws_request_id`.

## Credit

Accept or hold a credit block. Table `x_ent_erp_ovl_credit_exceptions`. Button **Run Agentic Audit**. Flow `AuditCreditExceptionFlow`. Process `credit`. The prompt asks the model to recommend `APPROVED` or `DENIED`.

### Architecture

```mermaid
flowchart LR
  subgraph workspace [Workspace]
    list[Credit Exceptions list]
    button[Run Agentic Audit]
  end

  subgraph records [Records]
    stage[(credit_exceptions)]
    metrics[(customer_metrics)]
    events[(audit_events)]
  end

  subgraph automation [Flow and action]
    flow[AuditCreditExceptionFlow]
    action[Invoke Bedrock Credit Audit]
  end

  runtime[Bedrock Runtime]
  caller[Callback caller]
  callback["POST /api/x_ent_erp_ovl/v1/agent-callback"]

  list --> button
  button -->|"BLOCKED only: correlation id, BUTTON event, PROCESSING"| stage
  button --> events
  stage -->|"status PROCESSING"| flow
  flow -->|"lookup by customer_id"| metrics
  flow -->|"process credit and correlation id"| action
  action -->|"SigV4 InvokeModel"| runtime
  runtime -->|"status, body, x-amzn-requestid"| action
  action --> flow
  flow -->|"not HTTP 200: journal warning and BLOCKED"| stage
  flow -->|"BEDROCK_RESULT"| events
  caller -->|"token, order_id, decision, justification"| callback
  callback -->|"APPROVED is RELEASED, DENIED is BLOCKED"| stage
  callback -->|"CALLBACK"| events
```

### Sequence

```mermaid
sequenceDiagram
  actor User
  participant Form
  participant Stage as Credit Exceptions
  participant Events as Audit Events
  participant Flow as AuditCreditExceptionFlow
  participant Metrics as Customer Metrics
  participant Action as Invoke Bedrock Credit Audit
  participant Bedrock as Bedrock Runtime
  actor Caller as Callback caller
  participant API as agent-callback API

  User->>Form: Open a BLOCKED credit row and click Run Agentic Audit
  Form->>Stage: Write correlation id and set PROCESSING
  Form->>Events: Insert BUTTON for process credit
  Stage->>Flow: Row inserted or updated while PROCESSING
  Flow->>Metrics: Look up customer_id
  Metrics-->>Flow: Exposure, limit, risk tier, past due
  Flow->>Action: process credit, correlation id, order, customer, amount, metrics
  Action->>Bedrock: Signed InvokeModel request
  Bedrock-->>Action: status_code, body, error, timed_out, x-amzn-requestid
  alt Status is missing, the call timed out, or status is not 200
    Flow->>Stage: Append a warning and set BLOCKED
  else HTTP 200
    Note over Flow,Stage: Status stays PROCESSING. This flow does not release credit.
  end
  Flow->>Events: Insert BEDROCK_RESULT with aws_request_id
  Caller->>API: POST order_id, decision, justification, and the token
  Note over Caller,API: process may be omitted. A missing process means credit.
  alt decision is APPROVED
    API->>Stage: Set RELEASED and append the justification
  else decision is DENIED
    API->>Stage: Set BLOCKED and append the justification
  end
  API->>Events: Insert CALLBACK and copy aws_request_id when the correlation id matches
```

## Order

Accept or hold an order. Table `x_ent_erp_ovl_order_holds`. Button **Queue Order Audit**. Flow `AuditOrderFlow`. Process `order`. The prompt asks the model to recommend accept or hold.

### Architecture

```mermaid
flowchart LR
  subgraph workspace [Workspace]
    list[Order Holds list]
    button[Queue Order Audit]
  end

  subgraph records [Records]
    stage[(order_holds)]
    metrics[(customer_metrics)]
    events[(audit_events)]
  end

  subgraph automation [Flow and action]
    flow[AuditOrderFlow]
    action[Invoke Bedrock Credit Audit]
  end

  runtime[Bedrock Runtime]
  caller[Callback caller]
  callback["POST /api/x_ent_erp_ovl/v1/agent-callback"]

  list --> button
  button -->|"BLOCKED only: correlation id, BUTTON event, PROCESSING"| stage
  button --> events
  stage -->|"status PROCESSING"| flow
  flow -->|"lookup by customer_id"| metrics
  flow -->|"process order and correlation id"| action
  action -->|"SigV4 InvokeModel"| runtime
  runtime -->|"status, body, x-amzn-requestid"| action
  action --> flow
  flow -->|"not HTTP 200: journal warning and BLOCKED"| stage
  flow -->|"BEDROCK_RESULT"| events
  caller -->|"token, process order, order_id, decision, justification"| callback
  callback -->|"APPROVED is RELEASED, DENIED is BLOCKED"| stage
  callback -->|"CALLBACK"| events
```

### Sequence

```mermaid
sequenceDiagram
  actor User
  participant Form
  participant Stage as Order Holds
  participant Events as Audit Events
  participant Flow as AuditOrderFlow
  participant Metrics as Customer Metrics
  participant Action as Invoke Bedrock Credit Audit
  participant Bedrock as Bedrock Runtime
  actor Caller as Callback caller
  participant API as agent-callback API

  User->>Form: Open a BLOCKED order row and click Queue Order Audit
  Form->>Stage: Write correlation id and set PROCESSING
  Form->>Events: Insert BUTTON for process order
  Stage->>Flow: Row inserted or updated while PROCESSING
  Flow->>Metrics: Look up customer_id
  Metrics-->>Flow: Exposure, limit, risk tier, past due
  Flow->>Action: process order, correlation id, order, customer, amount, metrics
  Action->>Bedrock: Signed InvokeModel request that asks accept or hold
  Bedrock-->>Action: status_code, body, error, timed_out, x-amzn-requestid
  alt Status is missing, the call timed out, or status is not 200
    Flow->>Stage: Append a warning and set BLOCKED
  else HTTP 200
    Note over Flow,Stage: Status stays PROCESSING. This flow does not release the order.
  end
  Flow->>Events: Insert BEDROCK_RESULT with aws_request_id
  Caller->>API: POST process order, order_id, decision, justification, and the token
  alt decision is APPROVED
    API->>Stage: Set RELEASED and append the justification
  else decision is DENIED
    API->>Stage: Set BLOCKED and append the justification
  end
  API->>Events: Insert CALLBACK and copy aws_request_id when the correlation id matches
```

## Fulfillment

Release or hold pick and ship. Table `x_ent_erp_ovl_fulfillment_holds`. Button **Queue Fulfillment Audit**. Flow `AuditFulfillmentFlow`. Process `fulfillment`. The prompt asks the model to recommend release or hold for pick and ship.

### Architecture

```mermaid
flowchart LR
  subgraph workspace [Workspace]
    list[Fulfillment Holds list]
    button[Queue Fulfillment Audit]
  end

  subgraph records [Records]
    stage[(fulfillment_holds)]
    metrics[(customer_metrics)]
    events[(audit_events)]
  end

  subgraph automation [Flow and action]
    flow[AuditFulfillmentFlow]
    action[Invoke Bedrock Credit Audit]
  end

  runtime[Bedrock Runtime]
  caller[Callback caller]
  callback["POST /api/x_ent_erp_ovl/v1/agent-callback"]

  list --> button
  button -->|"BLOCKED only: correlation id, BUTTON event, PROCESSING"| stage
  button --> events
  stage -->|"status PROCESSING"| flow
  flow -->|"lookup by customer_id"| metrics
  flow -->|"process fulfillment and correlation id"| action
  action -->|"SigV4 InvokeModel"| runtime
  runtime -->|"status, body, x-amzn-requestid"| action
  action --> flow
  flow -->|"not HTTP 200: journal warning and BLOCKED"| stage
  flow -->|"BEDROCK_RESULT"| events
  caller -->|"token, process fulfillment, order_id, decision, justification"| callback
  callback -->|"APPROVED is RELEASED, DENIED is BLOCKED"| stage
  callback -->|"CALLBACK"| events
```

### Sequence

```mermaid
sequenceDiagram
  actor User
  participant Form
  participant Stage as Fulfillment Holds
  participant Events as Audit Events
  participant Flow as AuditFulfillmentFlow
  participant Metrics as Customer Metrics
  participant Action as Invoke Bedrock Credit Audit
  participant Bedrock as Bedrock Runtime
  actor Caller as Callback caller
  participant API as agent-callback API

  User->>Form: Open a BLOCKED fulfillment row and click Queue Fulfillment Audit
  Form->>Stage: Write correlation id and set PROCESSING
  Form->>Events: Insert BUTTON for process fulfillment
  Stage->>Flow: Row inserted or updated while PROCESSING
  Flow->>Metrics: Look up customer_id
  Metrics-->>Flow: Exposure, limit, risk tier, past due
  Flow->>Action: process fulfillment, correlation id, order, customer, amount, metrics
  Action->>Bedrock: Signed InvokeModel request that asks release or hold for pick and ship
  Bedrock-->>Action: status_code, body, error, timed_out, x-amzn-requestid
  alt Status is missing, the call timed out, or status is not 200
    Flow->>Stage: Append a warning and set BLOCKED
  else HTTP 200
    Note over Flow,Stage: Status stays PROCESSING. This flow does not release fulfillment.
  end
  Flow->>Events: Insert BEDROCK_RESULT with aws_request_id
  Caller->>API: POST process fulfillment, order_id, decision, justification, and the token
  alt decision is APPROVED
    API->>Stage: Set RELEASED and append the justification
  else decision is DENIED
    API->>Stage: Set BLOCKED and append the justification
  end
  API->>Events: Insert CALLBACK and copy aws_request_id when the correlation id matches
```

## Invoice

Release or hold billing. Table `x_ent_erp_ovl_invoice_holds`. Button **Queue Invoice Audit**. Flow `AuditInvoiceFlow`. Process `invoice`. The prompt asks the model to recommend release or hold for billing.

### Architecture

```mermaid
flowchart LR
  subgraph workspace [Workspace]
    list[Invoice Holds list]
    button[Queue Invoice Audit]
  end

  subgraph records [Records]
    stage[(invoice_holds)]
    metrics[(customer_metrics)]
    events[(audit_events)]
  end

  subgraph automation [Flow and action]
    flow[AuditInvoiceFlow]
    action[Invoke Bedrock Credit Audit]
  end

  runtime[Bedrock Runtime]
  caller[Callback caller]
  callback["POST /api/x_ent_erp_ovl/v1/agent-callback"]

  list --> button
  button -->|"BLOCKED only: correlation id, BUTTON event, PROCESSING"| stage
  button --> events
  stage -->|"status PROCESSING"| flow
  flow -->|"lookup by customer_id"| metrics
  flow -->|"process invoice and correlation id"| action
  action -->|"SigV4 InvokeModel"| runtime
  runtime -->|"status, body, x-amzn-requestid"| action
  action --> flow
  flow -->|"not HTTP 200: journal warning and BLOCKED"| stage
  flow -->|"BEDROCK_RESULT"| events
  caller -->|"token, process invoice, order_id, decision, justification"| callback
  callback -->|"APPROVED is RELEASED, DENIED is BLOCKED"| stage
  callback -->|"CALLBACK"| events
```

### Sequence

```mermaid
sequenceDiagram
  actor User
  participant Form
  participant Stage as Invoice Holds
  participant Events as Audit Events
  participant Flow as AuditInvoiceFlow
  participant Metrics as Customer Metrics
  participant Action as Invoke Bedrock Credit Audit
  participant Bedrock as Bedrock Runtime
  actor Caller as Callback caller
  participant API as agent-callback API

  User->>Form: Open a BLOCKED invoice row and click Queue Invoice Audit
  Form->>Stage: Write correlation id and set PROCESSING
  Form->>Events: Insert BUTTON for process invoice
  Stage->>Flow: Row inserted or updated while PROCESSING
  Flow->>Metrics: Look up customer_id
  Metrics-->>Flow: Exposure, limit, risk tier, past due
  Flow->>Action: process invoice, correlation id, order, customer, amount, metrics
  Action->>Bedrock: Signed InvokeModel request that asks release or hold for billing
  Bedrock-->>Action: status_code, body, error, timed_out, x-amzn-requestid
  alt Status is missing, the call timed out, or status is not 200
    Flow->>Stage: Append a warning and set BLOCKED
  else HTTP 200
    Note over Flow,Stage: Status stays PROCESSING. This flow does not release the invoice.
  end
  Flow->>Events: Insert BEDROCK_RESULT with aws_request_id
  Caller->>API: POST process invoice, order_id, decision, justification, and the token
  alt decision is APPROVED
    API->>Stage: Set RELEASED and append the justification
  else decision is DENIED
    API->>Stage: Set BLOCKED and append the justification
  end
  API->>Events: Insert CALLBACK and copy aws_request_id when the correlation id matches
```

## Cash

Apply, short-pay, or hold a payment. Table `x_ent_erp_ovl_cash_applications`. Button **Queue Cash Audit**. Flow `AuditCashFlow`. Process `cash`. The prompt asks the model to recommend apply, short-pay, or hold.

### Architecture

```mermaid
flowchart LR
  subgraph workspace [Workspace]
    list[Cash Applications list]
    button[Queue Cash Audit]
  end

  subgraph records [Records]
    stage[(cash_applications)]
    metrics[(customer_metrics)]
    events[(audit_events)]
  end

  subgraph automation [Flow and action]
    flow[AuditCashFlow]
    action[Invoke Bedrock Credit Audit]
  end

  runtime[Bedrock Runtime]
  caller[Callback caller]
  callback["POST /api/x_ent_erp_ovl/v1/agent-callback"]

  list --> button
  button -->|"BLOCKED only: correlation id, BUTTON event, PROCESSING"| stage
  button --> events
  stage -->|"status PROCESSING"| flow
  flow -->|"lookup by customer_id"| metrics
  flow -->|"process cash and correlation id"| action
  action -->|"SigV4 InvokeModel"| runtime
  runtime -->|"status, body, x-amzn-requestid"| action
  action --> flow
  flow -->|"not HTTP 200: journal warning and BLOCKED"| stage
  flow -->|"BEDROCK_RESULT"| events
  caller -->|"token, process cash, order_id, decision, justification"| callback
  callback -->|"APPROVED is RELEASED, DENIED is BLOCKED"| stage
  callback -->|"CALLBACK"| events
```

### Sequence

```mermaid
sequenceDiagram
  actor User
  participant Form
  participant Stage as Cash Applications
  participant Events as Audit Events
  participant Flow as AuditCashFlow
  participant Metrics as Customer Metrics
  participant Action as Invoke Bedrock Credit Audit
  participant Bedrock as Bedrock Runtime
  actor Caller as Callback caller
  participant API as agent-callback API

  User->>Form: Open a BLOCKED cash row and click Queue Cash Audit
  Form->>Stage: Write correlation id and set PROCESSING
  Form->>Events: Insert BUTTON for process cash
  Stage->>Flow: Row inserted or updated while PROCESSING
  Flow->>Metrics: Look up customer_id
  Metrics-->>Flow: Exposure, limit, risk tier, past due
  Flow->>Action: process cash, correlation id, order, customer, amount, metrics
  Action->>Bedrock: Signed InvokeModel request that asks apply, short-pay, or hold
  Bedrock-->>Action: status_code, body, error, timed_out, x-amzn-requestid
  alt Status is missing, the call timed out, or status is not 200
    Flow->>Stage: Append a warning and set BLOCKED
  else HTTP 200
    Note over Flow,Stage: Status stays PROCESSING. This flow does not release cash.
  end
  Flow->>Events: Insert BEDROCK_RESULT with aws_request_id
  Caller->>API: POST process cash, order_id, decision, justification, and the token
  alt decision is APPROVED
    API->>Stage: Set RELEASED and append the justification
  else decision is DENIED
    API->>Stage: Set BLOCKED and append the justification
  end
  API->>Events: Insert CALLBACK and copy aws_request_id when the correlation id matches
```
