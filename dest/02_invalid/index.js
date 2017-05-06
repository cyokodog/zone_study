'use strict';

var _settings_jp = require('../data/settings_jp');

var _settings_jp2 = _interopRequireDefault(_settings_jp);

var _settings_EN = require('../data/settings_EN');

var _settings_EN2 = _interopRequireDefault(_settings_EN);

var _fetchGreetMessage = require('./fetchGreetMessage');

var _fetchGreetMessage2 = _interopRequireDefault(_fetchGreetMessage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('zone.js');

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

function onHandleError(delegate, current, target, error) {
  console.error('エラー発生', error.rejection.stack);
  return false;
};