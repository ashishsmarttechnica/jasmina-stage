"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getImg;

function getImg(url) {
  if (url) {
    return url.startsWith("http") ? url : "".concat(process.env.NEXT_PUBLIC_IMAGE_URL).concat(url);
  }
}