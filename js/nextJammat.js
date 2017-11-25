const jammatNames = ['Fajr J','Zuhr J','Asr J','Maghrib J','Isha J','Jummah','Khutbah J']

function convertTimeToMiliseconds(data){
  var jammatTimeMiliseconds = []
  for(j=0;j<jammatNames.length;j++){
    jammatName = jammatNames[j];
    for(var key in data){
      if(key == jammatName){
        dateLookingAt = new Date(data.Date.slice(6,10),data.Date.slice(0,2)-1,data.Date.slice(3,5),data[key].slice(0,2),data[key].slice(3,5));
        if(dateLookingAt > today){
          jammatTimeMiliseconds.push(dateLookingAt)
        }
      }
    }
  }
  return(jammatTimeMiliseconds)
}

function nextJammatCountdown(data){
  var time
  today = new Date()
  for(i=0;i<data.length;i++){
    if(new Date(data[i].Date).toLocaleDateString() == today.toLocaleDateString()){
      var jammatTimeMiliseconds = convertTimeToMiliseconds(data[i]);
    if(jammatTimeMiliseconds.length == 0){
        jammatTimeMiliseconds = convertTimeToMiliseconds(data[i+1]);
      }
    }
  }

  timeDiff = new Date(jammatTimeMiliseconds[0]-today);
  hours = Ticking(timeDiff.getHours());
  minutes = Ticking(timeDiff.getMinutes());
  seconds = Ticking(timeDiff.getSeconds());
  $('#countdown').html(hours + ':' + minutes);
  $('#countdown_second').html(seconds);

}
