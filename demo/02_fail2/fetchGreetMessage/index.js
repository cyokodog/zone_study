const fetchMessage = require('./fetchMessage');
const fetchName = require('./fetchName');

module.exports = async (userId, msgId) => {
  const name = await fetchName(userId) || '';
  const message = await fetchMessage(msgId) || '';
  return `${message}, ${name}`;
}

// import fetchMessage from './fetchMessage';
// import fetchName from './fetchName';

// export default async (userId, msgId) => {
//   const name = await fetchName(userId) || '';
//   const message = await fetchMessage(msgId) || '';
//   return `${message}, ${name}`;
// }
