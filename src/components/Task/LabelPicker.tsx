"use client";

import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import handleLabelChange from "@/helpers/handleLabelChange";
import { cn } from "../../lib/utils";
import { Label } from "../../lib/types";
import { Check, Pencil, X } from "lucide-react";

export default function LabelPicker({
  value,
  onChange,
  onEdit,
  onRemove,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  onEdit: (label: Label) => void;
  onRemove: (label: Label) => void;
}) {
  const labels = useSelector((s: RootState) => s.board.labels);

  if (labels.length === 0) {
    return (
      <p className="mt-1 text-xs text-gray-400">No labels yet — add one below.</p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {labels.map((l) => {
        const active = value.includes(l.title);

        return (
          <div
            key={l.title}
            className={cn(
              "group relative inline-flex items-center overflow-hidden rounded-full text-sm font-medium transition",
              active
                ? cn(l.activeClass ?? "bg-gray-700", "text-white")
                : "border border-gray-300 bg-white text-gray-600"
            )}
          >
            <button
              type="button"
              aria-pressed={active}
              onClick={() => onChange(handleLabelChange(value, l.title))}
              className="inline-flex cursor-pointer items-center gap-1.5 px-3 py-1"
            >
              {active ? (
                <Check size={12} strokeWidth={3} aria-hidden="true" />
              ) : (
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    l.activeClass ?? "bg-gray-400"
                  )}
                />
              )}
              {l.title}
            </button>

            {/* Hover overlay: backdrop click still toggles (passes through);
                only the icon buttons edit/delete. */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 bg-black/55 opacity-0 transition group-hover:opacity-100">
              <button
                type="button"
                title="Edit label"
                aria-label={`Edit ${l.title}`}
                onClick={() => onEdit(l)}
                className="pointer-events-none cursor-pointer rounded p-0.5 text-white hover:bg-white/25 group-hover:pointer-events-auto"
              >
                <Pencil size={13} strokeWidth={2.5} aria-hidden="true" />
              </button>
              <button
                type="button"
                title="Delete label"
                aria-label={`Delete ${l.title}`}
                onClick={() => onRemove(l)}
                className="pointer-events-none cursor-pointer rounded p-0.5 text-white hover:bg-white/25 group-hover:pointer-events-auto"
              >
                <X size={14} strokeWidth={3} aria-hidden="true" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
