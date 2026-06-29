import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateUser } from "@/services/userService";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { Trash2, X, ChevronDown } from "lucide-react";
import { API_BASE_URL } from "@/utils/constants";

const GENDER_OPTIONS = [
  { value: "", label: "— Select" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

/* Custom dropdown — fixed size, never expands the layout */
function GenderDropdown({ value, onChange, inputCls }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Outside click → close
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

  const selected =
    GENDER_OPTIONS.find((o) => o.value === value) ?? GENDER_OPTIONS[0];

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={
          inputCls + " flex items-center justify-between gap-1 cursor-pointer"
        }
      >
        <span>{selected.label}</span>
        <ChevronDown
          size={12}
          className={`shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown list — absolute, same width as trigger */}
      {open && (
        <ul className="absolute top-full left-0 right-0 mt-1 z-50 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-1)] shadow-lg overflow-hidden">
          {GENDER_OPTIONS.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={
                  "w-full text-left px-3 py-1.5 text-xs transition-colors duration-100 " +
                  (opt.value === value
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

export default function EditProfileModal({
  onClose,
  onSaved,
  targetUser = null,
}) {
  const { user, setUser } = useAuth();
  const activeUser = targetUser ?? user;

  const [visible, setVisible] = useState(false);
  const [formState, setFormState] = useState({
    username: activeUser?.username ?? "",
    email: activeUser?.email ?? "",
    gender: activeUser?.gender ?? "",
    age: activeUser?.age ?? "",
    mobileNumber: activeUser?.mobile_number ?? "",
    password: "",
    profilePicture: null,
    previewUrl: activeUser?.profile_picture
      ? `${API_BASE_URL}${activeUser.profile_picture}`
      : null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", error: false });

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const set = (key) => (e) =>
    setFormState((prev) => ({ ...prev, [key]: e.target.value }));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormState((prev) => ({
      ...prev,
      profilePicture: file,
      previewUrl: URL.createObjectURL(file),
    }));
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setFormState((prev) => ({
      ...prev,
      profilePicture: null,
      previewUrl: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", error: false });
    try {
      const fd = new FormData();
      fd.append("email", formState.email);
      fd.append("username", formState.username);
      fd.append("mobile_number", formState.mobileNumber);
      if (formState.gender) fd.append("gender", formState.gender);
      if (formState.age) fd.append("age", formState.age);
      if (formState.password) fd.append("password", formState.password);
      if (formState.profilePicture)
        fd.append("profile_picture", formState.profilePicture);
      if (!formState.previewUrl && !formState.profilePicture)
        fd.append("remove_profile_picture", "true");

      const updated = await updateUser(activeUser.id, fd);
      if (!targetUser) setUser(updated);
      onSaved?.(updated);
      handleClose();
    } catch (err) {
      const data = err.response?.data;
      const firstError =
        data?.email?.[0] ||
        data?.username?.[0] ||
        data?.mobile_number?.[0] ||
        data?.password?.[0] ||
        data?.non_field_errors?.[0] ||
        "Something went wrong";
      setMessage({ text: firstError, error: true });
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full px-3 py-1.5 text-xs border border-[var(--color-border)] rounded-lg bg-[var(--color-surface-2)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)] transition-colors duration-150";
  const labelCls = "text-[11px] font-medium text-[var(--color-text-secondary)]";

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Edit Profile"
        style={{ opacity: visible ? 1 : 0 }}
        className={[
          "fixed z-50 bg-[var(--color-surface-1)] border border-[var(--color-border)] flex flex-col rounded-2xl",
          "transition-all duration-300 ease-out",
          "left-3 right-3 top-1/2",
          visible
            ? "-translate-y-1/2 scale-100"
            : "-translate-y-[45%] scale-95",
          "md:left-1/2 md:right-auto md:top-1/2 md:-translate-x-1/2 md:w-full md:max-w-sm",
          visible
            ? "md:-translate-y-1/2 md:scale-100"
            : "md:-translate-y-[45%] md:scale-95",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2 shrink-0">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
            Edit Profile
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form body */}
        <div className="px-5 pb-5 overflow-y-auto">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
            {/* Username */}
            <div className="flex flex-col gap-1">
              <label className={labelCls}>Username</label>
              <input
                type="text"
                value={formState.username}
                onChange={set("username")}
                className={inputCls}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className={labelCls}>Email</label>
              <input
                type="email"
                value={formState.email}
                onChange={set("email")}
                required
                className={inputCls}
              />
            </div>

            {/* Gender + Age */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1 min-w-0">
                <label className={labelCls}>Gender</label>
                <GenderDropdown
                  value={formState.gender}
                  onChange={(val) =>
                    setFormState((prev) => ({ ...prev, gender: val }))
                  }
                  inputCls={inputCls}
                />
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <label className={labelCls}>Age</label>
                <input
                  type="number"
                  value={formState.age}
                  onChange={set("age")}
                  min="1"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Mobile */}
            <div className="flex flex-col gap-1">
              <label className={labelCls}>Mobile Number</label>
              <input
                type="tel"
                value={formState.mobileNumber}
                onChange={set("mobileNumber")}
                required
                className={inputCls}
              />
            </div>

            {/* Profile picture */}
            <div className="flex flex-col gap-1">
              <label className={labelCls}>Profile Picture</label>
              <div
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)] cursor-pointer hover:border-[var(--color-primary)] transition-colors"
                onClick={() => document.getElementById("epm-pic-input").click()}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-[var(--color-surface-1)] flex items-center justify-center border border-[var(--color-border)]">
                  {formState.previewUrl ? (
                    <img
                      src={formState.previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-semibold text-[var(--color-text-primary)]">
                      {(activeUser?.username ||
                        activeUser?.email)?.[0]?.toUpperCase() ?? "U"}
                    </span>
                  )}
                </div>
                <p className="flex-1 text-xs text-[var(--color-text-secondary)] truncate">
                  {formState.profilePicture
                    ? formState.profilePicture.name
                    : formState.previewUrl
                      ? "Current photo — tap to change"
                      : "Tap to upload photo"}
                </p>
                {(formState.profilePicture || formState.previewUrl) && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-[var(--color-danger)] hover:opacity-70 transition-opacity shrink-0"
                    aria-label="Remove image"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <input
                id="epm-pic-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className={labelCls}>New Password</label>
              <input
                type="password"
                placeholder="Leave blank to keep current"
                value={formState.password}
                onChange={set("password")}
                className={inputCls}
              />
            </div>

            {/* Error / success */}
            {message.text && (
              <p
                className={`text-[11px] ${message.error ? "text-[var(--color-danger)]" : "text-[var(--color-success)]"}`}
              >
                {message.text}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                variant="ghost"
                className="flex-1 text-xs py-1.5"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 text-xs py-1.5"
                disabled={loading}
              >
                {loading ? <Spinner className="w-3.5 h-3.5 mx-auto" /> : "Save"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
