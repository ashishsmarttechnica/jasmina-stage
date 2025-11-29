"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPostReport = exports.createReport = void 0;

var _axios = _interopRequireDefault(require("@/lib/axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var createReport = function createReport(data) {
  var res;
  return regeneratorRuntime.async(function createReport$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(_axios["default"].post("/create/report", data));

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

exports.createReport = createReport;

var createPostReport = function createPostReport(data) {
  var res;
  return regeneratorRuntime.async(function createPostReport$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(_axios["default"].post("/create/post/report", data));

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

exports.createPostReport = createPostReport;