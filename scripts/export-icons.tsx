// Renders every Keel icon to a standalone SVG in /figma/icons and a JSON map.
// Run: npx tsx scripts/export-icons.tsx
import { mkdirSync, writeFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { allIcons } from "../components/icons";

const dir = new URL("../figma/icons/", import.meta.url);
mkdirSync(dir, { recursive: true });
const map: Record<string, string> = {};
for (const [name, Icon] of Object.entries(allIcons)) {
  const svg = renderToStaticMarkup(<Icon size={16} />)
    .replace(' aria-hidden="true"', "")
    .replace(' focusable="false"', "")
    .replace(/ data-icon="[^"]*"/, "")
    .replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
  const key = name.replace(/^Icon/, "");
  map[key] = svg;
  writeFileSync(new URL(`${key}.svg`, dir), svg + "\n");
}
writeFileSync(new URL("icons.json", dir), JSON.stringify(map, null, 2) + "\n");
console.log(`Exported ${Object.keys(map).length} icons`);
