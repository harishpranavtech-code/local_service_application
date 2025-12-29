export interface Booking {
  $id: string;
  customerId: string;
  customerName: string;
  providerId: string;
  providerName: string;
  serviceId: string;
  serviceTitle: string;
  bookingDate: string;
  bookingTime: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  totalPrice: number;
  notes?: string;
  paymentStatus: "pending" | "paid" | "refunded";
  createdAt: string;
}

export interface CreateBookingData {
  bookingDate: string;
  bookingTime: string;
  notes?: string;
}
