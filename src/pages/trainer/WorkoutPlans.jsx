import { useState, useEffect, useCallback } from "react";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  getWorkoutPlans,
  createWorkoutPlan,
  updateWorkoutPlan,
  deleteWorkoutPlan,
} from "@/services/workoutPlanService";
import useRole from "@/hooks/useRole";

const EMPTY_FORM = { title: "", description: "" };

const MODAL_TITLES = {
  create: "Create Workout Plan",
  edit: "Edit Workout Plan",
  delete: "Delete Workout Plan",
};

export default function WorkoutPlans() {
  const { isTrainer } = useRole();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState({ type: null, plan: null });
  const [formData, setFormData] = useState(EMPTY_FORM);

  const openModal = (type, plan = null) => {
    setError("");
    setFormData(
      plan ? { title: plan.title, description: plan.description } : EMPTY_FORM,
    );
    setModal({ type, plan });
  };

  const closeModal = () => {
    setModal({ type: null, plan: null });
    setFormData(EMPTY_FORM);
    setError("");
  };

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getWorkoutPlans();
      setPlans(data.results ?? data);
    } catch {
      setPlans([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);
    try {
      if (modal.type === "create") await createWorkoutPlan(formData);
      if (modal.type === "edit")
        await updateWorkoutPlan(modal.plan.id, formData);
      if (modal.type === "delete") await deleteWorkoutPlan(modal.plan.id);
      closeModal();
      fetchPlans();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.title?.[0] ||
          "Something went wrong",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: "title",
      label: "Title",
      render: (row) => (
        <span className="font-medium text-[var(--color-text-primary)]">
          {row.title}
        </span>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (row) => (
        <span className="text-[var(--color-text-secondary)] line-clamp-1">
          {row.description}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      render: (row) => (
        <span className="text-[var(--color-text-secondary)]">
          {new Date(row.created_at).toLocaleDateString("en-GB")}
        </span>
      ),
    },
    ...(isTrainer
      ? [
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openModal("edit", row)}
                  className="px-3 py-1 text-xs font-medium rounded-lg border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => openModal("delete", row)}
                  className="px-3 py-1 text-xs font-medium rounded-lg border border-[var(--color-danger)] text-[var(--color-danger)] hover:bg-[var(--color-danger)] hover:text-white transition-all duration-200"
                >
                  Delete
                </button>
              </div>
            ),
          },
        ]
      : []),
  ];

  const renderModalContent = () => {
    if (modal.type === "delete") {
      return (
        <div className="flex flex-col gap-6">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-[var(--color-text-primary)]">
              {modal.plan?.title}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex items-center gap-3">
            <Button className="flex-1" onClick={closeModal}>
              Cancel
            </Button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 px-4 py-2 rounded-xl font-medium text-sm bg-[var(--color-danger)] text-white hover:opacity-90 transition-all duration-200 disabled:opacity-50"
            >
              {submitting ? (
                <Spinner className="w-4 h-4 mx-auto" />
              ) : (
                "Yes, Delete"
              )}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        <Input
          label="Title"
          name="title"
          placeholder="e.g. Strength Builder - Week 1"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          required
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm md:text-base font-medium text-[var(--color-text-primary)]">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Describe the workout plan..."
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={3}
            required
            className="px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base border border-[var(--color-border)] rounded-xl bg-transparent text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)] transition-all duration-200 resize-none"
          />
        </div>
        {error && (
          <p className="text-xs md:text-sm text-[var(--color-danger)]">
            {error}
          </p>
        )}
        <Button
          onClick={handleSubmit}
          className="w-full mt-2"
          disabled={submitting}
        >
          {submitting ? (
            <Spinner className="w-4 h-4 mx-auto" />
          ) : modal.type === "create" ? (
            "Create Plan"
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Workout Plans
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {isTrainer
              ? "Create and manage workout plans"
              : "View branch workout plans"}
          </p>
        </div>
        {isTrainer && (
          <Button onClick={() => openModal("create")}>+ New Plan</Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner className="w-8 h-8" />
        </div>
      ) : plans.length === 0 ? (
        <EmptyState message="No workout plans found" />
      ) : (
        <Table columns={columns} data={plans} />
      )}

      <Modal
        isOpen={modal.type !== null}
        onClose={closeModal}
        title={MODAL_TITLES[modal.type]}
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
}
