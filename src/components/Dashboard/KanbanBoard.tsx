"use client";

import { useDispatch, useSelector } from "react-redux";
import { selectVisibleColumns } from "../../redux/selectors";
import { AppDispatch, RootState } from "../../redux/store";
import { moveTask } from "../../redux/slices/boardSlice";
import Column from "../Column/Column";
import { useMemo, useState } from "react";
import TaskModal from "../Task/TaskModal";
import AddColumnModal from "./AddColumnModal";
import { cn, colorFromName, getInitials, formatDueDate } from "../../lib/utils";
import { Calendar } from "lucide-react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

export default function KanbanBoard() {
  const columns = useSelector(selectVisibleColumns);
  const rawColumns = useSelector((s: RootState) => s.board.columns);
  const tasks = useSelector((s: RootState) => s.board.tasks);
  const labels = useSelector((s: RootState) => s.board.labels);
  const dispatch = useDispatch<AppDispatch>();

  const [open, setOpen] = useState<null | { columnId: string }>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overColumnId, setOverColumnId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const colById = useMemo(
    () => Object.fromEntries(rawColumns.map((c) => [c.id, c])),
    [rawColumns]
  );

  const onDragStart = (e: DragStartEvent) => {
    setActiveId(e.active.id as string);
  };

  // Resolve whichever column the pointer is over — whether the collision
  // target is a column droppable or a card sortable inside one — so the whole
  // column highlights consistently (cards included, not just empty space).
  const onDragOver = (e: DragOverEvent) => {
    const { over } = e;
    if (!over) {
      setOverColumnId(null);
      return;
    }
    const colId =
      over.data.current?.type === "column"
        ? (over.id as string)
        : (over.data.current?.columnId as string | undefined);
    setOverColumnId(colId ?? null);
  };

  const onDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    setOverColumnId(null);
    const { active, over } = e;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;
    const overType = over.data.current?.type;

    let toColumn: string;
    let toIndex: number;

    if (overType === "column") {
      toColumn = overId;
      toIndex = colById[toColumn]?.taskIds.length ?? 0;
    } else {
      toColumn = over.data.current?.columnId as string;
      const destIds = colById[toColumn]?.taskIds ?? [];
      const overIndex = destIds.indexOf(overId);
      toIndex = overIndex < 0 ? destIds.length : overIndex;
    }

    const from = colById[tasks[taskId]?.status];
    if (from && from.id === toColumn && from.taskIds.indexOf(taskId) === toIndex)
      return;

    dispatch(moveTask({ taskId, toColumn, toIndex }));
  };

  const activeTask = activeId ? tasks[activeId] : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={() => {
        setActiveId(null);
        setOverColumnId(null);
      }}
    >
      <div className="scrollbar-hide flex min-h-0 flex-1 items-stretch gap-4 overflow-x-auto pb-2">
        {columns.map((col) => (
          <Column
            key={col.id}
            column={col}
            highlighted={overColumnId === col.id}
            onAdd={() => setOpen({ columnId: col.id })}
          />
        ))}
        <AddColumnModal />
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="border border-gray-300 rounded-xl p-3 bg-white shadow-lg rotate-2 cursor-grabbing">
            <div className="font-medium text-sm">{activeTask.title}</div>
            {activeTask.description && (
              <div className="text-xs text-gray-500 mt-1">
                {activeTask.description}
              </div>
            )}
            <div className="flex flex-wrap gap-1 mt-2">
              {activeTask.labels.map((l) => {
                const activeClass =
                  labels.find((label) => label.title === l)?.activeClass ??
                  "bg-gray-400";
                return (
                  <span
                    key={l}
                    className={cn(
                      "px-3 py-1 text-xs rounded-full text-white font-medium",
                      activeClass
                    )}
                  >
                    {l}
                  </span>
                );
              })}
            </div>
            {(activeTask.assignee || activeTask.dueDate) && (
              <div className="mt-3 flex items-center justify-between">
                {activeTask.assignee ? (
                  <span
                    title={activeTask.assignee}
                    className={cn(
                      "grid h-6 w-6 place-items-center rounded-full text-[10px] font-semibold text-white",
                      colorFromName(activeTask.assignee)
                    )}
                  >
                    {getInitials(activeTask.assignee)}
                  </span>
                ) : (
                  <span />
                )}
                {activeTask.dueDate && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                    <Calendar size={12} aria-hidden="true" />
                    {formatDueDate(activeTask.dueDate)}
                  </span>
                )}
              </div>
            )}
          </div>
        ) : null}
      </DragOverlay>

      {open && (
        <TaskModal
          mode="create"
          initial={{ status: open.columnId }}
          onClose={() => setOpen(null)}
        />
      )}
    </DndContext>
  );
}
