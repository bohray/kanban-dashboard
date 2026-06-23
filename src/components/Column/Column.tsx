"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { Column as ColumnT, UNASSIGNED_ID } from "../../lib/types";
import { deleteCategory } from "../../redux/slices/boardSlice";
import TaskCard from "../Task/TaskCard";
import { useState } from "react";
import EditModal from "./EditModal";
import DeleteModal from "../Common/DeleteModal";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "../../lib/utils";
import { MoreHorizontal, Plus } from "lucide-react";

export default function Column({
  column,
  onAdd,
  highlighted,
}: {
  column: ColumnT;
  onAdd: () => void;
  highlighted: boolean;
}) {
  const tasks = useSelector((s: RootState) => s.board.tasks);
  const [displayMenu, setDisplayMenu] = useState(false);
  const [activeModal, setActiveModal] = useState<null | "edit" | "delete">(null);
  const isLocked = column.id === UNASSIGNED_ID;

  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = () => {
    dispatch(deleteCategory({ id: column.id }));
  };

  const handleDisplay = () => {
    setDisplayMenu((prev) => !prev);
  };

  const { setNodeRef } = useDroppable({
    id: column.id,
    data: { type: "column", columnId: column.id },
  });

  return (
    <div
      className={cn(
        "flex h-full max-h-full w-80 shrink-0 flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition-colors",
        highlighted && "border-cyan-400 bg-cyan-50"
      )}
    >
      <div className="flex shrink-0 items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{column.name}</span>
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-100 px-1.5 text-xs font-medium text-gray-500">
            {column.taskIds.length}
          </span>
        </div>
        {!isLocked && (
        <div className="relative flex items-center gap-0.5">
          <button
            className="grid h-7 w-7 cursor-pointer place-items-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            onClick={handleDisplay}
            aria-label="Column actions"
          >
            <MoreHorizontal size={16} aria-hidden="true" />
          </button>

          <button
            className="grid h-7 w-7 cursor-pointer place-items-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            onClick={onAdd}
            aria-label="Add task"
          >
            <Plus size={16} aria-hidden="true" />
          </button>
          {displayMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDisplayMenu(false)}
              />
              <div className="absolute top-7 left-0 z-20 flex min-w-[7rem] flex-col items-stretch rounded-lg border border-gray-300 bg-white py-1 shadow-lg">
                <button
                  className="cursor-pointer px-3 py-1 text-left hover:bg-gray-100"
                  onClick={() => {
                    setActiveModal("edit");
                    setDisplayMenu(false);
                  }}
                >
                  Edit
                </button>
                <button
                  className="cursor-pointer px-3 py-1 text-left hover:bg-gray-100"
                  onClick={() => {
                    setActiveModal("delete");
                    setDisplayMenu(false);
                  }}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
        )}
      </div>
      <div
        ref={setNodeRef}
        className="scrollbar-hide flex min-h-0 flex-1 flex-col overflow-y-auto"
      >
        <SortableContext
          items={column.taskIds}
          strategy={verticalListSortingStrategy}
        >
          {column.taskIds.map((id) => (
            <TaskCard key={id} task={tasks[id]} columnId={column.id} />
          ))}
        </SortableContext>
        {column.taskIds.length === 0 &&
          (isLocked ? (
            <div className="grid flex-1 place-items-center rounded-xl border border-dashed border-gray-200 text-xs text-gray-400">
              No tasks
            </div>
          ) : (
            <button
              type="button"
              onClick={onAdd}
              className="grid flex-1 cursor-pointer place-items-center rounded-xl border border-dashed border-gray-200 text-xs text-gray-400 transition hover:border-gray-300 hover:text-gray-500"
            >
              Drop or create a task
            </button>
          ))}
      </div>

      {activeModal === "edit" && (
        <EditModal column={column} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "delete" && (
        <DeleteModal
          title={column.name}
          onConfirm={handleDelete}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}
