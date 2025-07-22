"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const [name, setName] = useState("");
  const [initialCapital, setInitialCapital] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const parseResponseBody = async (response) => {
    const contentType = response.headers.get("content-type");
    return contentType && contentType.includes("application/json")
      ? await response.json()
      : await response.text();
  };

  const loadProfile = async () => {
    setLoading(true);

    try {
      setName(session?.user?.name || "");

      setInitialCapital(session?.user?.initialCapital?.toString() || "");
    } catch (err) {
      toast.error(err.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      loadProfile();
    } else if (status === "unauthenticated") {
      setLoading(false);
      toast.error("You must be logged in to view your profile.");
    }
  }, [status, session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (!session || !session.user || !session.user.id) {
        toast.error("User not authenticated. Please log in.");
        setSaving(false);
        return;
      }
      const res = await fetch("/api/v1/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          initialCapital: Number(initialCapital),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Profile updated!");
        setIsEditing(false);
        await update({
          name: data.user.name,
          initialCapital: data.user.initialCapital,
        });
      } else {
        toast.error(data.message || "Update failed.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    loadProfile();
  };

  if (loading || status === "loading") {
    return (
      <div className="flex items-center justify-center h-[50vh] text-white gap-2">
        <Loader2 className="animate-spin" />
        Loading...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center h-[50vh] text-red-400">
        Please log in to view your profile.
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-zinc-800 text-gray-200 dark:text-gray-100 p-4 flex items-center justify-center">
      <div className=" absolute top-5 right-5">
        <Link href="/" className=" font-semibold  text-gray-300 hover:text-gray-100">Go to Dashboard</Link>
      </div>
      <div className="bg-zinc-900  p-8 rounded-xl shadow-lg w-full max-w-md mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-100 dark:text-white">
          Profile
        </h2>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-lg font-medium mb-2 text-gray-300 dark:text-gray-200"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500 transition-colors duration-200"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="initialCapital"
                className="block text-lg font-medium mb-2 text-gray-300 dark:text-gray-200"
              >
                Initial Capital
              </label>
              <input
                id="initialCapital"
                type="number"
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500 transition-colors duration-200"
                value={initialCapital}
                onChange={(e) => setInitialCapital(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-blue-900 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors duration-200"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex-1 bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-zinc-800  p-4 rounded-lg">
              <p className="text-lg font-medium text-gray-300 dark:text-gray-200">
                Name:
              </p>
              <p className="text-2xl font-bold text-gray-100 dark:text-white">
                {name || "N/A"}
              </p>
            </div>
            <div className="bg-zinc-800  p-4 rounded-lg">
              <p className="text-lg font-medium text-gray-300 dark:text-gray-200">
                Initial Capital:
              </p>
              <p className="text-2xl font-bold text-gray-100 dark:text-white">
                ₹{Number(initialCapital).toLocaleString() || "N/A"}
              </p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-blue-900 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-800 transition-colors duration-200"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
