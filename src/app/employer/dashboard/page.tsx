"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

interface EmployerProfile {
  id: string;
  user_id: string;
  company_name: string;
  company_website: string | null;
  company_logo: string | null;
  company_description: string | null;
  industry: string | null;
  company_size: string | null;
  is_verified: boolean;
  created_at: string;
}

export default function EmployerDashboardPage() {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<EmployerProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState("");

  // Redirect nếu chưa đăng nhập
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Redirect nếu không phải employer
  useEffect(() => {
    if (!loading && userRole !== "employer") {
      router.push("/");
    }
  }, [userRole, loading, router]);

  // Fetch employer profile from Backend API
  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;

      try {
        const data = await api.employer.getProfile();
        setProfile(data);
      } catch (err) {
        setError("Không thể tải thông tin employer profile");
      } finally {
        setLoadingProfile(false);
      }
    }

    if (user && userRole === "employer") {
      fetchProfile();
    }
  }, [user, userRole]);

  // Loading state
  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Không hiển thị nếu không đủ điều kiện
  if (!user || userRole !== "employer") {
    return null;
  }

  // Error state
  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Lỗi</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={() => router.push("/")} className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Employer Dashboard</h1>
          <p className="text-gray-600 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Chào mừng trở lại, {user.email}
          </p>
        </div>

        {/* Verification Status */}
        {profile && !profile.is_verified && (
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl shadow-sm p-6 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Tài khoản chưa được xác minh</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Tài khoản employer của bạn đang chờ được xác minh. Vui lòng chờ quản trị viên xác nhận thông tin công ty của bạn.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Company Profile Card */}
        {profile && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
            <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50">
              <h2 className="text-2xl font-bold text-gray-900">Thông tin công ty</h2>
            </div>
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Company Logo */}
                {profile.company_logo && (
                  <div className="sm:col-span-2">
                    <Image
                      src={profile.company_logo}
                      alt={`${profile.company_name} logo`}
                      width={200}
                      height={80}
                      className="h-20 w-auto object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </div>
                )}

                {/* Company Name */}
                <div>
                  <dt className="text-sm font-medium text-gray-500">Tên công ty</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.company_name}</dd>
                </div>

                {/* Website */}
                {profile.company_website && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Website</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <a href={profile.company_website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">
                        {profile.company_website}
                      </a>
                    </dd>
                  </div>
                )}

                {/* Industry */}
                {profile.industry && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Ngành nghề</dt>
                    <dd className="mt-1 text-sm text-gray-900">{profile.industry}</dd>
                  </div>
                )}

                {/* Company Size */}
                {profile.company_size && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Quy mô</dt>
                    <dd className="mt-1 text-sm text-gray-900">{profile.company_size} nhân viên</dd>
                  </div>
                )}

                {/* Description */}
                {profile.company_description && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Mô tả công ty</dt>
                    <dd className="mt-1 text-sm text-gray-900">{profile.company_description}</dd>
                  </div>
                )}

                {/* Verification Status */}
                <div>
                  <dt className="text-sm font-medium text-gray-500">Trạng thái xác minh</dt>
                  <dd className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${profile.is_verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{profile.is_verified ? "✓ Đã xác minh" : "⏳ Chờ xác minh"}</span>
                  </dd>
                </div>

                {/* Created At */}
                <div>
                  <dt className="text-sm font-medium text-gray-500">Ngày đăng ký</dt>
                  <dd className="mt-1 text-sm text-gray-900">{new Date(profile.created_at).toLocaleDateString("vi-VN")}</dd>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Post Job */}
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-blue-100 p-6 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Đăng tin tuyển dụng</h3>
            <p className="text-sm text-gray-600 mb-6">Tạo và đăng tin tuyển dụng mới</p>
            <button onClick={() => router.push("/employer/post-job")} disabled={!profile?.is_verified} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold">
              {profile?.is_verified ? "Đăng tin ngay" : "Chờ xác minh"}
            </button>
          </div>

          {/* Manage Jobs */}
          <div className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-green-100 p-6 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Quản lý tin tuyển dụng</h3>
            <p className="text-sm text-gray-600 mb-6">Xem và chỉnh sửa các tin đã đăng</p>
            <button onClick={() => router.push("/employer/jobs")} disabled={!profile?.is_verified} className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold">
              {profile?.is_verified ? "Xem tin đăng" : "Chờ xác minh"}
            </button>
          </div>

          {/* Applications */}
          <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-purple-100 p-6 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Quản lý ứng viên</h3>
            <p className="text-sm text-gray-600 mb-6">Xem và đánh giá hồ sơ ứng viên</p>
            <button onClick={() => router.push("/employer/applications")} disabled={!profile?.is_verified} className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold">
              {profile?.is_verified ? "Xem ứng viên" : "Chờ xác minh"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
