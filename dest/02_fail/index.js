'use strict';

var _settings_jp = require('../data/settings_jp');

var _settings_jp2 = _interopRequireDefault(_settings_jp);

var _settings_EN = require('../data/settings_EN');

var _settings_EN2 = _interopRequireDefault(_settings_EN);

var _fetchGreetMessage = require('./fetchGreetMessage');

var _fetchGreetMessage2 = _interopRequireDefault(_fetchGreetMessage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Zone from 'node-zone';
require('zone.js');
// require('zone.js/dist/zone-node');
// require('zone.js/dist/long-stack-trace-zone.js');

/**
 * node-zoneだとエラーを検出できない
 */
var onHandleError = function onHandleError(delegate, current, target, error) {
  console.error('エラー発生');
  // console.error(error.rejection.stack);
  return false;
};

Zone.current.fork({
  properties: {
    SETTINGS: _settings_jp2.default
  },
  onHandleError: onHandleError
}).run(function () {
  (0, _fetchGreetMessage2.default)('taro', 'hello').then(function (msg) {
    return console.log(msg);
  });
  (0, _fetchGreetMessage2.default)('jiro', 'bye').then(function (msg) {
    return console.log(msg);
  });
});

Zone.current.fork({
  properties: {
    SETTINGS: _settings_EN2.default
  },
  onHandleError: onHandleError
}).run(function () {
  (0, _fetchGreetMessage2.default)('taro', 'hello').then(function (msg) {
    return console.log(msg);
  });
  (0, _fetchGreetMessage2.default)('jiro', 'bye').then(function (msg) {
    return console.log(msg);
  });
});