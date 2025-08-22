import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";

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

    const sorter = (a: string, b: string) =>
      sort === "newest"
        ? (board.tasks[b]?.createdAt ?? 0) - (board.tasks[a]?.createdAt ?? 0)
        : (board.tasks[a]?.createdAt ?? 0) - (board.tasks[b]?.createdAt ?? 0);

    return board.columns.map((col) => ({
      ...col,
      taskIds: col.taskIds.filter(passes).sort(sorter),
    }));
  }
);
