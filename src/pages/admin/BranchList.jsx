import { useState, useEffect, useCallback } from "react";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { getBranches, createBranch } from "@/services/branchService";
import { Building2 } from "lucide-react";

export default function BranchList() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", location: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await createBranch(formData);
      setIsOpen(false);
      setFormData({ name: "", location: "" });
      fetchBranches();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.name?.[0] ||
          "Something went wrong",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: "name",
      label: "Branch Name",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Building2 size={14} className="text-[var(--color-primary)]" />
          <span className="font-medium text-[var(--color-text-primary)]">
            {row.name}
          </span>
        </div>
      ),
    },
    {
      key: "location",
      label: "Location",
      render: (row) => (
        <span className="text-[var(--color-text-secondary)]">
          {row.location}
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
  ];

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
        <Button onClick={() => setIsOpen(true)}>+ New Branch</Button>
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

      {/* Create Branch Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setError("");
          setFormData({ name: "", location: "" });
        }}
        title="Create New Branch"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Branch Name"
            name="name"
            placeholder="e.g. Uttara North Branch"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            label="Location"
            name="location"
            placeholder="e.g. Uttara Sector-14, Dhaka"
            value={formData.location}
            onChange={handleChange}
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
              "Create Branch"
            )}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
