"use client";

import type React from "react";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check auth for all admin pages except login
    if (pathname !== "/admin/login") {
      const isAuthenticated = localStorage.getItem("adminAuth") === "true";
      if (!isAuthenticated) {
        router.push("/admin/login");
      }
    }
  }, [pathname, router]);

  // Don't show sidebar on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50" suppressHydrationWarning>
      <AdminSidebar />
      <main className="flex-1" suppressHydrationWarning>
        {children}
      </main>
    </div>
  );
}
