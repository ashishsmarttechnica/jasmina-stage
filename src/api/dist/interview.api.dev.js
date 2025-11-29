"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateInterview = exports.cancelInterview = exports.scheduleInterview = exports.getAllInterviews = void 0;

var _axios = _interopRequireDefault(require("@/lib/axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getAllInterviews = function getAllInterviews(_ref) {
  var _ref$page, page, _ref$limit, limit, _ref$status, status, companyId, response;

  return regeneratorRuntime.async(function getAllInterviews$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _ref$page = _ref.page, page = _ref$page === void 0 ? 1 : _ref$page, _ref$limit = _ref.limit, limit = _ref$limit === void 0 ? 10 : _ref$limit, _ref$status = _ref.status, status = _ref$status === void 0 ? 0 : _ref$status, companyId = _ref.companyId;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(_axios["default"].get("/applied-interviews?page=".concat(page, "&limit=").concat(limit, "&status=").concat(status, "&companyId=").concat(companyId)));

        case 4:
          response = _context.sent;
          return _context.abrupt("return", response.data);

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](1);
          throw _context.t0;

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

exports.getAllInterviews = getAllInterviews;

var scheduleInterview = function scheduleInterview(data) {
  var response;
  return regeneratorRuntime.async(function scheduleInterview$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].post("/interview/apply", data));

        case 3:
          response = _context2.sent;
          return _context2.abrupt("return", response.data);

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          throw _context2.t0;

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.scheduleInterview = scheduleInterview;

var cancelInterview = function cancelInterview(interviewId) {
  var response;
  return regeneratorRuntime.async(function cancelInterview$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(_axios["default"]["delete"]("cancel/interview?interviewId=".concat(interviewId)));

        case 3:
          response = _context3.sent;
          return _context3.abrupt("return", response.data);

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          throw _context3.t0;

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.cancelInterview = cancelInterview;

var updateInterview = function updateInterview(_ref2) {
  var interviewId, data, response;
  return regeneratorRuntime.async(function updateInterview$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          interviewId = _ref2.interviewId, data = _ref2.data;
          _context4.prev = 1;
          _context4.next = 4;
          return regeneratorRuntime.awrap(_axios["default"].put("/update/interview?interviewId=".concat(interviewId), data));

        case 4:
          response = _context4.sent;
          return _context4.abrupt("return", response.data);

        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](1);
          throw _context4.t0;

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

exports.updateInterview = updateInterview;