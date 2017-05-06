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
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(settings, userId, msgId) {
    var name, message;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            name = void 0;
            _context.prev = 1;
            _context.next = 4;
            return (0, _fetchName2.default)(settings, userId);

          case 4:
            name = _context.sent;
            _context.next = 10;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context['catch'](1);

            console.error(_context.t0.stack);

          case 10:
            message = void 0;
            _context.prev = 11;
            _context.next = 14;
            return (0, _fetchMessage2.default)(settings, msgId);

          case 14:
            message = _context.sent;
            _context.next = 20;
            break;

          case 17:
            _context.prev = 17;
            _context.t1 = _context['catch'](11);

            console.error(_context.t1.stack);

          case 20:
            return _context.abrupt('return', message + ', ' + name);

          case 21:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[1, 7], [11, 17]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();