"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSingleJob = exports.updateApplicationStatus = exports.updateJobStatus = exports.applyJob = exports.getAppliedJobs = exports.getSavedJob = exports.getSavedJobs = exports.removeJob = exports.saveJob = exports.getJobs = exports.getRecentJobs = exports.createJob = void 0;

var _axios = _interopRequireDefault(require("@/lib/axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var createJob = function createJob(data) {
  var res;
  return regeneratorRuntime.async(function createJob$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(_axios["default"].post("/create/job", data));

        case 2:
          res = _context.sent;
          return _context.abrupt("return", res.data);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.createJob = createJob;

var getRecentJobs = function getRecentJobs(userId) {
  var res;
  return regeneratorRuntime.async(function getRecentJobs$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(_axios["default"].get("/recent/job?userId=".concat(userId)));

        case 2:
          res = _context2.sent;
          return _context2.abrupt("return", res.data);

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.getRecentJobs = getRecentJobs;

var getJobs = function getJobs() {
  var _ref,
      _ref$search,
      search,
      _ref$location,
      location,
      lgbtq,
      _ref$page,
      page,
      _ref$limit,
      limit,
      params,
      url,
      res,
      _args3 = arguments;

  return regeneratorRuntime.async(function getJobs$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _ref = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : {}, _ref$search = _ref.search, search = _ref$search === void 0 ? "" : _ref$search, _ref$location = _ref.location, location = _ref$location === void 0 ? "" : _ref$location, lgbtq = _ref.lgbtq, _ref$page = _ref.page, page = _ref$page === void 0 ? 1 : _ref$page, _ref$limit = _ref.limit, limit = _ref$limit === void 0 ? 100 : _ref$limit;
          params = new URLSearchParams(); // Always add search parameter (even if empty)

          params.append("search", search); // Always add location parameter (even if empty)

          params.append("location", location); // Add lgbtq parameter if it's defined (true/false)

          if (lgbtq !== undefined) {
            params.append("lgbtq", lgbtq);
          } // Always add page and limit


          params.append("page", page);
          params.append("limit", limit);
          url = "/search/job?".concat(params.toString());
         // console.log("API Call URL:", url);
          _context3.next = 11;
          return regeneratorRuntime.awrap(_axios["default"].get(url));

        case 11:
          res = _context3.sent;
         // console.log("API Response:", res.data);
          return _context3.abrupt("return", res.data);

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.getJobs = getJobs;

var saveJob = function saveJob(_ref2) {
  var jobId, userId, res;
  return regeneratorRuntime.async(function saveJob$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          jobId = _ref2.jobId, userId = _ref2.userId;
          _context4.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].post("/save/job", {
            jobId: jobId,
            userId: userId
          }));

        case 3:
          res = _context4.sent;
          return _context4.abrupt("return", res.data);

        case 5:
        case "end":
          return _context4.stop();
      }
    }
  });
};

exports.saveJob = saveJob;

var removeJob = function removeJob(_ref3) {
  var jobId, userId, response;
  return regeneratorRuntime.async(function removeJob$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          jobId = _ref3.jobId, userId = _ref3.userId;
          _context5.next = 3;
          return regeneratorRuntime.awrap(_axios["default"]["delete"]("/remove/job", {
            data: {
              jobId: jobId,
              userId: userId
            }
          }));

        case 3:
          response = _context5.sent;
          return _context5.abrupt("return", response.data);

        case 5:
        case "end":
          return _context5.stop();
      }
    }
  });
};

exports.removeJob = removeJob;

var getSavedJobs = function getSavedJobs(userId) {
  var res;
  return regeneratorRuntime.async(function getSavedJobs$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(_axios["default"].get("/get/save/job?id=".concat(userId)));

        case 2:
          res = _context6.sent;
          return _context6.abrupt("return", res.data);

        case 4:
        case "end":
          return _context6.stop();
      }
    }
  });
};

exports.getSavedJobs = getSavedJobs;

var getSavedJob = function getSavedJob(id) {
  var res;
  return regeneratorRuntime.async(function getSavedJob$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(_axios["default"].get("/get/save/job?id=".concat(id)));

        case 2:
          res = _context7.sent;
          return _context7.abrupt("return", res.data);

        case 4:
        case "end":
          return _context7.stop();
      }
    }
  });
};

exports.getSavedJob = getSavedJob;

var getAppliedJobs = function getAppliedJobs(_ref4) {
  var userId, _ref4$page, page, _ref4$limit, limit, params, res;

  return regeneratorRuntime.async(function getAppliedJobs$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          userId = _ref4.userId, _ref4$page = _ref4.page, page = _ref4$page === void 0 ? 1 : _ref4$page, _ref4$limit = _ref4.limit, limit = _ref4$limit === void 0 ? 10 : _ref4$limit;
          params = new URLSearchParams();
          params.append("id", userId);
          params.append("page", page);
          params.append("limit", limit);
          _context8.next = 7;
          return regeneratorRuntime.awrap(_axios["default"].get("/get/applied/job?".concat(params.toString())));

        case 7:
          res = _context8.sent;
          return _context8.abrupt("return", res.data);

        case 9:
        case "end":
          return _context8.stop();
      }
    }
  });
};

exports.getAppliedJobs = getAppliedJobs;

var applyJob = function applyJob(data) {
  var res;
  return regeneratorRuntime.async(function applyJob$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.next = 2;
          return regeneratorRuntime.awrap(_axios["default"].post("/apply/job", data));

        case 2:
          res = _context9.sent;
          return _context9.abrupt("return", res.data);

        case 4:
        case "end":
          return _context9.stop();
      }
    }
  });
};

exports.applyJob = applyJob;

var updateJobStatus = function updateJobStatus(_ref5) {
  var jobId, status, res;
  return regeneratorRuntime.async(function updateJobStatus$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          jobId = _ref5.jobId, status = _ref5.status;
         // console.log("updateJobStatus API called with:", {
          //   jobId: jobId,
          //   status: status
          // }); // Debug log

          _context10.next = 4;
          return regeneratorRuntime.awrap(_axios["default"].put("/update/job?jobId=".concat(jobId), {
            status: status
          }));

        case 4:
          res = _context10.sent;
         // console.log("updateJobStatus API response:", res.data); // Debug log

          return _context10.abrupt("return", res.data);

        case 7:
        case "end":
          return _context10.stop();
      }
    }
  });
};

exports.updateJobStatus = updateJobStatus;

var updateApplicationStatus = function updateApplicationStatus(_ref6) {
  var userId, jobId, status, res;
  return regeneratorRuntime.async(function updateApplicationStatus$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          userId = _ref6.userId, jobId = _ref6.jobId, status = _ref6.status;
          _context11.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].post("/update-applied-job", {
            userId: userId,
            jobId: jobId,
            status: status
          }));

        case 3:
          res = _context11.sent;
          return _context11.abrupt("return", res.data);

        case 5:
        case "end":
          return _context11.stop();
      }
    }
  });
};

exports.updateApplicationStatus = updateApplicationStatus;

var getSingleJob = function getSingleJob(jobId) {
  var res;
  return regeneratorRuntime.async(function getSingleJob$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.next = 2;
          return regeneratorRuntime.awrap(_axios["default"].get("/get/single/job?id=".concat(jobId)));

        case 2:
          res = _context12.sent;
          return _context12.abrupt("return", res.data);

        case 4:
        case "end":
          return _context12.stop();
      }
    }
  });
};

exports.getSingleJob = getSingleJob;