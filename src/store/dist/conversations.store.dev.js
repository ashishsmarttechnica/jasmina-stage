"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _chat = require("@/api/chat.api");

var _zustand = require("zustand");

var _middleware = require("zustand/middleware");

var useConversationsStore = (0, _zustand.create)((0, _middleware.devtools)(function (set) {
  return {
    conversations: [],
    loading: false,
    error: null,
    fetchConversations: function fetchConversations(userId) {
      var response;
      return regeneratorRuntime.async(function fetchConversations$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (userId) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return");

            case 2:
              set({
                loading: true,
                error: null
              });
              _context.prev = 3;
              _context.next = 6;
              return regeneratorRuntime.awrap((0, _chat.getConversations)(userId));

            case 6:
              response = _context.sent;

              if (response.success) {
                set({
                  conversations: response.data.results || []
                });
              } else {
                set({
                  error: "Failed to fetch conversations"
                });
              }

              _context.next = 13;
              break;

            case 10:
              _context.prev = 10;
              _context.t0 = _context["catch"](3);
              set({
                error: _context.t0.message || "Failed to fetch conversations"
              });

            case 13:
              _context.prev = 13;
              set({
                loading: false
              });
              return _context.finish(13);

            case 16:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[3, 10, 13, 16]]);
    },
    setConversations: function setConversations(conversations) {
      return set({
        conversations: conversations
      });
    }
  };
}, {
  name: "ConversationsStore"
}));
var _default = useConversationsStore;
exports["default"] = _default;