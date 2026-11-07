// Loaded by now-sdk from @types/servicenow/fluent/tables.d.ts.
// Fluent sources cannot contain declare global, and the compiler only types
// trigger.current from Now.Internal.Tables. These entries match the columns
// declared on the two overlay tables in src/app.fluent.ts.

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
            current_status: Typed<"BLOCKED" | "PROCESSING" | "RELEASED">
            ai_justification: Typed<string>
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
