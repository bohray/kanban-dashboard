"use client";

import { renameCategory } from "@/redux/slices/boardSlice";
import { Column as ColumnT } from "../../lib/types";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import InputField from "../ui/InputField";
import Modal from "../Common/Modal";

type Props = {
  column: ColumnT;
  onClose: () => void;
};

export default function EditModal({ column, onClose }: Props) {
  const [title, setTitle] = useState<string>(column.name);
  const [err, setErr] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = title.trim();
    if (!name) {
      setErr("Name Required");
      return;
    }
    dispatch(renameCategory({ id: column.id, name }));
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <h3 className="text-lg font-semibold">Rename Column</h3>
      <form onSubmit={onSubmit}>
          <div className="py-2">
            <label className="text-sm">Name</label>
            <InputField
              type="text"
              autoFocus
              className="mt-1 w-full"
              value={title}
              placeholder="Enter the Name"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          {err && <div className="text-sm text-red-600">{err}</div>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="cursor-pointer rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 hover:bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="cursor-pointer rounded-xl bg-gray-900 px-4 py-2 text-white hover:bg-black/70">
              Save
            </button>
          </div>
        </form>
    </Modal>
  );
}
