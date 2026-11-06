import type { ComponentType, ReactNode } from "react";

export type Prop = { name: string; type: string; default?: string; description: string };

export type DemoSpec = {
  /** Exact name of the exported demo function — used to pull its source into "Show code". */
  id: string;
  title: string;
  description?: ReactNode;
  render: ComponentType;
  /** Let the preview fill the width without centering (tables, layouts). */
  full?: boolean;
  /** Preview height for overlays (sheets, dialogs) that need room. */
  minHeight?: number;
  /** Demo file this demo lives in, when it isn't the page's `source`. */
  file?: string;
};

export type DocPage = {
  slug: string;
  title: string;
  group: string;
  section: "Foundations" | "Components" | "Patterns" | "Templates";
  summary: ReactNode;
  whenToUse?: string[];
  whenNot?: string[];
  demos?: DemoSpec[];
  api?: { title?: string; props: Prop[] }[];
  a11y?: string[];
  dos?: { do: string; dont: string }[];
  /** Free-form page body (foundations, patterns). Rendered after the summary. */
  body?: ComponentType;
  /** Source file of the demos, matched against import.meta.glob raw sources. */
  source?: string;
  keywords?: string[];
  /** Component names this page documents; used to find and show their source files. Defaults to the title without spaces. */
  components?: string[];
  /** Figma node id of the matching component set in the Keel library. */
  figma?: string;
};
