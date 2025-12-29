"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { getBookingsByProvider } from "@/src/lib/appwrite/bookings";
import { Booking } from "@/src/types";
import { DollarSign, TrendingUp, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function EarningsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = useCallback(async () => {
    if (!user) return;

    try {
      const data = await getBookingsByProvider(user.$id);
      setBookings(data);
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const completedBookings = bookings.filter((b) => b.status === "completed");
  const totalEarnings = completedBookings.reduce(
    (sum, b) => sum + b.totalPrice,
    0
  );
  const pendingEarnings = bookings
    .filter((b) => b.status === "confirmed" || b.status === "pending")
    .reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Earnings</h1>
        <p className="text-gray-400">
          Track your income and completed bookings
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Earnings</p>
              <p className="text-3xl font-bold text-white">₹{totalEarnings}</p>
            </div>
            <div className="w-12 h-12 bg-neutral-800/50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Completed Jobs</p>
              <p className="text-3xl font-bold text-white">
                {completedBookings.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-neutral-800/50 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Pending Earnings</p>
              <p className="text-3xl font-bold text-white">
                ₹{pendingEarnings}
              </p>
            </div>
            <div className="w-12 h-12 bg-neutral-800/50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Earnings History */}
      <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">
          Completed Bookings
        </h2>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Loading earnings...</p>
          </div>
        ) : completedBookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No completed bookings yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {completedBookings.map((booking) => (
              <div
                key={booking.$id}
                className="bg-neutral-800/30 border border-white/10 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="text-white font-medium mb-1">
                    {booking.serviceTitle}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {format(new Date(booking.bookingDate), "MMM dd, yyyy")} •{" "}
                    {booking.customerName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-white">
                    ₹{booking.totalPrice}
                  </p>
                  <p className="text-gray-400 text-xs">Paid</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
