// AuditCreditExceptionFlow -> Flow().
// Trigger -> wfa.trigger(trigger.record.createdOrUpdated) on x_ent_erp_ovl_credit_exceptions
// when current_status=PROCESSING. Insert and update are both covered by createdOrUpdated.
// Step 1 -> wfa.action(action.core.lookUpRecord) on x_ent_erp_ovl_customer_metrics.
// Step 2 -> wfa.action(invokeBedrockCreditAudit), the Integration Hub action from spoke-actions.ts.
// Step 3 -> wfa.flowLogic.if plus wfa.action(action.core.updateRecord). A missing status, a timeout,
// or any status other than 200 journals a warning and sets current_status back to BLOCKED.
// This flow never sets RELEASED. Release happens only in the callback API.

import { Flow, action, trigger, wfa } from "@servicenow/sdk/automation"
import { invokeBedrockCreditAudit } from "./spoke-actions.now.ts"

const CREDIT_EXCEPTIONS = "x_ent_erp_ovl_credit_exceptions"
const CUSTOMER_METRICS = "x_ent_erp_ovl_customer_metrics"

Flow(
  {
    $id: Now.ID["flow_audit_credit_exception"],
    name: "AuditCreditExceptionFlow",
    internalName: "audit_credit_exception_flow",
    description: "When a credit exception enters PROCESSING, look up customer metrics and call the model. Failure returns the row to BLOCKED for a human. Success waits for the callback.",
    runAs: "system",
    flowPriority: "MEDIUM",
  },
  wfa.trigger(
    trigger.record.createdOrUpdated,
    { $id: Now.ID["trigger_credit_exception_processing"] },
    {
      table: CREDIT_EXCEPTIONS,
      condition: "current_status=PROCESSING",
      run_flow_in: "background",
      run_on_extended: "false",
      trigger_strategy: "unique_changes",
    },
  ),
  (params) => {
    const metrics = wfa.action(
      action.core.lookUpRecord,
      { $id: Now.ID["lookup_customer_metrics"] },
      {
        table: CUSTOMER_METRICS,
        conditions: `customer_id=${wfa.dataPill(params.trigger.current.customer_id, "string")}`,
        sort_column: "sys_updated_on",
        sort_type: "sort_desc",
        if_multiple_records_are_found_action: "use_first_record",
        dont_fail_flow_on_error: true,
      },
    )
    const audit = wfa.action(
      invokeBedrockCreditAudit,
      { $id: Now.ID["call_bedrock_audit"] },
      {
        order_id: wfa.dataPill(params.trigger.current.order_id, "string"),
        customer_id: wfa.dataPill(params.trigger.current.customer_id, "string"),
        amount: wfa.dataPill(params.trigger.current.amount, "string"),
        customer_metrics: {
          exposure: wfa.dataPill(metrics.Record.exposure, "string"),
          limit_amount: wfa.dataPill(metrics.Record.limit_amount, "string"),
          risk_tier: wfa.dataPill(metrics.Record.risk_tier, "string"),
          past_due: wfa.dataPill(metrics.Record.past_due, "boolean"),
        },
      },
    )
    wfa.flowLogic.if(
      {
        $id: Now.ID["audit_call_failed"],
        label: "Model call needs a human",
        condition: `${wfa.dataPill(audit.status_code, "integer")}ISEMPTY^OR${wfa.dataPill(audit.timed_out, "boolean")}=true^OR${wfa.dataPill(audit.timed_out, "boolean")}=1^OR${wfa.dataPill(audit.status_code, "integer")}!=200`,
      },
      () => {
        wfa.action(
          action.core.updateRecord,
          { $id: Now.ID["block_for_human_review"] },
          {
            table_name: CREDIT_EXCEPTIONS,
            record: wfa.dataPill(params.trigger.current, "reference"),
            values: TemplateValue({
              current_status: "BLOCKED",
              ai_justification:
                "Agentic audit did not complete with HTTP 200. The status was missing, the call timed out, or the runtime returned a non-200 response. A human must review this credit exception. This flow does not release credit.",
            }),
          },
        )
      },
    )
  },
)
