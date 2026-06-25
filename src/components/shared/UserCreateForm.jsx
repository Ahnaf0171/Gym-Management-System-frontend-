import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { createUser } from "@/services/userService";
import { getUsers } from "@/services/userService";
import { ROLES } from "@/utils/constants";
import useRole from "@/hooks/useRole";
import { getBranches } from "@/services/branchService";

export function UserCreateForm({ onSuccess, className = "" }) {
  const { isAdmin } = useRole();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: isAdmin ? ROLES.MANAGER : "",
    gym_branch: "",
    trainer: "",
    mobile_number: "",
  });

  const [branches, setBranches] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAdmin) {
      getBranches()
        .then((data) => setBranches(data.results ?? data))
        .catch(() => setBranches([]));
    }
  }, [isAdmin]);

  useEffect(() => {
    if (formData.role === ROLES.MEMBER) {
      getUsers(1, ROLES.TRAINER)
        .then((data) => setTrainers(data.results ?? []))
        .catch(() => setTrainers([]));
    } else {
      setTrainers([]);
      setFormData((prev) => ({ ...prev, trainer: "" }));
    }
  }, [formData.role]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let payload = {
        email: formData.email,
        password: formData.password,
        role: formData.role,
        mobile_number: formData.mobile_number,
      };

      if (isAdmin) {
        payload.gym_branch = formData.gym_branch;
      }

      if (formData.role === ROLES.MEMBER && formData.trainer) {
        payload.trainer = formData.trainer;
      }

      await createUser(payload);
      onSuccess?.();
      setFormData({
        email: "",
        password: "",
        role: "",
        gym_branch: "",
        trainer: "",
        mobile_number: "",
      });
    } catch (err) {
      const data = err.response?.data;
      if (data?.role) {
        setError(data.role[0]);
      } else if (data?.email) {
        setError(data.email[0]);
      } else if (data?.mobile_number) {
        setError(data.mobile_number[0]);
      } else if (data?.message) {
        setError(data.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = isAdmin
    ? [{ value: ROLES.MANAGER, label: "Gym Manager" }]
    : [
        { value: ROLES.TRAINER, label: "Trainer" },
        { value: ROLES.MEMBER, label: "Member" },
      ];

  const selectClass =
    "px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base border border-[var(--color-border)] rounded-xl bg-[var(--color-surface-2)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)] transition-all duration-200";

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col gap-4 ${className}`}
    >
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="Enter email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <Input
        label="Mobile Number"
        name="mobile_number"
        type="tel"
        placeholder="Enter mobile number"
        value={formData.mobile_number}
        onChange={handleChange}
        required
      />
      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="Enter password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      {isAdmin ? (
        <div className="flex flex-col gap-1">
          <label className="text-sm md:text-base font-medium text-[var(--color-text-primary)]">
            Role
          </label>
          <div className={`${selectClass} opacity-70 cursor-not-allowed`}>
            Gym Manager
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <label className="text-sm md:text-base font-medium text-[var(--color-text-primary)]">
            Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className={selectClass}
          >
            <option value="">Select role</option>
            {roleOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Admin → Branch dropdown */}
      {isAdmin && (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[var(--color-text-primary)]">
            Branch
          </label>
          <select
            name="gym_branch"
            value={formData.gym_branch}
            onChange={handleChange}
            required
            className={selectClass}
          >
            <option value="">Select branch</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Member → Trainer dropdown */}
      {formData.role === ROLES.MEMBER && (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[var(--color-text-primary)]">
            Assign Trainer
          </label>
          <select
            name="trainer"
            value={formData.trainer}
            onChange={handleChange}
            required
            className={selectClass}
          >
            <option value="">Select trainer</option>
            {trainers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.email}
              </option>
            ))}
          </select>
        </div>
      )}

      {error && (
        <p className="text-xs md:text-sm text-[var(--color-danger)]">{error}</p>
      )}

      <Button type="submit" className="w-full mt-2" disabled={loading}>
        {loading ? <Spinner className="w-4 h-4 mx-auto" /> : "Create User"}
      </Button>
    </form>
  );
}
