"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";
import Link from "next/link";

const companySizeOptions = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];

export default function EmployerRegisterPage() {
  const { user, userRole, loading, refreshUserRole, getAccessToken } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    company_name: "",
    company_website: "",
    company_logo: "",
    company_description: "",
    industry: "",
    company_size: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Redirect nếu chưa đăng nhập
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Redirect nếu đã là employer
  useEffect(() => {
    if (!loading && userRole === "employer") {
      router.push("/employer/dashboard");
    }
  }, [userRole, loading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (!user) {
        setError("Vui lòng đăng nhập để tiếp tục");
        return;
      }

      const token = getAccessToken();
      if (!token) {
        setError("Session đã hết hạn. Vui lòng đăng nhập lại.");
        return;
      }

      // Tạo employer profile - Gọi Backend API
      const employerData = {
        company_name: formData.company_name,
        company_website: formData.company_website || undefined,
        company_logo: formData.company_logo || undefined,
        company_description: formData.company_description || undefined,
        industry: formData.industry || undefined,
        company_size: formData.company_size || undefined,
      };

      // Gọi API backend
      await api.employer.register(employerData);

      console.log("Employer profile created successfully");

      // Cập nhật user metadata với role employer
      const { error: updateError } = await supabase.auth.updateUser({
        data: { role: "employer" },
      });

      if (updateError) {
        console.error("Error updating user role:", updateError);
      }

      // Refresh user role
      await refreshUserRole();

      setSuccess(true);

      // Redirect sau 2 giây
      setTimeout(() => {
        router.push("/employer/dashboard");
      }, 2000);
    } catch (err: unknown) {
      console.error("Error registering employer:", err);
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi không mong muốn");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Không hiển thị nếu chưa login hoặc đã là employer
  if (!user || userRole === "employer") {
    return null;
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Đăng ký thành công!</h2>
          <p className="text-gray-600 mb-6">Bạn đã trở thành employer. Đang chuyển đến dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Đăng ký Employer</h1>
            <p className="text-gray-600">Điền thông tin công ty của bạn để trở thành employer và đăng tuyển việc làm</p>
          </div>

          {/* Error Message */}
          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Name */}
            <div>
              <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-2">
                Tên công ty <span className="text-red-500">*</span>
              </label>
              <input
                id="company_name"
                name="company_name"
                type="text"
                required
                value={formData.company_name}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                placeholder="Nhập tên công ty"
              />
            </div>

            {/* Company Website */}
            <div>
              <label htmlFor="company_website" className="block text-sm font-medium text-gray-700 mb-2">
                Website công ty
              </label>
              <input
                id="company_website"
                name="company_website"
                type="url"
                value={formData.company_website}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                placeholder="https://company.com"
              />
            </div>

            {/* Company Logo URL */}
            <div>
              <label htmlFor="company_logo" className="block text-sm font-medium text-gray-700 mb-2">
                Logo công ty (URL)
              </label>
              <input
                id="company_logo"
                name="company_logo"
                type="url"
                value={formData.company_logo}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                placeholder="https://company.com/logo.png"
              />
            </div>

            {/* Industry */}
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                Ngành nghề
              </label>
              <input
                id="industry"
                name="industry"
                type="text"
                value={formData.industry}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                placeholder="Ví dụ: Technology, Finance, Healthcare..."
              />
            </div>

            {/* Company Size */}
            <div>
              <label htmlFor="company_size" className="block text-sm font-medium text-gray-700 mb-2">
                Quy mô công ty
              </label>
              <select id="company_size" name="company_size" value={formData.company_size} onChange={handleChange} disabled={isSubmitting} className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50">
                <option value="">Chọn quy mô công ty</option>
                {companySizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size} nhân viên
                  </option>
                ))}
              </select>
            </div>

            {/* Company Description */}
            <div>
              <label htmlFor="company_description" className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả công ty
              </label>
              <textarea
                id="company_description"
                name="company_description"
                rows={4}
                value={formData.company_description}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 resize-none"
                placeholder="Mô tả về công ty của bạn..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6">
              <Link href="/" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                ← Quay lại trang chủ
              </Link>

              <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Đang xử lý...
                  </>
                ) : (
                  "Đăng ký Employer"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
