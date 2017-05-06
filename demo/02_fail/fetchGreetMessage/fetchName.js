// import Zone from 'node-zone';

export default userId => {
  const settings = Zone.current.get('SETTINGS');
  if(!settings){
    throw new Error('ZoneからSETTINGSが取得できない...！');
  }
  return new Promise(resolve => {
    setTimeout(function(){
      throw new Error('強制エラー発動...！');
      resolve(settings.users[userId]);
    }, 1000);
  });
}
