"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { getServiceById } from "@/src/lib/appwrite/services";
import { Service } from "@/src/types";
import Link from "next/link";
import { ArrowLeft, Clock, MapPin, User } from "lucide-react";

export default function ServiceDetailPage() {
  const params = useParams();

  const { user } = useAuth();
  const serviceId = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="fixed inset-0 min-h-screen w-screen bg-linear-to-r from-black via-neutral-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Service Not Found
          </h1>
          <Link
            href="/"
            className="inline-block bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 min-h-screen w-screen bg-linearr-to-r from-black via-neutral-900 to-black overflow-y-auto">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-neutral-900/80 backdrop-blur sticky top-0 z-10">
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
                  {user.role === "provider" && (
                    <Link
                      href="/provider-dashboard"
                      className="text-sm font-medium text-white hover:underline"
                    >
                      Dashboard
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
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Services</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
              {/* Image */}
              <div className="w-full h-96 bg-linear-to-r from-neutral-800 to-neutral-900 flex items-center justify-center">
                <span className="text-9xl">🔧</span>
              </div>

              {/* Details */}
              <div className="p-8">
                <div className="mb-6">
                  <span className="inline-block bg-neutral-800/50 text-gray-300 text-sm px-3 py-1 rounded-full border border-white/10 mb-4">
                    {service.category}
                  </span>
                  <h1 className="text-4xl font-bold text-white mb-4">
                    {service.title}
                  </h1>
                </div>

                <div className="flex items-center gap-6 mb-6 text-gray-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{service.duration} minutes</span>
                  </div>
                  {service.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      <span>{service.location}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-white/10 pt-6 mb-6">
                  <h2 className="text-xl font-bold text-white mb-3">
                    Description
                  </h2>
                  <p className="text-gray-400 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h2 className="text-xl font-bold text-white mb-3">
                    Service Provider
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-linear-to-r from-neutral-700 to-neutral-800 flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {service.providerName}
                      </p>
                      <p className="text-gray-400 text-sm">Verified Provider</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-6 sticky top-24">
              <div className="mb-6">
                <p className="text-gray-400 text-sm mb-2">Price</p>
                <p className="text-5xl font-bold text-white">
                  ₹{service.price}
                </p>
              </div>

              <div className="border-t border-white/10 pt-6 mb-6">
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
                    onClick={() => {
                      // TODO: Implement booking modal
                      alert("Booking feature coming soon!");
                    }}
                    className="w-full bg-white text-black py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Book Now
                  </button>
                ) : (
                  <div className="text-center text-gray-400 text-sm">
                    Only customers can book services
                  </div>
                )
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/register"
                    className="block w-full bg-white text-black py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center"
                  >
                    Sign Up to Book
                  </Link>
                  <Link
                    href="/login"
                    className="block w-full bg-neutral-800/50 text-white py-3 px-6 rounded-lg hover:bg-neutral-700/50 border border-white/10 transition-colors font-medium text-center"
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
