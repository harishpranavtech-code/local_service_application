"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { getBookingsByCustomer } from "@/src/lib/appwrite/bookings";
import { Booking } from "@/src/types";
import Link from "next/link";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = useCallback(async () => {
    if (!user) return;

    try {
      const data = await getBookingsByCustomer(user.$id);
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

  function getStatusIcon(status: string) {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "completed":
        return <CheckCircle className="w-5 h-5 text-white" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "confirmed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "completed":
        return "bg-white/20 text-white border-white/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    }
  }

  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const upcomingBookings = bookings.filter((b) => b.status === "confirmed");

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-400">Manage your service bookings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Bookings</p>
              <p className="text-3xl font-bold text-white">{bookings.length}</p>
            </div>
            <div className="w-12 h-12 bg-neutral-800/50 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Pending</p>
              <p className="text-3xl font-bold text-white">
                {pendingBookings.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-neutral-800/50 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Upcoming</p>
              <p className="text-3xl font-bold text-white">
                {upcomingBookings.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-neutral-800/50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            <Calendar className="w-5 h-5" />
            <span>Browse Services</span>
          </Link>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">My Bookings</h2>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">
              You have not made any bookings yet.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <Calendar className="w-5 h-5" />
              <span>Browse Services</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.$id}
                className="bg-neutral-800/30 border border-white/10 rounded-lg p-6 hover:bg-neutral-800/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {booking.serviceTitle}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Provider: {booking.providerName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(booking.status)}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Date</p>
                    <p className="text-white font-medium">
                      {format(new Date(booking.bookingDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Time</p>
                    <p className="text-white font-medium">
                      {booking.bookingTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Total Price</p>
                    <p className="text-white font-medium">
                      ₹{booking.totalPrice}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Payment</p>
                    <p className="text-white font-medium capitalize">
                      {booking.paymentStatus}
                    </p>
                  </div>
                </div>

                {booking.notes && (
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-gray-400 text-xs mb-1">Notes</p>
                    <p className="text-white text-sm">{booking.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
