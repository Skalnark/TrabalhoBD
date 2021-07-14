export default class UtilsFunctions {
  
  static pad(val){
    return (val<10) ? '0' + val : val;
  }

  static formatTimeStampToDate(timeStamp) {
    const date = new Date(timeStamp);
    return date.toLocaleString('pt-BR', { timeZone: 'UTC' }).slice(0, 10);
  }
  
  static onlyDigit(value) {
    return /^\d+$/.test(value);
  }

  static formatTimeStampToHours(timestamp) {
    const hours = new Date(timestamp);
    var h = new Date(timestamp).getHours();
    var m = new Date(timestamp).getMinutes();

    var output = UtilsFunctions.pad(h) + 'h' + UtilsFunctions.pad(m);

    return output;
  }

}