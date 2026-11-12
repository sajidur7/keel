// Writes skills/keel/references/components.md from docs-site/src/generated/api.json (run after gen-api).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const api = JSON.parse(fs.readFileSync(path.join(root, "docs-site/src/generated/api.json"), "utf8"));
const byFile = {};
for (const [name, e] of Object.entries(api)) (byFile[e.file] ??= []).push([name, e]);
const order = ["action", "chat", "ai", "container", "content", "feedback", "inputs", "choice", "select", "dates", "pickers", "layout", "navigation", "overlay", "table", "lists", "data", "charts", "utility", "spinner", "parts"];
const skip = new Set(["className", "style", "xstyle", "children", "asChild", "defaultValue", "value", "type"]);
let md = `# Keel components — full catalog\n\nGenerated from the TypeScript source (\`npm run api && node scripts/gen-skill-catalog.mjs\`). Import everything from \`@keel/components\` (components/index.ts).\nEvery component also accepts \`xstyle\` (StyleX styles), \`className\` and \`style\`. \`*\` = required.\n`;
for (const f of order) {
  const list = byFile[`${f}.tsx`]; if (!list) continue;
  md += `\n## ${f}.tsx\n`;
  for (const [name, e] of list.sort((a, b) => a[0].localeCompare(b[0]))) {
    const props = e.props.filter((p) => p.required || !skip.has(p.name)).slice(0, 14).map((p) => `\`${p.name}${p.required ? "*" : ""}\`${p.type.length < 150 ? `: ${p.type}` : ""}${p.default ? ` = ${p.default}` : ""}`);
    md += `\n- **${name}** — ${(e.description || "").split("\n")[0] || "—"}${props.length ? `\n  ${props.join(" · ")}` : ""}`;
  }
  md += "\n";
}
// Hooks: name + first JSDoc line, read straight from hooks.ts.
const hooksSrc = fs.readFileSync(path.join(root, "components/hooks.ts"), "utf8");
const hooks = [...hooksSrc.matchAll(/(?:\/\*\*\s*([^\n]*?)\s*\*\/\s*\n)?export (?:function|const) (use[A-Za-z]+)/g)].map((m) => [m[2], m[1] || ""]);
if (hooks.length) {
  md += `\n## hooks.ts\n\nHeadless behavior. Import from \`@keel/components\`.\n`;
  for (const [n, doc] of hooks.sort((a, b) => a[0].localeCompare(b[0]))) md += `\n- **${n}**${doc ? ` — ${doc}` : ""}`;
  md += "\n";
}
fs.writeFileSync(path.join(root, "skills/keel/references/components.md"), md);
console.log("components.md", md.length, "chars");
