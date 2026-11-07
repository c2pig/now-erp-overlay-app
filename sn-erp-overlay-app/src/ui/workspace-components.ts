// Next Experience workspace list / data grid -> Workspace(), UxListMenuConfig(), and List().
// This SDK has no DataGrid() symbol. The workspace list menu is the configurable list bound to
// x_ent_erp_ovl_credit_exceptions, and List() is the sys_ui_list column layout for that table.
// "updated" is the platform column sys_updated_on (label Updated).
// "Run Agentic Audit" -> UiAction(). It is a form and workspace button, shown only while
// current_status is BLOCKED, and its server script sets current_status to PROCESSING.

import { List, UiAction, UxListMenuConfig, Workspace } from "@servicenow/sdk/core"

const CREDIT_EXCEPTIONS = "x_ent_erp_ovl_credit_exceptions"
const LIST_COLUMNS = "order_id,customer_id,amount,current_status,sys_updated_on"

const creditExceptionLists = UxListMenuConfig({
  $id: Now.ID["list_menu_credit_exceptions"],
  name: "Credit Exception Lists",
  description: "Workspace lists bound to credit exceptions.",
  active: true,
  categories: [
    {
      $id: Now.ID["list_category_credit"],
      title: "Credit Exceptions",
      order: 10,
      active: true,
      lists: [
        {
          $id: Now.ID["list_credit_exceptions"],
          title: "Credit Exceptions",
          order: 10,
          active: true,
          table: CREDIT_EXCEPTIONS,
          columns: LIST_COLUMNS,
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
  tables: [CREDIT_EXCEPTIONS],
  listConfig: creditExceptionLists,
})

List({
  table: CREDIT_EXCEPTIONS,
  view: "Default",
  columns: [
    { element: "order_id", position: 0 },
    { element: "customer_id", position: 1 },
    { element: "amount", position: 2 },
    { element: "current_status", position: 3 },
    { element: "sys_updated_on", position: 4 },
  ],
})

const RUN_AGENTIC_AUDIT_SCRIPT = `(function runAgenticAudit(current, action) {
  if (String(current.current_status) !== "BLOCKED") {
    gs.addErrorMessage("Run Agentic Audit is available only while the credit exception is BLOCKED.");
    return;
  }
  current.current_status = "PROCESSING";
  current.update();
  gs.addInfoMessage("Agentic audit started. The credit exception stays blocked until the callback releases it.");
  action.setRedirectURL(current);
})(current, action);
`

UiAction({
  $id: Now.ID["ui_action_run_agentic_audit"],
  table: CREDIT_EXCEPTIONS,
  name: "Run Agentic Audit",
  actionName: "run_agentic_audit",
  active: true,
  order: 100,
  hint: "Set this credit exception to PROCESSING so the audit flow runs.",
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
  script: RUN_AGENTIC_AUDIT_SCRIPT,
})
