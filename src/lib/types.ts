export type Label = {
  title: string;
  class: string;
  activeClass: string;
};

export type ColumnId =
  | "draft"
  | "unsolved"
  | "under-review"
  | "solved"
  | (string & {});
export type Task = {
  id: string;
  title: string;
  description?: string;
  labels: string[];
  createdAt: number;
  status: ColumnId;
};
export type Column = { id: ColumnId; name: string; taskIds: string[] };

// The permanent landing column for tasks whose column was deleted.
// Hidden from the board when empty, and locked (no rename/delete/add).
export const UNASSIGNED_ID = "unassigned";
export type BoardState = {
  labels: Label[];
  columns: Column[];
  tasks: Record<string, Task>;
  filters: {
    query: string;
    label: string | "All";
    sort: "manual" | "newest" | "oldest";
  };
};
