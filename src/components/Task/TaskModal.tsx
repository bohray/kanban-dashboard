"use client";

import { useDispatch, useSelector } from "react-redux";
import { addTask, updateTask, addLabel } from "../../redux/slices/boardSlice";
import { RootState } from "../../redux/store";
import { ColumnId, Task } from "../../lib/types";
import { useState } from "react";
import LabelPicker from "./LabelPicker";

type Props =
  | { mode: "create"; initial?: Partial<Task>; onClose: () => void }
  | { mode: "edit"; id: string; onClose: () => void };

const statusOptions: ColumnId[] = [
  "draft",
  "unsolved",
  "under-review",
  "solved",
];

export default function TaskModal(props: Props) {
  const dispatch = useDispatch();
  const tasks = useSelector((s: RootState) => s.board.tasks);

  const initial: Partial<Task> =
    props.mode === "edit" ? tasks[props.id] : props.initial ?? {};

  const [form, setForm] = useState({
    title: initial.title ?? "",
    description: initial.description ?? "",
    labels: initial.labels ?? [],
    status: (initial.status as ColumnId) ?? "draft",
  });

  const [newLabel, setNewLabel] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const updateForm = (field: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setErr("Title is required.");
      return;
    }

    const taskData = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
    };

    if (props.mode === "create") {
      dispatch(addTask(taskData) as any);
    } else {
      dispatch(
        updateTask({
          id: (props as any).id,
          changes: taskData,
        }) as any
      );
    }

    props.onClose();
  };

  const handleAddLabel = () => {
    const name = newLabel.trim();
    if (!name) return;
    dispatch(addLabel({ name }) as any);
    updateForm("labels", Array.from(new Set([...form.labels, name])));
    setNewLabel("");
  };

  return (
    <div
      className="fixed inset-0 bg-black/20 grid place-items-center"
      onClick={props.onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-gray-300 shadow p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold">
          {props.mode === "create" ? "Create task" : "Edit task"}
        </h3>

        <form onSubmit={onSubmit} className="mt-3 space-y-3">
          {/* Title */}
          <div>
            <label className="text-sm">Title</label>
            <input
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
              value={form.title}
              onChange={(e) => updateForm("title", e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm">Description</label>
            <textarea
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
              rows={4}
              value={form.description}
              onChange={(e) => updateForm("description", e.target.value)}
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-sm">Status</label>
            <select
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
              value={form.status}
              onChange={(e) => updateForm("status", e.target.value as ColumnId)}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          {/* Labels */}
          <div>
            <label className="text-sm">Labels</label>
            <LabelPicker
              value={form.labels}
              onChange={(v) => updateForm("labels", v)}
            />
            <div className="flex gap-2 mt-2">
              <input
                className="flex-1 rounded-xl border border-gray-300 px-3 py-2"
                placeholder="Add new label..."
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
              />
              <button
                type="button"
                className="rounded-xl border border-gray-300 cursor-pointer px-3 py-2 bg-gray-50 hover:bg-gray-200"
                onClick={handleAddLabel}
              >
                Add
              </button>
            </div>
          </div>

          {/* Error */}
          {err && <div className="text-sm text-red-600">{err}</div>}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="rounded-xl border border-gray-300 px-3 py-2 bg-gray-50 hover:bg-gray-300 cursor-pointer"
              onClick={props.onClose}
            >
              Cancel
            </button>
            <button className="rounded-xl bg-gray-900 text-white px-4 py-2 hover:bg-black/70 cursor-pointer">
              {props.mode === "create" ? "Create" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
