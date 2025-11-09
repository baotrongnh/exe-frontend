"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function Navbar() {
  const { user, userRole, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const handleBecomeEmployer = () => {
    router.push("/employer/register");
  };
  const handleDashboard = () => {
    router.push("/messages");
  };

  const handleEmployerDashboard = () => {
    router.push("/employer/dashboard");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">Sworker</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700">Xin chào, {user.email}</span>

                {/* Hiển thị button dựa trên user role */}
                {userRole === "employer" ? (
                  <button onClick={handleEmployerDashboard} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Dashboard
                  </button>
                ) : userRole === "normal" ? (
                  <div className="flex gap-4">
                    <Button onClick={handleBecomeEmployer} className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Become Employer
                    </Button>
                    <Button onClick={handleDashboard} className="bg-blue-600 text-primary-foreground hover:opacity-80 cursor-pointer">
                      Go to Dashboard
                    </Button>
                  </div>
                ) : null}

                <button onClick={handleSignOut} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Đăng xuất
                </button>
              </>
            ) : (
              <div className="space-x-2">
                <Link href="/login" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                  Đăng nhập
                </Link>
                <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
