export default (settings, userId) => {
  return new Promise(resolve => {
    throw new Error('強制エラー発動...！');
  });
}
