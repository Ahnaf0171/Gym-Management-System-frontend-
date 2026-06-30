import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.email.length > 30) {
      return setError("Email must be under 30 characters.");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return setError("Please enter a correct email.");
    }

    setLoading(true);
    try {
      await login(formData.email, formData.password);
    } catch (err) {
      const msg = (
        err.response?.data?.detail ||
        err.response?.data?.message ||
        ""
      ).toLowerCase();

      if (msg.includes("password")) setError("Incorrect password.");
      else if (
        msg.includes("email") ||
        msg.includes("user") ||
        err.response?.status === 404
      )
        setError("No account found with this email.");
      else setError(msg || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start sm:items-center justify-center bg-[var(--color-bg)] px-4 pt-[50px] sm:pt-0">
      <div className="w-full max-w-md relative">
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Close"
          className="absolute -top-2 right-0 p-2 rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-1)] transition-colors"
        >
          <X className="w-6 h-6 sm:w-8 sm:h-8 font-bold" />
        </button>

        <div className="text-center mb-8">
          <h1
            className="text-4xl md:text-5xl font-bold tracking-wide mb-2"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--color-primary)",
            }}
          >
            GYM PRO
          </h1>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)]">
            Sign in to your account
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-1)] p-6 md:p-8">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-4"
          >
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 bottom-2.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-6 h-6" />
                ) : (
                  <Eye className="w-6 h-6" />
                )}
              </button>
            </div>

            {error && (
              <div className="text-xs md:text-sm text-[var(--color-danger)]">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? <Spinner className="w-4 h-4 mx-auto" /> : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
