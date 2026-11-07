// Scripted REST API -> RestApi() (sys_ws_definition / sys_ws_operation).
// Requested path /api/x_ent_erp_ovl/v1/agent-callback is namespace x_ent_erp_ovl + serviceId v1 + path /agent-callback.
// A versions[] entry would insert another /v1 segment, so the version lives in serviceId.
// The route script is a string literal because this SDK rejects inline functions on script fields
// unless they are server modules. The handler below is the complete on-platform script.
// Canonical body fields are snake_case: order_id, decision, justification.
// The hyphenated alias order-id is accepted when order_id is absent. decision and justification stay snake_case.
// APPROVED -> current_status RELEASED. DENIED -> current_status BLOCKED. No other decision is written.
// Platform session auth stays on so the GlideRecord update runs as the calling user.
// The application check is the X-Agent-Callback-Token header against x_ent_erp_ovl.callback_token.

import { RestApi } from "@servicenow/sdk/core"

const AGENT_CALLBACK_SCRIPT = `(function process(request, response) {
  var TABLE = "x_ent_erp_ovl_credit_exceptions";
  var TOKEN_PROPERTY = "x_ent_erp_ovl.callback_token";
  var TOKEN_HEADER = "X-Agent-Callback-Token";

  function oneLine(value) {
    return String(value == null ? "" : value).replace(/[\\r\\n]/g, " ");
  }

  function writeJson(status, payload, log) {
    response.setStatus(status);
    if (response && typeof response.setHeader === "function") {
      response.setHeader("Content-Type", "application/json");
    }
    response.setBody(payload);
    gs.info(
      "order_id=" + oneLine(log.orderId) +
      " decision=" + oneLine(log.decision) +
      " sys_id=" + oneLine(log.sysId) +
      " http_status=" + String(status) +
      (log.multiple ? " multiple=true" : "")
    );
  }

  function constantTimeEquals(left, right) {
    var a = String(left);
    var b = String(right);
    var diff = a.length ^ b.length;
    var max = a.length > b.length ? a.length : b.length;
    var index = 0;
    while (index < max) {
      var leftCode = index < a.length ? a.charCodeAt(index) : 0;
      var rightCode = index < b.length ? b.charCodeAt(index) : 0;
      diff = diff | (leftCode ^ rightCode);
      index = index + 1;
    }
    return diff === 0;
  }

  function headerValue(name) {
    var value = "";
    if (request && typeof request.getHeader === "function") {
      value = request.getHeader(name);
    }
    if (!value && request && request.headers) {
      value = request.headers[name] || request.headers[name.toLowerCase()] || "";
    }
    return value == null ? "" : String(value);
  }

  function readBody() {
    var raw = "";
    if (request && request.body && typeof request.body.dataString === "string") {
      raw = request.body.dataString;
    } else if (request && typeof request.body === "string") {
      raw = request.body;
    }
    if (!raw) {
      return { ok: false, error: "Request body is required." };
    }
    try {
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || Object.prototype.toString.call(parsed) !== "[object Object]") {
        return { ok: false, error: "Request body must be a JSON object." };
      }
      return { ok: true, value: parsed };
    } catch (parseError) {
      return { ok: false, error: "Request body is not valid JSON." };
    }
  }

  var expectedToken = gs.getProperty(TOKEN_PROPERTY);
  var presentedToken = headerValue(TOKEN_HEADER);
  if (!expectedToken || !presentedToken || !constantTimeEquals(presentedToken, expectedToken)) {
    writeJson(401, { error: "unauthorized" }, { orderId: "", decision: "", sysId: "", multiple: false });
    return;
  }

  var bodyResult = readBody();
  if (!bodyResult.ok) {
    writeJson(400, { error: "invalid_request", message: bodyResult.error }, { orderId: "", decision: "", sysId: "", multiple: false });
    return;
  }
  var body = bodyResult.value;

  var orderId = "";
  if (typeof body.order_id === "string") {
    orderId = body.order_id;
  } else if (typeof body["order-id"] === "string") {
    orderId = body["order-id"];
  }
  var decision = typeof body.decision === "string" ? body.decision : "";
  var justification = typeof body.justification === "string" ? body.justification : "";

  if (!orderId || orderId.length > 40) {
    writeJson(400, {
      error: "invalid_request",
      message: "order_id is required and must be a string of at most 40 characters. The alias order-id is accepted when order_id is absent."
    }, { orderId: oneLine(orderId), decision: "", sysId: "", multiple: false });
    return;
  }
  if (decision !== "APPROVED" && decision !== "DENIED") {
    writeJson(400, {
      error: "invalid_request",
      message: "decision must be APPROVED or DENIED."
    }, { orderId: orderId, decision: "", sysId: "", multiple: false });
    return;
  }
  if (!justification || justification.length > 4000) {
    writeJson(400, {
      error: "invalid_request",
      message: "justification is required and must be a string of at most 4000 characters."
    }, { orderId: orderId, decision: decision, sysId: "", multiple: false });
    return;
  }

  var nextStatus = decision === "APPROVED" ? "RELEASED" : "BLOCKED";
  var gr = new GlideRecord(TABLE);
  gr.addQuery("order_id", orderId);
  gr.orderByDesc("sys_updated_on");
  gr.query();
  if (!gr.next()) {
    writeJson(404, { error: "not_found", order_id: orderId }, { orderId: orderId, decision: decision, sysId: "", multiple: false });
    return;
  }
  var multiple = gr.hasNext();
  var sysId = String(gr.getUniqueValue());
  gr.setValue("current_status", nextStatus);
  gr.setValue("ai_justification", justification);
  var updated = gr.update();
  if (!updated) {
    writeJson(500, { error: "update_failed", order_id: orderId, sys_id: sysId }, {
      orderId: orderId,
      decision: decision,
      sysId: sysId,
      multiple: multiple
    });
    return;
  }
  writeJson(200, {
    order_id: orderId,
    decision: decision,
    sys_id: sysId,
    current_status: nextStatus,
    multiple: multiple
  }, { orderId: orderId, decision: decision, sysId: sysId, multiple: multiple });
})(request, response);
`

RestApi({
  $id: Now.ID["api_agent_callback"],
  name: "Agent Callback",
  serviceId: "v1",
  namespace: "x_ent_erp_ovl",
  shortDescription: "Applies an APPROVED or DENIED credit decision. Canonical JSON keys are order_id, decision, and justification. order-id is accepted as an alias of order_id.",
  consumes: "application/json",
  produces: "application/json",
  active: true,
  routes: [
    {
      $id: Now.ID["route_agent_callback"],
      name: "agent-callback",
      method: "POST",
      path: "/agent-callback",
      active: true,
      authentication: true,
      authorization: false,
      internalRole: false,
      consumes: "application/json",
      produces: "application/json",
      shortDescription: "POST JSON { order_id | order-id, decision: APPROVED | DENIED, justification }. Requires header X-Agent-Callback-Token.",
      requestExample: '{"order_id":"SO-1001","decision":"APPROVED","justification":"Exposure is inside the limit."}',
      headers: [
        {
          $id: Now.ID["header_agent_callback_token"],
          name: "X-Agent-Callback-Token",
          required: true,
          exampleValue: "set-the-callback-token-property",
          shortDescription: "Shared secret compared in constant time with system property x_ent_erp_ovl.callback_token.",
        },
      ],
      script: AGENT_CALLBACK_SCRIPT,
    },
  ],
})
