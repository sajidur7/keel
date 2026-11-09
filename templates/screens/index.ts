/* Every screen, in gallery order. Each entry renders a full page built only from @keel/components. */
import type { ReactNode } from "react";
import { dashboardScreens } from "./dashboards";
import { detailScreens } from "./details";
import { entryScreens } from "./entry";
import { listScreens } from "./lists";
import { moreScreens } from "./more";
import { settingsScreens } from "./settings";
import { workScreens } from "./work";

export type Screen = { id: string; title: string; category: string; render: () => ReactNode };
export { GoProvider } from "./kit";

const order = ["Dashboards", "CRM", "Records", "Work", "Finance", "Commerce", "Support", "Marketing", "People ops", "Operations", "Developers", "Security", "Settings", "Billing", "AI", "Auth", "Onboarding", "System"];
export const screens: Screen[] = [...dashboardScreens, ...listScreens, ...detailScreens, ...workScreens, ...settingsScreens, ...moreScreens, ...entryScreens]
  .sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category));
export const screenCategories = order.filter((c) => screens.some((s) => s.category === c));
export const screenById = new Map(screens.map((s) => [s.id, s]));
