"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _job = require("@/api/job.api");

var _resentjob = _interopRequireDefault(require("@/store/resentjob.store"));

var _reactQuery = require("@tanstack/react-query");

var _react = require("react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var useGetResentJob = function useGetResentJob(userId) {
  var _useResentJobStore = (0, _resentjob["default"])(),
      setResentJobs = _useResentJobStore.setResentJobs,
      setLoading = _useResentJobStore.setLoading,
      setError = _useResentJobStore.setError;

  var _useQuery = (0, _reactQuery.useQuery)({
    queryKey: ["recentJobs", userId],
    queryFn: function queryFn() {
      return (0, _job.getRecentJobs)(userId);
    },
    enabled: !!userId
  }),
      data = _useQuery.data,
      isLoading = _useQuery.isLoading,
      error = _useQuery.error;

  (0, _react.useEffect)(function () {
    if (data) {
      setResentJobs(data.data);
    }

    setLoading(isLoading);

    if (error) {
      setError(error);
    }
  }, [data, isLoading, error, setResentJobs, setLoading, setError]);
  return {
    data: data,
    isLoading: isLoading,
    error: error
  };
};

var _default = useGetResentJob;
exports["default"] = _default;