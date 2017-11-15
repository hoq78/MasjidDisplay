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
   displayTimetable(result); //JSON
};

function displayTimetable(data){
  var table = document.getElementById('timetable');
  date = new Date('07/07/2016');
  console.log(data);
  for(elementInArray=0; elementInArray<data.length; elementInArray++){
    if(data[elementInArray].Date == date.getDate()){
      for(j=0;j<prayer.length;j++){
        prayerName = prayer[j];
        for(var key in data[elementInArray]){
          if (key == prayerName){
            $('#' + prayerName + 'Azaan').append(time(data[elementInArray][key]));
          }
          else if (key == prayerName + ' J'){
            $('#' + prayerName + 'Jammat').append(time(data[elementInArray+1][key]));
            $('#' + prayerName + 'TJammat').append(data[elementInArray][key]);
          }

        }
      }
    }
  };
}
