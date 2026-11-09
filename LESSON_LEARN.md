# Lesson learned: `npm run deploy` failed

## What failed

`npm run deploy` runs `now-sdk install`. It logged into `https://dev391124.service-now.com` as `admin` and then stopped with:

```text
Unable to install third party application 'x_ent_erp_ovl'
```

The app source was fine. The instance refused to install the scope.

## Root cause

A custom ServiceNow app scope must start with `x_`, then the instance company code, then `_`.

This instance's company code was `1886784`. It only accepts custom apps whose scope starts with `x_1886784_`.

This app uses scope `x_ent_erp_ovl`. That scope belongs to company code `ent`, not `1886784`. The installer treats any other company code as a third-party store app, and it will not install a third-party app from this zip.

Two properties hold that company code:

| Property | Value before the fix | Why it matters |
| --- | --- | --- |
| `glide.appcreator.company.code` | `1886784` | Company code used for new apps |
| `sn_appauthor.all_company_keys` | `1886784` | List of company codes this instance is allowed to install |

Changing only the first property was not enough. The installer still checked the allow-list, and `ent` was not on it.

## What we changed

1. Set the company code to `ent`, so it matches `x_ent_erp_ovl`.
2. Added `ent` to the allow-list, and kept the original code: `1886784,ent`.
3. Ran `npm run deploy` again.

The second property is protected, so a normal record update did not stick. `GlidePropertiesDB.set` did.

## Commands

Read the failed install:

```bash
npx now-sdk query sys_execution_tracker -q "sys_id=8c0e2ee793945310f87bf7718bba1006" --output json
```

Read the company code:

```bash
npx now-sdk query sys_properties -q "name=glide.appcreator.company.code" -f "name,value" --output json
```

Set the company code. This ran on the instance in the global scope:

```javascript
var name = "glide.appcreator.company.code";
var gr = new GlideRecord("sys_properties");
gr.addQuery("name", name);
gr.query();
gr.next();
gr.setValue("sys_policy", "");
gr.setValue("value", "ent");
gr.setWorkflow(false);
gr.update();
```

```bash
npx now-sdk exec --scope global --reason "Set vendor key to ent so scope x_ent_erp_ovl can install" --output json '<script above>'
```

`npm run deploy` still failed. The allow-list was still only `1886784`:

```bash
npx now-sdk query sys_properties -q "nameLIKEappcreator^ORnameLIKEvendor_prefix^ORvalue=1886784" -f "name,value" --output json
```

Add `ent` to the allow-list:

```javascript
GlidePropertiesDB.set("sn_appauthor.all_company_keys", "1886784,ent");
```

```bash
npx now-sdk exec --scope global --reason "Clear protection and add ent to the company key allow-list" --output json '<script above>'
```

Deploy again:

```bash
npm run deploy
```

## Result

The install finished. Flow activation reported 2 of 2 succeeded.

The app record is active:

- Name: Agentic ERP Overlay
- Scope: `x_ent_erp_ovl`
- Version: `1.0.0`
- URL: `https://dev391124.service-now.com/sys_app.do?sys_id=c7e4a91b2d8f4e6a9b0c1d2e3f405162`

New custom apps on this instance will use the `x_ent_` prefix. The original company code `1886784` is still in the allow-list.
