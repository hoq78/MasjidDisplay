  function getDigitalClock() {
    var dateObject = new Date() // DATE() CONSTRUCTOR FOR CURRENT SYSTEM DATE AND TIME.
    var hrs = dateObject.getHours();
    var min = dateObject.getMinutes();
    var sec = dateObject.getSeconds();
    var time;

    min = Ticking(min); //pads the time to 2 digits when the time is less than 2 digits long
    sec = Ticking(sec);

    $("#dc_second").html(sec);
    $('#dc').html(hrs + ':' + min);

    // CALL THE FUNCTION EVERY 1 SECOND RECURSIVLY
    time = setTimeout('getDigitalClock()', 1000);
}

function Ticking(ticVal) {
    if (ticVal < 10) {
        ticVal = "0" + ticVal;
    }
    return ticVal;
}

function DisplayTime() {
        $("#time").css("display", "inline-block");
        getDigitalClock();
}
