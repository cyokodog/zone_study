export default userId => {
  const settings = Zone.current.get('SETTINGS');
  if(!settings){
    throw new Error('ZoneからSETTINGSが取得できない...！');
  }
  return new Promise(resolve => {
    setTimeout(function(){
      resolve(settings.users[userId]);
    }, 1000);
  });
}
