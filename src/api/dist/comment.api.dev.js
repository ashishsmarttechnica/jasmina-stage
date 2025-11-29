"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createComment = exports.getAllComments = void 0;

var _axios = _interopRequireDefault(require("@/lib/axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getAllComments = function getAllComments(postId, viewerId, page) {
  var limit,
      res,
      _args = arguments;
  return regeneratorRuntime.async(function getAllComments$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          limit = _args.length > 3 && _args[3] !== undefined ? _args[3] : 10;
          _context.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].get("/get/comments?postId=".concat(postId, "&viewerId=").concat(viewerId, "&page=").concat(page, "&limit=").concat(limit)));

        case 3:
          res = _context.sent;
          return _context.abrupt("return", res.data);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.getAllComments = getAllComments;

var createComment = function createComment(data) {
  var res;
  return regeneratorRuntime.async(function createComment$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(_axios["default"].post("/create/comment", data));

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

exports.createComment = createComment;