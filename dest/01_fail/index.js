'use strict';

var _settings_jp = require('../data/settings_jp');

var _settings_jp2 = _interopRequireDefault(_settings_jp);

var _settings_EN = require('../data/settings_EN');

var _settings_EN2 = _interopRequireDefault(_settings_EN);

var _fetchGreetMessage = require('./fetchGreetMessage');

var _fetchGreetMessage2 = _interopRequireDefault(_fetchGreetMessage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// JP
(0, _fetchGreetMessage2.default)(_settings_jp2.default, 'taro', 'hello').then(function (msg) {
  return console.log(msg);
});
(0, _fetchGreetMessage2.default)(_settings_jp2.default, 'jiro', 'bye').then(function (msg) {
  return console.log(msg);
});

// EN
(0, _fetchGreetMessage2.default)(_settings_EN2.default, 'taro', 'hello').then(function (msg) {
  return console.log(msg);
});
(0, _fetchGreetMessage2.default)(_settings_EN2.default, 'jiro', 'bye').then(function (msg) {
  return console.log(msg);
});