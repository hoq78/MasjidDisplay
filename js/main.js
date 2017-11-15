/**
* Main Function that runs when the page is loaded and initialises all the functions
*/
const CSVPath = '/csv/timetable.csv';

prayer = ['Fajr','Zuhr','Asr','Maghrib','Isha'];

function main(){
  DisplayTime();
  getDate();
  getCSV(CSVPath,csvJSON);
};

function time( str ) {
    if ( !/:/.test( str ) ) { str += ':00'; }
    return str.replace(/^\d{1}:/, '0$&').replace(/:\d{1}$/, '$&0' );
}
