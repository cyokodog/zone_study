import SETTINGS_JP from '../data/settings_jp';
import SETTINGS_EN from '../data/settings_EN';
import fetchGreetMessage from './fetchGreetMessage';

// import Zone from 'node-zone';
require('zone.js');
// require('zone.js/dist/zone-node');
// require('zone.js/dist/long-stack-trace-zone.js');

/**
 * node-zoneだとエラーを検出できない
 */
const onHandleError = (delegate, current, target, error) => {
  console.error('エラー発生');
  // console.error(error.rejection.stack);
  return false;
};

Zone.current.fork({
	properties: {
    SETTINGS: SETTINGS_JP
	},
  onHandleError: onHandleError
}).run(() => {
  fetchGreetMessage('taro', 'hello').then(msg => console.log(msg));
  fetchGreetMessage('jiro', 'bye').then(msg => console.log(msg));
});

Zone.current.fork({
	properties: {
    SETTINGS: SETTINGS_EN
	},
  onHandleError: onHandleError
}).run(() => {
  fetchGreetMessage('taro', 'hello').then(msg => console.log(msg));
  fetchGreetMessage('jiro', 'bye').then(msg => console.log(msg));
});

