import axios from "@/lib/axios";

export const getAllMemberships = async (companyId) => {
  const res = await axios.get(`/get/all/memberships?companyId=${companyId}`);
  return res.data;
};

export const getMembership = async () => {
  const res = await axios.get(`/numberOfEmployee`);
  return res.data;
};

export const getPreviousPlans = async (companyId) => {
  const res = await axios.get(`/previous-plan/${companyId}`);
  return res.data;
};

export const purchasePlan = async (purchaseData) => {
  const res = await axios.post("/purchase-plan", purchaseData);
  return res.data;
};

export const planRequest = async ({ companyId, newMembershipId, companyReason }) => {
  const res = await axios.post("/change/planRequest", null, {
    params: {
      companyId,
      newMembershipId,
      companyReason,
    },
  });
  return res.data;
};
