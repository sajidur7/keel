import type { ComponentType, ReactNode } from "react";

export type Demo = {
  /** Exported function name in the demos file — its source is shown as the code. */
  id: string;
  title: string;
  description?: ReactNode;
  Comp: ComponentType;
  /** demos file key (e.g. "action") used to find the raw source. */
  file: string;
  /** Edge-to-edge preview with no padding (shells, full layouts). */
  bleed?: boolean;
  /** Preview height for full-screen things (app shell, chat layout). */
  height?: number;
};

export type DocPage = {
  slug: string;
  title: string;
  group: string;
  description: string;
  /** Exported component names documented on this page (API tables + import line). */
  components: string[];
  demos: Demo[];
  /** Short usage guidance bullets. */
  dos?: string[];
  donts?: string[];
  /** Badge in the nav ("New" for components added in v2). */
  badge?: string;
  /** Which demo the overview card previews (default 0). */
  previewDemo?: number;
  /** Guide pages render `render` instead of demos/API. */
  render?: ComponentType;
};
