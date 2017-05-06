// 何故か import だと Promise.then がスケジュールされないので、requireで読み込む
// import 'zone.js';
require('zone.js');
// require('zone.js/dist/long-stack-trace-zone.js');

import {EventEmitter} from 'events';

import TimeStacker from './TimeStacker';

import zoneSettings from './zoneSettings';

Zone.current.fork(zoneSettings).run(() => {

  const emitter = Zone.current.get('emitter');

  const timeStacker = new TimeStacker();

  let lastHtml = '';

  // モデルが変更されたかもよイベントを受け取ったら...
  emitter.on('checkDataChanged', () => {

    // 変更されていたたら...
    const html = timeStacker.getHtml();
    if(lastHtml !== html){

      // ビューを書き換える
      document.querySelector('.data').innerHTML = html;
      lastHtml = html;
      console.log('----------draw');
    }
  });

  document.querySelector('.start').addEventListener('click', () => {

    // 今の時分秒をモデルにロードする
    timeStacker.loadCurrentTime();

  }, false);
});
