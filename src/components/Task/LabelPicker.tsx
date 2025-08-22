"use client";

import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import handleLabelChange from "@/helpers/handleLabelChange";

export default function LabelPicker({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const labels = useSelector((s: RootState) => s.board.labels);

  return (
    <div className="flex flex-wrap gap-2">
      {labels.map((l) => {
        const active = value.includes(l.title);

        const labelClass = active
          ? l.activeClass ?? "bg-gray-700 text-white"
          : l.class ?? "bg-gray-500 text-black";

        return (
          <button
            key={l.title}
            type="button"
            className={`px-3 py-1 text-sm rounded-full cursor-pointer text-white ${labelClass}`}
            onClick={() => onChange(handleLabelChange(value, l.title))}
          >
            {l.title}
          </button>
        );
      })}
    </div>
  );
}
