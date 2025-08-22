"use client";

import { useSelector } from "react-redux";
import { selectVisibleColumns } from "../../redux/selectors";
import Column from "../Column/Column";
import { useState } from "react";
import TaskModal from "../Task/TaskModal";

import AddColumnModal from "./AddColumnModal";

export default function KanbanBoard() {
  const columns = useSelector(selectVisibleColumns);
  const [open, setOpen] = useState<null | { columnId: string }>(null);

  return (
    <>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((col) => (
          <Column
            key={col.id}
            column={col}
            onAdd={() => setOpen({ columnId: col.id })}
          />
        ))}
        <AddColumnModal />
      </div>
      {open && (
        <TaskModal
          mode="create"
          initial={{ status: open.columnId as any }}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}
