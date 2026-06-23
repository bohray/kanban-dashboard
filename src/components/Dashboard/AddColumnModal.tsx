"use client";

import { addCategory } from "@/redux/slices/boardSlice";
import { AppDispatch } from "@/redux/store";
import { useState } from "react";
import { useDispatch } from "react-redux";
import InputField from "../ui/InputField";
import Modal from "../Common/Modal";
import { Plus } from "lucide-react";

export default function AddColumnModal() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [err, setErr] = useState("");

  const dispatch = useDispatch<AppDispatch>();

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = title.trim();

    if (!name) setErr("Name Required!");
    else {
      dispatch(addCategory({ name: name }));
      handleOpen();
    }
  };
  return (
    <>
      <button
        onClick={handleOpen}
        className="grid h-full w-72 shrink-0 cursor-pointer place-items-center rounded-2xl border border-dashed border-gray-300 bg-white/40 font-medium text-gray-500 transition hover:bg-white hover:text-gray-700"
      >
        <span className="flex items-center gap-1">
          <Plus size={16} aria-hidden="true" /> Add Column
        </span>
      </button>

      {open && (
        <Modal onClose={handleOpen}>
          <h3 className="text-lg font-semibold">New Category Name</h3>
          <form onSubmit={onSubmit}>
              <div className="py-2">
                <label className="text-sm">Name of the Column</label>
                <InputField
                  type="text"
                  autoFocus
                  className="mt-1 w-full"
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
        </Modal>
      )}
    </>
  );
}
