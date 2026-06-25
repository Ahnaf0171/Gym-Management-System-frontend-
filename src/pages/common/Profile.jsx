import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getRoleLabel } from "@/utils/roleUtils";
import useRole from "@/hooks/useRole";
import { updateUser } from "@/services/userService";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import {
  Mail,
  Building2,
  Calendar,
  Shield,
  User,
  Cake,
  Phone,
} from "lucide-react";
import { API_BASE_URL } from "@/utils/constants";

export default function Profile() {
  const { user, setUser } = useAuth();
  const { roleColor } = useRole();
  const [editing, setEditing] = useState(false);

  const [username, setUsername] = useState(user?.username ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [gender, setGender] = useState(user?.gender ?? "");
  const [age, setAge] = useState(user?.age ?? "");
  const [mobileNumber, setMobileNumber] = useState(user?.mobile_number ?? "");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(
    user?.profile_picture ? `${API_BASE_URL}${user.profile_picture}` : null,
  );

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", error: false });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", error: false });

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("username", username);
      if (gender) formData.append("gender", gender);
      if (age) formData.append("age", age);
      formData.append("mobile_number", mobileNumber);
      if (password) formData.append("password", password);
      if (profilePicture) formData.append("profile_picture", profilePicture);

      const updated = await updateUser(user.id, formData);
      setUser(updated);
      setMessage({ text: "Profile updated!", error: false });
      setPassword("");
      setProfilePicture(null);
      setEditing(false);
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

  const infoItems = [
    {
      id: 1,
      icon: <User size={16} />,
      label: "Username",
      value: user?.username,
    },
    { id: 2, icon: <Mail size={16} />, label: "Email", value: user?.email },
    {
      id: 3,
      icon: <Shield size={16} />,
      label: "Role",
      value: getRoleLabel(user?.role),
      color: roleColor,
    },
    {
      id: 4,
      icon: <User size={16} />,
      label: "Gender",
      value: user?.gender
        ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
        : "—",
    },
    { id: 5, icon: <Cake size={16} />, label: "Age", value: user?.age },
    {
      id: 6,
      icon: <Phone size={16} />,
      label: "Mobile",
      value: user?.mobile_number,
    },
    {
      id: 7,
      icon: <Building2 size={16} />,
      label: "Branch",
      value: user?.gym_branch_name ?? "All Branches",
    },
    {
      id: 8,
      icon: <Calendar size={16} />,
      label: "Joined",
      value: user?.created_at
        ? new Date(user.created_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "—",
    },
  ];

  return (
    <div className="max-w-lg mx-auto py-8 px-4 flex flex-col gap-4">
      <div>
        <h1
          className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          My Profile
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Your account information
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-1)] p-6 flex items-center gap-4">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={user?.username || "Profile"}
            className="w-14 h-14 rounded-full object-cover shrink-0 border border-[var(--color-border)]"
          />
        ) : (
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0"
            style={{ backgroundColor: roleColor }}
          >
            {(user?.username || user?.email)?.[0]?.toUpperCase() ?? "?"}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-[var(--color-text-primary)] truncate">
            {user?.username || user?.email}
          </p>
          <span
            className="text-xs font-medium px-2.5 py-1 rounded-full mt-1 inline-block"
            style={{ color: roleColor, backgroundColor: `${roleColor}20` }}
          >
            {getRoleLabel(user?.role)}
          </span>
        </div>
        <Button
          onClick={() => {
            setEditing((p) => !p);
            setMessage({ text: "", error: false });
          }}
          className="text-xs px-3 py-1.5 shrink-0"
        >
          {editing ? "Cancel" : "Edit"}
        </Button>
      </div>

      {/* Edit form */}
      {editing && (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-1)] p-6">
          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <Input
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[var(--color-text-primary)]">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="px-4 py-2 text-sm border border-[var(--color-border)] rounded-xl bg-[var(--color-surface-2)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)] transition-all duration-200"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <Input
              label="Age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min="1"
            />
            <Input
              label="Mobile Number"
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[var(--color-text-primary)]">
                Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-sm text-[var(--color-text-primary)]"
              />
            </div>

            <Input
              label="New Password"
              type="password"
              placeholder="Leave blank to keep current password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {message.text && (
              <p
                className={`text-xs ${message.error ? "text-[var(--color-danger)]" : "text-[var(--color-success)]"}`}
              >
                {message.text}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Spinner className="w-4 h-4 mx-auto" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </div>
      )}

      {/* Info list */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-1)] divide-y divide-[var(--color-border)]">
        {infoItems.map(({ id, icon, label, value, color }) => (
          <div key={id} className="flex items-center gap-3 px-6 py-4">
            <span style={{ color: color ?? "var(--color-primary)" }}>
              {icon}
            </span>
            <span className="text-xs md:text-sm text-[var(--color-text-secondary)] w-20 shrink-0">
              {label}
            </span>
            <span className="text-xs md:text-sm font-medium text-[var(--color-text-primary)]">
              {value ?? "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
