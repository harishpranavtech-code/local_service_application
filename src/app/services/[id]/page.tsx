"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { getServiceById } from "@/src/lib/appwrite/services";
import { Service } from "@/src/types";
import Link from "next/link";
import { ArrowLeft, Clock, MapPin, User, Menu, X } from "lucide-react";

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const serviceId = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const loadService = useCallback(async () => {
    try {
      const data = await getServiceById(serviceId);
      setService(data);
    } catch (error) {
      console.error("Failed to load service:", error);
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    loadService();
  }, [loadService]);

  if (loading) {
    return (
      <div className="fixed inset-0 min-h-screen w-screen bg-linear-to-r from-black via-neutral-900 to-black flex items-center justify-center">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="fixed inset-0 min-h-screen w-screen bg-linear-to-r from-black via-neutral-900 to-black flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-4">
            Service Not Found
          </h1>
          <Link
            href="/"
            className="inline-block bg-white text-black px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm sm:text-base"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 min-h-screen w-screen bg-linear-to-r from-black via-neutral-900 to-black overflow-y-auto">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-neutral-900/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/">
              <h1 className="cursor-pointer text-xl sm:text-2xl font-bold text-white">
                Local Service Platform
              </h1>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-300 truncate max-w-32">
                    {user.name}
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
                  <Link
                    href="/"
                    className="rounded-lg bg-neutral-800/50 border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-700/50 transition"
                  >
                    Back to Home
                  </Link>
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
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-white hover:bg-neutral-800/50 rounded"
                  >
                    Back to Home
                  </Link>
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

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 sm:mb-6 transition-colors text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Back to Services</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
              {/* Image */}
              <div className="w-full h-64 sm:h-80 lg:h-96 bg-linear-to-r from-neutral-800 to-neutral-900 flex items-center justify-center">
                <span className="text-6xl sm:text-7xl lg:text-9xl">🔧</span>
              </div>

              {/* Details */}
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="mb-4 sm:mb-6">
                  <span className="inline-block bg-neutral-800/50 text-gray-300 text-xs sm:text-sm px-3 py-1 rounded-full border border-white/10 mb-3 sm:mb-4">
                    {service.category}
                  </span>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
                    {service.title}
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-4 sm:mb-6 text-gray-400 text-sm sm:text-base">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{service.duration} minutes</span>
                  </div>
                  {service.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{service.location}</span>
                    </div>
                  )}
                </div>
                <div className="border-t border-white/10 pt-4 sm:pt-6 mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">
                    Description
                  </h2>
                  <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                    {service.description}
                  </p>
                </div>

                <div className="border-t border-white/10 pt-4 sm:pt-6">
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">
                    Service Provider
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-r from-neutral-700 to-neutral-800 flex items-center justify-center">
                      <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm sm:text-base">
                        {service.providerName}
                      </p>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        Verified Provider
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-6 lg:sticky lg:top-24">
              <div className="mb-4 sm:mb-6">
                <p className="text-gray-400 text-xs sm:text-sm mb-2">Price</p>
                <p className="text-4xl sm:text-5xl font-bold text-white">
                  ₹{service.price}
                </p>
              </div>

              <div className="border-t border-white/10 pt-4 sm:pt-6 mb-4 sm:mb-6">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-white font-medium">
                      {service.duration} min
                    </span>
                  </div>
                  {service.location && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Location</span>
                      <span className="text-white font-medium">
                        {service.location}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {user ? (
                user.role === "customer" ? (
                  <button
                    onClick={() => router.push(`/services/${service.$id}/book`)}
                    className="w-full bg-white text-black py-2.5 sm:py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm sm:text-base"
                  >
                    Book Now
                  </button>
                ) : (
                  <div className="text-center text-gray-400 text-xs sm:text-sm">
                    Only customers can book services
                  </div>
                )
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/register"
                    className="block w-full bg-white text-black py-2.5 sm:py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center text-sm sm:text-base"
                  >
                    Sign Up to Book
                  </Link>
                  <Link
                    href="/login"
                    className="block w-full bg-neutral-800/50 text-white py-2.5 sm:py-3 px-6 rounded-lg hover:bg-neutral-700/50 border border-white/10 transition-colors font-medium text-center text-sm sm:text-base"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
