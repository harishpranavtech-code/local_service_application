"use client";

import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Home,
  Briefcase,
  Calendar,
  DollarSign,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function ProviderDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        {/* FIXED TOGGLE BUTTON - Always visible on mobile */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-lg text-white shadow-xl transition-transform hover:scale-105 active:scale-95"
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          {sidebarOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        {/* Sidebar - Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          fixed lg:static
          w-64 h-screen
          bg-neutral-900/95 backdrop-blur-xl border-r border-white/10
          transition-transform duration-300 ease-out
          z-40
        `}
        >
          <div className="flex flex-col h-full">
            {/* Logo - with padding to avoid button overlap on mobile */}
            <div className="p-6 border-b border-white/10 pt-20 lg:pt-6">
              <Link href="/" onClick={() => setSidebarOpen(false)}>
                <h1 className="text-xl sm:text-2xl font-bold text-white cursor-pointer">
                  Provider Hub
                </h1>
              </Link>
            </div>

            {/* User Info */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-neutral-700 to-neutral-800 flex items-center justify-center text-white font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{user.name}</p>
                  <p className="text-gray-400 text-sm">Provider</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              <Link
                href="/provider-dashboard"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-neutral-800/50 rounded-lg transition-colors"
              >
                <Home className="w-5 h-5 shrink-0" />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/provider-dashboard/services"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-neutral-800/50 rounded-lg transition-colors"
              >
                <Briefcase className="w-5 h-5 shrink-0" />
                <span>My Services</span>
              </Link>

              <Link
                href="/provider-dashboard/bookings"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-neutral-800/50 rounded-lg transition-colors"
              >
                <Calendar className="w-5 h-5 -0" />
                <span>Bookings</span>
              </Link>

              <Link
                href="/provider-dashboard/earnings"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-neutral-800/50 rounded-lg transition-colors"
              >
                <DollarSign className="w-5 h-5 shrink-0" />
                <span>Earnings</span>
              </Link>
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-white/10">
              <button
                onClick={() => {
                  logout();
                  setSidebarOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-neutral-800/50 rounded-lg transition-colors w-full"
              >
                <LogOut className="w-5 h-5 shrink-0" />
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
