var weather = {
    lang: config.lang || 'en',
    apiKey: config.weather.weatherAPIKey,
    iconLookup: {
        '01d': 'wi-day-sunny',
        '02d': 'wi-day-cloudy',
        '03d': 'wi-cloudy',
        '04d': 'wi-cloudy-windy',
        '09d': 'wi-showers',
        '10d': 'wi-rain',
        '11d': 'wi-thunderstorm',
        '13d': 'wi-snow',
        '50d': 'wi-fog',
        '01n': 'wi-night-clear',
        '02n': 'wi-night-cloudy',
        '03n': 'wi-night-cloudy',
        '04n': 'wi-night-cloudy',
        '09n': 'wi-night-showers',
        '10n': 'wi-night-rain',
        '11n': 'wi-night-thunderstorm',
        '13n': 'wi-night-snow',
        '50n': 'wi-night-alt-cloudy-windy'
    },
    updateInterval: 600000,
    apiBase: 'http://api.openweathermap.org/data/2.5/',
    weatherLocation: config.weather.id ||'2640726',
}
//Returns the full API key to be used for retrieval from the server
weather.oneDayApiKey = function() {
    return weather.apiBase + 'weather?id=' + weather.weatherLocation + '&units=' + config.weather.units + '&mode=json&APPID=' + weather.apiKey;
};
// Returns the API key for the forecast page
weather.forecastApiKey = function() {
    return weather.apiBase + 'forecast?id=' + weather.weatherLocation + '&units=' + config.weather.units + '&mode=json&APPID=' + weather.apiKey;
}

//Round any values to an integer from a float
weather.roundValue = function(temperature) {
    return parseInt(temperature);
};

//Retrieve current Weather information
weather.getWeather = function(whichAPI, callback) {
    $.ajax({
        type: 'GET',
        url: whichAPI(),
        success: function(data) {
            weatherData = data;
            callback();
        }

    });
};

weather.dashboardPage = function() { // gets the data to display on the dashboard page
    let _currentTemperature = weather.roundValue(weatherData.main.temp) + '°C',
        _iconClass = weatherData.weather[0].icon,
        _icon = "wi " + weather.iconLookup[_iconClass] + " wi-fw";
    _tempHigh = weather.roundValue(weatherData.main.temp_max);
    _tempLow = weather.roundValue(weatherData.main.temp_min);
    _location = weatherData.name + ", " + weatherData.sys.country;
    //Lets Certain IDs in HTML have these values as well as change the class of the icon container so the correct icon is displayed
    document.getElementById("tempCurrent").innerHTML = _currentTemperature;
    $('#weatherGlyphicon').attr('class', _icon);
    document.getElementById("tempHighLow").innerHTML = _tempHigh.toString() + "°C/" + _tempLow.toString() + "°C";
    document.getElementById("tempLocation").innerHTML = _location;
}

getRainData = function(data) { //funcion to get the data for the rain bars
    rainData = [];
    for (count = 0; count < data.length; count++) {
        for (hour = 0; hour < data[count].length; hour++) {
            if (typeof data[count][hour].rain['3h'] == "undefined") {
              rainData.push('0');
            } else {
              rainData.push(data[count][hour].rain['3h'])
            };
        };
    }
return rainData;
}

getTemp = function(data){ // function to get the data for the temp axis
    tempData = [];
    for (count = 0; count < data.length; count++) {
        for (hour = 0; hour < data[count].length; hour++) {
            if (typeof(data[count][hour].main.temp) === 'undefined') {
                tempData.push('0');
            } else {
                tempData.push(data[count][hour].main.temp);
            };
        };
    }
    return tempData
}

getXAxisData = function(data){ // gets the data for the categories on the x Axis
    xAxisData = [];
    for(count=0;count<data.length;count++){
        for(hour=0;hour<data[count].length;hour++){
            xAxisData.push(data[count][hour].dt_txt);
        }
    }
    return xAxisData;
}

function get12Hour(element){
    hour = element.slice(11,13);
    if( parseInt(hour) > 12 ){
        twelveHour = parseInt(hour) - 12
        hour = twelveHour.toString() + ' PM'
    } else if( parseInt(hour) < 12 && parseInt(hour) > 0 ){
        hour = hour + ' AM'
    } else if( parseInt(hour) == 12 ){
        hour = hour + ' PM'
    }else if( parseInt(hour) == 0){
        hour = '12 AM'
    }
    return hour
}

function dataForDisplay(array){ //Gets the dates from the xAxis and converts the numbers into days
    xAxisDisplay = [];
    daysInWeek = ['Sun','Mon','Tues','Wed','Thurs','Fri','Sat']
    for(i=0;i<array.length;i++){
        dateElement = array[i].slice(0,10);
        hour = get12Hour(array[i]);
        date = new Date(dateElement)
        day = date.getDay()
        display = daysInWeek[day] + ' ' + hour;
        xAxisDisplay.push(display);
    }
    return xAxisDisplay
}

weather.forecastPage = function() {
    currentDate = new Date();
    fiveDayWeatherGrouping = [
        [],
        [],
        [],
        [],
        []
    ];
        //Sorts all the data into an array so that the Highcharts API can easily parse the information
    for (i = 0; i < fiveDayWeatherGrouping.length; i++) {
        for (j = 0; j < weatherData.list.length; j++) {
            if (currentDate.toISOString().slice(0, 10) === weatherData.list[j].dt_txt.slice(0, 10)) {
                fiveDayWeatherGrouping[i].push(weatherData.list[j]);
            }
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    xAxisData = dataForDisplay(getXAxisData(fiveDayWeatherGrouping));

    rainData = getRainData(fiveDayWeatherGrouping);

    tempData = getTemp(fiveDayWeatherGrouping);

    // Highcharts API function to draw the chart
    $(function() {
        var myChart = Highcharts.chart('weatherGraph', {
            chart: {
                color:'#FFFFFF',
                zoomType: 'xy',
                backgroundColor: '#000000',
                fontSize:'40px'
            },
            title: {
                text: '5 Day Weather',
                style:{
                color: '#FFFFFF',
                fontSize:'30px'
            }
            },
            xAxis: [{
                categories: xAxisData,
                color:'#FFFFFF',
                crosshair: true,
                labels: {
                  rotation: 90,
                    style:{
                        color:'#FFFFFF',
                        fontSize:'20px',
                        fontWeight:'bold'
                    }
                }
            }],
            yAxis: [{ //Primary Axis
                labels: {
                    format: '{value}°C',
                    style: {
                        color: '#FFFFFF',
                        fontSize:'20px'
                    }
                },
                title: {
                    text: 'Temperature',
                    style: {
                        color: '#FFFFFF',
                        fontSize:'20px'
                    }
                }
            }, { //Secondary Axis
                title: {
                    text: 'Precipitation',
                    style: {
                        color: '#FFFFFF',
                        fontSize:'20px'
                    }
                },
                labels: {
                    format: '{value} mm',
                    style: {
                        color: '#FFFFFF'
                    }
                },
                opposite: true
            }],
            tooltip: {
                shared: true

            },
            legend: {
                layout: 'vertical',
                align: 'left',
                x: 150,
                verticalAlign: 'top',
                y: 100,
                floating: true,
                backgroundColor: '#000000',
                itemStyle:{
                    color:'#FFFFFF',
                    fontSize:'15px'
                }
            },
            series: [{
                name: 'Precipitation',
                type: 'column',
                yAxis: 1,
                data: rainData,
                color:'#34576d',
                tooltop: {
                    valueSuffix: ' mm'
                }
            }, {
                name: 'Temperature',
                type: 'spline',
                data: tempData,
                tooltip: {
                    valueSuffix: ' °C'
                }
            }]
        });
    });
}

//Updates the current weather every 600000 milliseconds (10 minutes)
setInterval(weather.updateCurrentWeather, weather.updateInterval);
