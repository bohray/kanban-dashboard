"use client";

import { Task, ColumnId } from "../../lib/types";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { deleteTask } from "../../redux/slices/boardSlice";
import TaskModal from "./TaskModal";
import { labelsData } from "@/constants/static-label-data";
import DeleteModal from "../Common/DeleteModal";

export default function TaskCard({ task }: { task: Task }) {
  const [displayMenu, setDisplayMenu] = useState(false);
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const handleDisplay = () => {
    setDisplayMenu((prev) => !prev);
  };

  const handleDelete = () => {
    dispatch(deleteTask({ id: task.id }) as any);
  };

  return (
    <>
      <div className="border border-gray-300 rounded-xl p-3 mb-2 bg-white shadow-sm hover:shadow transition">
        <div className="flex items-center justify-between">
          <div className="font-medium text-sm">{task.title}</div>
          <div className="relative">
            <button
              className="px-2 py-1 cursor-pointer hover:bg-gray-300 rounded-3xl"
              onClick={handleDisplay}
            >
              ⋯
            </button>
            {displayMenu && (
              <div className="absolute flex flex-col items-center z-10 bg-white border border-gray-300 rounded-lg py-1 top-7 left-0">
                <button
                  className="px-3 py-1 hover:bg-gray-300 w-full cursor-pointer"
                  onClick={() => {
                    setOpen(true);
                    handleDisplay();
                  }}
                >
                  Edit{" "}
                </button>
                <DeleteModal
                  title={task.title}
                  handleDelete={handleDelete}
                  isColumn={false}
                  onClose={handleDisplay}
                />
              </div>
            )}
          </div>
        </div>
        {task.description && (
          <div className="text-xs text-gray-500 mt-1">{task.description}</div>
        )}
        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-wrap gap-1">
            {task.labels.map((l) => {
              const labelObj = labelsData.find((label) => label.title === l);

              const activeClass = labelObj?.activeClass ?? "bg-gray-400";
              return (
                <span
                  key={l}
                  className={`px-3 py-1 text-xs rounded-full cursor-default text-white font-medium ${activeClass}`}
                >
                  {l}
                </span>
              );
            })}
          </div>
        </div>
      </div>
      {open && (
        <TaskModal mode="edit" id={task.id} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
