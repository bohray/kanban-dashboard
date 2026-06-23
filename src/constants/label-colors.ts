// Preset palette for custom labels. Each color provides the faded (`class`)
// and solid (`activeClass`) Tailwind backgrounds used across the label UI.
export type LabelColor = {
  name: string;
  class: string;
  activeClass: string;
};

export const labelColors: LabelColor[] = [
  { name: "Gray", class: "bg-gray-400/40", activeClass: "bg-gray-400" },
  { name: "Yellow", class: "bg-yellow-500/40", activeClass: "bg-yellow-500" },
  { name: "Orange", class: "bg-orange-600/40", activeClass: "bg-orange-600" },
  { name: "Red", class: "bg-red-500/40", activeClass: "bg-red-500" },
  { name: "Pink", class: "bg-pink-500/40", activeClass: "bg-pink-500" },
  { name: "Purple", class: "bg-purple-500/40", activeClass: "bg-purple-500" },
  { name: "Blue", class: "bg-blue-500/40", activeClass: "bg-blue-500" },
  { name: "Green", class: "bg-green-500/40", activeClass: "bg-green-500" },
];
