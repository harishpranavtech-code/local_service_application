"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/src/context/AuthContext";
import {
  getBookingsByProvider,
  updateBookingStatus,
} from "@/src/lib/appwrite/bookings";
import { Booking } from "@/src/types";
import { CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";
import { format } from "date-fns";

export default function ProviderBookingsPage() {
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

  async function handleStatusChange(
    bookingId: string,
    status: "confirmed" | "completed" | "cancelled"
  ) {
    try {
      await updateBookingStatus(bookingId, status);
      await loadBookings();
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update booking status");
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />;
      default:
        return (
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
        );
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
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
          Bookings
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Manage your service bookings
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm mb-1">
                Total Bookings
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-white">
                {bookings.length}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-neutral-800/50 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm mb-1">Pending</p>
              <p className="text-2xl sm:text-3xl font-bold text-white">
                {pendingBookings.length}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-neutral-800/50 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm mb-1">Confirmed</p>
              <p className="text-2xl sm:text-3xl font-bold text-white">
                {confirmedBookings.length}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-neutral-800/50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
          All Bookings
        </h2>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm sm:text-base">
              Loading bookings...
            </p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-400 text-sm sm:text-base">
              No bookings yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.$id}
                className="bg-neutral-800/30 border border-white/10 rounded-lg p-4 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 truncate">
                      {booking.serviceTitle}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      Customer: {booking.customerName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-start">
                    {getStatusIcon(booking.status)}
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Date</p>
                    <p className="text-white font-medium text-sm sm:text-base">
                      {format(new Date(booking.bookingDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Time</p>
                    <p className="text-white font-medium text-sm sm:text-base">
                      {booking.bookingTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Price</p>
                    <p className="text-white font-medium text-sm sm:text-base">
                      ₹{booking.totalPrice}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Payment</p>
                    <p className="text-white font-medium capitalize text-sm sm:text-base">
                      {booking.paymentStatus}
                    </p>
                  </div>
                </div>

                {booking.notes && (
                  <div className="border-t border-white/10 pt-4 mb-4">
                    <p className="text-gray-400 text-xs mb-1">Customer Notes</p>
                    <p className="text-white text-sm">{booking.notes}</p>
                  </div>
                )}

                {booking.status === "pending" && (
                  <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() =>
                        handleStatusChange(booking.$id, "confirmed")
                      }
                      className="flex-1 bg-white text-black py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(booking.$id, "cancelled")
                      }
                      className="flex-1 bg-neutral-800/50 text-white py-2 px-4 rounded-lg hover:bg-neutral-700/50 border border-white/10 transition-colors font-medium text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {booking.status === "confirmed" && (
                  <div className="border-t border-white/10 pt-4">
                    <button
                      onClick={() =>
                        handleStatusChange(booking.$id, "completed")
                      }
                      className="w-full bg-white text-black py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                    >
                      Mark as Completed
                    </button>
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
