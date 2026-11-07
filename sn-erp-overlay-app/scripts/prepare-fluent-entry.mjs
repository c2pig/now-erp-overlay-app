import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

const copies = [
  ["src/app.fluent.ts", "src/app.now.ts"],
  ["src/server/api-routes.ts", "src/server/api-routes.now.ts"],
  ["src/server/spoke-actions.ts", "src/server/spoke-actions.now.ts"],
  ["src/server/workflow-flows.ts", "src/server/workflow-flows.now.ts"],
  ["src/ui/workspace-components.ts", "src/ui/workspace-components.now.ts"],
]

for (const [from, to] of copies) {
  const source = path.join(root, from)
  const target = path.join(root, to)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.copyFileSync(source, target)
}
