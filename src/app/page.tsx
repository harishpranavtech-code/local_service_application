"use client";

import { useAuth } from "@/src/context/AuthContext";
import { useEffect, useState } from "react";
import { getAllServices } from "@/src/lib/appwrite/services";
import { Service } from "@/src/types";
import { ServiceCard } from "@/src/components/services/ServiceCard";
import Link from "next/link";

export default function HomePage() {
  const { user, loading: authLoading, logout } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      const data = await getAllServices();
      setServices(data);
    } catch (error) {
      console.error("Failed to load services:", error);
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-r from-black via-neutral-900 to-black text-gray-200">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-neutral-900/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/">
              <h1 className="cursor-pointer text-2xl font-bold text-white">
                Local Service Platform
              </h1>
            </Link>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-300">
                    Welcome, {user.name}!
                  </span>

                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-wide text-gray-400">
                    {user.role}
                  </span>

                  {user.role === "provider" && (
                    <Link
                      href="/provider-dashboard"
                      className="text-sm font-medium text-white hover:underline"
                    >
                      Dashboard
                    </Link>
                  )}

                  {user.role === "customer" && (
                    <Link
                      href="/dashboard"
                      className="text-sm font-medium text-white hover:underline"
                    >
                      My Bookings
                    </Link>
                  )}

                  <button
                    onClick={logout}
                    className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-gray-200 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm text-gray-300 hover:text-white transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-gray-200 transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute -top-40 -left-40 h-105 w-105 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 h-105 w-105 rounded-full bg-white/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-5xl font-bold text-white">
            Find Local Services Near You
          </h2>
          <p className="mb-8 text-xl text-gray-400">
            Connect with trusted service providers in your area
          </p>

          {!user && (
            <div className="flex justify-center">
              <Link
                href="/register"
                className="rounded-lg bg-white px-8 py-3 text-lg font-semibold text-black hover:bg-gray-200 transition"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h3 className="mb-10 text-3xl font-bold text-white">
          Available Services
        </h3>

        {loading ? (
          <div className="py-12 text-center">
            <div className="text-lg   text-gray-400">Loading services...</div>
          </div>
        ) : services.length === 0 ? (
          <div className="py-12 text-center ">
            <p className="mb-4 text-lg text-gray-400">
              No services available yet.
            </p>

            {user?.role === "provider" && (
              <Link
                href="/provider-dashboard/services/create"
                className="inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-gray-200 transition"
              >
                Create Your First Service
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.$id} service={service} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
