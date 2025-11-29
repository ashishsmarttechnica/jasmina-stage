"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.planRequest = exports.purchasePlan = exports.getPreviousPlans = exports.getMembership = exports.getAllMemberships = void 0;

var _axios = _interopRequireDefault(require("@/lib/axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getAllMemberships = function getAllMemberships(companyId) {
  var res;
  return regeneratorRuntime.async(function getAllMemberships$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(_axios["default"].get("/get/all/memberships?companyId=".concat(companyId)));

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

exports.getAllMemberships = getAllMemberships;

var getMembership = function getMembership() {
  var res;
  return regeneratorRuntime.async(function getMembership$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(_axios["default"].get("/get/all/membership"));

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

exports.getMembership = getMembership;

var getPreviousPlans = function getPreviousPlans(companyId) {
  var res;
  return regeneratorRuntime.async(function getPreviousPlans$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(_axios["default"].get("/previous-plan/".concat(companyId)));

        case 2:
          res = _context3.sent;
          return _context3.abrupt("return", res.data);

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.getPreviousPlans = getPreviousPlans;

var purchasePlan = function purchasePlan(purchaseData) {
  var res;
  return regeneratorRuntime.async(function purchasePlan$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(_axios["default"].post("/purchase-plan", purchaseData));

        case 2:
          res = _context4.sent;
          return _context4.abrupt("return", res.data);

        case 4:
        case "end":
          return _context4.stop();
      }
    }
  });
};

exports.purchasePlan = purchasePlan;

var planRequest = function planRequest(_ref) {
  var companyId, newMembershipId, companyReason, res;
  return regeneratorRuntime.async(function planRequest$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          companyId = _ref.companyId, newMembershipId = _ref.newMembershipId, companyReason = _ref.companyReason;
          _context5.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].post("/change/planRequest", null, {
            params: {
              companyId: companyId,
              newMembershipId: newMembershipId,
              companyReason: companyReason
            }
          }));

        case 3:
          res = _context5.sent;
          return _context5.abrupt("return", res.data);

        case 5:
        case "end":
          return _context5.stop();
      }
    }
  });
};

exports.planRequest = planRequest;