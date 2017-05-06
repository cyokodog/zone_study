'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _fetchMessage = require('./fetchMessage');

var _fetchMessage2 = _interopRequireDefault(_fetchMessage);

var _fetchName = require('./fetchName');

var _fetchName2 = _interopRequireDefault(_fetchName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(userId, msgId) {
    var name, message;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _fetchName2.default)(userId);

          case 2:
            _context.t0 = _context.sent;

            if (_context.t0) {
              _context.next = 5;
              break;
            }

            _context.t0 = '';

          case 5:
            name = _context.t0;
            _context.next = 8;
            return (0, _fetchMessage2.default)(msgId);

          case 8:
            _context.t1 = _context.sent;

            if (_context.t1) {
              _context.next = 11;
              break;
            }

            _context.t1 = '';

          case 11:
            message = _context.t1;
            return _context.abrupt('return', message + ', ' + name);

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();