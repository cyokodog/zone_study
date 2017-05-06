import SETTINGS_JP from '../data/settings_jp';
import SETTINGS_EN from '../data/settings_EN';
import fetchGreetMessage from './fetchGreetMessage';

// JP
fetchGreetMessage(SETTINGS_JP, 'taro', 'hello').then(msg => console.log(msg));
fetchGreetMessage(SETTINGS_JP, 'jiro', 'bye').then(msg => console.log(msg));

// EN
fetchGreetMessage(SETTINGS_EN, 'taro', 'hello').then(msg => console.log(msg));
fetchGreetMessage(SETTINGS_EN, 'jiro', 'bye').then(msg => console.log(msg));

