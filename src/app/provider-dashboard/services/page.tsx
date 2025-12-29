"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/src/context/AuthContext";
import {
  getServicesByProvider,
  deleteService,
} from "@/src/lib/appwrite/services";
import { Service } from "@/src/types";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function ServicesPage() {
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

  async function handleDelete(serviceId: string) {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      await deleteService(serviceId);
      setServices(services.filter((s) => s.$id !== serviceId));
    } catch (error) {
      console.error("Failed to delete service:", error);
      alert("Failed to delete service");
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">My Services</h1>
          <p className="text-gray-400">Manage your service offerings</p>
        </div>
        <Link
          href="/provider-dashboard/services/create"
          className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Create Service</span>
        </Link>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Loading services...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-12 text-center">
          <p className="text-gray-400 mb-4 text-lg">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.$id}
              className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors"
            >
              {/* Image Placeholder */}
              <div className="w-full h-48 bg-linear-to-r from-neutral-800 to-neutral-900 flex items-center justify-center">
                <span className="text-6xl">🔧</span>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {service.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-white">
                    ₹{service.price}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {service.duration} min
                  </span>
                </div>

                <div className="mb-4">
                  <span className="inline-block bg-neutral-800/50 text-gray-300 text-xs px-3 py-1 rounded-full border border-white/10">
                    {service.category}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/provider-dashboard/services/${service.$id}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(service.$id)}
                    className="flex items-center justify-center gap-2 bg-neutral-800/50 text-white px-4 py-2 rounded-lg hover:bg-neutral-700/50 border border-white/10 transition-colors text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
