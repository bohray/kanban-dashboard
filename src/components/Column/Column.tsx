"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Column as ColumnT } from "../../lib/types";
import { deleteCategory } from "../../redux/slices/boardSlice";
import TaskCard from "../Task/TaskCard";
import { useState } from "react";
import EditModal from "./EditModal";
import DeleteModal from "../Common/DeleteModal";

export default function Column({
  column,
  onAdd,
}: {
  column: ColumnT;
  onAdd: () => void;
}) {
  const tasks = useSelector((s: RootState) => s.board.tasks);
  const [displayMenu, setDisplayMenu] = useState(false);

  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteCategory({ id: column.id }) as any);
  };

  const handleDisplay = () => {
    setDisplayMenu((prev) => !prev);
  };

  return (
    <div className="rounded-2xl bg-white p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          <span className="font-semibold">{column.name}</span>
          <span className="px-1 py-0.5 text-black/70">
            {column.taskIds.length}
          </span>
        </div>
        <div className="relative flex items-center gap-1">
          <button
            className="px-2 py-1 cursor-pointer hover:bg-gray-300 rounded-3xl"
            onClick={handleDisplay}
          >
            ⋯
          </button>

          <button
            className="px-2 py-1 rounded-2xl hover:bg-gray-300 cursor-pointer"
            onClick={onAdd}
          >
            ＋
          </button>
          {displayMenu && (
            <div className="absolute flex flex-col items-center z-10 bg-white border border-gray-300 rounded-lg py-1 top-7 left-0">
              <EditModal column={column} onClose={handleDisplay} />
              <DeleteModal
                title={column.name}
                handleDelete={handleDelete}
                onClose={handleDisplay}
              />
            </div>
          )}
        </div>
      </div>
      {column.taskIds.map((id) => (
        <TaskCard key={id} task={tasks[id]} />
      ))}
    </div>
  );
}
