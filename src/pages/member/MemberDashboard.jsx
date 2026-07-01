import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getDashboardStats } from "@/services/dashboardService";
import { DashboardStats } from "@/components/shared/DashboardStats";
import {
  checkIn,
  checkOut,
  getAttendance,
  deleteAttendance,
} from "@/services/attendanceService";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import {
  ClipboardList,
  Clock,
  CheckSquare,
  CheckCircle,
  AlertCircle,
  Trash2,
} from "lucide-react";

export default function MemberDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [attendanceList, setAttendanceList] = useState([]);
  const [activeAttendance, setActiveAttendance] = useState(null);
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // ── Stats ────────────────────────────────────────
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch {
        setStats({
          total_tasks: 0,
          pending_tasks: 0,
          in_progress_tasks: 0,
          completed_tasks: 0,
        });
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  // ── Attendance ───────────────────────────────────
  useEffect(() => {
    const fetchAttendance = async () => {
      setAttendanceLoading(true);
      try {
        const data = await getAttendance();
        const records = data.results ?? data;
        const today = new Date().toDateString();
        const todayRecords = records.filter(
          (r) =>
            new Date(r.check_in).toDateString() === today &&
            Number(r.member) === Number(user?.id),
        );
        setAttendanceList(todayRecords);
        setActiveAttendance(todayRecords.find((r) => !r.check_out) ?? null);
      } catch {
        setAttendanceList([]);
        setActiveAttendance(null);
      } finally {
        setAttendanceLoading(false);
      }
    };
    fetchAttendance();
  }, [user?.id]);

  // Auto-hide the inline error after a few seconds
  useEffect(() => {
    if (!attendanceError) return;
    const timer = setTimeout(() => setAttendanceError(null), 5000);
    return () => clearTimeout(timer);
  }, [attendanceError]);

  // ── Handlers ─────────────────────────────────────
  const handleCheckIn = async () => {
    setActionLoading(true);
    setAttendanceError(null);
    try {
      const data = await checkIn();
      setAttendanceList((prev) => [data, ...prev]);
      setActiveAttendance(data);
    } catch (err) {
      const msg =
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.detail ||
        "Check in failed";
      setAttendanceError(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    setAttendanceError(null);
    try {
      const data = await checkOut(activeAttendance.id);
      setAttendanceList((prev) =>
        prev.map((r) => (r.id === activeAttendance.id ? data : r)),
      );
      setActiveAttendance(null);
    } catch (err) {
      const msg =
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.detail ||
        "Check out failed";
      setAttendanceError(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    const id = confirmDeleteId;
    if (!id) return;

    setConfirmDeleteId(null);
    setDeletingId(id);
    setAttendanceError(null);
    try {
      await deleteAttendance(id);
      setAttendanceList((prev) => prev.filter((r) => r.id !== id));
      if (activeAttendance?.id === id) {
        setActiveAttendance(null);
      }
    } catch (err) {
      const msg = err.response?.data?.detail || "Could not remove this record.";
      setAttendanceError(msg);
    } finally {
      setDeletingId(null);
    }
  };

  // ── Stat cards ───────────────────────────────────
  const statCards = [
    {
      id: 1,
      label: "Total Tasks",
      value: stats?.total_tasks ?? 0,
      icon: <ClipboardList size={22} />,
      color: "var(--color-info)",
      to: "/member/my-tasks",
    },
    {
      id: 2,
      label: "Pending",
      value: stats?.pending_tasks ?? 0,
      icon: <Clock size={22} />,
      color: "var(--color-warning)",
      to: "/member/my-tasks",
    },
    {
      id: 3,
      label: "In Progress",
      value: stats?.in_progress_tasks ?? 0,
      icon: <CheckSquare size={22} />,
      color: "var(--color-primary)",
      to: "/member/my-tasks",
    },
    {
      id: 4,
      label: "Completed",
      value: stats?.completed_tasks ?? 0,
      icon: <CheckCircle size={22} />,
      color: "var(--color-success)",
      to: "/member/my-tasks",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1
          className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Welcome, {user?.email}
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Your fitness overview
        </p>
      </div>

      {/* Stats */}
      <DashboardStats stats={statCards} loading={statsLoading} />

      {/* Attendance */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-1)] p-6 flex flex-col gap-4">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">
            Attendance Today
          </p>

          {attendanceLoading ? (
            <Spinner className="w-5 h-5" />
          ) : (
            <div className="flex gap-3">
              <Button
                onClick={handleCheckIn}
                disabled={actionLoading || !!activeAttendance}
              >
                {actionLoading && !activeAttendance ? (
                  <Spinner className="w-4 h-4 mx-auto" />
                ) : (
                  "Check In"
                )}
              </Button>
              <button
                onClick={handleCheckOut}
                disabled={actionLoading || !activeAttendance}
                className="px-4 py-2 rounded-xl text-sm font-medium border border-[var(--color-danger)] text-[var(--color-danger)] hover:bg-[var(--color-danger)] hover:text-white transition-all duration-200 disabled:opacity-40"
              >
                {actionLoading && !!activeAttendance ? (
                  <Spinner className="w-4 h-4 mx-auto" />
                ) : (
                  "Check Out"
                )}
              </button>
            </div>
          )}
        </div>

        {/* Inline error message (replaces alert()) */}
        {attendanceError && (
          <div
            className="flex items-start gap-2 text-sm px-4 py-3 rounded-xl border"
            style={{
              color: "var(--color-danger)",
              backgroundColor: "var(--color-danger)15",
              borderColor: "var(--color-danger)40",
            }}
          >
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{attendanceError}</span>
          </div>
        )}

        {/* Records */}
        {attendanceLoading ? null : attendanceList.length === 0 ? (
          <p className="text-xs text-[var(--color-text-secondary)]">
            Not checked in today
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {attendanceList.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between gap-2 text-xs px-4 py-2 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)]"
              >
                <div className="flex items-center gap-4">
                  <span className="text-[var(--color-text-secondary)]">
                    Check In:{" "}
                    <span className="font-medium text-[var(--color-text-primary)]">
                      {new Date(r.check_in).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </span>
                  <span className="text-[var(--color-text-secondary)]">
                    Check Out:{" "}
                    <span className="font-medium text-[var(--color-text-primary)]">
                      {r.check_out
                        ? new Date(r.check_out).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(r.id)}
                  disabled={deletingId === r.id}
                  className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:text-white hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                  aria-label="Remove record"
                  title="Remove record"
                >
                  {deletingId === r.id ? (
                    <Spinner className="w-3.5 h-3.5" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {confirmDeleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setConfirmDeleteId(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-1)] p-6 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-1">
              <p className="text-base font-semibold text-[var(--color-text-primary)]">
                Delete attendance record?
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Do you want to delete this attendance? This action cannot be
                undone.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)] transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-all duration-200"
                style={{ backgroundColor: "var(--color-danger)" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
