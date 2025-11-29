"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendMessage = exports.getMessages = exports.getConversations = exports.generateChatRoom = void 0;

var _axios = _interopRequireDefault(require("@/lib/axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var generateChatRoom = function generateChatRoom(_ref) {
  var userId, profileId, response;
  return regeneratorRuntime.async(function generateChatRoom$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          userId = _ref.userId, profileId = _ref.profileId;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(_axios["default"].get("/generate/room?userId=".concat(userId, "&profileId=").concat(profileId)));

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

exports.generateChatRoom = generateChatRoom;

var getConversations = function getConversations(userId) {
  var response;
  return regeneratorRuntime.async(function getConversations$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].get("/get/conversations/?userId=".concat(userId)));

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

exports.getConversations = getConversations;

var getMessages = function getMessages(roomId) {
  var limit,
      page,
      response,
      _args3 = arguments;
  return regeneratorRuntime.async(function getMessages$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          limit = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : 200;
          page = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : 1;
          _context3.prev = 2;
          _context3.next = 5;
          return regeneratorRuntime.awrap(_axios["default"].get("/messages?limit=".concat(limit, "&page=").concat(page, "&roomId=").concat(roomId)));

        case 5:
          response = _context3.sent;
          return _context3.abrupt("return", response.data);

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](2);
          throw _context3.t0;

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[2, 9]]);
};

exports.getMessages = getMessages;

var sendMessage = function sendMessage(_ref2) {
  var senderId, receiverId, content, formData, response;
  return regeneratorRuntime.async(function sendMessage$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          senderId = _ref2.senderId, receiverId = _ref2.receiverId, content = _ref2.content;
          _context4.prev = 1;
          formData = new FormData();
          formData.append("senderId", senderId);
          formData.append("receiverId", receiverId);
          formData.append("content", content);
          _context4.next = 8;
          return regeneratorRuntime.awrap(_axios["default"].post("/messages", formData));

        case 8:
          response = _context4.sent;
          return _context4.abrupt("return", response.data);

        case 12:
          _context4.prev = 12;
          _context4.t0 = _context4["catch"](1);
          throw _context4.t0;

        case 15:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 12]]);
};

exports.sendMessage = sendMessage;