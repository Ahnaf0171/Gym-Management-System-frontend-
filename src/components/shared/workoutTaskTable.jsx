import { useState } from "react";
import { Table } from "@/components/ui/Table";
import { Modal } from "@/components/ui/Modal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  updateWorkoutTask,
  deleteWorkoutTask,
} from "@/services/workoutTaskService";
import { TASK_STATUS } from "@/utils/constants";
import useRole from "@/hooks/useRole";

// ── Constants ────────────────────────────────────────
const STATUSES = [
  { key: TASK_STATUS.PENDING, label: "Pending" },
  { key: TASK_STATUS.IN_PROGRESS, label: "In Progress" },
  { key: TASK_STATUS.COMPLETED, label: "Completed" },
];

const selectClass =
  "px-4 py-2 text-sm border border-[var(--color-border)] rounded-xl bg-[var(--color-surface-2)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)] transition-all duration-200";

export function WorkoutTaskTable({
  tasks = [],
  onStatusUpdate,
  members = [],
  className = "",
}) {
  const { isTrainer, isMember } = useRole();

  const [selectedTask, setSelectedTask] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ member: "", due_date: "" });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [error, setError] = useState("");

  const closeModal = () => {
    setSelectedTask(null);
    setIsEditing(false);
    setError("");
  };

  const openEdit = () => {
    setEditData({
      member: selectedTask.member,
      due_date: selectedTask.due_date,
    });
    setIsEditing(true);
  };

  // ── Status update ────────────────────────────────
  const handleStatusChange = async (newStatus) => {
    if (newStatus === selectedTask.status) return;
    setUpdatingStatus(newStatus);
    setError("");
    try {
      await updateWorkoutTask(selectedTask.id, { status: newStatus });
      setSelectedTask((prev) => ({ ...prev, status: newStatus }));
      onStatusUpdate?.();
    } catch {
      setError("Failed to update status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  // ── Edit submit ──────────────────────────────────
  const handleEditSubmit = async () => {
    setEditSubmitting(true);
    setError("");
    try {
      await updateWorkoutTask(selectedTask.id, {
        member: Number(editData.member),
        due_date: editData.due_date,
      });
      setSelectedTask((prev) => ({
        ...prev,
        member: Number(editData.member),
        due_date: editData.due_date,
        member_email: members.find((m) => m.id === Number(editData.member))
          ?.email,
      }));
      setIsEditing(false);
      onStatusUpdate?.();
    } catch {
      setError("Failed to update task");
    } finally {
      setEditSubmitting(false);
    }
  };

  // ── Delete ───────────────────────────────────────
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteWorkoutTask(selectedTask.id);
      closeModal();
      onStatusUpdate?.();
    } catch {
      setError("Failed to delete task");
    } finally {
      setDeleting(false);
    }
  };

  // ── Table columns ────────────────────────────────
  const columns = [
    {
      key: "workout_plan",
      label: "Plan",
      render: (row) => (
        <span className="text-[var(--color-text-primary)]">
          {row.workout_plan_title ?? `Plan #${row.workout_plan}`}
        </span>
      ),
    },
    ...(isTrainer
      ? [
          {
            key: "member",
            label: "Member",
            render: (row) => (
              <span className="text-[var(--color-text-secondary)]">
                {row.member_email ?? `Member #${row.member}`}
              </span>
            ),
          },
        ]
      : []),
    {
      key: "due_date",
      label: "Due Date",
      render: (row) => (
        <span className="text-[var(--color-text-secondary)]">
          {row.due_date}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  if (tasks.length === 0) return <EmptyState message="No tasks found" />;

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <Table
        columns={columns}
        data={tasks}
        onRowClick={(row) => {
          setError("");
          setIsEditing(false);
          setSelectedTask(row);
        }}
      />

      <Modal
        isOpen={!!selectedTask}
        onClose={closeModal}
        title={isEditing ? "Edit Task" : "Task Details"}
      >
        {selectedTask && (
          <div className="flex flex-col gap-5">
            {/* ── Detail View ── */}
            {!isEditing && (
              <>
                {/* Info */}
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)]">
                      Plan
                    </span>
                    <span className="font-medium text-[var(--color-text-primary)]">
                      {selectedTask.workout_plan_title ??
                        `Plan #${selectedTask.workout_plan}`}
                    </span>
                  </div>
                  {isTrainer && (
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-secondary)]">
                        Member
                      </span>
                      <span className="font-medium text-[var(--color-text-primary)]">
                        {selectedTask.member_email ??
                          `Member #${selectedTask.member}`}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)]">
                      Due Date
                    </span>
                    <span className="font-medium text-[var(--color-text-primary)]">
                      {selectedTask.due_date}
                    </span>
                  </div>
                </div>

                <hr className="border-[var(--color-border)]" />

                {/* Status buttons */}
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                    Status
                  </span>
                  <div className="flex gap-2">
                    {STATUSES.map(({ key, label }) => {
                      const isActive = selectedTask.status === key;
                      const isLoading = updatingStatus === key;
                      const canChange = isTrainer || isMember;
                      return (
                        <button
                          key={key}
                          onClick={() => canChange && handleStatusChange(key)}
                          disabled={!canChange || !!updatingStatus}
                          className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 disabled:opacity-50
                            ${
                              isActive
                                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                                : "bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                            }`}
                        >
                          {isLoading ? (
                            <Spinner className="w-3 h-3 mx-auto" />
                          ) : (
                            label
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-[var(--color-danger)]">{error}</p>
                )}

                {/* Edit + Delete — Trainer only */}
                {isTrainer && (
                  <>
                    <hr className="border-[var(--color-border)]" />
                    <div className="flex gap-3">
                      <button
                        onClick={openEdit}
                        className="flex-1 px-4 py-2 rounded-xl text-sm font-medium border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all duration-200"
                      >
                        Edit Task
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex-1 px-4 py-2 rounded-xl text-sm font-medium border border-[var(--color-danger)] text-[var(--color-danger)] hover:bg-[var(--color-danger)] hover:text-white transition-all duration-200 disabled:opacity-50"
                      >
                        {deleting ? (
                          <Spinner className="w-4 h-4 mx-auto" />
                        ) : (
                          "Delete Task"
                        )}
                      </button>
                    </div>
                  </>
                )}
              </>
            )}

            {/* ── Edit View ── */}
            {isEditing && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-[var(--color-text-primary)]">
                    Member
                  </label>
                  <select
                    value={editData.member}
                    onChange={(e) =>
                      setEditData((p) => ({ ...p, member: e.target.value }))
                    }
                    className={selectClass}
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.email}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Due Date"
                  type="date"
                  value={editData.due_date}
                  onChange={(e) =>
                    setEditData((p) => ({ ...p, due_date: e.target.value }))
                  }
                />

                {error && (
                  <p className="text-xs text-[var(--color-danger)]">{error}</p>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setError("");
                    }}
                    className="flex-1 px-4 py-2 rounded-xl text-sm font-medium border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditSubmit}
                    disabled={editSubmitting}
                    className="flex-1 px-4 py-2 rounded-xl text-sm font-medium bg-[var(--color-primary)] text-white hover:opacity-90 transition-all duration-200 disabled:opacity-50"
                  >
                    {editSubmitting ? (
                      <Spinner className="w-4 h-4 mx-auto" />
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
