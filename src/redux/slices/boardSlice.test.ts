import { describe, it, expect } from "vitest";
import reducer, {
  addTask,
  updateTask,
  moveTask,
  deleteTask,
  deleteCategory,
  addCategory,
  renameCategory,
  addLabel,
  updateLabel,
  removeLabel,
  setFilters,
  resetBoard,
} from "./boardSlice";
import { BoardState, UNASSIGNED_ID } from "../../lib/types";

const makeState = (): BoardState => ({
  labels: [{ title: "Low", class: "bg-yellow-500/40", activeClass: "bg-yellow-500" }],
  filters: { query: "", label: "All", sort: "manual" },
  columns: [
    { id: "a", name: "A", taskIds: ["t1", "t2"] },
    { id: "b", name: "B", taskIds: ["t3"] },
    { id: UNASSIGNED_ID, name: "Unassigned", taskIds: [] },
  ],
  tasks: {
    t1: { id: "t1", title: "T1", labels: [], createdAt: 1, status: "a" },
    t2: { id: "t2", title: "T2", labels: ["Low"], createdAt: 2, status: "a" },
    t3: { id: "t3", title: "T3", labels: [], createdAt: 3, status: "b" },
  },
});

const col = (s: BoardState, id: string) => s.columns.find((c) => c.id === id)!;

describe("moveTask", () => {
  it("reorders within the same column", () => {
    const s = reducer(makeState(), moveTask({ taskId: "t1", toColumn: "a", toIndex: 1 }));
    expect(col(s, "a").taskIds).toEqual(["t2", "t1"]);
  });

  it("moves a task across columns and updates its status", () => {
    const s = reducer(makeState(), moveTask({ taskId: "t1", toColumn: "b", toIndex: 0 }));
    expect(col(s, "a").taskIds).toEqual(["t2"]);
    expect(col(s, "b").taskIds).toEqual(["t1", "t3"]);
    expect(s.tasks.t1.status).toBe("b");
  });

  it("clamps an out-of-range index to the end", () => {
    const s = reducer(makeState(), moveTask({ taskId: "t1", toColumn: "b", toIndex: 99 }));
    expect(col(s, "b").taskIds).toEqual(["t3", "t1"]);
  });
});

describe("deleteCategory", () => {
  it("moves the column's tasks to Unassigned instead of deleting them", () => {
    const s = reducer(makeState(), deleteCategory({ id: "a" }));
    expect(s.columns.some((c) => c.id === "a")).toBe(false);
    expect(col(s, UNASSIGNED_ID).taskIds).toEqual(["t1", "t2"]);
    expect(s.tasks.t1.status).toBe(UNASSIGNED_ID);
    expect(s.tasks.t2.status).toBe(UNASSIGNED_ID);
  });

  it("refuses to delete the Unassigned column", () => {
    const s = reducer(makeState(), deleteCategory({ id: UNASSIGNED_ID }));
    expect(s.columns.some((c) => c.id === UNASSIGNED_ID)).toBe(true);
  });
});

describe("addCategory / renameCategory", () => {
  it("adds a column with a slugified id", () => {
    const s = reducer(makeState(), addCategory({ name: "In Review" }));
    const added = s.columns.find((c) => c.name === "In Review")!;
    expect(added).toBeDefined();
    expect(added.id.startsWith("in-review-")).toBe(true);
  });

  it("renames a column", () => {
    const s = reducer(makeState(), renameCategory({ id: "a", name: "Alpha" }));
    expect(col(s, "a").name).toBe("Alpha");
  });
});

describe("tasks", () => {
  it("adds a task to the front of its column", () => {
    const s = reducer(
      makeState(),
      addTask({ title: "New", description: "", labels: [], status: "a" })
    );
    expect(col(s, "a").taskIds).toHaveLength(3);
    const newId = col(s, "a").taskIds[0];
    expect(s.tasks[newId].title).toBe("New");
  });

  it("updateTask moves a task when its status changes", () => {
    const s = reducer(makeState(), updateTask({ id: "t3", changes: { status: "a" } }));
    expect(col(s, "b").taskIds).toEqual([]);
    expect(col(s, "a").taskIds).toContain("t3");
    expect(s.tasks.t3.status).toBe("a");
  });

  it("deleteTask removes it from its column and the task map", () => {
    const s = reducer(makeState(), deleteTask({ id: "t2" }));
    expect(col(s, "a").taskIds).toEqual(["t1"]);
    expect(s.tasks.t2).toBeUndefined();
  });
});

describe("labels", () => {
  it("adds a label with the chosen color and ignores duplicates", () => {
    let s = reducer(makeState(), addLabel({ name: "Bug", class: "c", activeClass: "ac" }));
    expect(s.labels.find((l) => l.title === "Bug")).toMatchObject({ class: "c", activeClass: "ac" });
    s = reducer(s, addLabel({ name: "Bug", class: "x", activeClass: "y" }));
    expect(s.labels.filter((l) => l.title === "Bug")).toHaveLength(1);
  });

  it("renames a label and rewrites the references on tasks", () => {
    const s = reducer(
      makeState(),
      updateLabel({ oldTitle: "Low", title: "Minor", class: "c", activeClass: "ac" })
    );
    expect(s.labels.some((l) => l.title === "Minor")).toBe(true);
    expect(s.tasks.t2.labels).toEqual(["Minor"]);
  });

  it("refuses a rename that collides with another label", () => {
    let s = reducer(makeState(), addLabel({ name: "High" }));
    s = reducer(s, updateLabel({ oldTitle: "Low", title: "High", class: "c", activeClass: "ac" }));
    expect(s.labels.some((l) => l.title === "Low")).toBe(true);
    expect(s.labels.filter((l) => l.title === "High")).toHaveLength(1);
  });

  it("removes a label and untags it from every task", () => {
    const s = reducer(makeState(), removeLabel({ title: "Low" }));
    expect(s.labels.some((l) => l.title === "Low")).toBe(false);
    expect(s.tasks.t2.labels).toEqual([]);
  });
});

describe("filters & reset", () => {
  it("merges filter updates", () => {
    const s = reducer(makeState(), setFilters({ query: "bug" }));
    expect(s.filters.query).toBe("bug");
    expect(s.filters.sort).toBe("manual");
  });

  it("resetBoard restores the default columns and seed tasks", () => {
    const s = reducer(makeState(), resetBoard());
    expect(Object.keys(s.tasks).length).toBeGreaterThan(0);
    expect(s.columns.some((c) => c.id === UNASSIGNED_ID)).toBe(true);
    expect(s.columns.map((c) => c.id)).toContain("backlog");
  });
});
