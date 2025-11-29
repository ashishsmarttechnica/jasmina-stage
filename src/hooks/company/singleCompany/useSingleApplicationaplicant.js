import { getAllApplicants } from "@/api/company.api";
import useSingleApplicationApplicantStore from "@/store/singleApplicationApplicant.store";
import { useQuery } from "@tanstack/react-query";

export const useAllApplicants = (jobId, page = 1, limit = 10) => {
  const setApplicants = useSingleApplicationApplicantStore((s) => s.setApplicants);
  const applicants = useSingleApplicationApplicantStore((s) => s.applicants);
  const setPagination = useSingleApplicationApplicantStore((s) => s.setPagination);

  return useQuery({
    queryKey: ["applicants", jobId, page],
    queryFn: async () => {
      if (!jobId) {
        return {
          newApplicants: [],
          pagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
          isLastPage: true,
        };
      }

      try {
        const res = await getAllApplicants(jobId, page, limit);

        // Check if the response indicates an error
        if (!res.success) {
          console.error("API Error:", res.message);
          throw new Error(res.message || "Failed to fetch applicants");
        }

        // Extract applications array and pagination from response
        const applications = res?.data?.applications || [];
        const pagination = res?.data?.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
        };

        // Process applicants to normalize the data structure
        const processedApplicants = applications.map((app) => {
          // Extract user profile data
          const userData = app.userId?.profile || {};

          return {
            _id: app._id,
            name: app.fullName || userData.fullName || userData.userName || "Unknown",
            userName: app.userName || userData.userName || "",
            email: app.email || app.userId?.email || "",
            location: app.location || userData.location || "",
            phone: app.phone || userData.phone || "",
            status: app.status || "0", // Status from application
            resume: app.appliedCV || app.userId?.resume || "",
            experience:
              app.expYears ||
              userData.experience ||
              app.userId?.preferences?.yearsOfExperience ||
              "",
            title:
              app.jobTitle || (app.userId?.experience && app.userId?.experience[0]?.jobTitle) || "",
            seen: app.seen,
            createdAt: app.createdAt,
            userId: app.userId?._id,
            // Keep the original data for reference if needed
            originalData: app,
          };
        });

       // console.log("Processed applicants:", processedApplicants);

        // If it's the first page, replace applicants, otherwise append
        const mergedApplicants =
          page === 1 ? processedApplicants : [...applicants, ...processedApplicants];

        setPagination(pagination);
        setApplicants(mergedApplicants);

        // Calculate if we're on the last page based on pagination info
        const isLastPage = page >= pagination.totalPages;

        return {
          newApplicants: mergedApplicants,
          pagination,
          isLastPage,
        };
      } catch (error) {
        console.error("Error fetching applicants:", error);
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
    keepPreviousData: true, // Keep previous data while fetching new page
    enabled: !!jobId, // Only run query if jobId is provided
  });
};

// Default export for backward compatibility
export default useAllApplicants;
