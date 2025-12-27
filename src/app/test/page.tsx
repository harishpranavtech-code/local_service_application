"use client";

import { useEffect, useState } from "react";
import { account } from "@/src/lib/appwrite/client";

export default function TestPage() {
  const [status, setStatus] = useState("Testing connection...");

  useEffect(() => {
    async function testConnection() {
      try {
        await account.get();
        setStatus("✅ Appwrite connected successfully!");
      } catch (error) {
        const err = error as { code?: number; message?: string };
        if (err.code === 401) {
          setStatus("✅ Appwrite connected (not logged in)");
        } else {
          setStatus(
            "❌ Connection failed: " + (err.message || "Unknown error")
          );
        }
      }
    }
    testConnection();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          Appwrite Connection Test
        </h1>
        <p className="text-xl text-gray-600">{status}</p>
      </div>
    </div>
  );
}
