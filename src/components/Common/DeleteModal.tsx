"use client";

import Modal from "./Modal";

type Props = {
  title: string;
  onConfirm: () => void;
  onClose: () => void;
  isColumn?: boolean;
};

export default function DeleteModal({
  title,
  onConfirm,
  onClose,
  isColumn = true,
}: Props) {
  return (
    <Modal onClose={onClose}>
      <h3 className="text-lg font-semibold">
        Delete {isColumn ? "Column" : "Task"}
      </h3>
      <div className="py-2">
        <p>
          Do you want to delete <b>{title}</b>?
          {isColumn ? " Its tasks will be moved to Unassigned." : ""}
        </p>

        <div className="mt-3 flex justify-end gap-2">
          <button
            type="button"
            className="cursor-pointer rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="cursor-pointer rounded-xl bg-red-700 px-4 py-2 text-white hover:bg-red-700/50"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
