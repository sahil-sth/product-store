import { Link, useNavigate } from "react-router";
import { ArrowLeftIcon, UserPlus2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

import { useSignup } from "../hooks/useUsers";

const SignupPage = () => {
  const signup = useSignup();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
    }
    signup.mutate(formData, {
      onSuccess: () => {
        navigate("/", { replace: true });
      },
    }); //TODO: add more functionality
  };
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
            {/* Name Input */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Full name"
                className="input w-full rounded-lg border-base-300 bg-base-200"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
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
            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="input w-full rounded-lg border-base-300 bg-base-200"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={signup.isPending}
            >
              {signup.isPending ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Sign up"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
