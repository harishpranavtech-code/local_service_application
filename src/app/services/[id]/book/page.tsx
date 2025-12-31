"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { getServiceById } from "@/src/lib/appwrite/services";
import { createBooking } from "@/src/lib/appwrite/bookings";
import { Service } from "@/src/types";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";

export default function BookServicePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const serviceId = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    bookingDate: "",
    bookingTime: "",
    notes: "",
  });

  const loadService = useCallback(async () => {
    try {
      const data = await getServiceById(serviceId);
      if (!data) {
        router.push("/");
        return;
      }
      setService(data);
    } catch (error) {
      console.error("Failed to load service:", error);
      router.push("/");
    } finally {
      setLoading(false);
    }
  }, [serviceId, router]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "customer") {
      router.push("/");
      return;
    }
    loadService();
  }, [user, loadService, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (!service || !user) return;

    try {
      await createBooking(
        {
          bookingDate: formData.bookingDate,
          bookingTime: formData.bookingTime,
          notes: formData.notes,
        },
        user.$id,
        user.name,
        service.$id,
        service.title,
        service.providerId,
        service.providerName,
        service.price
      );

      router.push("/dashboard");
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  }

  const today = new Date().toISOString().split("T")[0];

  if (loading) {
    return (
      <div className="fixed inset-0 min-h-screen w-screen bg-linear-to-r from-black via-neutral-900 to-black flex items-center justify-center">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  if (!service) {
    return null;
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

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300 hidden sm:block truncate max-w-32">
                {user?.name}
              </span>
              <Link
                href="/dashboard"
                className="text-xs sm:text-sm font-medium text-white hover:underline"
              >
                My Bookings
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <Link
          href={`/services/${serviceId}`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 sm:mb-6 transition-colors text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Back to Service</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-6 lg:p-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Book Service
              </h1>
              <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">
                Fill in the details to book this service
              </p>

              {error && (
                <div className="bg-neutral-800/50 border border-white/10 text-gray-300 px-4 py-3 rounded-lg mb-6 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label
                    htmlFor="bookingDate"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Booking Date
                  </label>
                  <input
                    id="bookingDate"
                    type="date"
                    value={formData.bookingDate}
                    onChange={(e) =>
                      setFormData({ ...formData, bookingDate: e.target.value })
                    }
                    required
                    min={today}
                    className="w-full px-4 py-2.5 sm:py-2 bg-neutral-800/50 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-transparent text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label
                    htmlFor="bookingTime"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Preferred Time
                  </label>
                  <input
                    id="bookingTime"
                    type="time"
                    value={formData.bookingTime}
                    onChange={(e) =>
                      setFormData({ ...formData, bookingTime: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2.5 sm:py-2 bg-neutral-800/50 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-transparent text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-2.5 sm:py-2 bg-neutral-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-white/20 focus:border-transparent resize-none text-sm sm:text-base"
                    placeholder="Any specific requirements or instructions..."
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-white text-black py-2.5 sm:py-3 px-6 rounded-lg hover:bg-gray-200 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
                  >
                    {submitting ? "Booking..." : "Confirm Booking"}
                  </button>
                  <Link
                    href={`/services/${serviceId}`}
                    className="bg-neutral-800/50 text-white py-2.5 sm:py-3 px-6 rounded-lg hover:bg-neutral-700/50 border border-white/10 transition-colors font-medium text-center text-sm sm:text-base"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>

          {/* Service Summary */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
                Booking Summary
              </h2>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm mb-1">
                    Service
                  </p>
                  <p className="text-white font-medium text-sm sm:text-base">
                    {service.title}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-xs sm:text-sm mb-1">
                    Provider
                  </p>
                  <p className="text-white font-medium text-sm sm:text-base">
                    {service.providerName}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-xs sm:text-sm mb-1">
                    Category
                  </p>
                  <p className="text-white font-medium text-sm sm:text-base">
                    {service.category}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{service.duration} minutes</span>
                </div>

                {service.location && (
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm mb-1">
                      Location
                    </p>
                    <p className="text-white font-medium text-sm sm:text-base">
                      {service.location}
                    </p>
                  </div>
                )}

                <div className="border-t border-white/10 pt-4 mt-4">
                  <div className="flex items-center justify-between mb-2 text-sm sm:text-base">
                    <span className="text-gray-400">Service Price</span>
                    <span className="text-white font-medium">
                      ₹{service.price}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-base sm:text-lg font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-white">₹{service.price}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
