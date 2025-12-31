"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { getServicesByProvider } from "@/src/lib/appwrite/services";
import { getBookingsByProvider } from "@/src/lib/appwrite/bookings";
import { Service, Booking } from "@/src/types";
import Link from "next/link";
import { Plus, Briefcase, Calendar, DollarSign } from "lucide-react";

export default function ProviderDashboardPage() {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user) return;

    try {
      const [servicesData, bookingsData] = await Promise.all([
        getServicesByProvider(user.$id),
        getBookingsByProvider(user.$id),
      ]);
      setServices(servicesData);
      setBookings(bookingsData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const activeBookings = bookings.filter(
    (b) => b.status === "pending" || b.status === "confirmed"
  ).length;

  const totalEarnings = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Manage your services and bookings
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm mb-1">
                Total Services
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-white">
                {services.length}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-neutral-800/50 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm mb-1">
                Active Bookings
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-white">
                {activeBookings}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-neutral-800/50 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm mb-1">
                Total Earnings
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-white">
                ₹{totalEarnings}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-neutral-800/50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link
            href="/provider-dashboard/services/create"
            className="inline-flex items-center justify-center gap-2 bg-white text-black px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Create New Service</span>
          </Link>
          <Link
            href="/provider-dashboard/services"
            className="inline-flex items-center justify-center gap-2 bg-neutral-800/50 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-neutral-700/50 border border-white/10 transition-colors font-medium text-sm sm:text-base"
          >
            <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>View All Services</span>
          </Link>
          <Link
            href="/provider-dashboard/bookings"
            className="inline-flex items-center justify-center gap-2 bg-neutral-800/50 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-neutral-700/50 border border-white/10 transition-colors font-medium text-sm sm:text-base"
          >
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>View Bookings</span>
          </Link>
        </div>
      </div>

      {/* Recent Services */}
      <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
          Your Services
        </h2>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm sm:text-base">
              Loading services...
            </p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-400 mb-4 text-sm sm:text-base">
              You have not created any services yet.
            </p>
            <Link
              href="/provider-dashboard/services/create"
              className="inline-flex items-center gap-2 bg-white text-black px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Create Your First Service</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {services.slice(0, 5).map((service) => (
              <div
                key={service.$id}
                className="bg-neutral-800/30 border border-white/10 rounded-lg p-4 hover:bg-neutral-800/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-1 truncate">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm line-clamp-1">
                      {service.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="text-right">
                      <p className="text-xl sm:text-2xl font-bold text-white">
                        ₹{service.price}
                      </p>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        {service.duration} min
                      </p>
                    </div>
                    <Link
                      href={`/provider-dashboard/services/${service.$id}`}
                      className="bg-neutral-700/50 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-neutral-600/50 border border-white/10 transition-colors text-xs sm:text-sm font-medium whitespace-nowrap"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
