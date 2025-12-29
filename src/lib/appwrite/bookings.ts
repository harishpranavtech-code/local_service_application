import { ID, Query } from "appwrite";
import { databases } from "./client";
import { appwriteConfig } from "./config";
import type { CreateBookingData, Booking } from "@/src/types";

export async function createBooking(
  data: CreateBookingData,
  customerId: string,
  customerName: string,
  serviceId: string,
  serviceTitle: string,
  providerId: string,
  providerName: string,
  totalPrice: number
) {
  try {
    const newBooking = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.bookingsCollectionId,
      ID.unique(),
      {
        customerId,
        customerName,
        providerId,
        providerName,
        serviceId,
        serviceTitle,
        bookingDate: data.bookingDate,
        bookingTime: data.bookingTime,
        status: "pending",
        totalPrice,
        notes: data.notes || "",
        paymentStatus: "pending",
        createdAt: new Date().toISOString(),
      }
    );

    return newBooking;
  } catch (error) {
    const err = error as Error;
    console.error("Create booking error:", err);
    throw err;
  }
}

export async function getBookingsByCustomer(
  customerId: string
): Promise<Booking[]> {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.bookingsCollectionId,
      [Query.equal("customerId", [customerId]), Query.orderDesc("createdAt")]
    );

    return response.documents.map((doc) => ({
      $id: doc.$id,
      customerId: doc.customerId as string,
      customerName: doc.customerName as string,
      providerId: doc.providerId as string,
      providerName: doc.providerName as string,
      serviceId: doc.serviceId as string,
      serviceTitle: doc.serviceTitle as string,
      bookingDate: doc.bookingDate as string,
      bookingTime: doc.bookingTime as string,
      status: doc.status as "pending" | "confirmed" | "completed" | "cancelled",
      totalPrice: doc.totalPrice as number,
      notes: doc.notes as string | undefined,
      paymentStatus: doc.paymentStatus as "pending" | "paid" | "refunded",
      createdAt: doc.createdAt as string,
    }));
  } catch (error) {
    const err = error as Error;
    console.error("Get customer bookings error:", err);
    throw err;
  }
}

export async function getBookingsByProvider(
  providerId: string
): Promise<Booking[]> {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.bookingsCollectionId,
      [Query.equal("providerId", [providerId]), Query.orderDesc("createdAt")]
    );

    return response.documents.map((doc) => ({
      $id: doc.$id,
      customerId: doc.customerId as string,
      customerName: doc.customerName as string,
      providerId: doc.providerId as string,
      providerName: doc.providerName as string,
      serviceId: doc.serviceId as string,
      serviceTitle: doc.serviceTitle as string,
      bookingDate: doc.bookingDate as string,
      bookingTime: doc.bookingTime as string,
      status: doc.status as "pending" | "confirmed" | "completed" | "cancelled",
      totalPrice: doc.totalPrice as number,
      notes: doc.notes as string | undefined,
      paymentStatus: doc.paymentStatus as "pending" | "paid" | "refunded",
      createdAt: doc.createdAt as string,
    }));
  } catch (error) {
    const err = error as Error;
    console.error("Get provider bookings error:", err);
    throw err;
  }
}

export async function updateBookingStatus(
  bookingId: string,
  status: "pending" | "confirmed" | "completed" | "cancelled"
) {
  try {
    const updated = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.bookingsCollectionId,
      bookingId,
      { status }
    );

    return updated;
  } catch (error) {
    const err = error as Error;
    console.error("Update booking status error:", err);
    throw err;
  }
}

export async function cancelBooking(bookingId: string) {
  try {
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.bookingsCollectionId,
      bookingId,
      { status: "cancelled" }
    );
  } catch (error) {
    const err = error as Error;
    console.error("Cancel booking error:", err);
    throw err;
  }
}
