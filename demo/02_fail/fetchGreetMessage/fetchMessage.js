// import Zone from 'node-zone';

export default msgId => {
  const settings = Zone.current.get('SETTINGS');
  if(!settings){
    throw new Error('ZoneからSETTINGSが取得できない...！');
  }
  return new Promise(resolve => {
    setTimeout(function(){
      resolve(settings.messages[msgId]);
    }, 2000);
  });
}
