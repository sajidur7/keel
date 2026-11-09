// Generates docs-site/src/generated/api.json — every exported component's props, types, defaults and JSDoc,
// read straight from components/*.tsx with the TypeScript compiler. Run: npm run api
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript5";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "components");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".tsx")).map((f) => path.join(dir, f));
const program = ts.createProgram(files, {
  jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler,
  strict: true, skipLibCheck: true, baseUrl: root,
});
const checker = program.getTypeChecker();
const out = {};
const ours = (decl) => decl && path.resolve(decl.getSourceFile().fileName).startsWith(dir);
const doc = (sym) => ts.displayPartsToString(sym?.getDocumentationComment(checker) ?? []).trim();
const clean = (s) => s.replace(/import\("[^"]+"\)\./g, "").replace(/React\./g, "").replace(/\s+/g, " ").slice(0, 160);

function defaultsOf(node) {
  // function Foo({ a = 1, b = "x" }) / forwardRef(function Foo({ ... }, ref)) / const Foo = ({ ... }) =>
  const map = {};
  let fn = node;
  if (ts.isVariableDeclaration(node) && node.initializer) {
    fn = node.initializer;
    if (ts.isCallExpression(fn)) fn = fn.arguments[0];
  }
  const param = fn && fn.parameters?.[0];
  if (param && ts.isObjectBindingPattern(param.name)) {
    for (const el of param.name.elements) if (el.initializer) map[(el.propertyName ?? el.name).getText()] = el.initializer.getText().slice(0, 60);
  }
  return map;
}

for (const sf of program.getSourceFiles()) {
  if (!path.resolve(sf.fileName).startsWith(dir) || !sf.fileName.endsWith(".tsx")) continue;
  const mod = checker.getSymbolAtLocation(sf);
  if (!mod) continue;
  for (const exp of checker.getExportsOfModule(mod)) {
    const name = exp.getName();
    if (!/^[A-Z]/.test(name) || (/^Icon[A-Z]/.test(name) && name !== "IconButton" && name !== "IconSizeContext")) continue;
    const decl = exp.valueDeclaration;
    if (!decl || !ours(decl)) continue;
    const type = checker.getTypeOfSymbolAtLocation(exp, decl);
    const sig = type.getCallSignatures()[0];
    if (!sig) continue;
    const p0 = sig.getParameters()[0];
    const defaults = defaultsOf(decl);
    const props = [];
    if (p0) {
      const pt = checker.getTypeOfSymbolAtLocation(p0, decl);
      for (const prop of pt.getProperties()) {
        const pd = prop.valueDeclaration ?? prop.declarations?.[0];
        const own = pd && ours(pd);
        const keep = own || ["children", "className", "style", "disabled", "open", "onOpenChange", "value", "defaultValue", "onValueChange", "checked", "onCheckedChange", "placeholder", "type", "asChild"].includes(prop.getName());
        if (!keep) continue;
        const ty = checker.getTypeOfSymbolAtLocation(prop, decl);
        const members = ty.isUnion() ? ty.types : [ty];
        const literal = members.every((x) => x.flags & (ts.TypeFlags.StringLiteral | ts.TypeFlags.NumberLiteral | ts.TypeFlags.BooleanLiteral | ts.TypeFlags.Undefined | ts.TypeFlags.Null));
        let t;
        if (literal) t = [...new Set(members.filter((x) => !(x.flags & ts.TypeFlags.Undefined)).map((x) => { const s0 = checker.typeToString(x); return s0 === "true" || s0 === "false" ? "boolean" : s0; }))].join(" | ");
        else if (pd && pd.type && pd.getText().length < 400) t = pd.type.getText().replace(/\s+/g, " ");
        else t = checker.typeToString(ty, undefined, ts.TypeFormatFlags.NoTruncation).replace(/ \| undefined/g, "");
        props.push({ name: prop.getName(), type: clean(t), required: !(prop.flags & ts.SymbolFlags.Optional), default: defaults[prop.getName()], description: doc(prop) });
      }
    }
    const common = ["children", "disabled", "open", "onOpenChange", "value", "defaultValue", "onValueChange", "checked", "onCheckedChange", "placeholder", "type", "asChild"];
    const order = (p) => (p.required ? 0 : 1) + (common.includes(p.name) ? 1 : 0) + (["className", "style", "xstyle"].includes(p.name) ? 3 : 0);
    props.sort((a, b) => order(a) - order(b));
    out[name] = { file: path.basename(sf.fileName), description: doc(exp), props };
  }
}
const target = path.join(root, "docs-site/src/generated/api.json");
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, JSON.stringify(out, null, 1));
console.log(`api.json: ${Object.keys(out).length} components`);
