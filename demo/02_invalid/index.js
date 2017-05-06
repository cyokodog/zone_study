import SETTINGS_JP from '../data/settings_jp';
import SETTINGS_EN from '../data/settings_EN';
import fetchGreetMessage from './fetchGreetMessage';
require('zone.js');

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

function onHandleError(delegate, current, target, error){
  console.error('エラー発生', error.rejection.stack);
  return false;
};
