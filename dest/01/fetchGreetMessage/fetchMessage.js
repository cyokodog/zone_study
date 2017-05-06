"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (settings, msgId) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(settings.messages[msgId]);
    }, 2000);
  });
};