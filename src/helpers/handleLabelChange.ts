import { BUILT_IN_LABEL_TITLES } from "../constants/built-in-labels";

export default function handleLabelChange(
  current: string[],
  selected: string
): string[] {
  const isBuiltIn = BUILT_IN_LABEL_TITLES.includes(selected);
  const isActive = current.includes(selected);

  if (isBuiltIn) {
    if (isActive) {
      // Allow deselecting built-in labels
      return current.filter((v) => v !== selected);
    } else {
      // Only one built-in label allowed at a time
      return [
        ...current.filter((v) => !BUILT_IN_LABEL_TITLES.includes(v)),
        selected,
      ];
    }
  } else {
    // Toggle custom labels freely
    return isActive
      ? current.filter((v) => v !== selected)
      : [...current, selected];
  }
}
