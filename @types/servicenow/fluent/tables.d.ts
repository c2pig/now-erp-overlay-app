// Loaded by now-sdk from @types/servicenow/fluent/tables.d.ts.
// Fluent sources cannot contain declare global, and the compiler only types
// trigger.current from Now.Internal.Tables. These entries match the columns
// declared on the overlay tables in src/app.fluent.ts.

import type { Typed } from "@servicenow/sdk/core"

declare global {
  namespace Now {
    namespace Internal {
      interface Tables {
        x_ent_erp_ovl_credit_exceptions: {
          schema: {
            order_id: Typed<string>
            customer_id: Typed<string>
            amount: Typed<string | number>
            correlation_id: Typed<string>
            current_status: Typed<"BLOCKED" | "PROCESSING" | "RELEASED">
            ai_justification: Typed<string>
          }
          extends?: undefined
        }
        x_ent_erp_ovl_order_holds: {
          schema: {
            order_id: Typed<string>
            customer_id: Typed<string>
            amount: Typed<string | number>
            correlation_id: Typed<string>
            current_status: Typed<"BLOCKED" | "PROCESSING" | "RELEASED">
            ai_justification: Typed<string>
          }
          extends?: undefined
        }
        x_ent_erp_ovl_fulfillment_holds: {
          schema: {
            order_id: Typed<string>
            customer_id: Typed<string>
            amount: Typed<string | number>
            correlation_id: Typed<string>
            current_status: Typed<"BLOCKED" | "PROCESSING" | "RELEASED">
            ai_justification: Typed<string>
          }
          extends?: undefined
        }
        x_ent_erp_ovl_invoice_holds: {
          schema: {
            order_id: Typed<string>
            customer_id: Typed<string>
            amount: Typed<string | number>
            correlation_id: Typed<string>
            current_status: Typed<"BLOCKED" | "PROCESSING" | "RELEASED">
            ai_justification: Typed<string>
          }
          extends?: undefined
        }
        x_ent_erp_ovl_cash_applications: {
          schema: {
            order_id: Typed<string>
            customer_id: Typed<string>
            amount: Typed<string | number>
            correlation_id: Typed<string>
            current_status: Typed<"BLOCKED" | "PROCESSING" | "RELEASED">
            ai_justification: Typed<string>
          }
          extends?: undefined
        }
        x_ent_erp_ovl_audit_events: {
          schema: {
            process: Typed<"credit" | "order" | "fulfillment" | "invoice" | "cash">
            order_id: Typed<string>
            source_table: Typed<string>
            source_sys_id: Typed<string>
            event: Typed<"BUTTON" | "BEDROCK_RESULT" | "CALLBACK">
            correlation_id: Typed<string>
            aws_request_id: Typed<string>
            http_status: Typed<string>
            decision: Typed<string>
            note: Typed<string>
          }
          extends?: undefined
        }
        x_ent_erp_ovl_customer_metrics: {
          schema: {
            customer_id: Typed<string>
            exposure: Typed<string | number>
            limit_amount: Typed<string | number>
            risk_tier: Typed<string>
            past_due: Typed<boolean>
          }
          extends?: undefined
        }
      }
    }
  }
}
