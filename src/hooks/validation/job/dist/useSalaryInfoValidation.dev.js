"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = require("react");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var useSalaryInfoValidation = function useSalaryInfoValidation() {
  var _useState = (0, _react.useState)({}),
      _useState2 = _slicedToArray(_useState, 2),
      errors = _useState2[0],
      setErrors = _useState2[1];

  var validateForm = function validateForm(formData) {
    var newErrors = {}; // Work Mode validation (mandatory) - only if not remote

    if (!formData.isRemote && !formData.workMode) {
      newErrors.workMode = "Work mode is required";
    } // Contact Email validation (mandatory)
    // if (!formData.contactEmail) {
    //   newErrors.contactEmail = "Contact email is required";
    // } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
    //   newErrors.contactEmail = "Please enter a valid email address";
    // }


    if (!formData.contactNumber) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^\d{10,15}$/.test(formData.contactNumber.replace(/[+\s-]/g, ""))) {
      newErrors.contactNumber = "Please enter a valid phone number (10-15 digits)";
    } // Salary validation (mandatory)


    if (!formData.salaryRange) {
      newErrors.salaryRange = "Salary range is required";
    } else if (!formData.salaryRange) {
      // Check if the salary format is correct based on the pattern
      var isRangeFormat = /^\d+\s*-\s*\d+\s+[A-Za-z]+$/.test(formData.salaryRange); // e.g., 5000 - 8000 INR

      var isLpaFormat = /^\d+\s*-\s*\d+\s+LPA$/i.test(formData.salaryRange); // e.g., 5-7 LPA

      if (!isRangeFormat && !isLpaFormat) {
        newErrors.salaryRange = "Please enter a valid salary format (e.g., 5000 - 8000 INR or 5-7 LPA)";
      }
    }

    if (!formData.applicationDeadline) {
      newErrors.applicationDeadline = "Application deadline is required";
    } else {
      var deadlineDate = new Date(formData.applicationDeadline);
      var today = new Date();
      today.setHours(0, 0, 0, 0);

      if (deadlineDate < today) {
        newErrors.applicationDeadline = "Deadline cannot be in the past";
      }
    } // Optional fields - no validation required
    // - education
    // - experience
    // - openPositions
    // - languages
    // - tags


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  var clearError = function clearError(fieldName) {
    setErrors(function (prev) {
      var updatedErrors = _objectSpread({}, prev);

      delete updatedErrors[fieldName];
      return updatedErrors;
    });
  };

  return {
    errors: errors,
    setErrors: setErrors,
    validateForm: validateForm,
    clearError: clearError
  };
};

var _default = useSalaryInfoValidation;
exports["default"] = _default;