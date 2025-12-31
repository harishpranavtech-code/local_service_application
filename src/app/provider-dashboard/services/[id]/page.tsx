"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { getServiceById, updateService } from "@/src/lib/appwrite/services";
import { Service } from "@/src/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const categories = [
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

export default function EditServicePage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [service, setService] = useState<Service | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: categories[0],
    price: "",
    duration: "",
    location: "",
  });

  const loadService = useCallback(async () => {
    try {
      const data = await getServiceById(serviceId);
      if (!data) {
        router.push("/provider-dashboard/services");
        return;
      }

      if (data.providerId !== user?.$id) {
        router.push("/provider-dashboard/services");
        return;
      }

      setService(data);
      setFormData({
        title: data.title,
        description: data.description,
        category: data.category,
        price: data.price.toString(),
        duration: data.duration.toString(),
        location: data.location || "",
      });
    } catch (error) {
      console.error("Failed to load service:", error);
      setError("Failed to load service");
    } finally {
      setLoading(false);
    }
  }, [serviceId, router, user]);

  useEffect(() => {
    loadService();
  }, [loadService]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      await updateService(serviceId, {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        location: formData.location || undefined,
      });

      router.push("/provider-dashboard/services");
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Failed to update service");
    } finally {
      setSaving(false);
    }
  }

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
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <Link
          href="/provider-dashboard/services"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Back to Services</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
          Edit Service
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Update your service details
        </p>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-6 lg:p-8">
          {error && (
            <div className="bg-neutral-800/50 border border-white/10 text-gray-300 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Service Title
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="w-full px-4 py-2.5 sm:py-2 bg-neutral-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-white/20 focus:border-transparent text-sm sm:text-base"
                placeholder="e.g., Professional Plumbing Service"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                rows={4}
                className="w-full px-4 py-2.5 sm:py-2 bg-neutral-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-white/20 focus:border-transparent resize-none text-sm sm:text-base"
                placeholder="Describe your service in detail..."
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Category
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
                className="w-full px-4 py-2.5 sm:py-2 bg-neutral-800/50 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-transparent text-sm sm:text-base"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-neutral-900">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Price (₹)
                </label>
                <input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2.5 sm:py-2 bg-neutral-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-white/20 focus:border-transparent text-sm sm:text-base"
                  placeholder="500"
                />
              </div>

              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Duration (minutes)
                </label>
                <input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  required
                  min="1"
                  className="w-full px-4 py-2.5 sm:py-2 bg-neutral-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-white/20 focus:border-transparent text-sm sm:text-base"
                  placeholder="60"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Location (Optional)
              </label>
              <input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full px-4 py-2.5 sm:py-2 bg-neutral-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-white/20 focus:border-transparent text-sm sm:text-base"
                placeholder="e.g., Chennai, Tamil Nadu"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-white text-black py-2.5 sm:py-3 px-6 rounded-lg hover:bg-gray-200 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <Link
                href="/provider-dashboard/services"
                className="bg-neutral-800/50 text-white py-2.5 sm:py-3 px-6 rounded-lg hover:bg-neutral-700/50 border border-white/10 transition-colors font-medium text-center text-sm sm:text-base"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
