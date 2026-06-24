"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  addTask,
  updateTask,
  addLabel,
  updateLabel,
  removeLabel,
} from "../../redux/slices/boardSlice";
import { AppDispatch, RootState } from "../../redux/store";
import { ColumnId, Task, Label, UNASSIGNED_ID } from "../../lib/types";
import { useRef, useState } from "react";
import LabelPicker from "./LabelPicker";
import InputField from "../ui/InputField";
import Modal from "../Common/Modal";
import { labelColors } from "../../constants/label-colors";
import { cn, toSentenceCase } from "../../lib/utils";

type Props =
  | { mode: "create"; initial?: Partial<Task>; onClose: () => void }
  | { mode: "edit"; id: string; onClose: () => void };

export default function TaskModal(props: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((s: RootState) => s.board.tasks);
  const columns = useSelector((s: RootState) => s.board.columns);
  const labels = useSelector((s: RootState) => s.board.labels);

  const initial: Partial<Task> =
    props.mode === "edit" ? tasks[props.id] : props.initial ?? {};

  const [form, setForm] = useState({
    title: initial.title ?? "",
    description: initial.description ?? "",
    labels: initial.labels ?? [],
    status: (initial.status as ColumnId) ?? "backlog",
    assignee: initial.assignee ?? "",
    dueDate: initial.dueDate ?? "",
  });

  const [newLabel, setNewLabel] = useState("");
  const [newLabelColor, setNewLabelColor] = useState(labelColors[0]);
  const [editingLabel, setEditingLabel] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const labelInputRef = useRef<HTMLInputElement>(null);

  type FormState = typeof form;

  const updateForm = <K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) => {
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
      assignee: form.assignee.trim(),
    };

    if (props.mode === "create") {
      dispatch(addTask(taskData));
    } else {
      dispatch(
        updateTask({
          id: props.id,
          changes: taskData,
        })
      );
    }

    props.onClose();
  };

  const resetLabelForm = () => {
    setEditingLabel(null);
    setNewLabel("");
    setNewLabelColor(labelColors[0]);
    setErr(null);
  };

  const handleAddLabel = () => {
    const name = toSentenceCase(newLabel);
    if (!name) return;
    dispatch(
      addLabel({
        name,
        class: newLabelColor.class,
        activeClass: newLabelColor.activeClass,
      })
    );
    updateForm("labels", Array.from(new Set([...form.labels, name])));
    resetLabelForm();
  };

  const handleEditLabel = (label: Label) => {
    setEditingLabel(label.title);
    setNewLabel(label.title);
    // Preserve the label's current color even if it isn't in the preset palette.
    setNewLabelColor({
      name: "current",
      class: label.class,
      activeClass: label.activeClass,
    });
    // Move focus off the pill (releases the hover/focus overlay) into the input.
    labelInputRef.current?.focus();
  };

  const handleSaveLabel = () => {
    if (!editingLabel) return;
    const title = toSentenceCase(newLabel);
    if (!title) return;
    if (title !== editingLabel && labels.some((l) => l.title === title)) {
      setErr("A label with that name already exists.");
      return;
    }
    dispatch(
      updateLabel({
        oldTitle: editingLabel,
        title,
        class: newLabelColor.class,
        activeClass: newLabelColor.activeClass,
      })
    );
    // Keep this task's selection in sync if the renamed label was applied.
    if (title !== editingLabel && form.labels.includes(editingLabel)) {
      updateForm(
        "labels",
        form.labels.map((x) => (x === editingLabel ? title : x))
      );
    }
    resetLabelForm();
  };

  const handleRemoveLabel = (label: Label) => {
    dispatch(removeLabel({ title: label.title }));
    if (form.labels.includes(label.title)) {
      updateForm(
        "labels",
        form.labels.filter((x) => x !== label.title)
      );
    }
    if (editingLabel === label.title) resetLabelForm();
  };

  return (
    <Modal onClose={props.onClose}>
      <h3 className="text-lg font-semibold">
        {props.mode === "create" ? "Create task" : "Edit task"}
      </h3>

        <form onSubmit={onSubmit} className="mt-3 space-y-3">
          {/* Title */}
          <div>
            <label className="text-sm">Title</label>
            <InputField
              className="mt-1 w-full"
              value={form.title}
              onChange={(e) => updateForm("title", e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm">Description</label>
            <InputField
              as="textarea"
              className="mt-1 w-full"
              rows={4}
              value={form.description}
              onChange={(e) => updateForm("description", e.target.value)}
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-sm">Status</label>
            <InputField
              as="select"
              className="mt-1 w-full"
              value={form.status}
              onChange={(e) => updateForm("status", e.target.value as ColumnId)}
            >
              {columns
                .filter(
                  (col) =>
                    col.id !== UNASSIGNED_ID || form.status === UNASSIGNED_ID
                )
                .map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.name}
                  </option>
                ))}
            </InputField>
          </div>

          {/* Assignee & due date */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm">Assignee</label>
              <InputField
                className="mt-1 w-full"
                placeholder="e.g. Yash Bhardwaj"
                value={form.assignee}
                onChange={(e) => updateForm("assignee", e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="text-sm">Due date</label>
              <InputField
                type="date"
                className="mt-1 w-full"
                value={form.dueDate}
                onChange={(e) => updateForm("dueDate", e.target.value)}
              />
            </div>
          </div>

          {/* Labels */}
          <div>
            <label className="text-sm">Labels</label>
            <LabelPicker
              value={form.labels}
              onChange={(v) => updateForm("labels", v)}
              onEdit={handleEditLabel}
              onRemove={handleRemoveLabel}
            />
            <div className="mt-2 space-y-2">
              <div className="flex gap-2">
                <InputField
                  ref={labelInputRef}
                  className="flex-1"
                  placeholder={
                    editingLabel ? "Rename label..." : "Add new label..."
                  }
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (editingLabel) handleSaveLabel();
                      else handleAddLabel();
                    }
                  }}
                />
                {editingLabel && (
                  <button
                    type="button"
                    className="rounded-xl border border-gray-300 cursor-pointer px-3 py-2 bg-gray-50 hover:bg-gray-200"
                    onClick={resetLabelForm}
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="button"
                  className="rounded-xl border border-gray-300 cursor-pointer px-3 py-2 bg-gray-50 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={editingLabel ? handleSaveLabel : handleAddLabel}
                  disabled={!newLabel.trim()}
                >
                  {editingLabel ? "Save" : "Add"}
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="mr-1 text-xs text-gray-400">Color</span>
                {labelColors.map((c) => (
                  <button
                    key={c.activeClass}
                    type="button"
                    title={c.name}
                    aria-label={c.name}
                    aria-pressed={newLabelColor.activeClass === c.activeClass}
                    onClick={() => setNewLabelColor(c)}
                    className={cn(
                      "h-5 w-5 rounded-full transition",
                      c.activeClass,
                      newLabelColor.activeClass === c.activeClass
                        ? "ring-2 ring-gray-500 ring-offset-1"
                        : "hover:scale-110"
                    )}
                  />
                ))}
              </div>
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
    </Modal>
  );
}
