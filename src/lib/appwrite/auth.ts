import { ID, Query } from "appwrite";
import { account, databases } from "./client";
import { appwriteConfig } from "./config";
import type { RegisterData, User } from "@/src/types";

export async function registerUser(data: RegisterData) {
  try {
    const { email, password, name, role } = data;

    // First, check if there's an active session and delete it
    try {
      await account.deleteSession("current");
    } catch {
      // No active session, continue
    }

    // Create auth account
    const newAccount = await account.create(ID.unique(), email, password, name);

    if (!newAccount) throw new Error("Account creation failed");

    // Create session (login)
    await account.createEmailPasswordSession(email, password);

    // Create user document in database
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        name,
        email,
        role,
        createdAt: new Date().toISOString(),
      }
    );

    return newUser;
  } catch (error) {
    const err = error as Error;
    console.error("Registration error:", err);
    throw err;
  }
}

export async function loginUser(email: string, password: string) {
  try {
    // Delete any existing session first
    try {
      await account.deleteSession("current");
    } catch {
      // No active session, continue
    }

    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    const err = error as Error;
    console.error("Login error:", err);
    throw err;
  }
}

export async function logoutUser() {
  try {
    await account.deleteSession("current");
  } catch (error) {
    const err = error as Error;
    console.error("Logout error:", err);
    throw err;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) return null;

    // Get user document from database
    const userDocs = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("email", currentAccount.email)]
    );

    if (userDocs.documents.length === 0) return null;

    const doc = userDocs.documents[0];

    // Map to User type
    return {
      $id: doc.$id,
      name: doc.name as string,
      email: doc.email as string,
      phone: doc.phone as string | undefined,
      role: doc.role as "customer" | "provider",
      avatar: doc.avatar as string | undefined,
      address: doc.address as string | undefined,
      city: doc.city as string | undefined,
      createdAt: doc.createdAt as string,
    };
  } catch (error) {
    console.log(error);

    console.log("No active session");
    return null;
  }
}
