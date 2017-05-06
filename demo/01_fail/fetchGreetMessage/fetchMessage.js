export default (settings, msgId) => {
  return new Promise(resolve => {
    setTimeout(function(){
      resolve(settings.messages[msgId]);
    }, 2000);
  });
}
