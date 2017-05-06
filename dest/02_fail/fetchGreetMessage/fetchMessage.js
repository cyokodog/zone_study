'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

// import Zone from 'node-zone';

exports.default = function (msgId) {
  var settings = Zone.current.get('SETTINGS');
  if (!settings) {
    throw new Error('ZoneからSETTINGSが取得できない...！');
  }
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(settings.messages[msgId]);
    }, 2000);
  });
};