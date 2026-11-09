// Requested scope x-ent-erp-ovl cannot be stored: ServiceNow scopes match (x|sn)_[a-z0-9_]+ and reject hyphens.
// Every record in this app uses x_ent_erp_ovl. The application record itself is not an Application() call.
// now.config.json scope, scopeId, name, and description are the SDK symbols for the scoped app
// (name Agentic ERP Overlay, short description of credit-block overlays).
// credit_exceptions, order_holds, fulfillment_holds, invoice_holds, and cash_applications
// are the stage tables. Each uses audit: true so ServiceNow writes sys_audit.
// audit_events is the append-only business trail (BUTTON, BEDROCK_RESULT, CALLBACK).
// customer_metrics -> Table() x_ent_erp_ovl_customer_metrics, the lookup companion for every stage flow.
// Currency and journal columns -> GenericColumn({ columnType }) because this SDK has no CurrencyColumn or JournalColumn.
// Choice current_status -> ChoiceColumn. System properties -> Property(). Secrets use type "password".
// The access-key property was requested as password/string; Property type "password" is the masked string.

import { ChoiceColumn, GenericColumn, Property, Role, StringColumn, Table, BooleanColumn } from "@servicenow/sdk/core"

export const x_ent_erp_ovl_user = Role({
  name: "x_ent_erp_ovl.user",
  description: "Read and update ERP overlay stage records and the audit event trail.",
  grantable: true,
  canDelegate: true,
})

export const x_ent_erp_ovl_credit_exceptions = Table({
  name: "x_ent_erp_ovl_credit_exceptions",
  label: "Credit Exceptions",
  display: "order_id",
  audit: true,
  extensible: false,
  accessibleFrom: "public",
  callerAccess: "tracking",
  basePolicy: "public",
  allowWebServiceAccess: true,
  createAccessControls: true,
  userRole: x_ent_erp_ovl_user,
  readRoles: [x_ent_erp_ovl_user],
  writeRoles: [x_ent_erp_ovl_user],
  createRoles: [x_ent_erp_ovl_user],
  actions: { read: true, create: true, update: true },
  schema: {
    order_id: StringColumn({
      label: "Order ID",
      maxLength: 40,
      mandatory: true,
    }),
    customer_id: StringColumn({
      label: "Customer ID",
      maxLength: 40,
      mandatory: false,
    }),
    amount: GenericColumn({
      label: "Amount",
      columnType: "currency",
    }),
    correlation_id: StringColumn({
      label: "Correlation ID",
      maxLength: 40,
      mandatory: false,
    }),
    current_status: ChoiceColumn({
      label: "Current Status",
      maxLength: 40,
      mandatory: true,
      default: "BLOCKED",
      dropdown: "dropdown_without_none",
      choices: {
        BLOCKED: { label: "BLOCKED", sequence: 1 },
        PROCESSING: { label: "PROCESSING", sequence: 2 },
        RELEASED: { label: "RELEASED", sequence: 3 },
      },
    }),
    ai_justification: GenericColumn({
      label: "AI Justification",
      columnType: "journal",
    }),
  },
  index: [
    {
      name: "order_id_idx",
      unique: false,
      element: "order_id",
    },
  ],
})

export const x_ent_erp_ovl_order_holds = Table({
  name: "x_ent_erp_ovl_order_holds",
  label: "Order Holds",
  display: "order_id",
  audit: true,
  extensible: false,
  accessibleFrom: "public",
  callerAccess: "tracking",
  basePolicy: "public",
  allowWebServiceAccess: true,
  createAccessControls: true,
  userRole: x_ent_erp_ovl_user,
  readRoles: [x_ent_erp_ovl_user],
  writeRoles: [x_ent_erp_ovl_user],
  createRoles: [x_ent_erp_ovl_user],
  actions: { read: true, create: true, update: true },
  schema: {
    order_id: StringColumn({
      label: "Order ID",
      maxLength: 40,
      mandatory: true,
    }),
    customer_id: StringColumn({
      label: "Customer ID",
      maxLength: 40,
      mandatory: false,
    }),
    amount: GenericColumn({
      label: "Amount",
      columnType: "currency",
    }),
    correlation_id: StringColumn({
      label: "Correlation ID",
      maxLength: 40,
      mandatory: false,
    }),
    current_status: ChoiceColumn({
      label: "Current Status",
      maxLength: 40,
      mandatory: true,
      default: "BLOCKED",
      dropdown: "dropdown_without_none",
      choices: {
        BLOCKED: { label: "BLOCKED", sequence: 1 },
        PROCESSING: { label: "PROCESSING", sequence: 2 },
        RELEASED: { label: "RELEASED", sequence: 3 },
      },
    }),
    ai_justification: GenericColumn({
      label: "AI Justification",
      columnType: "journal",
    }),
  },
  index: [
    {
      name: "order_id_idx",
      unique: false,
      element: "order_id",
    },
  ],
})

export const x_ent_erp_ovl_fulfillment_holds = Table({
  name: "x_ent_erp_ovl_fulfillment_holds",
  label: "Fulfillment Holds",
  display: "order_id",
  audit: true,
  extensible: false,
  accessibleFrom: "public",
  callerAccess: "tracking",
  basePolicy: "public",
  allowWebServiceAccess: true,
  createAccessControls: true,
  userRole: x_ent_erp_ovl_user,
  readRoles: [x_ent_erp_ovl_user],
  writeRoles: [x_ent_erp_ovl_user],
  createRoles: [x_ent_erp_ovl_user],
  actions: { read: true, create: true, update: true },
  schema: {
    order_id: StringColumn({
      label: "Order ID",
      maxLength: 40,
      mandatory: true,
    }),
    customer_id: StringColumn({
      label: "Customer ID",
      maxLength: 40,
      mandatory: false,
    }),
    amount: GenericColumn({
      label: "Amount",
      columnType: "currency",
    }),
    correlation_id: StringColumn({
      label: "Correlation ID",
      maxLength: 40,
      mandatory: false,
    }),
    current_status: ChoiceColumn({
      label: "Current Status",
      maxLength: 40,
      mandatory: true,
      default: "BLOCKED",
      dropdown: "dropdown_without_none",
      choices: {
        BLOCKED: { label: "BLOCKED", sequence: 1 },
        PROCESSING: { label: "PROCESSING", sequence: 2 },
        RELEASED: { label: "RELEASED", sequence: 3 },
      },
    }),
    ai_justification: GenericColumn({
      label: "AI Justification",
      columnType: "journal",
    }),
  },
  index: [
    {
      name: "order_id_idx",
      unique: false,
      element: "order_id",
    },
  ],
})

export const x_ent_erp_ovl_invoice_holds = Table({
  name: "x_ent_erp_ovl_invoice_holds",
  label: "Invoice Holds",
  display: "order_id",
  audit: true,
  extensible: false,
  accessibleFrom: "public",
  callerAccess: "tracking",
  basePolicy: "public",
  allowWebServiceAccess: true,
  createAccessControls: true,
  userRole: x_ent_erp_ovl_user,
  readRoles: [x_ent_erp_ovl_user],
  writeRoles: [x_ent_erp_ovl_user],
  createRoles: [x_ent_erp_ovl_user],
  actions: { read: true, create: true, update: true },
  schema: {
    order_id: StringColumn({
      label: "Order ID",
      maxLength: 40,
      mandatory: true,
    }),
    customer_id: StringColumn({
      label: "Customer ID",
      maxLength: 40,
      mandatory: false,
    }),
    amount: GenericColumn({
      label: "Amount",
      columnType: "currency",
    }),
    correlation_id: StringColumn({
      label: "Correlation ID",
      maxLength: 40,
      mandatory: false,
    }),
    current_status: ChoiceColumn({
      label: "Current Status",
      maxLength: 40,
      mandatory: true,
      default: "BLOCKED",
      dropdown: "dropdown_without_none",
      choices: {
        BLOCKED: { label: "BLOCKED", sequence: 1 },
        PROCESSING: { label: "PROCESSING", sequence: 2 },
        RELEASED: { label: "RELEASED", sequence: 3 },
      },
    }),
    ai_justification: GenericColumn({
      label: "AI Justification",
      columnType: "journal",
    }),
  },
  index: [
    {
      name: "order_id_idx",
      unique: false,
      element: "order_id",
    },
  ],
})

export const x_ent_erp_ovl_cash_applications = Table({
  name: "x_ent_erp_ovl_cash_applications",
  label: "Cash Applications",
  display: "order_id",
  audit: true,
  extensible: false,
  accessibleFrom: "public",
  callerAccess: "tracking",
  basePolicy: "public",
  allowWebServiceAccess: true,
  createAccessControls: true,
  userRole: x_ent_erp_ovl_user,
  readRoles: [x_ent_erp_ovl_user],
  writeRoles: [x_ent_erp_ovl_user],
  createRoles: [x_ent_erp_ovl_user],
  actions: { read: true, create: true, update: true },
  schema: {
    order_id: StringColumn({
      label: "Order ID",
      maxLength: 40,
      mandatory: true,
    }),
    customer_id: StringColumn({
      label: "Customer ID",
      maxLength: 40,
      mandatory: false,
    }),
    amount: GenericColumn({
      label: "Amount",
      columnType: "currency",
    }),
    correlation_id: StringColumn({
      label: "Correlation ID",
      maxLength: 40,
      mandatory: false,
    }),
    current_status: ChoiceColumn({
      label: "Current Status",
      maxLength: 40,
      mandatory: true,
      default: "BLOCKED",
      dropdown: "dropdown_without_none",
      choices: {
        BLOCKED: { label: "BLOCKED", sequence: 1 },
        PROCESSING: { label: "PROCESSING", sequence: 2 },
        RELEASED: { label: "RELEASED", sequence: 3 },
      },
    }),
    ai_justification: GenericColumn({
      label: "AI Justification",
      columnType: "journal",
    }),
  },
  index: [
    {
      name: "order_id_idx",
      unique: false,
      element: "order_id",
    },
  ],
})

export const x_ent_erp_ovl_audit_events = Table({
  name: "x_ent_erp_ovl_audit_events",
  label: "Audit Events",
  display: "order_id",
  audit: true,
  extensible: false,
  accessibleFrom: "public",
  callerAccess: "tracking",
  basePolicy: "public",
  allowWebServiceAccess: true,
  createAccessControls: true,
  userRole: x_ent_erp_ovl_user,
  readRoles: [x_ent_erp_ovl_user],
  createRoles: [x_ent_erp_ovl_user],
  actions: { read: true, create: true, update: false },
  schema: {
    process: ChoiceColumn({
      label: "Process",
      maxLength: 40,
      mandatory: true,
      dropdown: "dropdown_without_none",
      choices: {
        credit: { label: "credit", sequence: 1 },
        order: { label: "order", sequence: 2 },
        fulfillment: { label: "fulfillment", sequence: 3 },
        invoice: { label: "invoice", sequence: 4 },
        cash: { label: "cash", sequence: 5 },
      },
    }),
    order_id: StringColumn({
      label: "Order ID",
      maxLength: 40,
      mandatory: true,
    }),
    source_table: StringColumn({
      label: "Source Table",
      maxLength: 80,
      mandatory: true,
    }),
    source_sys_id: StringColumn({
      label: "Source Record",
      maxLength: 40,
      mandatory: true,
    }),
    event: ChoiceColumn({
      label: "Event",
      maxLength: 40,
      mandatory: true,
      dropdown: "dropdown_without_none",
      choices: {
        BUTTON: { label: "BUTTON", sequence: 1 },
        BEDROCK_RESULT: { label: "BEDROCK_RESULT", sequence: 2 },
        CALLBACK: { label: "CALLBACK", sequence: 3 },
      },
    }),
    correlation_id: StringColumn({
      label: "Correlation ID",
      maxLength: 40,
      mandatory: false,
    }),
    aws_request_id: StringColumn({
      label: "AWS Request ID",
      maxLength: 100,
      mandatory: false,
    }),
    http_status: StringColumn({
      label: "HTTP Status",
      maxLength: 10,
      mandatory: false,
    }),
    decision: StringColumn({
      label: "Decision",
      maxLength: 40,
      mandatory: false,
    }),
    note: StringColumn({
      label: "Note",
      maxLength: 1000,
      mandatory: false,
    }),
  },
  index: [
    { name: "order_id_idx", unique: false, element: "order_id" },
    { name: "correlation_id_idx", unique: false, element: "correlation_id" },
  ],
})

export const x_ent_erp_ovl_customer_metrics = Table({
  name: "x_ent_erp_ovl_customer_metrics",
  label: "Customer Metrics",
  display: "customer_id",
  audit: true,
  extensible: false,
  accessibleFrom: "public",
  callerAccess: "tracking",
  basePolicy: "public",
  allowWebServiceAccess: true,
  createAccessControls: true,
  userRole: x_ent_erp_ovl_user,
  readRoles: [x_ent_erp_ovl_user],
  writeRoles: [x_ent_erp_ovl_user],
  createRoles: [x_ent_erp_ovl_user],
  actions: { read: true, create: true, update: true },
  schema: {
    customer_id: StringColumn({
      label: "Customer ID",
      maxLength: 40,
      mandatory: true,
      unique: true,
    }),
    exposure: GenericColumn({
      label: "Exposure",
      columnType: "currency",
    }),
    limit_amount: GenericColumn({
      label: "Limit Amount",
      columnType: "currency",
    }),
    risk_tier: StringColumn({
      label: "Risk Tier",
      maxLength: 40,
      mandatory: false,
    }),
    past_due: BooleanColumn({
      label: "Past Due",
      default: false,
    }),
  },
})

Property({
  $id: Now.ID["prop_aws_bedrock_endpoint"],
  name: "x_ent_erp_ovl.aws_bedrock_endpoint",
  type: "string",
  value: "",
  description: "Bedrock runtime base URL, for example https://bedrock-runtime.us-east-1.amazonaws.com. A path that already ends in /invoke is used as the request path.",
})

Property({
  $id: Now.ID["prop_aws_access_key"],
  name: "x_ent_erp_ovl.aws_access_key",
  type: "password",
  value: "",
  ignoreCache: true,
  description: "Access key id used to sign Bedrock InvokeModel requests. Stored as a password property and never written into source.",
})

Property({
  $id: Now.ID["prop_aws_secret_key"],
  name: "x_ent_erp_ovl.aws_secret_key",
  type: "password",
  value: "",
  ignoreCache: true,
  description: "Secret access key required for SigV4. Stored as a password property and never written into source.",
})

Property({
  $id: Now.ID["prop_aws_region"],
  name: "x_ent_erp_ovl.aws_region",
  type: "string",
  value: "us-east-1",
  description: "Signing region for the Bedrock runtime call. Default us-east-1.",
})

Property({
  $id: Now.ID["prop_aws_model_id"],
  name: "x_ent_erp_ovl.aws_model_id",
  type: "string",
  value: "",
  description: "Bedrock model id placed in the InvokeModel URI path.",
})

Property({
  $id: Now.ID["prop_callback_token"],
  name: "x_ent_erp_ovl.callback_token",
  type: "password",
  value: "",
  ignoreCache: true,
  description: "Shared secret required in the X-Agent-Callback-Token header. Password type. An empty value rejects every callback.",
})
