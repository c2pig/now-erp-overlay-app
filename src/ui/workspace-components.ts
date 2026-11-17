// Next Experience workspace list / data grid -> Workspace(), UxListMenuConfig(), and List().
// This SDK has no DataGrid() symbol. Each stage table has a list and a form button.
// The button is shown only while current_status is BLOCKED. It writes a correlation id,
// inserts a BUTTON audit event, and sets current_status to PROCESSING.
// "updated" is the platform column sys_updated_on (label Updated).

import { List, UiAction, UxListMenuConfig, Workspace } from "@servicenow/sdk/core"

const STAGE_COLUMNS = "order_id,customer_id,amount,current_status,sys_updated_on"
const AUDIT_COLUMNS = "process,order_id,event,correlation_id,aws_request_id,http_status,decision,sys_created_on"

const CREDIT_AUDIT_SCRIPT = `(function runAgenticAudit(current, action) {
  if (String(current.current_status) !== "BLOCKED") {
    gs.addErrorMessage("The audit button is available only while this credit row is BLOCKED.");
    return;
  }
  var correlationId = String(gs.generateGUID());
  current.correlation_id = correlationId;
  current.current_status = "PROCESSING";
  current.update();
  var audit = new GlideRecord("x_ent_erp_ovl_audit_events");
  audit.initialize();
  audit.setValue("process", "credit");
  audit.setValue("order_id", String(current.order_id || ""));
  audit.setValue("source_table", current.getTableName());
  audit.setValue("source_sys_id", current.getUniqueValue());
  audit.setValue("event", "BUTTON");
  audit.setValue("correlation_id", correlationId);
  audit.setValue("decision", "QUEUED");
  audit.setValue("note", "A person queued the credit audit. The model only advises. The callback is the only release.");
  audit.insert();
  gs.addInfoMessage("credit audit queued. The row stays blocked until the callback releases it.");
  action.setRedirectURL(current);
})(current, action);
`

const ORDER_AUDIT_SCRIPT = `(function runAgenticAudit(current, action) {
  if (String(current.current_status) !== "BLOCKED") {
    gs.addErrorMessage("The audit button is available only while this order row is BLOCKED.");
    return;
  }
  var correlationId = String(gs.generateGUID());
  current.correlation_id = correlationId;
  current.current_status = "PROCESSING";
  current.update();
  var audit = new GlideRecord("x_ent_erp_ovl_audit_events");
  audit.initialize();
  audit.setValue("process", "order");
  audit.setValue("order_id", String(current.order_id || ""));
  audit.setValue("source_table", current.getTableName());
  audit.setValue("source_sys_id", current.getUniqueValue());
  audit.setValue("event", "BUTTON");
  audit.setValue("correlation_id", correlationId);
  audit.setValue("decision", "QUEUED");
  audit.setValue("note", "A person queued the order audit. The model only advises. The callback is the only release.");
  audit.insert();
  gs.addInfoMessage("order audit queued. The row stays blocked until the callback releases it.");
  action.setRedirectURL(current);
})(current, action);
`

const FULFILLMENT_AUDIT_SCRIPT = `(function runAgenticAudit(current, action) {
  if (String(current.current_status) !== "BLOCKED") {
    gs.addErrorMessage("The audit button is available only while this fulfillment row is BLOCKED.");
    return;
  }
  var correlationId = String(gs.generateGUID());
  current.correlation_id = correlationId;
  current.current_status = "PROCESSING";
  current.update();
  var audit = new GlideRecord("x_ent_erp_ovl_audit_events");
  audit.initialize();
  audit.setValue("process", "fulfillment");
  audit.setValue("order_id", String(current.order_id || ""));
  audit.setValue("source_table", current.getTableName());
  audit.setValue("source_sys_id", current.getUniqueValue());
  audit.setValue("event", "BUTTON");
  audit.setValue("correlation_id", correlationId);
  audit.setValue("decision", "QUEUED");
  audit.setValue("note", "A person queued the fulfillment audit. The model only advises. The callback is the only release.");
  audit.insert();
  gs.addInfoMessage("fulfillment audit queued. The row stays blocked until the callback releases it.");
  action.setRedirectURL(current);
})(current, action);
`

const INVOICE_AUDIT_SCRIPT = `(function runAgenticAudit(current, action) {
  if (String(current.current_status) !== "BLOCKED") {
    gs.addErrorMessage("The audit button is available only while this invoice row is BLOCKED.");
    return;
  }
  var correlationId = String(gs.generateGUID());
  current.correlation_id = correlationId;
  current.current_status = "PROCESSING";
  current.update();
  var audit = new GlideRecord("x_ent_erp_ovl_audit_events");
  audit.initialize();
  audit.setValue("process", "invoice");
  audit.setValue("order_id", String(current.order_id || ""));
  audit.setValue("source_table", current.getTableName());
  audit.setValue("source_sys_id", current.getUniqueValue());
  audit.setValue("event", "BUTTON");
  audit.setValue("correlation_id", correlationId);
  audit.setValue("decision", "QUEUED");
  audit.setValue("note", "A person queued the invoice audit. The model only advises. The callback is the only release.");
  audit.insert();
  gs.addInfoMessage("invoice audit queued. The row stays blocked until the callback releases it.");
  action.setRedirectURL(current);
})(current, action);
`

const CASH_AUDIT_SCRIPT = `(function runAgenticAudit(current, action) {
  if (String(current.current_status) !== "BLOCKED") {
    gs.addErrorMessage("The audit button is available only while this cash row is BLOCKED.");
    return;
  }
  var correlationId = String(gs.generateGUID());
  current.correlation_id = correlationId;
  current.current_status = "PROCESSING";
  current.update();
  var audit = new GlideRecord("x_ent_erp_ovl_audit_events");
  audit.initialize();
  audit.setValue("process", "cash");
  audit.setValue("order_id", String(current.order_id || ""));
  audit.setValue("source_table", current.getTableName());
  audit.setValue("source_sys_id", current.getUniqueValue());
  audit.setValue("event", "BUTTON");
  audit.setValue("correlation_id", correlationId);
  audit.setValue("decision", "QUEUED");
  audit.setValue("note", "A person queued the cash audit. The model only advises. The callback is the only release.");
  audit.insert();
  gs.addInfoMessage("cash audit queued. The row stays blocked until the callback releases it.");
  action.setRedirectURL(current);
})(current, action);
`

const overlayLists = UxListMenuConfig({
  $id: Now.ID["list_menu_credit_exceptions"],
  name: "ERP Overlay Lists",
  description: "Workspace lists for each order-to-cash stage and the audit event trail.",
  active: true,
  categories: [
    {
      $id: Now.ID["list_category_credit"],
      title: "Credit",
      order: 10,
      active: true,
      lists: [
        {
          $id: Now.ID["list_credit_exceptions"],
          title: "Credit Exceptions",
          order: 10,
          active: true,
          table: "x_ent_erp_ovl_credit_exceptions",
          columns: STAGE_COLUMNS,
          condition: "",
        },
      ],
    },
    {
      $id: Now.ID["list_category_order"],
      title: "Order",
      order: 20,
      active: true,
      lists: [
        {
          $id: Now.ID["list_order_holds"],
          title: "Order Holds",
          order: 10,
          active: true,
          table: "x_ent_erp_ovl_order_holds",
          columns: STAGE_COLUMNS,
          condition: "",
        },
      ],
    },
    {
      $id: Now.ID["list_category_fulfillment"],
      title: "Fulfillment",
      order: 30,
      active: true,
      lists: [
        {
          $id: Now.ID["list_fulfillment_holds"],
          title: "Fulfillment Holds",
          order: 10,
          active: true,
          table: "x_ent_erp_ovl_fulfillment_holds",
          columns: STAGE_COLUMNS,
          condition: "",
        },
      ],
    },
    {
      $id: Now.ID["list_category_invoice"],
      title: "Invoice",
      order: 40,
      active: true,
      lists: [
        {
          $id: Now.ID["list_invoice_holds"],
          title: "Invoice Holds",
          order: 10,
          active: true,
          table: "x_ent_erp_ovl_invoice_holds",
          columns: STAGE_COLUMNS,
          condition: "",
        },
      ],
    },
    {
      $id: Now.ID["list_category_cash"],
      title: "Cash",
      order: 50,
      active: true,
      lists: [
        {
          $id: Now.ID["list_cash_applications"],
          title: "Cash Applications",
          order: 10,
          active: true,
          table: "x_ent_erp_ovl_cash_applications",
          columns: STAGE_COLUMNS,
          condition: "",
        },
      ],
    },
    {
      $id: Now.ID["list_category_audit"],
      title: "Audit",
      order: 60,
      active: true,
      lists: [
        {
          $id: Now.ID["list_audit_events"],
          title: "Audit Events",
          order: 10,
          active: true,
          table: "x_ent_erp_ovl_audit_events",
          columns: AUDIT_COLUMNS,
          condition: "",
        },
      ],
    },
  ],
})

Workspace({
  $id: Now.ID["workspace_erp_overlay"],
  title: "Agentic ERP Overlay",
  path: "erp_overlay",
  active: true,
  order: 100,
  tables: [
    "x_ent_erp_ovl_credit_exceptions",
    "x_ent_erp_ovl_order_holds",
    "x_ent_erp_ovl_fulfillment_holds",
    "x_ent_erp_ovl_invoice_holds",
    "x_ent_erp_ovl_cash_applications",
    "x_ent_erp_ovl_audit_events",
  ],
  listConfig: overlayLists,
})

List({
  table: "x_ent_erp_ovl_credit_exceptions",
  view: "Default",
  columns: [
    { element: "order_id", position: 0 },
    { element: "customer_id", position: 1 },
    { element: "amount", position: 2 },
    { element: "current_status", position: 3 },
    { element: "sys_updated_on", position: 4 },
  ],
})

List({
  table: "x_ent_erp_ovl_order_holds",
  view: "Default",
  columns: [
    { element: "order_id", position: 0 },
    { element: "customer_id", position: 1 },
    { element: "amount", position: 2 },
    { element: "current_status", position: 3 },
    { element: "sys_updated_on", position: 4 },
  ],
})

List({
  table: "x_ent_erp_ovl_fulfillment_holds",
  view: "Default",
  columns: [
    { element: "order_id", position: 0 },
    { element: "customer_id", position: 1 },
    { element: "amount", position: 2 },
    { element: "current_status", position: 3 },
    { element: "sys_updated_on", position: 4 },
  ],
})

List({
  table: "x_ent_erp_ovl_invoice_holds",
  view: "Default",
  columns: [
    { element: "order_id", position: 0 },
    { element: "customer_id", position: 1 },
    { element: "amount", position: 2 },
    { element: "current_status", position: 3 },
    { element: "sys_updated_on", position: 4 },
  ],
})

List({
  table: "x_ent_erp_ovl_cash_applications",
  view: "Default",
  columns: [
    { element: "order_id", position: 0 },
    { element: "customer_id", position: 1 },
    { element: "amount", position: 2 },
    { element: "current_status", position: 3 },
    { element: "sys_updated_on", position: 4 },
  ],
})

List({
  table: "x_ent_erp_ovl_audit_events",
  view: "Default",
  columns: [
    { element: "process", position: 0 },
    { element: "order_id", position: 1 },
    { element: "event", position: 2 },
    { element: "correlation_id", position: 3 },
    { element: "aws_request_id", position: 4 },
    { element: "http_status", position: 5 },
    { element: "decision", position: 6 },
    { element: "sys_created_on", position: 7 },
  ],
})

UiAction({
  $id: Now.ID["ui_action_run_agentic_audit"],
  table: "x_ent_erp_ovl_credit_exceptions",
  name: "Run Agentic Audit",
  actionName: "run_agentic_audit",
  active: true,
  order: 100,
  hint: "Queue the credit audit. The flow calls the model and does not release the row.",
  condition: "current.current_status == 'BLOCKED'",
  showInsert: false,
  showUpdate: true,
  showQuery: false,
  showMultipleUpdate: false,
  form: {
    showButton: true,
    showLink: false,
    showContextMenu: false,
    style: "primary",
  },
  list: {
    showButton: false,
    showLink: false,
    showContextMenu: false,
  },
  client: {
    isClient: false,
  },
  workspace: {
    isConfigurableWorkspace: true,
    showFormButtonV2: true,
    showFormMenuButtonV2: false,
  },
  script: CREDIT_AUDIT_SCRIPT,
})

UiAction({
  $id: Now.ID["ui_action_run_order_audit"],
  table: "x_ent_erp_ovl_order_holds",
  name: "Queue Order Audit",
  actionName: "run_order_audit",
  active: true,
  order: 100,
  hint: "Queue the order audit. The flow calls the model and does not release the row.",
  condition: "current.current_status == 'BLOCKED'",
  showInsert: false,
  showUpdate: true,
  showQuery: false,
  showMultipleUpdate: false,
  form: {
    showButton: true,
    showLink: false,
    showContextMenu: false,
    style: "primary",
  },
  list: {
    showButton: false,
    showLink: false,
    showContextMenu: false,
  },
  client: {
    isClient: false,
  },
  workspace: {
    isConfigurableWorkspace: true,
    showFormButtonV2: true,
    showFormMenuButtonV2: false,
  },
  script: ORDER_AUDIT_SCRIPT,
})

UiAction({
  $id: Now.ID["ui_action_run_fulfillment_audit"],
  table: "x_ent_erp_ovl_fulfillment_holds",
  name: "Queue Fulfillment Audit",
  actionName: "run_fulfillment_audit",
  active: true,
  order: 100,
  hint: "Queue the fulfillment audit. The flow calls the model and does not release the row.",
  condition: "current.current_status == 'BLOCKED'",
  showInsert: false,
  showUpdate: true,
  showQuery: false,
  showMultipleUpdate: false,
  form: {
    showButton: true,
    showLink: false,
    showContextMenu: false,
    style: "primary",
  },
  list: {
    showButton: false,
    showLink: false,
    showContextMenu: false,
  },
  client: {
    isClient: false,
  },
  workspace: {
    isConfigurableWorkspace: true,
    showFormButtonV2: true,
    showFormMenuButtonV2: false,
  },
  script: FULFILLMENT_AUDIT_SCRIPT,
})

UiAction({
  $id: Now.ID["ui_action_run_invoice_audit"],
  table: "x_ent_erp_ovl_invoice_holds",
  name: "Queue Invoice Audit",
  actionName: "run_invoice_audit",
  active: true,
  order: 100,
  hint: "Queue the invoice audit. The flow calls the model and does not release the row.",
  condition: "current.current_status == 'BLOCKED'",
  showInsert: false,
  showUpdate: true,
  showQuery: false,
  showMultipleUpdate: false,
  form: {
    showButton: true,
    showLink: false,
    showContextMenu: false,
    style: "primary",
  },
  list: {
    showButton: false,
    showLink: false,
    showContextMenu: false,
  },
  client: {
    isClient: false,
  },
  workspace: {
    isConfigurableWorkspace: true,
    showFormButtonV2: true,
    showFormMenuButtonV2: false,
  },
  script: INVOICE_AUDIT_SCRIPT,
})

UiAction({
  $id: Now.ID["ui_action_run_cash_audit"],
  table: "x_ent_erp_ovl_cash_applications",
  name: "Queue Cash Audit",
  actionName: "run_cash_audit",
  active: true,
  order: 100,
  hint: "Queue the cash audit. The flow calls the model and does not release the row.",
  condition: "current.current_status == 'BLOCKED'",
  showInsert: false,
  showUpdate: true,
  showQuery: false,
  showMultipleUpdate: false,
  form: {
    showButton: true,
    showLink: false,
    showContextMenu: false,
    style: "primary",
  },
  list: {
    showButton: false,
    showLink: false,
    showContextMenu: false,
  },
  client: {
    isClient: false,
  },
  workspace: {
    isConfigurableWorkspace: true,
    showFormButtonV2: true,
    showFormMenuButtonV2: false,
  },
  script: CASH_AUDIT_SCRIPT,
})
