import { getCompanyAppliedJob } from "@/api/company.api";
import useSingleCompanyAppliedJobStore from "@/store/singleCopanyAppliedJob.store";
import { useQuery } from "@tanstack/react-query";

const useSingleCompanyAppliedJob = (id, searchQuery = "", status = "", page = 1, limit = 4) => {
  const { appliedJobs, setAppliedJobs, setPagination } = useSingleCompanyAppliedJobStore();

  return useQuery({
    queryKey: ["singleCompanyAppliedJob", id, searchQuery, status, page, limit],
    queryFn: async () => {
      const res = await getCompanyAppliedJob(id, searchQuery, status, page, limit);

      if (res.success) {
        const newData = res.data.jobs || [];
        const pagination = res.data.pagination;

        const mergedData = page === 1 ? newData : [...appliedJobs, ...newData];

        setAppliedJobs(mergedData);
        setPagination(pagination);

        return {
          data: mergedData,
          pagination: pagination,
          isLastPage: page >= (pagination?.totalPages || 1),
        };
      }

      throw new Error(res?.message || "Failed to fetch applied jobs");
    },
    // We return the merged data as the query result directly
    select: (res) => res.data,
    enabled: !!id,
    retry: 1,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
};

export default useSingleCompanyAppliedJob;
