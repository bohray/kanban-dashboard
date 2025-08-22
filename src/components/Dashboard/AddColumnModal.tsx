"use client";

import { addCategory } from "@/redux/slices/boardSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function AddColumnModal() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [err, setErr] = useState("");

  const dispatch = useDispatch();

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = title.trim();

    if (!name) setErr("Name Required!");
    else {
      dispatch(addCategory({ name: name }) as any);
      handleOpen();
    }
  };
  return (
    <>
      <div className="rounded-2xl border border-dashed p-4 grid place-items-center">
        <button
          className="rounded-xl border px-3 py-2 bg-gray-50 hover:bg-gray-200 cursor-pointer"
          onClick={handleOpen}
        >
          + Add Column
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/20 grid place-items-center">
          <div className="w-full max-w-md bg-white rounded-2xl border border-gray-300 shadow p-4">
            <h3 className="text-lg font-semibold">New Category Name</h3>
            <form onSubmit={onSubmit}>
              <div className="py-2">
                <label className="text-sm">Name of the Column</label>
                <input
                  type="name"
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                  value={title}
                  placeholder="Enter Name"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              {err && <div className="text-sm text-red-600">{err}</div>}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-gray-300 px-3 py-2 bg-gray-50 hover:bg-gray-300 cursor-pointer"
                  onClick={handleOpen}
                >
                  Cancel
                </button>
                <button className="rounded-xl bg-gray-900 text-white px-4 py-2 hover:bg-black/70 cursor-pointer">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
