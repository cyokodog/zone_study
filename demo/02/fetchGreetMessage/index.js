import fetchMessage from './fetchMessage';
import fetchName from './fetchName';

export default (userId, msgId) => {
  return Promise.all([
    fetchName(userId),
    fetchMessage(msgId)
  ]).then(result => {
    return `${result[1]}, ${result[0]}`
  });
}
