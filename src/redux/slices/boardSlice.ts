import { createSlice, PayloadAction, nanoid } from "@reduxjs/toolkit";
import { BoardState, Task, ColumnId, UNASSIGNED_ID } from "../../lib/types";
import { loadJSON } from "../../lib/storage";
import { toSentenceCase } from "../../lib/utils";
import { BUILT_IN_LABELS } from "../../constants/built-in-labels";

export const defaultState: BoardState = {
  labels: BUILT_IN_LABELS.map((l) => ({ ...l })),
  filters: { query: "", label: "All", sort: "manual" },
  columns: [
    { id: "draft", name: "Draft", taskIds: [] },
    { id: "unsolved", name: "Unsolved", taskIds: [] },
    { id: "under-review", name: "Under Review", taskIds: [] },
    { id: "solved", name: "Solved", taskIds: [] },
    { id: UNASSIGNED_ID, name: "Unassigned", taskIds: [] },
  ],
  tasks: {},
};

const initial = loadJSON<BoardState>("board") ?? defaultState;
// Ensure boards saved before the Unassigned bucket existed get one.
if (!initial.columns.some((c) => c.id === UNASSIGNED_ID)) {
  initial.columns.push({ id: UNASSIGNED_ID, name: "Unassigned", taskIds: [] });
}

// Normalize older labels to sentence case (e.g. "temp" -> "Temp"), dropping
// any that collapse to a duplicate, and update the tasks that reference them.
const seenLabels = new Set<string>();
initial.labels = initial.labels.reduce<BoardState["labels"]>((acc, l) => {
  const title = toSentenceCase(l.title);
  if (!seenLabels.has(title)) {
    seenLabels.add(title);
    acc.push({ ...l, title });
  }
  return acc;
}, []);
Object.values(initial.tasks).forEach((t) => {
  t.labels = Array.from(new Set(t.labels.map(toSentenceCase)));
});

// Persistence is handled by a single store.subscribe listener (see store.ts),
// keeping these reducers pure rather than writing to localStorage on every
// dispatch.
const slice = createSlice({
  name: "board",
  initialState: initial,
  reducers: {
    addCategory: (s, a: PayloadAction<{ name: string }>) => {
      const id = (a.payload.name.toLowerCase().replace(/\s+/g, "-") +
        "-" +
        nanoid(4)) as ColumnId;
      s.columns.push({ id, name: a.payload.name, taskIds: [] });
    },
    renameCategory: (s, a: PayloadAction<{ id: ColumnId; name: string }>) => {
      const col = s.columns.find((c) => c.id === a.payload.id);
      if (col) col.name = a.payload.name;
    },
    deleteCategory: (s, a: PayloadAction<{ id: ColumnId }>) => {
      // The Unassigned bucket is the safety net — it can't be deleted.
      if (a.payload.id === UNASSIGNED_ID) return;
      const idx = s.columns.findIndex((c) => c.id === a.payload.id);
      if (idx < 0) return;
      const removed = s.columns[idx];
      const unassigned = s.columns.find((c) => c.id === UNASSIGNED_ID);
      // Move the column's tasks to Unassigned instead of deleting them.
      removed.taskIds.forEach((id) => {
        if (s.tasks[id]) s.tasks[id].status = UNASSIGNED_ID;
      });
      if (unassigned) unassigned.taskIds.push(...removed.taskIds);
      s.columns.splice(idx, 1);
    },
    addTask: (s, a: PayloadAction<Omit<Task, "id" | "createdAt">>) => {
      const id = nanoid();
      const task: Task = { id, createdAt: Date.now(), ...a.payload };
      s.tasks[id] = task;
      s.columns.find((c) => c.id === task.status)?.taskIds.unshift(id);
    },
    updateTask: (
      s,
      a: PayloadAction<{ id: string; changes: Partial<Task> }>
    ) => {
      const prev = s.tasks[a.payload.id];
      if (!prev) return;
      const next = { ...prev, ...a.payload.changes };
      const nextStatus = a.payload.changes.status;
      if (nextStatus && prev.status !== nextStatus) {
        const from = s.columns.find((c) => c.id === prev.status);
        const to = s.columns.find((c) => c.id === nextStatus);
        if (from) from.taskIds = from.taskIds.filter((i) => i !== prev.id);
        if (to) to.taskIds.unshift(prev.id);
      }
      s.tasks[prev.id] = next;
    },
    moveTask: (
      s,
      a: PayloadAction<{ taskId: string; toColumn: ColumnId; toIndex: number }>
    ) => {
      const { taskId, toColumn, toIndex } = a.payload;
      const task = s.tasks[taskId];
      if (!task) return;
      const from = s.columns.find((c) => c.id === task.status);
      const to = s.columns.find((c) => c.id === toColumn);
      if (!from || !to) return;
      const fromIndex = from.taskIds.indexOf(taskId);
      if (fromIndex < 0) return;

      from.taskIds.splice(fromIndex, 1);
      task.status = toColumn;
      const target = from === to ? from : to;
      const clamped = Math.max(0, Math.min(toIndex, target.taskIds.length));
      target.taskIds.splice(clamped, 0, taskId);
    },
    deleteTask: (s, a: PayloadAction<{ id: string }>) => {
      const t = s.tasks[a.payload.id];
      if (!t) return;
      const col = s.columns.find((c) => c.id === t.status);
      if (col) col.taskIds = col.taskIds.filter((i) => i !== t.id);
      delete s.tasks[t.id];
    },

    addLabel: (
      s,
      a: PayloadAction<{ name: string; class?: string; activeClass?: string }>
    ) => {
      const exists = s.labels.some((label) => label.title === a.payload.name);
      if (!exists) {
        s.labels.push({
          title: a.payload.name,
          class: a.payload.class ?? "bg-gray-400/40",
          activeClass: a.payload.activeClass ?? "bg-gray-400",
        });
      }
    },
    updateLabel: (
      s,
      a: PayloadAction<{
        oldTitle: string;
        title: string;
        class: string;
        activeClass: string;
      }>
    ) => {
      const { oldTitle, title, class: cls, activeClass } = a.payload;
      const label = s.labels.find((l) => l.title === oldTitle);
      if (!label) return;
      // Refuse a rename that collides with a different existing label.
      if (title !== oldTitle && s.labels.some((l) => l.title === title)) return;
      label.title = title;
      label.class = cls;
      label.activeClass = activeClass;
      if (title !== oldTitle) {
        Object.values(s.tasks).forEach((t) => {
          t.labels = t.labels.map((x) => (x === oldTitle ? title : x));
        });
      }
    },
    removeLabel: (s, a: PayloadAction<{ title: string }>) => {
      s.labels = s.labels.filter((l) => l.title !== a.payload.title);
      Object.values(s.tasks).forEach((t) => {
        t.labels = t.labels.filter((x) => x !== a.payload.title);
      });
    },
    setFilters: (s, a: PayloadAction<Partial<BoardState["filters"]>>) => {
      s.filters = { ...s.filters, ...a.payload };
    },
    resetBoard: () => structuredClone(defaultState),
  },
});

export const {
  addCategory,
  renameCategory,
  deleteCategory,
  addTask,
  updateTask,
  moveTask,
  deleteTask,
  addLabel,
  updateLabel,
  removeLabel,
  setFilters,
  resetBoard,
} = slice.actions;

export default slice.reducer;
