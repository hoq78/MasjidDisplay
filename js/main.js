/**
* Main Function that runs when the page is loaded and initialises all the functions
*/
const CSVPath = 'csv/timetable.csv';

prayer = ['Fajr','Zuhr','Asr','Maghrib','Isha','Jummah','Khutbah'];

function main(){
  var time
  DisplayTime();
  getDate();
  getCSV(CSVPath,csvJSON);
  // time = setTimeout(main,1000);
};

function pushData(data){
  displayTimetable(data);
  nextJammatCountdown(data);
}

function time( str ) {
    if ( !/:/.test( str ) ) { str += ':00'; }
    return str.replace(/^\d{1}:/, '0$&').replace(/:\d{1}$/, '$&0' );
}

function getCSV(path,callback){
  $.ajax({
    type:"GET",
    url: path,
    dataType: "text",
    success: function(data){callback(data)}
  })
};


//var csv is the CSV file with headers
function csvJSON(csv){
  var lines=csv.split("\n");

  var result = [];

  var headers=lines[0].split(",");

  for(var i=1;i<lines.length;i++){

	  var obj = {};
	  var currentline=lines[i].split(",");

	  for(var j=0;j<headers.length;j++){
		  obj[headers[j]] = currentline[j];
	  };

	  result.push(obj);

  ;}

  //return result; //JavaScript object
   pushData(result); //JSON
};

function displayTimetable(data){
  var table = document.getElementById('timetable');
  date = new Date();
  for(i=0; i<data.length; i++){
    dateLookingAt = new Date(data[i].Date.slice(6,10),data[i].Date.slice(0,2)-1,data[i].Date.slice(3,5));
    console.log(dateLookingAt);
    if(dateLookingAt.toLocaleDateString() == date.toLocaleDateString()){
      for(j=0;j<prayer.length;j++){
        prayerName = prayer[j];
        for(var key in data[i]){
          if (key == prayerName){
            $('#' + prayerName + '2').append(time(data[i++][key]));
          }
          else if (key == prayerName + ' J'){
            $('#' + prayerName + '3').append(time(data[i+1][key]));
            $('#' + prayerName + '4').append(data[i][key]);
          }
      }
    }
  }
 }
}
