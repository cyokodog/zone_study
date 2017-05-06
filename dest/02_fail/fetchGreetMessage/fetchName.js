'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

// import Zone from 'node-zone';

exports.default = function (userId) {
  var settings = Zone.current.get('SETTINGS');
  if (!settings) {
    throw new Error('ZoneからSETTINGSが取得できない...！');
  }
  return new Promise(function (resolve) {
    setTimeout(function () {
      throw new Error('強制エラー発動...！');
      resolve(settings.users[userId]);
    }, 1000);
  });
};