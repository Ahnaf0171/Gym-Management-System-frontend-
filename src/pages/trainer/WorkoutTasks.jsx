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
const inputClass =
  "w-full px-4 py-2 text-sm border border-[var(--color-border)] rounded-xl bg-[var(--color-surface-2)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)] transition-all duration-200";

// Plain text input, auto-formats digits into YYYY-MM-DD as the user types.
// No native/browser calendar icon, so it can never pop out of the modal.
export function formatDateInput(raw) {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  const y = digits.slice(0, 4);
  const m = digits.slice(4, 6);
  const d = digits.slice(6, 8);
  return [y, m, d].filter(Boolean).join("-");
}

/* Dropdown with its own internal scroll (max-h-40) — only this scrolls, never the modal */
function CustomSelect({ value, onChange, options, placeholder = "Select" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => String(o.value) === String(value));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`${inputClass} flex items-center justify-between cursor-pointer`}
      >
        <span className={selected ? "" : "text-[var(--color-text-secondary)]"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-[var(--color-text-secondary)] transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul className="absolute left-0 right-0 top-full mt-1 z-50 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-1)] shadow-lg overflow-y-auto max-h-40">
          <li>
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)]"
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
                  "w-full text-left px-4 py-2 text-sm " +
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

    if (!formData.workout_plan) {
      setError("Please select a workout plan");
      return;
    }
    if (!formData.member) {
      setError("Please select a member");
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.due_date)) {
      setError("Please select a due date");
      return;
    }

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
          {/* No outer scroll here — only the dropdown list scrolls internally */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              {/* Plain text input — user types the date, no calendar popup at all */}
              <input
                type="text"
                inputMode="numeric"
                placeholder="YYYY-MM-DD"
                maxLength={10}
                value={formData.due_date}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    due_date: formatDateInput(e.target.value),
                  }))
                }
                className={inputClass}
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
