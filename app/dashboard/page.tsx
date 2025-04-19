"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LogoutButton from "../components/LogoutButton";

export default function DashboardPage() {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    try {
      const payload = JSON.parse(decodeJwtPayload(token));
      setRole(payload.role);
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, []);

  if (!role) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <LogoutButton />
      {role === "admin" ? <AdminPanel /> : <LaborerPanel />}
    </div>
  );
}

function decodeJwtPayload(token: string) {
  if (!token || typeof token !== "string") throw new Error("No token provided");

  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Token is malformed");

  const base64Url = parts[1];
  if (!base64Url) throw new Error("No payload in token");

  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "="
  );

  return atob(padded);
}

function AdminPanel() {
  return (
    <div className="space-y-4">
      <a
        href="/dashboard/admin/users"
        className="block p-4 bg-gray-100 rounded">
        Manage Users
      </a>
      <a
        href="/dashboard/admin/job-types"
        className="block p-4 bg-gray-100 rounded">
        Manage Job Types
      </a>
      <a
        href="/dashboard/admin/job-sheets"
        className="block p-4 bg-gray-100 rounded">
        Manage Job Sheets
      </a>
    </div>
  );
}

function LaborerPanel() {
  return (
    <div className="space-y-4">
      <a
        href="/dashboard/laborer/job-sheets"
        className="block p-4 bg-gray-100 rounded">
        My Job Sheets
      </a>
    </div>
  );
}
