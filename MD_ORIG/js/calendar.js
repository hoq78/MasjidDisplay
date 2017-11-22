// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = config.calendar.clientid;

var SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

/**
 * Check if current user has authorized this application.
 */
function checkCalAuth(callback) {
    gapi.auth.authorize({
        'client_id': CLIENT_ID,
        'scope': SCOPES.join(' '),
        'immediate': true
    }, function(authResult){ handleCalAuthResult(authResult,callback)});
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleCalAuthResult(authResult,callback) {
    var authorizeDiv = document.getElementById('authorize-div');
    if (authResult && !authResult.error) {
        // Hide auth UI, then load client library.
        authorizeDiv.style.display = 'none';
        loadCalendarApi(callback);
    } else {
        // Show auth UI, allowing the user to initiate authorization by
        // clicking authorize button.
        authorizeDiv.style.display = 'inline';
    }
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick(event) {
    gapi.auth.authorize({
            client_id: CLIENT_ID,
            scope: SCOPES,
            immediate: false
        },
        handleAuthResult);
    return false;
}

/**
 * Load Google Calendar client library. Runs callback
 * function which is dependant on which page is loaded.
 */

function loadCalendarApi(callback) {
    gapi.client.load('calendar', 'v3', callback);
}

function showNextEvent() {
  //Sends a request to Google Servers to get the next event from the current time.
    var request = gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 1,
        'orderBy': 'startTime'
    });

    request.execute(function(resp) {
        var events = resp.items,
            nextEvent = events[0],
            when = nextEvent.start.dateTime;
        if (!when) {
            when = nextEvent.start.date;
        };
        /**
        * Slices the time date string into separate variables
        * so that it can be positioned separately using CSS
        */
        time = when.slice(11, 16);
        date = when.slice(8, 10) + '/' + when.slice(5, 7);
        $('#nextEvent').html(nextEvent.summary);
        $('#nextEventDateAndTime').html(time + " " + date);
        $('#nextEventLocation').html(nextEvent.location);
    });
    setTimeout(showNextEvent,30000);
}

/**
* Sends a request to Google Servers
* to get the specified events so the detailed
* calendar page can display many events
*/

function detailedCalendarPage(){
    var request = gapi.client.calendar.events.list({
        'calendarId':'primary',
        'timeMin':(new Date()).toISOString(),
        'showDeleted':false,
        'singleEvents':true,
        'maxResults':config.calendar.howManyEvents,
        'orderBy': 'startTime'
    });

    request.execute(function(resp){
        displayEvents(resp);
    })
}
/**
* Uses the empty table in the calendar.html
* generate the rows and columns in the table
* to then use jquery to populate it.
*/

function displayEvents(resp){
    var table = document.getElementById('calendarTable');
    events = resp.items;
    for(itemNum=0;itemNum<config.calendar.howManyEvents;itemNum++){
        nextEvent = events[itemNum]
        when = nextEvent.start.dateTime;
        if (!when) {when = nextEvent.start.date;};
        item = 'item' + itemNum.toString();
        eventRow = table.insertRow();
        eventRow.id = item;
        dateTime = eventRow.insertCell();
        dateTime.id = item+'dateTime';
        summary = eventRow.insertCell();
        summary.id = item+'summary';
        place = eventRow.insertCell();
        place.id = item+'location';
        document.getElementById(item).className = 'EventLine';
        dateTimeOfEvent = when.slice(11,16) + ' ' + when.slice(8,10) + '/' + when.slice(5,7);
        eventSummary = nextEvent.summary;
        eventLocation = nextEvent.location;
        $('#'+item+'dateTime').html(dateTimeOfEvent);
        $('#'+item+'summary').html(eventSummary);
        $('#'+item+'location').html(eventLocation);
    }
}
