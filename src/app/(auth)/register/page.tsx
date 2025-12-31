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
      router.push("/");
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 min-h-screen w-screen bg-linear-to-r from-black via-neutral-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-neutral-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Create Account
          </h1>
          <p className="text-gray-400 mb-6 text-sm sm:text-base">
            Join our platform today
          </p>

          {error && (
            <div className="bg-neutral-800/50 border border-white/10 text-gray-300 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 sm:py-2 bg-neutral-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-white/20 focus:border-transparent text-sm sm:text-base"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 sm:py-2 bg-neutral-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-white/20 focus:border-transparent text-sm sm:text-base"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-1"
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
                  className="w-full px-4 py-2.5 sm:py-2 pr-10 bg-neutral-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-white/20 focus:border-transparent text-sm sm:text-base"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                I want to
              </label>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <label className="flex items-center cursor-pointer flex-1">
                  <input
                    type="radio"
                    value="customer"
                    checked={role === "customer"}
                    onChange={(e) => setRole(e.target.value as "customer")}
                    className="mr-2"
                  />
                  <span className="text-sm sm:text-base">Book Services</span>
                </label>
                <label className="flex items-center cursor-pointer flex-1">
                  <input
                    type="radio"
                    value="provider"
                    checked={role === "provider"}
                    onChange={(e) => setRole(e.target.value as "provider")}
                    className="mr-2"
                  />
                  <span className="text-sm sm:text-base">Provide Services</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-2.5 sm:py-2 px-4 rounded-lg hover:bg-gray-200 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400 text-sm sm:text-base">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-white hover:text-gray-300 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
