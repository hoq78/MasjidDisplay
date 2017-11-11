var CLIENT_ID = config.mail.clientid;
var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
var intervalHandle = null;
var emailSubject = [];
var emailContent = [];
var emailFrom = [];

/**
 * Check if current user has authorized this application.
 */

function checkAuth(callback) {
    gapi.auth.authorize({
        'client_id': CLIENT_ID,
        'scope': SCOPES.join(' '),
        'immediate': true
    }, function(authResult) { handleAuthResult(callback, authResult) } );
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */

function handleAuthResult(callback,authResult) {
    var authorizeDiv = document.getElementById('authorize-div');
    if (authResult && !authResult.error) {
        // Hide auth UI, then load client library.
        authorizeDiv.style.display = 'none';
        loadGmailApi(callback);
        registerInboxInterval(1000*60*5);
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

function registerInboxInterval(time){
  if(intervalHandle){
    clearInterval(intervalHandle);
  }
  intervalHandle = setInterval(inboxCount, time);
}

/**
 * Load Gmail API client library. Runs the callback function
 * dependant on which page is loaded
 */

function loadGmailApi(callback) {
    gapi.client.load('gmail', 'v1', callback);
}

/**
* Sends a request to the Google Servers to get
* the number of unread emails in the specified inbox
*/

function inboxCount() {
    var request = gapi.client.gmail.users.labels.get({
        'userId': 'me',
        'id': config.mail.whichInboxCount,
    });
    request.execute(function(resp) {
        noOfUnreadEmails = resp.messagesUnread;
        $('#inboxCountNumber').html(noOfUnreadEmails);
    });
  }

/**
* Takes the response from the Google Servers
* and pushes all the message IDs to an array then is returned
*/

function getEmailIds(resp){
  emailIDs = [];
  for(noOfmail=0; noOfmail<config.mail.howManyEmails && noOfmail < resp.messages.length; noOfmail++){
    emailID = resp.messages[noOfmail].id;
    emailIDs.push(emailID);
  };
  return emailIDs
}

/**
* Takes the resp and looks for the Subject attribute.
* Returns the Subject value
*/

function getSubjectHeaders(resp){
  for(i=0;i<resp.payload.headers.length;i++){
    if(resp.payload.headers[i].name == 'Subject'){
      subject = resp.payload.headers[i].value;
      return subject
    };
  };
}

/**
* Takes the Response from the server and looks for the From attribute.
* Returns the From value
*/

function getEmailFrom(resp){
  for(i=0;i<resp.payload.headers.length;i++){
    if(resp.payload.headers[i].name == 'From'){
      from = resp.payload.headers[i].value;
      return from
    };
  };
}

/**
* Checks if all the emails have been retrieved,
* if so then display the emails
*/

function finishedAllCallbacks(){
  if(emailSubject.length == config.mail.howManyEmails){
  displayEmails();
  }
}

/**
* Uses the empty table in the mail.html
* generate the rows and columns in the table
* to then use jquery to populate it using the arrays of data.
*/

function displayEmails(){
  var table = document.getElementById('emailsTable');
  for(itemNum=0;itemNum<emailSubject.length;itemNum++){
    item = 'item' + itemNum.toString();
    emailSubjectLine = table.insertRow();
    subjectLine = emailSubjectLine.insertCell();
    subjectLine.id = item;
    fromline = emailSubjectLine.insertCell();
    fromline.id = item+'from';
    document.getElementById(fromline.id).className = 'FromReceipt';
    document.getElementById(subjectLine.id).className = 'SubjectLine';
    var emailContentLine = table.insertRow();
    var contentLine = emailContentLine.insertCell();
    emailContentLine.id = item+'content';
    document.getElementById(emailContentLine.id).className = 'ContentRow';
    emailSubjectVar = emailSubject[itemNum];
    emailContentVar = emailContent[itemNum];
    emailFromVar = emailFrom[itemNum];
    $('#'+item).html(emailSubjectVar);
    $('#'+item+'from').html(emailFromVar);
    $('#'+item+'content').html(emailContentVar);
  }
}

/**
* Takes the Google Server response to push
* all the snippets of emails to an array.
* Returns the array.
*/

function getEmailContent(resp){
  emailContent = [];
  for(i=0; i<config.mail.howManyEmails;i++){
    emailSnippet = resp.snippet;
    emailContent.push(emailSnippet);
  };
  return emailContent;
}

/**
* Sends a request to the Google Servers
* for an array of the messageIDs and threadIDS
*/

function detailedMail(){
  var request = gapi.client.gmail.users.messages.list({
    'userId':'me',
    'labelIds':'IMPORTANT',
  });
  request.execute(function(resp) {
    emailIDs = getEmailIds(resp);
    for(emailIDtoGet=0;emailIDtoGet<emailIDs.length;emailIDtoGet++){
      emailID = emailIDs[emailIDtoGet];
      getMessage(emailID, finishedAllCallbacks);
    };
  })
}

/**
* Uses the email ids to get the content of the messages,
* and seperates all the data into the individual arrays
*/

function getMessage(id, callback){
    var request = gapi.client.gmail.users.messages.get({
        'userId': 'me',
        'id': id,
    });
    request.execute(function(resp){
      emailSubject.push(getSubjectHeaders(resp));
      emailContent.push(resp.snippet);
      emailFrom.push(getEmailFrom(resp));
      callback();
    })
}
