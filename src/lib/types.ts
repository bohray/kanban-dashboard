export type Label = {
  title: string;
  class: string;
  activeClass: string;
};

export type ColumnId =
  | "backlog"
  | "todo"
  | "in-progress"
  | "done"
  | (string & {});
export type Task = {
  id: string;
  title: string;
  description?: string;
  labels: string[];
  createdAt: number;
  status: ColumnId;
  // Person responsible — rendered as an initials avatar on the card.
  assignee?: string;
  // Target date as an ISO "YYYY-MM-DD" string — rendered as a date chip.
  dueDate?: string;
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
