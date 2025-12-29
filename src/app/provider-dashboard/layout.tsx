"use client";

import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Home, Briefcase, Calendar, DollarSign, LogOut } from "lucide-react";

export default function ProviderDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "provider")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="fixed inset-0 min-h-screen w-screen bg-linear-to-r from-black via-neutral-900 to-black flex items-center justify-center">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== "provider") {
    return null;
  }

  return (
    <div className="fixed inset-0 min-h-screen w-screen bg-linear-to-r from-black via-neutral-900 to-black">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-neutral-900/80 backdrop-blur-xl border-r border-white/10">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-white/10">
              <Link href="/">
                <h1 className="text-2xl font-bold text-white cursor-pointer">
                  Provider Hub
                </h1>
              </Link>
            </div>

            {/* User Info */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-r from-neutral-700 to-neutral-800 flex items-center justify-center text-white font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-medium">{user.name}</p>
                  <p className="text-gray-400 text-sm">Provider</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              <Link
                href="/provider-dashboard"
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-neutral-800/50 rounded-lg transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/provider-dashboard/services"
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-neutral-800/50 rounded-lg transition-colors"
              >
                <Briefcase className="w-5 h-5" />
                <span>My Services</span>
              </Link>

              <Link
                href="/provider-dashboard/bookings"
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-neutral-800/50 rounded-lg transition-colors"
              >
                <Calendar className="w-5 h-5" />
                <span>Bookings</span>
              </Link>

              <Link
                href="/provider-dashboard/earnings"
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-neutral-800/50 rounded-lg transition-colors"
              >
                <DollarSign className="w-5 h-5" />
                <span>Earnings</span>
              </Link>
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-white/10">
              <button
                onClick={logout}
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-neutral-800/50 rounded-lg transition-colors w-full"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
