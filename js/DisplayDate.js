/**
* A function to get the current Date and display it correctly for display on all pages
*/

function getDate() {
    var date = new Date();
    var daynumber = date.getDay();
    var dateOfMonth = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    var daysInTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var monthsInYear = ["January","February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var day;

    day = daysInTheWeek[daynumber];
    month = monthsInYear[month];
    let dateOut = day + ", " + month + " " +dateOfMonth + " " + year;
    $("#date").html(dateOut);
}
