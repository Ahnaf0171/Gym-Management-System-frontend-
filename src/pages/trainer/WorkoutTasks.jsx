import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { WorkoutTaskTable } from "@/components/shared/workoutTaskTable";
import {
  getWorkoutTasks,
  createWorkoutTask,
} from "@/services/workoutTaskService";
import { getWorkoutPlans } from "@/services/workoutPlanService";
import { getUsers } from "@/services/userService";
import { ROLES } from "@/utils/constants";
import useRole from "@/hooks/useRole";
import { ChevronDown } from "lucide-react";

const EMPTY_FORM = { workout_plan: "", member: "", due_date: "" };

/* ── Same CustomSelect pattern ── */
function CustomSelect({ value, onChange, options, placeholder = "Select" }) {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const ref = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, []);

  const handleOpen = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const estimatedHeight = Math.min(options.length + 1, 5) * 36;
      setOpenUp(spaceBelow < estimatedHeight + 8);
    }
    setOpen((p) => !p);
  };

  const selected = options.find((o) => String(o.value) === String(value));

  return (
    <div ref={ref} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className="w-full flex items-center justify-between gap-2 px-4 py-2 text-sm border border-[var(--color-border)] rounded-xl bg-[var(--color-surface-2)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)] transition-all duration-200 cursor-pointer"
      >
        <span
          className={
            selected
              ? "text-[var(--color-text-primary)]"
              : "text-[var(--color-text-secondary)]"
          }
        >
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-[var(--color-text-secondary)] transition-transform duration-150 mr-1.5 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          className={[
            "absolute left-0 right-0 z-50 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-1)] shadow-lg overflow-y-auto max-h-40",
            openUp ? "bottom-full mb-1" : "top-full mt-1",
          ].join(" ")}
        >
          <li>
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] transition-colors"
            >
              {placeholder}
            </button>
          </li>
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => {
                  onChange(String(opt.value));
                  setOpen(false);
                }}
                className={
                  "w-full text-left px-4 py-2 text-sm transition-colors duration-100 " +
                  (String(opt.value) === String(value)
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]")
                }
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ── Custom calendar date picker — opens UPWARD by default (above trigger) ── */
function CustomDatePicker({ value, onChange, placeholder = "Select date" }) {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(true);
  const [viewDate, setViewDate] = useState(() =>
    value ? new Date(value) : new Date(),
  );
  const ref = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, []);

  const handleOpen = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;
      // Prefer opening upward; only flip down if not enough room above
      setOpenUp(spaceAbove > 320 || spaceAbove > spaceBelow);
    }
    setOpen((p) => !p);
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = viewDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const isSelected = (day) => {
    if (!value) return false;
    const [vy, vm, vd] = value.split("-").map(Number);
    return vy === year && vm === month + 1 && vd === day;
  };

  const selectDay = (day) => {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    onChange(`${year}-${mm}-${dd}`);
    setOpen(false);
  };

  const displayValue = value
    ? new Date(value).toLocaleDateString("default", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <div ref={ref} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className="w-full flex items-center justify-between gap-2 px-4 py-2 text-sm border border-[var(--color-border)] rounded-xl bg-[var(--color-surface-2)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)] transition-all duration-200 cursor-pointer"
      >
        <span
          className={
            displayValue
              ? "text-[var(--color-text-primary)]"
              : "text-[var(--color-text-secondary)]"
          }
        >
          {displayValue || placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-[var(--color-text-secondary)] transition-transform duration-150 mr-1.5 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className={[
            "absolute left-0 right-0 z-50 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-1)] shadow-lg p-3",
            openUp ? "bottom-full mb-1" : "top-full mt-1",
          ].join(" ")}
        >
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={() => setViewDate(new Date(year, month - 1, 1))}
              className="px-2 py-1 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)]"
            >
              ‹
            </button>
            <span className="text-xs font-semibold text-[var(--color-text-primary)]">
              {monthLabel}
            </span>
            <button
              type="button"
              onClick={() => setViewDate(new Date(year, month + 1, 1))}
              className="px-2 py-1 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)]"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <span
                key={i}
                className="text-[10px] text-center text-[var(--color-text-secondary)]"
              >
                {d}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) =>
              day === null ? (
                <span key={i} />
              ) : (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectDay(day)}
                  className={
                    "text-xs h-7 rounded-lg transition-colors duration-100 " +
                    (isSelected(day)
                      ? "bg-[var(--color-primary)] text-white"
                      : "text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]")
                  }
                >
                  {day}
                </button>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function WorkoutTasks() {
  const { isTrainer } = useRole();

  const [tasks, setTasks] = useState([]);
  const [plans, setPlans] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(EMPTY_FORM);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getWorkoutTasks();
      setTasks(data.results ?? data);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFormData = useCallback(async () => {
    try {
      const [plansData, usersData] = await Promise.all([
        getWorkoutPlans(),
        getUsers(1, ROLES.MEMBER),
      ]);
      setPlans(plansData.results ?? []);
      setMembers(usersData.results ?? []);
    } catch {
      setPlans([]);
      setMembers([]);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchFormData();
  }, [fetchTasks, fetchFormData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await createWorkoutTask({
        workout_plan: Number(formData.workout_plan),
        member: Number(formData.member),
        due_date: formData.due_date,
      });
      setIsOpen(false);
      setFormData(EMPTY_FORM);
      fetchTasks();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.non_field_errors?.[0] ||
          "Something went wrong",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-xl md:text-2xl font-bold text-[var(--color-text-primary)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Workout Tasks
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Assign and manage member tasks
          </p>
        </div>
        {isTrainer && (
          <Button
            onClick={() => {
              setIsOpen(true);
              fetchFormData();
            }}
          >
            + New Task
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner className="w-8 h-8" />
        </div>
      ) : (
        <WorkoutTaskTable
          tasks={tasks}
          onStatusUpdate={fetchTasks}
          members={members}
        />
      )}

      {isTrainer && (
        <Modal
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
            setError("");
            setFormData(EMPTY_FORM);
          }}
          title="Assign Workout Task"
        >
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1"
          >
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[var(--color-text-primary)]">
                Workout Plan
              </label>
              <CustomSelect
                value={formData.workout_plan}
                onChange={(val) =>
                  setFormData((p) => ({ ...p, workout_plan: val }))
                }
                options={plans.map((p) => ({ value: p.id, label: p.title }))}
                placeholder="Select plan"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[var(--color-text-primary)]">
                Member
              </label>
              <CustomSelect
                value={formData.member}
                onChange={(val) => setFormData((p) => ({ ...p, member: val }))}
                options={members.map((m) => ({ value: m.id, label: m.email }))}
                placeholder="Select member"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[var(--color-text-primary)]">
                Due Date
              </label>
              <CustomDatePicker
                value={formData.due_date}
                onChange={(val) =>
                  setFormData((p) => ({ ...p, due_date: val }))
                }
                placeholder="Select due date"
              />
            </div>

            {error && (
              <p className="text-xs text-[var(--color-danger)]">{error}</p>
            )}

            <Button type="submit" className="w-full mt-4" disabled={submitting}>
              {submitting ? (
                <Spinner className="w-4 h-4 mx-auto" />
              ) : (
                "Assign Task"
              )}
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
}
