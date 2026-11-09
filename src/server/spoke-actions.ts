// Integration Hub script step -> Action() plus wfa.actionStep(actionStep.script).
// actionStep.script is the platform Script step (instance runtime), not a Node action.
// The script below is the complete on-platform program. It does not call the runtime during build.
// SHA-256 of strings uses GlideDigest.getSHA256Hex when that platform class is present.
// HMAC-SHA256 is implemented in this script. CertificateEncryption.generateMac accepts a Java
// string key and returns Base64, so it cannot carry the raw kDate/kRegion/kService/kSigning bytes.
// node:crypto is not used: the script step executes in the instance Rhino runtime, not in Node.
// Outputs status_code, body, error, timed_out, correlation_id, and aws_request_id are declared
// on the action and on the step. aws_request_id is the x-amzn-requestid response header.
// Access key, secret key, and Authorization are never written to the log.

import { Action, FlowObject, actionStep, wfa } from "@servicenow/sdk/automation"
import { BooleanColumn, GenericColumn, IntegerColumn, StringColumn } from "@servicenow/sdk/core"

const INVOKE_BEDROCK_SCRIPT = `(function execute(inputs, outputs) {
  var statusCode = 0;
  var bodyText = "";
  var errorText = "";
  var timedOut = false;
  var processName = String(inputs.process || "credit");
  var correlationId = String(inputs.correlation_id || "");
  var awsRequestId = "";
  if (processName !== "credit" && processName !== "order" && processName !== "fulfillment" && processName !== "invoice" && processName !== "cash") {
    processName = "credit";
  }
  if (!correlationId) {
    correlationId = String(gs.generateGUID());
  }

  function oneLine(value) {
    return String(value == null ? "" : value).replace(/[\\r\\n]/g, " ");
  }

  function finish() {
    if (bodyText.length > 8000) {
      bodyText = bodyText.substring(0, 8000);
    }
    if (errorText.length > 4000) {
      errorText = errorText.substring(0, 4000);
    }
    if (awsRequestId.length > 100) {
      awsRequestId = awsRequestId.substring(0, 100);
    }
    outputs.status_code = statusCode;
    outputs.body = bodyText;
    outputs.error = errorText;
    outputs.timed_out = timedOut;
    outputs.correlation_id = correlationId;
    outputs.aws_request_id = awsRequestId;
    gs.info(
      "bedrock_invoke process=" + oneLine(processName) +
      " order_id=" + oneLine(inputs.order_id) +
      " correlation_id=" + oneLine(correlationId) +
      " aws_request_id=" + oneLine(awsRequestId) +
      " http_status=" + statusCode +
      " timed_out=" + (timedOut ? "true" : "false")
    );
  }

  function utf8Bytes(value) {
    var text = String(value);
    var bytes = [];
    var index = 0;
    while (index < text.length) {
      var code = text.charCodeAt(index);
      if (code >= 0xd800 && code <= 0xdbff && index + 1 < text.length) {
        var next = text.charCodeAt(index + 1);
        if (next >= 0xdc00 && next <= 0xdfff) {
          code = 0x10000 + ((code & 0x3ff) << 10) + (next & 0x3ff);
          index = index + 1;
        }
      }
      if (code < 0x80) {
        bytes.push(code);
      } else if (code < 0x800) {
        bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
      } else if (code < 0x10000) {
        bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
      } else {
        bytes.push(0xf0 | (code >> 18), 0x80 | ((code >> 12) & 0x3f), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
      }
      index = index + 1;
    }
    return bytes;
  }

  function bytesToHex(bytes) {
    var hex = "";
    var index = 0;
    while (index < bytes.length) {
      var current = bytes[index] & 0xff;
      if (current < 16) {
        hex += "0";
      }
      hex += current.toString(16);
      index = index + 1;
    }
    return hex;
  }

  function rotr(word, bits) {
    return ((word >>> bits) | (word << (32 - bits))) >>> 0;
  }

  function sha256Bytes(messageBytes) {
    var bytes = messageBytes.slice();
    var bitLength = bytes.length * 8;
    bytes.push(0x80);
    while ((bytes.length % 64) !== 56) {
      bytes.push(0);
    }
    var high = Math.floor(bitLength / 4294967296);
    var low = bitLength - (high * 4294967296);
    bytes.push((high >>> 24) & 0xff, (high >>> 16) & 0xff, (high >>> 8) & 0xff, high & 0xff);
    bytes.push((low >>> 24) & 0xff, (low >>> 16) & 0xff, (low >>> 8) & 0xff, low & 0xff);

    var k = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];
    var h0 = 0x6a09e667;
    var h1 = 0xbb67ae85;
    var h2 = 0x3c6ef372;
    var h3 = 0xa54ff53a;
    var h4 = 0x510e527f;
    var h5 = 0x9b05688c;
    var h6 = 0x1f83d9ab;
    var h7 = 0x5be0cd19;

    var offset = 0;
    while (offset < bytes.length) {
      var w = [];
      var i = 0;
      while (i < 16) {
        var start = offset + (i * 4);
        w[i] = (((bytes[start] << 24) | (bytes[start + 1] << 16) | (bytes[start + 2] << 8) | bytes[start + 3]) >>> 0);
        i = i + 1;
      }
      i = 16;
      while (i < 64) {
        var s0 = (rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3)) >>> 0;
        var s1 = (rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10)) >>> 0;
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
        i = i + 1;
      }
      var a = h0;
      var b = h1;
      var c = h2;
      var d = h3;
      var e = h4;
      var f = h5;
      var g = h6;
      var h = h7;
      i = 0;
      while (i < 64) {
        var s1round = (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) >>> 0;
        var ch = ((e & f) ^ (~e & g)) >>> 0;
        var temp1 = (h + s1round + ch + k[i] + w[i]) >>> 0;
        var s0round = (rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) >>> 0;
        var maj = ((a & b) ^ (a & c) ^ (b & c)) >>> 0;
        var temp2 = (s0round + maj) >>> 0;
        h = g;
        g = f;
        f = e;
        e = (d + temp1) >>> 0;
        d = c;
        c = b;
        b = a;
        a = (temp1 + temp2) >>> 0;
        i = i + 1;
      }
      h0 = (h0 + a) >>> 0;
      h1 = (h1 + b) >>> 0;
      h2 = (h2 + c) >>> 0;
      h3 = (h3 + d) >>> 0;
      h4 = (h4 + e) >>> 0;
      h5 = (h5 + f) >>> 0;
      h6 = (h6 + g) >>> 0;
      h7 = (h7 + h) >>> 0;
      offset = offset + 64;
    }
    var digest = [];
    var words = [h0, h1, h2, h3, h4, h5, h6, h7];
    i = 0;
    while (i < words.length) {
      var word = words[i];
      digest.push((word >>> 24) & 0xff, (word >>> 16) & 0xff, (word >>> 8) & 0xff, word & 0xff);
      i = i + 1;
    }
    return digest;
  }

  function sha256HexPure(value) {
    return bytesToHex(sha256Bytes(utf8Bytes(value)));
  }

  function sha256HexOfString(value) {
    var pure = sha256HexPure(value);
    if (typeof GlideDigest !== "undefined") {
      try {
        var digest = new GlideDigest();
        if (digest && typeof digest.getSHA256Hex === "function") {
          var platformHex = String(digest.getSHA256Hex(value) || "").toLowerCase();
          if (/^[0-9a-f]{64}$/.test(platformHex)) {
            return platformHex;
          }
        }
      } catch (ignored) {
        return pure;
      }
    }
    return pure;
  }

  function hmacSha256(keyBytes, messageBytes) {
    var block = 64;
    var key = keyBytes.slice();
    if (key.length > block) {
      key = sha256Bytes(key);
    }
    while (key.length < block) {
      key.push(0);
    }
    var outer = [];
    var inner = [];
    var index = 0;
    while (index < block) {
      outer.push(key[index] ^ 0x5c);
      inner.push(key[index] ^ 0x36);
      index = index + 1;
    }
    var innerHash = sha256Bytes(inner.concat(messageBytes));
    return sha256Bytes(outer.concat(innerHash));
  }

  function awsEncode(value) {
    return encodeURIComponent(String(value)).replace(/[!'()*]/g, function (character) {
      return "%" + character.charCodeAt(0).toString(16).toUpperCase();
    });
  }

  function canonicalizePath(path) {
    var parts = String(path).split("/");
    var encoded = [];
    var index = 0;
    while (index < parts.length) {
      var segment = parts[index];
      try {
        segment = decodeURIComponent(segment);
      } catch (ignored) {
        segment = parts[index];
      }
      encoded.push(awsEncode(segment));
      index = index + 1;
    }
    return encoded.join("/");
  }

  function canonicalQuery(pairs) {
    var items = [];
    var index = 0;
    while (index < pairs.length) {
      items.push(awsEncode(pairs[index].name) + "=" + awsEncode(pairs[index].value));
      index = index + 1;
    }
    items.sort();
    return items.join("&");
  }

  function canonicalHeaderValue(value) {
    return String(value).replace(/^[ \\t]+|[ \\t]+$/g, "").replace(/[ \\t]+/g, " ");
  }

  function parseEndpoint(endpoint) {
    var match = String(endpoint).match(/^(https?):\\/\\/([^\\/?#]+)([^?#]*)/i);
    if (!match) {
      return null;
    }
    return {
      scheme: String(match[1]).toLowerCase(),
      host: String(match[2]).toLowerCase(),
      path: match[3] ? String(match[3]) : ""
    };
  }

  function resolveInvokePath(endpointPath, modelId) {
    var raw = endpointPath || "";
    if (raw.length > 1 && /\\/invoke$/i.test(raw)) {
      return canonicalizePath(raw);
    }
    var prefix = raw;
    if (prefix === "/") {
      prefix = "";
    }
    if (prefix.length > 1 && prefix.charAt(prefix.length - 1) === "/") {
      prefix = prefix.substring(0, prefix.length - 1);
    }
    return canonicalizePath(prefix + "/model/" + modelId + "/invoke");
  }

  function pad(number) {
    return number < 10 ? "0" + number : String(number);
  }

  try {
    var endpoint = String(gs.getProperty("x_ent_erp_ovl.aws_bedrock_endpoint") || "");
    var accessKey = String(gs.getProperty("x_ent_erp_ovl.aws_access_key") || "");
    var secretKey = String(gs.getProperty("x_ent_erp_ovl.aws_secret_key") || "");
    var region = String(gs.getProperty("x_ent_erp_ovl.aws_region") || "us-east-1");
    var modelId = String(gs.getProperty("x_ent_erp_ovl.aws_model_id") || "");
    if (!endpoint || !accessKey || !secretKey || !region || !modelId) {
      errorText = "Bedrock runtime properties are incomplete. Set the endpoint, access key, secret key, region, and model id.";
      finish();
      return;
    }
    var parsed = parseEndpoint(endpoint);
    if (!parsed) {
      errorText = "aws_bedrock_endpoint must be an absolute http or https URL.";
      finish();
      return;
    }

    var customerMetrics = {
      exposure: inputs.exposure,
      limit_amount: inputs.limit_amount,
      risk_tier: inputs.risk_tier,
      past_due: inputs.past_due
    };
    var stageQuestion = {
      credit: "recommend APPROVED or DENIED for this credit block",
      order: "recommend accept or hold for this order",
      fulfillment: "recommend release or hold for pick and ship",
      invoice: "recommend release or hold for billing",
      cash: "recommend apply, short-pay, or hold for this payment"
    };
    var prompt = "Review this " + processName + " stage and " + stageQuestion[processName] + " with a short justification. "
      + "This call only advises. It does not release the stage. "
      + "process=" + processName
      + " correlation_id=" + correlationId
      + " order_id=" + String(inputs.order_id || "")
      + " customer_id=" + String(inputs.customer_id || "")
      + " amount=" + String(inputs.amount || "")
      + " customer_metrics=" + JSON.stringify(customerMetrics);
    var payload = JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    var now = new Date();
    var dateStamp = String(now.getUTCFullYear()) + pad(now.getUTCMonth() + 1) + pad(now.getUTCDate());
    var amzDate = dateStamp + "T" + pad(now.getUTCHours()) + pad(now.getUTCMinutes()) + pad(now.getUTCSeconds()) + "Z";
    var canonicalUri = resolveInvokePath(parsed.path, modelId);
    var canonicalQueryString = canonicalQuery([]);
    var payloadHash = sha256HexOfString(payload);
    var contentType = "application/json";
    var headerLines = [
      ["content-type", canonicalHeaderValue(contentType)],
      ["host", canonicalHeaderValue(parsed.host)],
      ["x-amz-content-sha256", canonicalHeaderValue(payloadHash)],
      ["x-amz-date", canonicalHeaderValue(amzDate)]
    ];
    headerLines.sort(function (left, right) {
      if (left[0] < right[0]) return -1;
      if (left[0] > right[0]) return 1;
      return 0;
    });
    var canonicalHeaders = "";
    var signedNames = [];
    var headerIndex = 0;
    while (headerIndex < headerLines.length) {
      canonicalHeaders += headerLines[headerIndex][0] + ":" + headerLines[headerIndex][1] + "\\n";
      signedNames.push(headerLines[headerIndex][0]);
      headerIndex = headerIndex + 1;
    }
    var signedHeaders = signedNames.join(";");
    var canonicalRequest = "POST\\n" + canonicalUri + "\\n" + canonicalQueryString + "\\n" + canonicalHeaders + "\\n" + signedHeaders + "\\n" + payloadHash;
    var credentialScope = dateStamp + "/" + region + "/bedrock/aws4_request";
    var stringToSign = "AWS4-HMAC-SHA256\\n" + amzDate + "\\n" + credentialScope + "\\n" + sha256HexOfString(canonicalRequest);
    var kDate = hmacSha256(utf8Bytes("AWS4" + secretKey), utf8Bytes(dateStamp));
    var kRegion = hmacSha256(kDate, utf8Bytes(region));
    var kService = hmacSha256(kRegion, utf8Bytes("bedrock"));
    var kSigning = hmacSha256(kService, utf8Bytes("aws4_request"));
    var signature = bytesToHex(hmacSha256(kSigning, utf8Bytes(stringToSign)));
    var authorization = "AWS4-HMAC-SHA256 Credential=" + accessKey + "/" + credentialScope
      + ", SignedHeaders=" + signedHeaders
      + ", Signature=" + signature;

    var url = parsed.scheme + "://" + parsed.host + canonicalUri;
    var outbound = new sn_ws.RESTMessageV2();
    outbound.setEndpoint(url);
    outbound.setHttpMethod("POST");
    outbound.setRequestHeader("Content-Type", contentType);
    outbound.setRequestHeader("Host", parsed.host);
    outbound.setRequestHeader("X-Amz-Date", amzDate);
    outbound.setRequestHeader("X-Amz-Content-Sha256", payloadHash);
    outbound.setRequestHeader("Authorization", authorization);
    outbound.setRequestBody(payload);
    outbound.setHttpTimeout(120000);
    var httpResponse = outbound.execute();
    statusCode = Number(httpResponse.getStatusCode());
    bodyText = String(httpResponse.getBody() || "");
    if (typeof httpResponse.getHeader === "function") {
      awsRequestId = String(httpResponse.getHeader("x-amzn-requestid") || httpResponse.getHeader("X-Amzn-Requestid") || "");
    }
    if (typeof httpResponse.haveError === "function" && httpResponse.haveError()) {
      errorText = String(httpResponse.getErrorMessage() || "");
    }
    if (!statusCode) {
      statusCode = 0;
      timedOut = true;
      if (!errorText) {
        errorText = "The runtime call returned no HTTP status.";
      }
    }
  } catch (caught) {
    var caughtText = String(caught && caught.message ? caught.message : caught);
    timedOut = /timeout/i.test(caughtText) || statusCode === 0;
    errorText = caughtText;
    if (!statusCode) {
      statusCode = 0;
    }
  }
  finish();
})(inputs, outputs);
`

export const invokeBedrockCreditAudit = Action(
  {
    $id: Now.ID["action_invoke_bedrock"],
    name: "Invoke Bedrock Credit Audit",
    internalName: "invoke_bedrock_credit_audit",
    description: "Signs and sends a Bedrock InvokeModel request for one ERP stage. The model only advises. This action does not set RELEASED.",
    category: "credit_block",
    access: "public",
    inputs: {
      order_id: StringColumn({ label: "Order ID", maxLength: 40, mandatory: true }),
      customer_id: StringColumn({ label: "Customer ID", maxLength: 40, mandatory: true }),
      amount: GenericColumn({
        label: "Amount",
        columnType: "currency",
        maxLength: 40,
        mandatory: true,
      }),
      process: StringColumn({ label: "Process", maxLength: 40, mandatory: false }),
      correlation_id: StringColumn({ label: "Correlation ID", maxLength: 40, mandatory: false }),
      customer_metrics: FlowObject({
        label: "Customer Metrics",
        mandatory: false,
        fields: {
          exposure: GenericColumn({ label: "Exposure", columnType: "currency", maxLength: 40 }),
          limit_amount: GenericColumn({ label: "Limit Amount", columnType: "currency", maxLength: 40 }),
          risk_tier: StringColumn({ label: "Risk Tier", maxLength: 40 }),
          past_due: BooleanColumn({ label: "Past Due" }),
        },
      }),
    },
    outputs: {
      status_code: IntegerColumn({ label: "Status Code" }),
      body: StringColumn({ label: "Body", maxLength: 8000 }),
      error: StringColumn({ label: "Error", maxLength: 4000 }),
      timed_out: BooleanColumn({ label: "Timed Out" }),
      correlation_id: StringColumn({ label: "Correlation ID", maxLength: 40 }),
      aws_request_id: StringColumn({ label: "AWS Request ID", maxLength: 100 }),
    },
  },
  (params) => {
    const invoked = wfa.actionStep(
      actionStep.script,
      { $id: Now.ID["step_invoke_bedrock"], label: "Invoke model" },
      {
        required_run_time: "instance",
        script: INVOKE_BEDROCK_SCRIPT,
        errorHandlingType: "dont_stop_the_action",
        inputVariables: {
          order_id: { label: "Order ID", value: wfa.dataPill(params.inputs.order_id, "string") },
          customer_id: { label: "Customer ID", value: wfa.dataPill(params.inputs.customer_id, "string") },
          amount: { label: "Amount", value: wfa.dataPill(params.inputs.amount, "string") },
          exposure: {
            label: "Exposure",
            value: wfa.dataPill(params.inputs.customer_metrics.exposure, "string"),
          },
          limit_amount: {
            label: "Limit Amount",
            value: wfa.dataPill(params.inputs.customer_metrics.limit_amount, "string"),
          },
          risk_tier: {
            label: "Risk Tier",
            value: wfa.dataPill(params.inputs.customer_metrics.risk_tier, "string"),
          },
          past_due: {
            label: "Past Due",
            value: wfa.dataPill(params.inputs.customer_metrics.past_due, "boolean"),
          },
          process: { label: "Process", value: wfa.dataPill(params.inputs.process, "string") },
          correlation_id: {
            label: "Correlation ID",
            value: wfa.dataPill(params.inputs.correlation_id, "string"),
          },
        },
        outputVariables: {
          status_code: IntegerColumn({ label: "Status Code" }),
          body: StringColumn({ label: "Body", maxLength: 8000 }),
          error: StringColumn({ label: "Error", maxLength: 4000 }),
          timed_out: BooleanColumn({ label: "Timed Out" }),
          correlation_id: StringColumn({ label: "Correlation ID", maxLength: 40 }),
          aws_request_id: StringColumn({ label: "AWS Request ID", maxLength: 100 }),
        },
      },
    )
    wfa.assignActionOutputs(params.outputs, {
      status_code: wfa.dataPill(invoked.status_code, "integer"),
      body: wfa.dataPill(invoked.body, "string"),
      error: wfa.dataPill(invoked.error, "string"),
      timed_out: wfa.dataPill(invoked.timed_out, "boolean"),
      correlation_id: wfa.dataPill(invoked.correlation_id, "string"),
      aws_request_id: wfa.dataPill(invoked.aws_request_id, "string"),
    })
  },
)
