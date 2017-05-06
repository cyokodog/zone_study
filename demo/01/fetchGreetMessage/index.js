import fetchMessage from './fetchMessage';
import fetchName from './fetchName';

export default async (settings, userId, msgId) => {

  let name;
  try {
    name = await fetchName(settings, userId);
  } catch (e) {
    console.error(e.stack);
  }

  let message;
  try {
    message = await fetchMessage(settings, msgId);
  } catch (e) {
    console.error(e.stack);
  }

  return `${message}, ${name}`;
}
