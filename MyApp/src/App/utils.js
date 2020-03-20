export function getDateTime(dateString) {
    var time = dateString.slice(0, 8);
    var date = dateString.slice(13, 24);
    var timeArray = time.split(':');
    var d = new Date(date);
    d.setHours(parseInt(timeArray[0]));
    d.setMinutes(parseInt(timeArray[1]));
    d.setSeconds(parseInt(timeArray[2]));
    return d;
}
  
export function compare( a, b ) {
    var aTime = getDateTime(a.time);
    var bTime = getDateTime(b.time);
    if ( aTime < bTime ){
        return -1;
    }
    if ( aTime > bTime ){
        return 1;
    }
    return 0;
}