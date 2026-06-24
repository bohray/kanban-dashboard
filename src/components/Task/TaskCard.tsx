"use client";

import { Task, ColumnId } from "../../lib/types";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { deleteTask } from "../../redux/slices/boardSlice";
import TaskModal from "./TaskModal";
import DeleteModal from "../Common/DeleteModal";
import { AppDispatch, RootState } from "@/redux/store";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn, colorFromName, getInitials, formatDueDate } from "../../lib/utils";
import { MoreHorizontal, Calendar } from "lucide-react";

export default function TaskCard({
  task,
  columnId,
}: {
  task: Task;
  columnId: ColumnId;
}) {
  const [displayMenu, setDisplayMenu] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const labels = useSelector((s: RootState) => s.board.labels);
  const dispatch = useDispatch<AppDispatch>();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: "task", columnId } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const handleDisplay = () => {
    setDisplayMenu((prev) => !prev);
  };

  const handleDelete = () => {
    dispatch(deleteTask({ id: task.id }));
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="border border-gray-200 rounded-xl p-3 mb-2 bg-white shadow-sm hover:border-gray-300 hover:shadow-md transition cursor-grab active:cursor-grabbing touch-none"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="font-medium text-sm">{task.title}</div>
          <div className="relative shrink-0">
            <button
              className="grid h-7 w-7 cursor-pointer place-items-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              onClick={handleDisplay}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label="Task actions"
            >
              <MoreHorizontal size={16} aria-hidden="true" />
            </button>
            {displayMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => setDisplayMenu(false)}
                />
                <div className="absolute right-0 top-7 z-20 flex min-w-[6rem] flex-col items-stretch rounded-lg border border-gray-300 bg-white py-1 shadow-lg">
                  <button
                    className="w-full cursor-pointer px-3 py-1 text-left hover:bg-gray-100"
                    onClick={() => {
                      setOpen(true);
                      setDisplayMenu(false);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="w-full cursor-pointer px-3 py-1 text-left hover:bg-gray-100"
                    onClick={() => {
                      setConfirmDelete(true);
                      setDisplayMenu(false);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        {task.description && (
          <div className="text-xs text-gray-500 mt-1">{task.description}</div>
        )}
        {task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {task.labels.map((l) => {
              const labelObj = labels.find((label) => label.title === l);

              const activeClass = labelObj?.activeClass ?? "bg-gray-400";
              return (
                <span
                  key={l}
                  className={cn(
                    "px-2.5 py-0.5 text-xs rounded-full cursor-default text-white font-medium",
                    activeClass
                  )}
                >
                  {l}
                </span>
              );
            })}
          </div>
        )}
        {(task.assignee || task.dueDate) && (
          <div className="mt-3 flex items-center justify-between">
            {task.assignee ? (
              <span
                title={task.assignee}
                className={cn(
                  "grid h-6 w-6 place-items-center rounded-full text-[10px] font-semibold text-white",
                  colorFromName(task.assignee)
                )}
              >
                {getInitials(task.assignee)}
              </span>
            ) : (
              <span />
            )}
            {task.dueDate && (
              <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                <Calendar size={12} aria-hidden="true" />
                {formatDueDate(task.dueDate)}
              </span>
            )}
          </div>
        )}
      </div>
      {open && (
        <TaskModal mode="edit" id={task.id} onClose={() => setOpen(false)} />
      )}
      {confirmDelete && (
        <DeleteModal
          title={task.title}
          isColumn={false}
          onConfirm={handleDelete}
          onClose={() => setConfirmDelete(false)}
        />
      )}
    </>
  );
}
