import { getPreviousPlans } from "@/api/membership.api";
import { useQuery } from "@tanstack/react-query";

export const usePreviousPlans = (companyId) => {
  return useQuery({
    queryKey: ["previousPlans", companyId],
    queryFn: () => getPreviousPlans(companyId),
    enabled: !!companyId,
  });
};
