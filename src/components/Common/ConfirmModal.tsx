"use client";

import { cn } from "../../lib/utils";
import Modal from "./Modal";

type Props = {
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export default function ConfirmModal({
  title,
  message,
  confirmLabel = "Confirm",
  danger = true,
  onConfirm,
  onClose,
}: Props) {
  return (
    <Modal onClose={onClose}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="py-2 text-sm text-gray-600">{message}</p>
      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          className="cursor-pointer rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 hover:bg-gray-300"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="button"
          className={cn(
            "cursor-pointer rounded-xl px-4 py-2 text-white",
            danger ? "bg-red-700 hover:bg-red-700/80" : "bg-gray-900 hover:bg-black/70"
          )}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
