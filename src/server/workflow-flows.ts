// One flow per stage. Each trigger is createdOrUpdated while current_status is PROCESSING.
// Step 1 looks up x_ent_erp_ovl_customer_metrics by customer_id.
// Step 2 calls invokeBedrockCreditAudit. The model only advises.
// Step 3 journals a warning and sets BLOCKED when the call is missing, timed out, or not HTTP 200.
// Step 4 inserts a BEDROCK_RESULT audit event. None of these flows set RELEASED.

import { Flow, action, trigger, wfa } from "@servicenow/sdk/automation"
import { invokeBedrockCreditAudit } from "./spoke-actions.now.ts"

const CUSTOMER_METRICS = "x_ent_erp_ovl_customer_metrics"
const AUDIT_EVENTS = "x_ent_erp_ovl_audit_events"

Flow(
  {
    $id: Now.ID["flow_audit_credit_exception"],
    name: "AuditCreditExceptionFlow",
    internalName: "audit_credit_exception_flow",
    description: "When a credit exception enters PROCESSING, look up customer metrics and call the model. Failure returns the row to BLOCKED. Success waits for the callback.",
    runAs: "system",
    flowPriority: "MEDIUM",
  },
  wfa.trigger(
    trigger.record.createdOrUpdated,
    { $id: Now.ID["trigger_credit_exception_processing"] },
    {
      table: "x_ent_erp_ovl_credit_exceptions",
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
        process: "credit",
        correlation_id: wfa.dataPill(params.trigger.current.correlation_id, "string"),
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
            table_name: "x_ent_erp_ovl_credit_exceptions",
            record: wfa.dataPill(params.trigger.current, "reference"),
            values: TemplateValue({
              current_status: "BLOCKED",
              ai_justification: "Agentic audit did not complete with HTTP 200. The status was missing, the call timed out, or the runtime returned a non-200 response. A human must review this credit exception. This flow does not release credit.",
            }),
          },
        )
      },
    )
    wfa.action(
      action.core.createRecord,
      { $id: Now.ID["audit_event_credit"] },
      {
        table_name: AUDIT_EVENTS,
        values: TemplateValue({
          process: "credit",
          order_id: wfa.dataPill(params.trigger.current.order_id, "string"),
          source_table: "x_ent_erp_ovl_credit_exceptions",
          source_sys_id: wfa.dataPill(params.trigger.current.sys_id, "string"),
          event: "BEDROCK_RESULT",
          correlation_id: wfa.dataPill(audit.correlation_id, "string"),
          aws_request_id: wfa.dataPill(audit.aws_request_id, "string"),
          http_status: wfa.dataPill(audit.status_code, "integer"),
          decision: "ADVICE_ONLY",
          note: "Bedrock returned advice for this stage. This flow does not set RELEASED.",
        }),
      },
    )
  },
)

Flow(
  {
    $id: Now.ID["flow_audit_order"],
    name: "AuditOrderFlow",
    internalName: "audit_order_flow",
    description: "When an order hold enters PROCESSING, look up customer metrics and ask the model whether to accept or hold the order. This flow does not set RELEASED.",
    runAs: "system",
    flowPriority: "MEDIUM",
  },
  wfa.trigger(
    trigger.record.createdOrUpdated,
    { $id: Now.ID["trigger_order_processing"] },
    {
      table: "x_ent_erp_ovl_order_holds",
      condition: "current_status=PROCESSING",
      run_flow_in: "background",
      run_on_extended: "false",
      trigger_strategy: "unique_changes",
    },
  ),
  (params) => {
    const metrics = wfa.action(
      action.core.lookUpRecord,
      { $id: Now.ID["lookup_order_metrics"] },
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
      { $id: Now.ID["call_bedrock_order"] },
      {
        order_id: wfa.dataPill(params.trigger.current.order_id, "string"),
        customer_id: wfa.dataPill(params.trigger.current.customer_id, "string"),
        amount: wfa.dataPill(params.trigger.current.amount, "string"),
        process: "order",
        correlation_id: wfa.dataPill(params.trigger.current.correlation_id, "string"),
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
        $id: Now.ID["order_call_failed"],
        label: "Model call needs a human",
        condition: `${wfa.dataPill(audit.status_code, "integer")}ISEMPTY^OR${wfa.dataPill(audit.timed_out, "boolean")}=true^OR${wfa.dataPill(audit.timed_out, "boolean")}=1^OR${wfa.dataPill(audit.status_code, "integer")}!=200`,
      },
      () => {
        wfa.action(
          action.core.updateRecord,
          { $id: Now.ID["block_order_for_human_review"] },
          {
            table_name: "x_ent_erp_ovl_order_holds",
            record: wfa.dataPill(params.trigger.current, "reference"),
            values: TemplateValue({
              current_status: "BLOCKED",
              ai_justification: "Order audit did not complete with HTTP 200. The status was missing, the call timed out, or the runtime returned a non-200 response. A human must review this order. This flow does not release the order.",
            }),
          },
        )
      },
    )
    wfa.action(
      action.core.createRecord,
      { $id: Now.ID["audit_event_order"] },
      {
        table_name: AUDIT_EVENTS,
        values: TemplateValue({
          process: "order",
          order_id: wfa.dataPill(params.trigger.current.order_id, "string"),
          source_table: "x_ent_erp_ovl_order_holds",
          source_sys_id: wfa.dataPill(params.trigger.current.sys_id, "string"),
          event: "BEDROCK_RESULT",
          correlation_id: wfa.dataPill(audit.correlation_id, "string"),
          aws_request_id: wfa.dataPill(audit.aws_request_id, "string"),
          http_status: wfa.dataPill(audit.status_code, "integer"),
          decision: "ADVICE_ONLY",
          note: "Bedrock returned advice for this stage. This flow does not set RELEASED.",
        }),
      },
    )
  },
)

Flow(
  {
    $id: Now.ID["flow_audit_fulfillment"],
    name: "AuditFulfillmentFlow",
    internalName: "audit_fulfillment_flow",
    description: "When a fulfillment hold enters PROCESSING, look up customer metrics and ask the model whether to release or hold pick and ship. This flow does not set RELEASED.",
    runAs: "system",
    flowPriority: "MEDIUM",
  },
  wfa.trigger(
    trigger.record.createdOrUpdated,
    { $id: Now.ID["trigger_fulfillment_processing"] },
    {
      table: "x_ent_erp_ovl_fulfillment_holds",
      condition: "current_status=PROCESSING",
      run_flow_in: "background",
      run_on_extended: "false",
      trigger_strategy: "unique_changes",
    },
  ),
  (params) => {
    const metrics = wfa.action(
      action.core.lookUpRecord,
      { $id: Now.ID["lookup_fulfillment_metrics"] },
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
      { $id: Now.ID["call_bedrock_fulfillment"] },
      {
        order_id: wfa.dataPill(params.trigger.current.order_id, "string"),
        customer_id: wfa.dataPill(params.trigger.current.customer_id, "string"),
        amount: wfa.dataPill(params.trigger.current.amount, "string"),
        process: "fulfillment",
        correlation_id: wfa.dataPill(params.trigger.current.correlation_id, "string"),
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
        $id: Now.ID["fulfillment_call_failed"],
        label: "Model call needs a human",
        condition: `${wfa.dataPill(audit.status_code, "integer")}ISEMPTY^OR${wfa.dataPill(audit.timed_out, "boolean")}=true^OR${wfa.dataPill(audit.timed_out, "boolean")}=1^OR${wfa.dataPill(audit.status_code, "integer")}!=200`,
      },
      () => {
        wfa.action(
          action.core.updateRecord,
          { $id: Now.ID["block_fulfillment_for_human_review"] },
          {
            table_name: "x_ent_erp_ovl_fulfillment_holds",
            record: wfa.dataPill(params.trigger.current, "reference"),
            values: TemplateValue({
              current_status: "BLOCKED",
              ai_justification: "Fulfillment audit did not complete with HTTP 200. The status was missing, the call timed out, or the runtime returned a non-200 response. A human must review pick and ship. This flow does not release fulfillment.",
            }),
          },
        )
      },
    )
    wfa.action(
      action.core.createRecord,
      { $id: Now.ID["audit_event_fulfillment"] },
      {
        table_name: AUDIT_EVENTS,
        values: TemplateValue({
          process: "fulfillment",
          order_id: wfa.dataPill(params.trigger.current.order_id, "string"),
          source_table: "x_ent_erp_ovl_fulfillment_holds",
          source_sys_id: wfa.dataPill(params.trigger.current.sys_id, "string"),
          event: "BEDROCK_RESULT",
          correlation_id: wfa.dataPill(audit.correlation_id, "string"),
          aws_request_id: wfa.dataPill(audit.aws_request_id, "string"),
          http_status: wfa.dataPill(audit.status_code, "integer"),
          decision: "ADVICE_ONLY",
          note: "Bedrock returned advice for this stage. This flow does not set RELEASED.",
        }),
      },
    )
  },
)

Flow(
  {
    $id: Now.ID["flow_audit_invoice"],
    name: "AuditInvoiceFlow",
    internalName: "audit_invoice_flow",
    description: "When an invoice hold enters PROCESSING, look up customer metrics and ask the model whether to release or hold billing. This flow does not set RELEASED.",
    runAs: "system",
    flowPriority: "MEDIUM",
  },
  wfa.trigger(
    trigger.record.createdOrUpdated,
    { $id: Now.ID["trigger_invoice_processing"] },
    {
      table: "x_ent_erp_ovl_invoice_holds",
      condition: "current_status=PROCESSING",
      run_flow_in: "background",
      run_on_extended: "false",
      trigger_strategy: "unique_changes",
    },
  ),
  (params) => {
    const metrics = wfa.action(
      action.core.lookUpRecord,
      { $id: Now.ID["lookup_invoice_metrics"] },
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
      { $id: Now.ID["call_bedrock_invoice"] },
      {
        order_id: wfa.dataPill(params.trigger.current.order_id, "string"),
        customer_id: wfa.dataPill(params.trigger.current.customer_id, "string"),
        amount: wfa.dataPill(params.trigger.current.amount, "string"),
        process: "invoice",
        correlation_id: wfa.dataPill(params.trigger.current.correlation_id, "string"),
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
        $id: Now.ID["invoice_call_failed"],
        label: "Model call needs a human",
        condition: `${wfa.dataPill(audit.status_code, "integer")}ISEMPTY^OR${wfa.dataPill(audit.timed_out, "boolean")}=true^OR${wfa.dataPill(audit.timed_out, "boolean")}=1^OR${wfa.dataPill(audit.status_code, "integer")}!=200`,
      },
      () => {
        wfa.action(
          action.core.updateRecord,
          { $id: Now.ID["block_invoice_for_human_review"] },
          {
            table_name: "x_ent_erp_ovl_invoice_holds",
            record: wfa.dataPill(params.trigger.current, "reference"),
            values: TemplateValue({
              current_status: "BLOCKED",
              ai_justification: "Invoice audit did not complete with HTTP 200. The status was missing, the call timed out, or the runtime returned a non-200 response. A human must review billing. This flow does not release the invoice.",
            }),
          },
        )
      },
    )
    wfa.action(
      action.core.createRecord,
      { $id: Now.ID["audit_event_invoice"] },
      {
        table_name: AUDIT_EVENTS,
        values: TemplateValue({
          process: "invoice",
          order_id: wfa.dataPill(params.trigger.current.order_id, "string"),
          source_table: "x_ent_erp_ovl_invoice_holds",
          source_sys_id: wfa.dataPill(params.trigger.current.sys_id, "string"),
          event: "BEDROCK_RESULT",
          correlation_id: wfa.dataPill(audit.correlation_id, "string"),
          aws_request_id: wfa.dataPill(audit.aws_request_id, "string"),
          http_status: wfa.dataPill(audit.status_code, "integer"),
          decision: "ADVICE_ONLY",
          note: "Bedrock returned advice for this stage. This flow does not set RELEASED.",
        }),
      },
    )
  },
)

Flow(
  {
    $id: Now.ID["flow_audit_cash"],
    name: "AuditCashFlow",
    internalName: "audit_cash_flow",
    description: "When a cash application enters PROCESSING, look up customer metrics and ask the model whether to apply, short-pay, or hold the payment. This flow does not set RELEASED.",
    runAs: "system",
    flowPriority: "MEDIUM",
  },
  wfa.trigger(
    trigger.record.createdOrUpdated,
    { $id: Now.ID["trigger_cash_processing"] },
    {
      table: "x_ent_erp_ovl_cash_applications",
      condition: "current_status=PROCESSING",
      run_flow_in: "background",
      run_on_extended: "false",
      trigger_strategy: "unique_changes",
    },
  ),
  (params) => {
    const metrics = wfa.action(
      action.core.lookUpRecord,
      { $id: Now.ID["lookup_cash_metrics"] },
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
      { $id: Now.ID["call_bedrock_cash"] },
      {
        order_id: wfa.dataPill(params.trigger.current.order_id, "string"),
        customer_id: wfa.dataPill(params.trigger.current.customer_id, "string"),
        amount: wfa.dataPill(params.trigger.current.amount, "string"),
        process: "cash",
        correlation_id: wfa.dataPill(params.trigger.current.correlation_id, "string"),
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
        $id: Now.ID["cash_call_failed"],
        label: "Model call needs a human",
        condition: `${wfa.dataPill(audit.status_code, "integer")}ISEMPTY^OR${wfa.dataPill(audit.timed_out, "boolean")}=true^OR${wfa.dataPill(audit.timed_out, "boolean")}=1^OR${wfa.dataPill(audit.status_code, "integer")}!=200`,
      },
      () => {
        wfa.action(
          action.core.updateRecord,
          { $id: Now.ID["block_cash_for_human_review"] },
          {
            table_name: "x_ent_erp_ovl_cash_applications",
            record: wfa.dataPill(params.trigger.current, "reference"),
            values: TemplateValue({
              current_status: "BLOCKED",
              ai_justification: "Cash audit did not complete with HTTP 200. The status was missing, the call timed out, or the runtime returned a non-200 response. A human must review the payment. This flow does not release cash.",
            }),
          },
        )
      },
    )
    wfa.action(
      action.core.createRecord,
      { $id: Now.ID["audit_event_cash"] },
      {
        table_name: AUDIT_EVENTS,
        values: TemplateValue({
          process: "cash",
          order_id: wfa.dataPill(params.trigger.current.order_id, "string"),
          source_table: "x_ent_erp_ovl_cash_applications",
          source_sys_id: wfa.dataPill(params.trigger.current.sys_id, "string"),
          event: "BEDROCK_RESULT",
          correlation_id: wfa.dataPill(audit.correlation_id, "string"),
          aws_request_id: wfa.dataPill(audit.aws_request_id, "string"),
          http_status: wfa.dataPill(audit.status_code, "integer"),
          decision: "ADVICE_ONLY",
          note: "Bedrock returned advice for this stage. This flow does not set RELEASED.",
        }),
      },
    )
  },
)

