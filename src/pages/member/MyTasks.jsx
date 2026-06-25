import { useState, useEffect, useCallback } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { WorkoutTaskTable } from "@/components/shared/workoutTaskTable";
import { getWorkoutTasks } from "@/services/workoutTaskService";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1
          className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          My Tasks
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          View and update your assigned workout tasks
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner className="w-8 h-8" />
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState message="No tasks assigned yet" />
      ) : (
        <WorkoutTaskTable tasks={tasks} onStatusUpdate={fetchTasks} />
      )}
    </div>
  );
}
