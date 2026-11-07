// Requested scope x-ent-erp-ovl cannot be stored: ServiceNow scopes match (x|sn)_[a-z0-9_]+ and reject hyphens.
// Every record in this app uses x_ent_erp_ovl. The application record itself is not an Application() call.
// now.config.json scope, scopeId, name, and description are the SDK symbols for the scoped app
// (name Agentic ERP Overlay, short description of credit-block overlays).
// credit_exceptions -> Table() x_ent_erp_ovl_credit_exceptions. The SDK requires the scope prefix on sys_db_object.name.
// customer_metrics -> Table() x_ent_erp_ovl_customer_metrics, the lookup companion for the audit flow.
// Currency and journal columns -> GenericColumn({ columnType }) because this SDK has no CurrencyColumn or JournalColumn.
// Choice current_status -> ChoiceColumn. System properties -> Property(). Secrets use type "password".
// The access-key property was requested as password/string; Property type "password" is the masked string.

import { ChoiceColumn, GenericColumn, Property, Role, StringColumn, Table, BooleanColumn } from "@servicenow/sdk/core"

export const x_ent_erp_ovl_user = Role({
  name: "x_ent_erp_ovl.user",
  description: "Read and update credit-block overlay records.",
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
