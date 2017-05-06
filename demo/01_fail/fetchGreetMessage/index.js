import fetchMessage from './fetchMessage';
import fetchName from './fetchName';

export default async (settings, userId, msgId) => {

  let name = '';
  try {
    name = await fetchName(settings, userId);
  } catch (e) {
    console.error('エラー発生！');
    // console.error(e.stack);
    return '';
  }

  let message = '';
  try {
    message = await fetchMessage(settings, msgId);
  } catch (e) {
    console.error('エラー発生！');
    // console.error(e.stack);
    return '';
  }

  return `${message}, ${name}`;
}
