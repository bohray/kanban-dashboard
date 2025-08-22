"use client";

import { useState } from "react";

type Props = {
  title: string;
  handleDelete: () => void;
  isColumn?: boolean;
  onClose: () => void;
};

export default function DeleteModal({
  title,
  handleDelete,
  isColumn = true,
  onClose,
}: Props) {
  const [open, setOpen] = useState<boolean>(false);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    handleClick();
    onClose();
  };

  const onDelete = () => {
    handleDelete();
    handleClose();
  };

  return (
    <>
      <button
        className="px-3 py-1 hover:bg-gray-300 w-full cursor-pointer"
        onClick={handleClick}
      >
        Delete
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/20 grid place-items-center">
          <div className="w-full max-w-md bg-white rounded-2xl border border-gray-300 shadow p-4">
            <h3 className="text-lg font-semibold">Delete Column</h3>
            <div className="py-2">
              <p>
                Do you want to delete <b>{title}</b>
                {isColumn ? " along with its tasks?" : "?"}
              </p>

              <div className="flex justify-end gap-2 mt-3">
                <button
                  type="button"
                  className="rounded-xl border border-gray-300 px-3 py-2 bg-gray-50 hover:bg-gray-300 cursor-pointer"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  className="rounded-xl bg-red-700 text-white px-4 py-2 hover:bg-red-700/50 cursor-pointer"
                  onClick={onDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
