'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TimeStacker = function () {
  function TimeStacker() {
    (0, _classCallCheck3.default)(this, TimeStacker);

    this.times = [];
  }

  (0, _createClass3.default)(TimeStacker, [{
    key: 'loadCurrentTime',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var time;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.fetchTime();

              case 2:
                time = _context.sent;

                if (!this.times.length || this.times[this.times.length - 1] !== time) {
                  this.times.push(time);
                }

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function loadCurrentTime() {
        return _ref.apply(this, arguments);
      }

      return loadCurrentTime;
    }()
  }, {
    key: 'getHtml',
    value: function getHtml() {
      if (!this.times.length) {
        return '';
      }
      var list = this.times.map(function (time) {
        return '<li>' + time + '</li>';
      }).join('');
      return '<ul>' + list + '</ul>';
    }
  }, {
    key: 'fetchTime',
    value: function fetchTime() {
      return new Promise(function (resolve) {
        setTimeout(function () {
          var date = new Date();
          var hours = (date.getHours() + '').padStart(2, '0');
          var minutes = (date.getMinutes() + '').padStart(2, '0');
          var seconds = (date.getSeconds() + '').padStart(2, '0');
          var time = hours + ':' + minutes + ':' + seconds;
          resolve(time);
        }, 500);
      });
    }
  }]);
  return TimeStacker;
}();

exports.default = TimeStacker;