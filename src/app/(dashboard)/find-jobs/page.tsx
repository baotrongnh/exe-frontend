"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/components/toast";
import { useRouter } from "next/navigation";
import { PageHeader, SearchBar, JobCard, JobsPagination } from "./components";

// Type cho Job từ API
interface Job {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  job_type: "FREELANCE" | "PART_TIME" | "PROJECT" | "FULL_TIME";
  budget_type: "FIXED" | "HOURLY";
  budget_min: string;
  budget_max: string;
  currency: string;
  experience_level: "INTERN" | "JUNIOR" | "MIDDLE" | "SENIOR";
  deadline: string | null;
  status: string;
  applications_count: number;
  skills_required: string[];
  rejection_reason: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  category_id: string | null;
}

interface ApiResponse {
  success: boolean;
  data: Job[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export default function FindJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]); // Store all jobs for filtering
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // Fetch all jobs without search parameter
        const response: ApiResponse = await api.jobs.getAll({
          page: 1,
          limit: 100, // Fetch more jobs for client-side filtering
        });
        console.log("All jobs fetched:", response);
        setAllJobs(response.data || []);
        setError(null);
      } catch (err: unknown) {
        console.error("Error fetching jobs:", err);
        const errorMessage = err instanceof Error ? err.message : "Không thể tải dữ liệu jobs";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []); // Only fetch once on mount

  // Filter jobs based on search query
  useEffect(() => {
    if (!searchQuery) {
      // No search - show all jobs with pagination
      const startIndex = (pagination.page - 1) * pagination.limit;
      const endIndex = startIndex + pagination.limit;
      const paginatedJobs = allJobs.slice(startIndex, endIndex);
      setJobs(paginatedJobs);
      setPagination((prev) => ({
        ...prev,
        total: allJobs.length,
        pages: Math.ceil(allJobs.length / prev.limit),
      }));
    } else {
      // Filter jobs by search query (case-insensitive)
      const filtered = allJobs.filter((job) => job.title.toLowerCase().includes(searchQuery.toLowerCase()));
      console.log("Filtered jobs:", filtered);

      // Apply pagination to filtered results
      const startIndex = (pagination.page - 1) * pagination.limit;
      const endIndex = startIndex + pagination.limit;
      const paginatedJobs = filtered.slice(startIndex, endIndex);

      setJobs(paginatedJobs);
      setPagination((prev) => ({
        ...prev,
        total: filtered.length,
        pages: Math.ceil(filtered.length / prev.limit),
      }));
    }
  }, [allJobs, searchQuery, pagination.page, pagination.limit]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      // Reset về trang 1 khi search
      if (searchInput !== searchQuery) {
        setPagination((prev) => ({ ...prev, page: 1 }));
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // Handle search
  const handleSearch = () => {
    setSearchQuery(searchInput);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleBecomeEmployer = () => {
    router.push("/employer/register");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Handle apply job
  const handleApply = async (jobId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setApplyingJobId(jobId);
      const response = await api.applications.apply(jobId);

      if (response.success) {
        toast.showToast("Apply job thành công!", "success");
        setAppliedJobs((prev) => new Set(prev).add(jobId));
        // Refresh job list để cập nhật applications_count
        const jobsResponse: ApiResponse = await api.jobs.getAll({ page: pagination.page, limit: pagination.limit });
        setJobs(jobsResponse.data || []);
      }
    } catch (err: unknown) {
      console.error("Error applying job:", err);
      const errorMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Có lỗi xảy ra khi apply job";

      // Kiểm tra nếu cần upload CV
      if (errorMessage === "You must upload at least one active CV before applying for jobs") {
        toast.showToast("Bạn cần upload CV trước khi apply job", "error");
        setTimeout(() => {
          router.push("/my-cv");
        }, 1500);
      } else {
        toast.showToast(errorMessage, "error");
      }
    } finally {
      setApplyingJobId(null);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <PageHeader onBecomeEmployer={handleBecomeEmployer} />

      {/* Search Bar */}
      <SearchBar
        searchInput={searchInput}
        onSearchInputChange={handleSearchInputChange}
        onSearch={handleSearch}
        onKeyPress={handleKeyPress}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Filters Sidebar */}
        {/* <aside className="w-72 bg-card border-r border-border p-6 overflow-y-auto">
                         <FilterSection title="Type of Employment">
                              <FilterCheckbox label="Part-Time" count={5} />
                              <FilterCheckbox label="Remote" count={2} />
                              <FilterCheckbox label="Internship" count={24} />
                              <FilterCheckbox label="Contract" count={0} />
                         </FilterSection>

                         <FilterSection title="Categories">
                              <FilterCheckbox label="Design" count={24} />
                              <FilterCheckbox label="Sales" count={3} />
                              <FilterCheckbox label="Marketing" count={3} />
                              <div className="flex items-center gap-2">
                                   <Checkbox defaultChecked />
                                   <span className="text-sm text-foreground font-medium">Business (3)</span>
                              </div>
                              <FilterCheckbox label="Human Resource" count={6} />
                              <FilterCheckbox label="Finance" count={4} />
                              <FilterCheckbox label="Engineering" count={4} />
                              <div className="flex items-center gap-2">
                                   <Checkbox defaultChecked />
                                   <span className="text-sm text-foreground font-medium">Technology (5)</span>
                              </div>
                         </FilterSection>

                         <FilterSection title="Job Level">
                              <FilterCheckbox label="Entry Level" count={57} />
                              <FilterCheckbox label="Mid Level" count={3} />
                              <FilterCheckbox label="Senior Level" count={5} />
                              <div className="flex items-center gap-2">
                                   <Checkbox defaultChecked />
                                   <span className="text-sm text-foreground font-medium">Director (12)</span>
                              </div>
                              <FilterCheckbox label="VP or Above" count={8} />
                         </FilterSection>

                         <FilterSection title="Salary Range">
                              <FilterCheckbox label="$700 - $1000" count={4} />
                              <FilterCheckbox label="$100 - $1500" count={6} />
                              <FilterCheckbox label="$1500 - $2000" count={10} />
                              <div className="flex items-center gap-2">
                                   <Checkbox defaultChecked />
                                   <span className="text-sm text-foreground font-medium">$3000 or above (4)</span>
                              </div>
                         </FilterSection>
                    </aside> */}

        {/* Job Listings */}
        <div className="flex-1 p-8 overflow-y-auto">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">{searchQuery ? `Search Results for "${searchQuery}"` : "All Jobs"}</h2>
              <p className="text-sm text-muted-foreground">
                Showing {jobs.length} of {pagination.total} results
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchInput("");
                      setSearchQuery("");
                      setPagination((prev) => ({ ...prev, page: 1 }));
                    }}
                    className="ml-2 text-primary hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </p>
            </div>
          </div>

          {/* Job Cards */}
          <div className="space-y-4">
            {loading && (
              <div className="text-center py-10">
                <p className="text-muted-foreground">Đang tải...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-10">
                <p className="text-red-500">{error}</p>
              </div>
            )}

            {!loading && !error && jobs.length === 0 && (
              <div className="text-center py-10">
                <p className="text-muted-foreground">{searchQuery ? `Không tìm thấy công việc nào với từ khóa "${searchQuery}"` : "Không có công việc nào"}</p>
              </div>
            )}

            {!loading &&
              !error &&
              jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  searchQuery={searchQuery}
                  onApply={handleApply}
                  isApplying={applyingJobId === job.id}
                  isApplied={appliedJobs.has(job.id)}
                />
              ))}
          </div>

          {/* Pagination */}
          <JobsPagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
          />
        </div>
      </div>
    </div>
  );
}
