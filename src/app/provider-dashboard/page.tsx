"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { getServicesByProvider } from "@/src/lib/appwrite/services";
import { Service } from "@/src/types";
import Link from "next/link";
import { Plus, Briefcase, Calendar, DollarSign } from "lucide-react";

export default function ProviderDashboardPage() {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const loadServices = useCallback(async () => {
    if (!user) return;

    try {
      const data = await getServicesByProvider(user.$id);
      setServices(data);
    } catch (error) {
      console.error("Failed to load services:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-400">Manage your services and bookings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Services</p>
              <p className="text-3xl font-bold text-white">{services.length}</p>
            </div>
            <div className="w-12 h-12 bg-neutral-800/50 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Active Bookings</p>
              <p className="text-3xl font-bold text-white">0</p>
            </div>
            <div className="w-12 h-12 bg-neutral-800/50 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Earnings</p>
              <p className="text-3xl font-bold text-white">₹0</p>
            </div>
            <div className="w-12 h-12 bg-neutral-800/50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <Link
            href="/provider-dashboard/services/create"
            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Service</span>
          </Link>
          <Link
            href="/provider-dashboard/services"
            className="flex items-center gap-2 bg-neutral-800/50 text-white px-6 py-3 rounded-lg hover:bg-neutral-700/50 border border-white/10 transition-colors font-medium"
          >
            <Briefcase className="w-5 h-5" />
            <span>View All Services</span>
          </Link>
        </div>
      </div>

      {/* Recent Services */}
      <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Your Services</h2>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">
              You have not created any services yet.
            </p>
            <Link
              href="/provider-dashboard/services/create"
              className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First Service</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {services.slice(0, 5).map((service) => (
              <div
                key={service.$id}
                className="bg-neutral-800/30 border border-white/10 rounded-lg p-4 hover:bg-neutral-800/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-1">
                      {service.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">
                        ₹{service.price}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {service.duration} min
                      </p>
                    </div>
                    <Link
                      href={`/provider-dashboard/services/${service.$id}`}
                      className="bg-neutral-700/50 text-white px-4 py-2 rounded-lg hover:bg-neutral-600/50 border border-white/10 transition-colors text-sm font-medium"
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
