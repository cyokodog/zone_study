'use strict';

var _events = require('events');

var _TimeStacker = require('./TimeStacker');

var _TimeStacker2 = _interopRequireDefault(_TimeStacker);

var _zoneSettings = require('./zoneSettings');

var _zoneSettings2 = _interopRequireDefault(_zoneSettings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 何故か import だと Promise.then がスケジュールされないので、requireで読み込む
// import 'zone.js';
require('zone.js');
// require('zone.js/dist/long-stack-trace-zone.js');

Zone.current.fork(_zoneSettings2.default).run(function () {

  var emitter = Zone.current.get('emitter');

  var timeStacker = new _TimeStacker2.default();

  var lastHtml = '';

  // モデルが変更されたかもよイベントを受け取ったら...
  emitter.on('checkDataChanged', function () {

    // 変更されていたたら...
    var html = timeStacker.getHtml();
    if (lastHtml !== html) {

      // ビューを書き換える
      document.querySelector('.data').innerHTML = html;
      lastHtml = html;
      console.log('----------draw');
    }
  });

  document.querySelector('.start').addEventListener('click', function () {

    // 今の時分秒をモデルにロードする
    timeStacker.loadCurrentTime();
  }, false);
});