"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"customer" | "provider">("customer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register({ name, email, password, role });
      router.push("/"); // Redirect to homepage after registration
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 min-h-screen w-screen overflow-hidden bg-linear-to-r from-black via-neutral-900 to-black">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-105 w-105 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-105 w-105 rounded-full bg-white/5 blur-3xl" />

      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-white/10 bg-neutral-900/80 backdrop-blur-xl p-8 shadow-2xl">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-white">Create Account</h1>
              <p className="mt-2 text-sm text-gray-400">
                Join our platform today
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-400"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 transition"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-400"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 transition"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-400"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 pr-12 text-sm text-white placeholder-gray-500 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white transition"
                  >
                    {showPassword ? (
                      <Eye className="h-5 w-5" />
                    ) : (
                      <EyeOff className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Minimum 8 characters
                </p>
              </div>

              {/* Role */}
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-400">
                  I want to
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input
                      type="radio"
                      value="customer"
                      checked={role === "customer"}
                      onChange={(e) => setRole(e.target.value as "customer")}
                      className="accent-blue-500"
                    />
                    Book Services
                  </label>

                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input
                      type="radio"
                      value="provider"
                      checked={role === "provider"}
                      onChange={(e) => setRole(e.target.value as "provider")}
                      className="accent-blue-500"
                    />
                    Provide Services
                  </label>
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-white py-3 text-sm font-semibold text-black hover:bg-gray-200 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account..." : "Sign Up"}
              </button>
            </form>

            {/* Footer */}
            <p className="mt-8 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-white hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
