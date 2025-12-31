"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 min-h-screen w-screen bg-linear-to-r from-black via-neutral-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-neutral-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-400 mb-6 text-sm sm:text-base">
            Sign in to your account
          </p>

          {error && (
            <div className="bg-neutral-800/50 border border-white/10 text-gray-300 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-2.5 sm:py-2 px-4 rounded-lg hover:bg-gray-200 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400 text-sm sm:text-base">
            Do not have an account?{" "}
            <Link
              href="/register"
              className="text-white hover:text-gray-300 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
