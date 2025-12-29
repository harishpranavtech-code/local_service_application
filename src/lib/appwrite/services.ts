import { ID, Query } from "appwrite";
import { databases } from "./client";
import { appwriteConfig } from "./config";
import type { CreateServiceData, Service } from "@/src/types";

export async function createService(
  data: CreateServiceData,
  providerId: string,
  providerName: string
) {
  try {
    const newService = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.servicesCollectionId,
      ID.unique(),
      {
        ...data,
        providerId,
        providerName,
        isActive: true,
        createdAt: new Date().toISOString(),
      }
    );

    return newService;
  } catch (error) {
    const err = error as Error;
    console.error("Create service error:", err);
    throw err;
  }
}

export async function getAllServices(): Promise<Service[]> {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.servicesCollectionId,
      [
        Query.equal("isActive", [true]),
        Query.orderDesc("createdAt"),
        Query.limit(100),
      ]
    );

    return response.documents.map((doc) => ({
      $id: doc.$id,
      providerId: doc.providerId as string,
      providerName: doc.providerName as string,
      title: doc.title as string,
      description: doc.description as string,
      category: doc.category as string,
      price: doc.price as number,
      duration: doc.duration as number,
      location: doc.location as string | undefined,
      images: doc.images as string[] | undefined,
      isActive: doc.isActive as boolean,
      createdAt: doc.createdAt as string,
    }));
  } catch (error) {
    const err = error as Error;
    console.error("Get services error:", err);
    throw err;
  }
}

export async function getServiceById(
  serviceId: string
): Promise<Service | null> {
  try {
    const doc = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.servicesCollectionId,
      serviceId
    );

    return {
      $id: doc.$id,
      providerId: doc.providerId as string,
      providerName: doc.providerName as string,
      title: doc.title as string,
      description: doc.description as string,
      category: doc.category as string,
      price: doc.price as number,
      duration: doc.duration as number,
      location: doc.location as string | undefined,
      images: doc.images as string[] | undefined,
      isActive: doc.isActive as boolean,
      createdAt: doc.createdAt as string,
    };
  } catch (error) {
    console.error("Get service error:", error);
    return null;
  }
}

export async function getServicesByProvider(
  providerId: string
): Promise<Service[]> {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.servicesCollectionId,
      [
        Query.equal("providerId", [providerId]),
        Query.equal("isActive", [true]),
        Query.orderDesc("createdAt"),
      ]
    );

    return response.documents.map((doc) => ({
      $id: doc.$id,
      providerId: doc.providerId as string,
      providerName: doc.providerName as string,
      title: doc.title as string,
      description: doc.description as string,
      category: doc.category as string,
      price: doc.price as number,
      duration: doc.duration as number,
      location: doc.location as string | undefined,
      images: doc.images as string[] | undefined,
      isActive: doc.isActive as boolean,
      createdAt: doc.createdAt as string,
    }));
  } catch (error) {
    const err = error as Error;
    console.error("Get provider services error:", err);
    throw err;
  }
}

export async function updateService(
  serviceId: string,
  data: Partial<CreateServiceData>
) {
  try {
    const updated = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.servicesCollectionId,
      serviceId,
      data
    );

    return updated;
  } catch (error) {
    const err = error as Error;
    console.error("Update service error:", err);
    throw err;
  }
}

export async function deleteService(serviceId: string) {
  try {
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.servicesCollectionId,
      serviceId,
      { isActive: false }
    );
  } catch (error) {
    const err = error as Error;
    console.error("Delete service error:", err);
    throw err;
  }
}
