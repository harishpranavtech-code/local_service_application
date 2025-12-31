"use client";

import { useAuth } from "@/src/context/AuthContext";
import { useEffect, useState } from "react";
import { getAllServices } from "@/src/lib/appwrite/services";
import { Service } from "@/src/types";
import { ServiceCard } from "@/src/components/services/ServiceCard";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const categories = [
  "All",
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Cleaning",
  "Painting",
  "AC Repair",
  "Appliance Repair",
  "Pest Control",
  "Moving & Packing",
  "Other",
];

export default function HomePage() {
  const { user, loading: authLoading, logout } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredServices(services);
    } else {
      setFilteredServices(
        services.filter((s) => s.category === selectedCategory)
      );
    }
  }, [selectedCategory, services]);

  async function loadServices() {
    try {
      const data = await getAllServices();
      setServices(data);
      setFilteredServices(data);
    } catch (error) {
      console.error("Failed to load services:", error);
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-black via-neutral-900 to-black">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-r from-black via-neutral-900 to-black text-gray-200">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-neutral-900/80 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <h1 className="cursor-pointer text-xl sm:text-2xl font-bold text-white">
                Local Service Platform
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-300 truncate max-w-32">
                    {user.name}
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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/10">
              {user ? (
                <div className="space-y-3">
                  <div className="px-4 py-2">
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-gray-400 text-sm">{user.role}</p>
                  </div>

                  {user.role === "provider" && (
                    <Link
                      href="/provider-dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2 text-white hover:bg-neutral-800/50 rounded"
                    >
                      Dashboard
                    </Link>
                  )}

                  {user.role === "customer" && (
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2 text-white hover:bg-neutral-800/50 rounded"
                    >
                      My Bookings
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-white hover:bg-neutral-800/50 rounded"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-white hover:bg-neutral-800/50 rounded"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-white hover:bg-neutral-800/50 rounded"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 sm:py-16 md:py-24">
        <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Find Local Services Near You
          </h2>
          <p className="mb-6 sm:mb-8 text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Connect with trusted service providers in your area
          </p>

          {!user && (
            <div className="flex justify-center">
              <Link
                href="/register"
                className="rounded-lg bg-white px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg font-semibold text-black hover:bg-gray-200 transition"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Category Filter */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? "bg-white text-black"
                  : "bg-neutral-800/50 text-gray-300 hover:bg-neutral-700/50 border border-white/10"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:pb-16 sm:px-6 lg:px-8">
        <h3 className="mb-6 sm:mb-10 text-2xl sm:text-3xl font-bold text-white">
          {selectedCategory === "All"
            ? "Available Services"
            : `${selectedCategory} Services`}
        </h3>

        {loading ? (
          <div className="py-12 text-center">
            <div className="text-base sm:text-lg text-gray-400">
              Loading services...
            </div>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="py-12 text-center">
            <p className="mb-4 text-base sm:text-lg text-gray-400">
              {selectedCategory === "All"
                ? "No services available yet."
                : `No ${selectedCategory} services available.`}
            </p>

            {user?.role === "provider" && (
              <Link
                href="/provider-dashboard/services/create"
                className="inline-block rounded-lg bg-white px-4 sm:px-6 py-2 sm:py-3 text-sm font-semibold text-black hover:bg-gray-200 transition"
              >
                Create Your First Service
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredServices.map((service) => (
              <ServiceCard key={service.$id} service={service} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
