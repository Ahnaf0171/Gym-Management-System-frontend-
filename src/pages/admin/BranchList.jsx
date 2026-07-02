import { useState, useEffect, useCallback } from "react";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch,
} from "@/services/branchService";
import { Building2, Pencil, Trash2, MapPin } from "lucide-react";

const EMPTY_FORM = { name: "", location: "" };

export default function BranchList() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create modal
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_FORM);
  const [createError, setCreateError] = useState("");
  const [creating, setCreating] = useState(false);

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [editTarget, setEditTarget] = useState(null); // branch being edited
  const [editError, setEditError] = useState("");
  const [editing, setEditing] = useState(false);

  // Delete modal
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [dependencies, setDependencies] = useState(null);

  /* ─── Fetch ─── */
  const fetchBranches = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBranches();
      setBranches(data.results ?? data);
    } catch {
      setBranches([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  /* ─── Create handlers ─── */
  const openCreate = () => {
    setCreateForm(EMPTY_FORM);
    setCreateError("");
    setCreateOpen(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateError("");
    setCreating(true);
    try {
      await createBranch(createForm);
      setCreateOpen(false);
      fetchBranches();
    } catch (err) {
      setCreateError(
        err.response?.data?.message ||
          err.response?.data?.name?.[0] ||
          "Something went wrong",
      );
    } finally {
      setCreating(false);
    }
  };

  /* ─── Edit handlers ─── */
  const openEdit = (branch) => {
    setEditTarget(branch);
    setEditForm({ name: branch.name, location: branch.location });
    setEditError("");
    setEditOpen(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setEditError("");
    setEditing(true);
    try {
      await updateBranch(editTarget.id, editForm);
      setEditOpen(false);
      fetchBranches();
    } catch (err) {
      setEditError(
        err.response?.data?.message ||
          err.response?.data?.name?.[0] ||
          "Something went wrong",
      );
    } finally {
      setEditing(false);
    }
  };

  /* ─── Delete handlers ─── */
  const openDelete = (branch) => {
    setDeleteTarget(branch);
    setDeleteError("");
    setDependencies(null);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteBranch(deleteTarget.id);
      setDeleteOpen(false);
      fetchBranches();
    } catch (err) {
      const data = err.response?.data;
      if (data?.dependencies) {
        setDependencies(data.dependencies);
        setDeleteError(data.detail);
      } else {
        setDeleteError(data?.detail || "Something went wrong");
      }
    } finally {
      setDeleting(false);
    }
  };

  /* ─── Table columns ─── */
  const columns = [
    {
      key: "name",
      label: "Branch Name",
      render: (row) => (
        <div className="flex flex-col">
          {/* Desktop: single row with icon */}
          <div className="flex items-center gap-2">
            <Building2
              size={14}
              className="text-[var(--color-primary)] shrink-0"
            />
            <span className="font-medium text-[var(--color-text-primary)]">
              {row.name}
            </span>
          </div>
          {/* Mobile only: location shown below name */}
          <div className="flex items-center gap-1 mt-0.5 md:hidden">
            <MapPin
              size={12}
              className="text-[var(--color-text-secondary)] shrink-0"
            />
            <span className="text-xs text-[var(--color-text-secondary)]">
              {row.location}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "location",
      label: "Location",
      // Hidden on mobile via th/td className — handled in Table via col.hideOnMobile
      hideOnMobile: true,
      render: (row) => (
        <span className="text-[var(--color-text-secondary)]">
          {row.location}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEdit(row);
            }}
            className="p-2 rounded-lg text-[var(--color-info)] hover:bg-[var(--color-surface-2)] transition-colors"
            title="Edit branch"
          >
            <Pencil size={20} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openDelete(row);
            }}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[var(--color-danger)] hover:bg-[var(--color-surface-2)] transition-colors"
            title="Delete branch"
          >
            <Trash2 size={20} />
          </button>
        </div>
      ),
    },
  ];

  /* ─── Render ─── */
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Branches
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Manage all gym branches
          </p>
        </div>
        <Button onClick={openCreate}>+ New Branch</Button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner className="w-8 h-8" />
        </div>
      ) : branches.length === 0 ? (
        <EmptyState message="No branches found" />
      ) : (
        <Table columns={columns} data={branches} />
      )}

      {/* ── Create Modal ── */}
      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create New Branch"
      >
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <Input
            label="Branch Name"
            name="name"
            placeholder="e.g. Uttara North Branch"
            value={createForm.name}
            onChange={(e) =>
              setCreateForm((p) => ({ ...p, name: e.target.value }))
            }
            required
          />
          <Input
            label="Location"
            name="location"
            placeholder="e.g. Uttara Sector-14, Dhaka"
            value={createForm.location}
            onChange={(e) =>
              setCreateForm((p) => ({ ...p, location: e.target.value }))
            }
            required
          />
          {createError && (
            <p className="text-xs text-[var(--color-danger)]">{createError}</p>
          )}
          <Button type="submit" className="w-full mt-2" disabled={creating}>
            {creating ? (
              <Spinner className="w-4 h-4 mx-auto" />
            ) : (
              "Create Branch"
            )}
          </Button>
        </form>
      </Modal>

      {/* ── Edit Modal ── */}
      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Branch"
      >
        <form onSubmit={handleEdit} className="flex flex-col gap-4">
          <Input
            label="Branch Name"
            name="name"
            placeholder="e.g. Uttara North Branch"
            value={editForm.name}
            onChange={(e) =>
              setEditForm((p) => ({ ...p, name: e.target.value }))
            }
            required
          />
          <Input
            label="Location"
            name="location"
            placeholder="e.g. Uttara Sector-14, Dhaka"
            value={editForm.location}
            onChange={(e) =>
              setEditForm((p) => ({ ...p, location: e.target.value }))
            }
            required
          />
          {editError && (
            <p className="text-xs text-[var(--color-danger)]">{editError}</p>
          )}
          <Button type="submit" className="w-full mt-2" disabled={editing}>
            {editing ? <Spinner className="w-4 h-4 mx-auto" /> : "Save Changes"}
          </Button>
        </form>
      </Modal>

      {/* ── Delete Confirm Modal ── */}
      <Modal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete Branch"
      >
        <div className="flex flex-col gap-5">
          {!dependencies ? (
            <p className="text-sm text-[var(--color-text-secondary)]">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-[var(--color-text-primary)]">
                {deleteTarget?.name}
              </span>
              ? This action cannot be undone.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-[var(--color-danger)] font-medium">
                {deleteError}
              </p>
              <ul className="text-sm text-[var(--color-text-secondary)] flex flex-col gap-1">
                {dependencies.managers > 0 && (
                  <li>• Managers: {dependencies.managers}</li>
                )}
                {dependencies.trainers > 0 && (
                  <li>• Trainers: {dependencies.trainers}</li>
                )}
                {dependencies.members > 0 && (
                  <li>• Members: {dependencies.members}</li>
                )}
                {dependencies.workout_plans > 0 && (
                  <li>• Workout Plans: {dependencies.workout_plans}</li>
                )}
                {dependencies.attendance_records > 0 && (
                  <li>
                    • Attendance Records: {dependencies.attendance_records}
                  </li>
                )}
              </ul>
            </div>
          )}

          {deleteError && !dependencies && (
            <p className="text-xs text-[var(--color-danger)]">{deleteError}</p>
          )}

          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              onClick={() => setDeleteOpen(false)}
              disabled={deleting}
            >
              {dependencies ? "Close" : "Cancel"}
            </Button>
            {!dependencies && (
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? <Spinner className="w-4 h-4 mx-auto" /> : "Delete"}
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
