import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { UNASSIGNED_ID } from "../lib/types";

export const selectBoard = (s: RootState) => s.board;

export const selectVisibleColumns = createSelector(
  [(s: RootState) => s.board, (s: RootState) => s.board.filters],
  (board, filters) => {
    const q = filters.query.trim().toLowerCase();
    const label = filters.label;
    const sort = filters.sort;

    const passes = (id: string) => {
      const t = board.tasks[id];
      if (!t) return false;
      const byQuery = !q || t.title.toLowerCase().includes(q);
      const byLabel = label === "All" || t.labels.includes(label!);
      return byQuery && byLabel;
    };

    // "manual" preserves the drag order stored in taskIds.
    // "newest"/"oldest" sort by task creation time.
    return board.columns
      .filter((col) => col.id !== UNASSIGNED_ID || col.taskIds.length > 0)
      .map((col) => {
        const visible = col.taskIds.filter(passes);
        if (sort === "manual") return { ...col, taskIds: visible };
        const sorted = [...visible].sort((a, b) => {
          const diff = board.tasks[a].createdAt - board.tasks[b].createdAt;
          return sort === "oldest" ? diff : -diff;
        });
        return { ...col, taskIds: sorted };
      });
  }
);
