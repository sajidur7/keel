import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge needs to know Keel's custom font-size names so that
// `text-caption` and `text-subtle` (a color) are not treated as conflicts.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["eyebrow", "caption", "small", "body", "title", "page", "display", "stat"],
      shadow: ["raised", "raised-primary", "field", "card", "overlay", "focus"],
      radius: ["xs", "sm", "md", "lg", "xl", "full"],
    },
  },
});

/** Join class names and resolve Tailwind conflicts (last one wins). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
