"use client";

import { renameCategory } from "@/redux/slices/boardSlice";
import { Column as ColumnT } from "../../lib/types";
import { useState } from "react";
import { useDispatch } from "react-redux";

type Props = {
  column: ColumnT;
  onClose: () => void;
};

export default function EditModal({ column, onClose }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [err, setErr] = useState<string>("");

  const dispatch = useDispatch();

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    handleClick();
    onClose();
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = title.trim();
    if (!name) {
      setErr("Title Required");
    }

    if (name) {
      dispatch(renameCategory({ id: column.id, name: name }) as any);
      handleClose();
    }
  };
  return (
    <>
      <button
        className="px-3 py-1 hover:bg-gray-300 w-full cursor-pointer"
        onClick={handleClick}
      >
        Edit{" "}
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/20 grid place-items-center">
          <div className="w-full max-w-md bg-white rounded-2xl border border-gray-300 shadow p-4">
            <h3 className="text-lg font-semibold">Rename Column</h3>
            <form onSubmit={onSubmit}>
              <div className="py-2">
                <label className="text-sm">Name</label>
                <input
                  type="name"
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                  value={title}
                  placeholder="Enter the Name"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              {err && <div className="text-sm text-red-600">{err}</div>}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-gray-300 px-3 py-2 bg-gray-50 hover:bg-gray-300 cursor-pointer"
                  onClick={handleClose}
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
