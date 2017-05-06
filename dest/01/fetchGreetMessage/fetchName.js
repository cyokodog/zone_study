"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (settings, userId) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(settings.users[userId]);
    }, 1000);
  });
};