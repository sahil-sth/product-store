import { Link, useNavigate } from "react-router";
import { ArrowLeftIcon, UserPlus2Icon } from "lucide-react";
import { useState } from "react";
import { useLogin } from "../hooks/useUsers";
const RegisterPage = () => {
  const login = useLogin();
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    login.mutate(formData, {
      onSuccess: () => {
        navigate("/", { replace: true });
      },
    });
  };
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });
  return (
    <div className="max-w-lg mx-auto">
      <Link to="/" className="btn btn-ghost btn-sm gap-1 mb-4">
        <ArrowLeftIcon className="size-4" />
        Back
      </Link>
      <div className="card base-300">
        <div className="card-body">
          <h1 className="card-title">
            <UserPlus2Icon className="size-5 text-primary" />
            Sign up
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Email Address Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="input w-full rounded-lg border-base-300 bg-base-200"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="password"
                className="input w-full rounded-lg border-base-300 bg-base-200"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={login.isPending}
            >
              {login.isPending ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
