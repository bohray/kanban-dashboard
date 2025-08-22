const builtInLabels = ["Low", "Medium", "High", "Critical"];

export default function handleLabelChange(
  current: string[],
  selected: string
): string[] {
  const isBuiltIn = builtInLabels.includes(selected);
  const isActive = current.includes(selected);

  if (isBuiltIn) {
    if (isActive) {
      // Allow deselecting built-in labels
      return current.filter((v) => v !== selected);
    } else {
      // Only one built-in label allowed at a time
      return [...current.filter((v) => !builtInLabels.includes(v)), selected];
    }
  } else {
    // Toggle custom labels freely
    return isActive
      ? current.filter((v) => v !== selected)
      : [...current, selected];
  }
}
