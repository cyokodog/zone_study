'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (userId) {
  var settings = Zone.current.get('SETTINGS');
  if (!settings) {
    throw new Error('ZoneからSETTINGSが取得できない...！');
  }
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(settings.users[userId]);
    }, 1000);
  });
};