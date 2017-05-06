export default (settings, userId) => {
  return new Promise(resolve => {
    setTimeout(function(){
      resolve(settings.users[userId]);
    }, 1000);
  });
}
