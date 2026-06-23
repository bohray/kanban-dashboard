import { Label } from "../lib/types";

// The four priority labels every board ships with. Single source of truth for
// both the default board state (boardSlice) and the "only one priority active
// at a time" rule in the label picker (handleLabelChange) — keep new built-ins
// here so those two stay in sync.
export const BUILT_IN_LABELS: Label[] = [
  { title: "Low", class: "bg-yellow-500/40", activeClass: "bg-yellow-500" },
  { title: "Medium", class: "bg-orange-600/40", activeClass: "bg-orange-600" },
  { title: "High", class: "bg-red-500/40", activeClass: "bg-red-500" },
  { title: "Critical", class: "bg-red-700/40", activeClass: "bg-red-700" },
];

export const BUILT_IN_LABEL_TITLES = BUILT_IN_LABELS.map((l) => l.title);
