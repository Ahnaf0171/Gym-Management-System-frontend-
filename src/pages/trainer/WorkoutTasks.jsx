import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { WorkoutTaskTable } from "@/components/shared/WorkoutTaskTable";
import {
  getWorkoutTasks,
  createWorkoutTask,
} from "@/services/workoutTaskService";
import { getWorkoutPlans } from "@/services/workoutPlanService";
import { getUsers } from "@/services/userService";
import { ROLES } from "@/utils/constants";
import useRole from "@/hooks/useRole";

const selectClass =
  "px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base border border-[var(--color-border)] rounded-xl bg-[var(--color-surface-2)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)] transition-all duration-200";

const EMPTY_FORM = { workout_plan: "", member: "", due_date: "" };

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
            className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Workout Tasks
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Assign and manage member tasks
          </p>
        </div>
        {/* Trainer হলেই New Task button দেখাবে */}
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

      {/* Create Task Modal — Trainer only */}
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
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm md:text-base font-medium text-[var(--color-text-primary)]">
                Workout Plan
              </label>
              <select
                name="workout_plan"
                value={formData.workout_plan}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, workout_plan: e.target.value }))
                }
                required
                className={selectClass}
              >
                <option value="">Select plan</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm md:text-base font-medium text-[var(--color-text-primary)]">
                Member
              </label>
              <select
                name="member"
                value={formData.member}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, member: e.target.value }))
                }
                required
                className={selectClass}
              >
                <option value="">Select member</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.email}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Due Date"
              name="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) =>
                setFormData((p) => ({ ...p, due_date: e.target.value }))
              }
              required
            />

            {error && (
              <p className="text-xs md:text-sm text-[var(--color-danger)]">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full mt-2" disabled={submitting}>
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
