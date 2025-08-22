import { createSlice, PayloadAction, nanoid } from "@reduxjs/toolkit";
import { BoardState, Task, ColumnId } from "../../lib/types";
import { loadJSON, saveJSON } from "../../lib/storage";

const defaultState: BoardState = {
  labels: [
    {
      title: "Low",
      class: "bg-yellow-500/40",
      activeClass: "bg-yellow-500",
    },
    {
      title: "Medium",
      class: "bg-orange-600/40",
      activeClass: "bg-orange-600",
    },
    {
      title: "High",
      class: "bg-red-500/40",
      activeClass: "bg-red-500",
    },
    {
      title: "Critical",
      class: "bg-red-700/40",
      activeClass: "bg-red-700",
    },
  ],
  filters: { query: "", label: "All", sort: "newest" },
  columns: [
    { id: "draft", name: "Draft", taskIds: [] },
    { id: "unsolved", name: "Unsolved", taskIds: [] },
    { id: "under-review", name: "Under Review", taskIds: [] },
    { id: "solved", name: "Solved", taskIds: [] },
  ],
  tasks: {},
};

const initial = loadJSON<BoardState>("board") ?? defaultState;
const persist = (s: BoardState) => saveJSON("board", s);

const slice = createSlice({
  name: "board",
  initialState: initial,
  reducers: {
    addCategory: (s, a: PayloadAction<{ name: string }>) => {
      const id = (a.payload.name.toLowerCase().replace(/\s+/g, "-") +
        "-" +
        nanoid(4)) as ColumnId;
      s.columns.push({ id, name: a.payload.name, taskIds: [] });
      persist(s);
    },
    renameCategory: (s, a: PayloadAction<{ id: ColumnId; name: string }>) => {
      const col = s.columns.find((c) => c.id === a.payload.id);
      if (col) col.name = a.payload.name;
      persist(s);
    },
    deleteCategory: (s, a: PayloadAction<{ id: ColumnId }>) => {
      const idx = s.columns.findIndex((c) => c.id === a.payload.id);
      if (idx >= 0) {
        s.columns[idx].taskIds.forEach((id) => delete s.tasks[id]);
        s.columns.splice(idx, 1);
        persist(s);
      }
    },
    addTask: (s, a: PayloadAction<Omit<Task, "id" | "createdAt">>) => {
      const id = nanoid();
      const task: Task = { id, createdAt: Date.now(), ...a.payload };
      s.tasks[id] = task;
      s.columns.find((c) => c.id === task.status)?.taskIds.unshift(id);
      persist(s);
    },
    updateTask: (
      s,
      a: PayloadAction<{ id: string; changes: Partial<Task> }>
    ) => {
      const prev = s.tasks[a.payload.id];
      if (!prev) return;
      const next = { ...prev, ...a.payload.changes };
      if (
        a.payload.changes.status &&
        prev.status !== a.payload.changes.status
      ) {
        s.columns.find((c) => c.id === prev.status)!.taskIds = s.columns
          .find((c) => c.id === prev.status)!
          .taskIds.filter((i) => i !== prev.id);
        s.columns
          .find((c) => c.id === a.payload.changes.status)!
          .taskIds.unshift(prev.id);
      }
      s.tasks[prev.id] = next;
      persist(s);
    },
    deleteTask: (s, a: PayloadAction<{ id: string }>) => {
      const t = s.tasks[a.payload.id];
      if (!t) return;
      const col = s.columns.find((c) => c.id === t.status);
      if (col) col.taskIds = col.taskIds.filter((i) => i !== t.id);
      delete s.tasks[t.id];
      persist(s);
    },

    addLabel: (s, a: PayloadAction<{ name: string }>) => {
      const exists = s.labels.some((label) => label.title === a.payload.name);
      if (!exists) {
        s.labels.push({
          title: a.payload.name,
          class: "bg-gray-400/40",
          activeClass: "bg-gray-400",
        });
        persist(s);
      }
    },
    setFilters: (s, a: PayloadAction<Partial<BoardState["filters"]>>) => {
      s.filters = { ...s.filters, ...a.payload };
      persist(s);
    },
  },
});

export const {
  addCategory,
  renameCategory,
  deleteCategory,
  addTask,
  updateTask,
  deleteTask,
  addLabel,
  setFilters,
} = slice.actions;

export default slice.reducer;
