'use strict';

require('zone.js');

Zone.current.fork({
  properties: { hoge: 'HOGE' }
}).run(function () {
  setTimeout(function () {
    console.log(Zone.current.get('hoge'));
  }, 1000);
}); // require('zone.js');


Zone.current.fork({
  properties: { hoge: 'ほげ' }
}).run(function () {
  setTimeout(function () {
    console.log(Zone.current.get('hoge'));
  }, 500);
});

Zone.current.fork({
  onHandleError: function onHandleError(delegate, current, target, error) {
    console.error('zoneAwareStack', error.zoneAwareStack);
  }
}).run(function () {
  setTimeout(function () {
    throw new Error('エラー！');
  }, 750);
});

/*ほげ
zoneAwareStack Error: エラー！
    at new Error (native)
    at null.<anonymous> (/Users/cyokodog/Dev/github/esnext/zone/dest/02/index.js:38:11) [unnamed]
    at timer [as _onTimeout] (/Users/cyokodog/Dev/github/esnext/zone/node_modules/zone.js/dist/zone-node.js:1739:29) [<root>]
    at Timer.listOnTimeout (timers.js:92:15) [<root>]
HOGE*/