'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fetchMessage = require('./fetchMessage');

var _fetchMessage2 = _interopRequireDefault(_fetchMessage);

var _fetchName = require('./fetchName');

var _fetchName2 = _interopRequireDefault(_fetchName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (userId, msgId) {
  return Promise.all([(0, _fetchName2.default)(userId), (0, _fetchMessage2.default)(msgId)]).then(function (result) {
    return result[1] + ', ' + result[0];
  });
};