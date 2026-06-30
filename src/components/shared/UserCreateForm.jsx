import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { createUser, getUsers } from "@/services/userService";
import { ROLES } from "@/utils/constants";
import useRole from "@/hooks/useRole";
import { getBranches } from "@/services/branchService";
import { ChevronDown } from "lucide-react";

const DROPDOWN_MARGIN = 8; // breathing room from screen/modal edge
const DROPDOWN_MAX_CAP = 240; // never grow taller than this even if space allows

function CustomSelect({ value, onChange, options, placeholder = "Select" }) {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [maxHeight, setMaxHeight] = useState(DROPDOWN_MAX_CAP);
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

  // Recalculate position/height on open, and keep it correct if the
  // modal scrolls or the viewport resizes (e.g. mobile keyboard opening).
  useEffect(() => {
    if (!open) return;

    const recalc = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom - DROPDOWN_MARGIN;
      const spaceAbove = rect.top - DROPDOWN_MARGIN;

      // Pick whichever side actually has more room, then clamp the
      // dropdown height to whatever that side can really offer —
      // this is what stops it from ever spilling outside the modal.
      const shouldOpenUp = spaceBelow < 160 && spaceAbove > spaceBelow;
      setOpenUp(shouldOpenUp);
      const available = shouldOpenUp ? spaceAbove : spaceBelow;
      setMaxHeight(Math.max(120, Math.min(available, DROPDOWN_MAX_CAP)));
    };

    recalc();
    window.addEventListener("resize", recalc);
    window.addEventListener("scroll", recalc, true);
    return () => {
      window.removeEventListener("resize", recalc);
      window.removeEventListener("scroll", recalc, true);
    };
  }, [open]);

  const handleOpen = () => setOpen((p) => !p);

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
          className={`shrink-0 text-[var(--color-text-secondary)] transition-transform duration-150 mr-1 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          style={{ maxHeight: `${maxHeight}px` }}
          className={[
            "absolute left-0 right-0 z-50 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-1)] shadow-lg overflow-y-auto",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        role: formData.role,
        mobile_number: formData.mobile_number,
      };
      if (isAdmin) payload.gym_branch = formData.gym_branch;
      if (formData.role === ROLES.MEMBER && formData.trainer)
        payload.trainer = formData.trainer;

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
      setError(
        data?.role?.[0] ||
          data?.email?.[0] ||
          data?.mobile_number?.[0] ||
          data?.message ||
          "Something went wrong",
      );
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
        onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
        required
      />
      <Input
        label="Mobile Number"
        name="mobile_number"
        type="tel"
        placeholder="Enter mobile number"
        value={formData.mobile_number}
        onChange={(e) =>
          setFormData((p) => ({ ...p, mobile_number: e.target.value }))
        }
        required
      />
      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="Enter password"
        value={formData.password}
        onChange={(e) =>
          setFormData((p) => ({ ...p, password: e.target.value }))
        }
        required
      />

      {/* Role */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-[var(--color-text-primary)]">
          Role
        </label>
        {isAdmin ? (
          <div className="px-4 py-2 text-sm border border-[var(--color-border)] rounded-xl bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] opacity-70 cursor-not-allowed">
            Gym Manager
          </div>
        ) : (
          <CustomSelect
            value={formData.role}
            onChange={(val) => setFormData((p) => ({ ...p, role: val }))}
            options={roleOptions}
            placeholder="Select role"
          />
        )}
      </div>

      {/* Admin → Branch */}
      {isAdmin && (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[var(--color-text-primary)]">
            Branch
          </label>
          <CustomSelect
            value={formData.gym_branch}
            onChange={(val) => setFormData((p) => ({ ...p, gym_branch: val }))}
            options={branches.map((b) => ({ value: b.id, label: b.name }))}
            placeholder="Select branch"
          />
        </div>
      )}

      {/* Member → Trainer */}
      {formData.role === ROLES.MEMBER && (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[var(--color-text-primary)]">
            Assign Trainer
          </label>
          <CustomSelect
            value={formData.trainer}
            onChange={(val) => setFormData((p) => ({ ...p, trainer: val }))}
            options={trainers.map((t) => ({ value: t.id, label: t.email }))}
            placeholder="Select trainer"
          />
        </div>
      )}

      {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}

      <Button type="submit" className="w-full mt-2" disabled={loading}>
        {loading ? <Spinner className="w-4 h-4 mx-auto" /> : "Create User"}
      </Button>
    </form>
  );
}
