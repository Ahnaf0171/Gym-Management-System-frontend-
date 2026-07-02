// components/shared/AttendanceTable.jsx
import { useState, useEffect, useCallback } from "react";
import { Table } from "@/components/ui/Table";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { getAttendance, deleteAttendance } from "@/services/attendanceService";
import { Trash2 } from "lucide-react";

function formatDateTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AttendanceTable() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAttendance();
      setAttendance(data.results ?? data);
      setTotal(data.count ?? 0);
    } catch {
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const handleDelete = useCallback(async () => {
    if (!confirmId) return;
    setDeletingId(confirmId);
    try {
      await deleteAttendance(confirmId);
      setAttendance((prev) => prev.filter((row) => row.id !== confirmId));
      setTotal((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to delete attendance record", err);
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  }, [confirmId]);

  const columns = [
    {
      key: "member_email",
      label: "Member",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {row.member_email?.[0]?.toUpperCase() ?? "?"}
          </div>
          <span className="font-medium text-[var(--color-text-primary)]">
            {row.member_email ?? `Member #${row.member}`}
          </span>
        </div>
      ),
    },
    {
      key: "check_in",
      label: "Check In",
      render: (row) => (
        <span className="text-[var(--color-text-secondary)]">
          {formatDateTime(row.check_in)}
        </span>
      ),
    },
    {
      key: "check_out",
      label: "Check Out",
      render: (row) => (
        <span className="text-[var(--color-text-secondary)]">
          {formatDateTime(row.check_out)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className="text-xs font-medium px-2.5 py-1 rounded-full"
          style={{
            color: row.check_out
              ? "var(--color-success)"
              : "var(--color-warning)",
            backgroundColor: row.check_out
              ? "var(--color-success)20"
              : "var(--color-warning)20",
          }}
        >
          {row.check_out ? "Checked Out" : "Present"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <button
          type="button"
          onClick={() => setConfirmId(row.id)}
          disabled={deletingId === row.id}
          className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-white hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Remove attendance record"
          title="Remove record"
        >
          {deletingId === row.id ? (
            <Spinner className="w-4 h-4" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1
          className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Attendance
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          {total} record{total !== 1 ? "s" : ""} found
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner className="w-8 h-8" />
        </div>
      ) : attendance.length === 0 ? (
        <EmptyState message="No attendance records found" />
      ) : (
        <>
          {/* Desktop / tablet: normal table, hidden on mobile */}
          <div className="hidden sm:block">
            <Table columns={columns} data={attendance} />
          </div>

          {/* Mobile: stacked card per row, no side scroll, text wraps */}
          <div className="flex flex-col gap-3 sm:hidden">
            {attendance.map((row, i) => (
              <div
                key={row.id ?? i}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-1)] p-4 flex flex-col gap-3 w-full min-w-0"
              >
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    >
                      {row.member_email?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <span className="font-medium text-[var(--color-text-primary)] break-words min-w-0">
                      {row.member_email ?? `Member #${row.member}`}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setConfirmId(row.id)}
                    disabled={deletingId === row.id}
                    className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-white hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    aria-label="Remove attendance record"
                  >
                    {deletingId === row.id ? (
                      <Spinner className="w-4 h-4" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--color-text-secondary)]">
                    Check In
                  </span>
                  <span className="text-[var(--color-text-primary)] text-right break-words">
                    {formatDateTime(row.check_in)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--color-text-secondary)]">
                    Check Out
                  </span>
                  <span className="text-[var(--color-text-primary)] text-right break-words">
                    {formatDateTime(row.check_out)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--color-text-secondary)]">
                    Status
                  </span>
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{
                      color: row.check_out
                        ? "var(--color-success)"
                        : "var(--color-warning)",
                      backgroundColor: row.check_out
                        ? "var(--color-success)20"
                        : "var(--color-warning)20",
                    }}
                  >
                    {row.check_out ? "Checked Out" : "Present"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Modal
        isOpen={!!confirmId}
        onClose={() => setConfirmId(null)}
        title="Remove Attendance"
      >
        <p className="text-sm text-[var(--color-text-secondary)] mb-6">
          Do you want to remove this attendance?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setConfirmId(null)}
            className="px-4 py-2 rounded-lg text-sm border border-[var(--color-border)] text-[var(--color-text-primary)]"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={!!deletingId}
            className="px-4 py-2 rounded-lg text-sm bg-red-500 text-white disabled:opacity-50"
          >
            {deletingId ? "Removing..." : "Remove"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
