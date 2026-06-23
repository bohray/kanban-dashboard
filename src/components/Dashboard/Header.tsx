"use client";

import { useDispatch, useSelector } from "react-redux";
import { setFilters, resetBoard } from "../../redux/slices/boardSlice";
import { AppDispatch, RootState } from "../../redux/store";
import InputField from "../ui/InputField";
import ConfirmModal from "../Common/ConfirmModal";
import { useState } from "react";

export default function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const { labels, filters } = useSelector((s: RootState) => s.board);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="flex shrink-0 flex-col gap-3 mb-4">
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-500 text-white shadow-sm">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="5" height="16" rx="1.5" />
            <rect x="10" y="4" width="5" height="10" rx="1.5" />
            <rect x="17" y="4" width="5" height="13" rx="1.5" />
          </svg>
        </span>
        <div className="leading-tight">
          <h1 className="text-xl font-semibold">FlowBoard</h1>
          <p className="text-xs text-gray-500">Kanban workflow board</p>
        </div>
        </div>
        <button
          type="button"
          onClick={() => setConfirmReset(true)}
          className="cursor-pointer rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          Reset board
        </button>
      </div>

      <div className="flex w-full flex-wrap gap-2">
        <div className="relative">
          <InputField
            className="w-64"
            placeholder="Search by issue name..."
            value={filters.query}
            onChange={(e) => dispatch(setFilters({ query: e.target.value }))}
          />
        </div>
        <InputField
          as="select"
          value={filters.label ?? "All"}
          onChange={(e) => dispatch(setFilters({ label: e.target.value }))}
        >
          <option>All</option>
          {labels.map((l) => (
            <option key={l.title}>{l.title}</option>
          ))}
        </InputField>
        <InputField
          as="select"
          value={filters.sort}
          onChange={(e) =>
            dispatch(
              setFilters({
                sort: e.target.value as "manual" | "newest" | "oldest",
              })
            )
          }
        >
          <option value="manual">Manual</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </InputField>
      </div>

      {confirmReset && (
        <ConfirmModal
          title="Reset board?"
          message="This deletes all tasks, columns, and labels and restores the default board. This can't be undone."
          confirmLabel="Reset board"
          onConfirm={() => dispatch(resetBoard())}
          onClose={() => setConfirmReset(false)}
        />
      )}
    </div>
  );
}
