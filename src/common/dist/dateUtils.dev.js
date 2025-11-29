"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRelativeTime = getRelativeTime;

function getRelativeTime(date) {
  var now = new Date();
  var target = new Date(date);
  var diffMs = now - target;
  var diffSeconds = Math.floor(diffMs / 1000);
  var diffMinutes = Math.floor(diffSeconds / 60);
  var diffHours = Math.floor(diffMinutes / 60);
  var diffDays = Math.floor(diffHours / 24);
  var diffMonths = Math.floor(diffDays / 30);
  var diffYears = Math.floor(diffMonths / 12);
  if (diffYears > 0) return "".concat(diffYears, " year").concat(diffYears > 1 ? "s" : "", " ago");
  if (diffMonths > 0) return "".concat(diffMonths, " month").concat(diffMonths > 1 ? "s" : "", " ago");
  if (diffDays > 0) return "".concat(diffDays, " day").concat(diffDays > 1 ? "s" : "", " ago");
  if (diffHours > 0) return "".concat(diffHours, " hour").concat(diffHours > 1 ? "s" : "", " ago");
  if (diffMinutes > 0) return "".concat(diffMinutes, " minute").concat(diffMinutes > 1 ? "s" : "", " ago");
  return "just now";
}