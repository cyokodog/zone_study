export default class TimeStacker {

  constructor(){
    this.times = [];
  }

  async loadCurrentTime (){
    const time = await this.fetchTime();
    if(!this.times.length || this.times[this.times.length-1] !== time){
      this.times.push(time);
    }
  }

  getHtml () {
    if(!this.times.length) {
      return '';
    }
    const list = this.times.map(time => {
      return `<li>${time}</li>`;
    }).join('');
    return `<ul>${list}</ul>`;
  }

  fetchTime (){
    return new Promise(resolve => {
      setTimeout(function(){
        const date = new Date;
        const hours = (date.getHours()+'').padStart(2,'0');
        const minutes = (date.getMinutes()+'').padStart(2,'0');
        const seconds = (date.getSeconds()+'').padStart(2,'0');
        const time = `${hours}:${minutes}:${seconds}`;
        resolve(time);
      }, 500);
    });
  }
}
