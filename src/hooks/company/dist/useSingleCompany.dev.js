"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useSingleCompany = void 0;

var _company = require("@/api/company.api");

var _reactQuery = require("@tanstack/react-query");

var useSingleCompany = function useSingleCompany(userId) {
  return (0, _reactQuery.useQuery)({
    queryKey: ["singleCompany", userId],
    queryFn: function queryFn() {
      return (0, _company.getCompany)(userId);
    },
    select: function select(res) {
      return res.data;
    },
    enabled: !!userId,
    retry: 1,
    refetchOnWindowFocus: false
  });
};

exports.useSingleCompany = useSingleCompany;