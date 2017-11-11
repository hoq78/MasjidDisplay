function showAnalogueClock() {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var date = new Date();
    var angle;
    var radius = 150;
    //Clear Everything and Re-Draw every second
    context.clearRect(0, 0, canvas.width, canvas.height);
    markHours();

    showSeconds();
    showMinutes();
    showHours();

    time = setTimeout(showAnalogueClock, 1000);

    function centerDial() {
        context.beginPath();
        context.arc(canvas.width / 2, canvas.height / 2, 2, 0, Math.PI * 2);
        context.lineWidth = 0;
        context.fillStyle = '#000000';
        context.strokeStyle = '#000000';
        context.stroke();
    }

    function markHours() {
        for (var hour = 0; hour < 12; hour++) {
            angle = (hour - 3) * (Math.PI * 2) / 12; // THE ANGLE TO MARK.
            context.lineWidth = 3; // HAND WIDTH.
            context.beginPath();

            var x1 = (canvas.width / 2) + Math.cos(angle) * (radius);
            var y1 = (canvas.height / 2) + Math.sin(angle) * (radius);
            var x2 = (canvas.width / 2) + Math.cos(angle) * (radius - (radius / 7));
            var y2 = (canvas.height / 2) + Math.sin(angle) * (radius - (radius / 7));

            context.moveTo(x1, y1);
            context.lineTo(x2, y2);

            context.strokeStyle = '#466B76';
            context.stroke();
        }
    }

    function showSeconds() {

        var sec = date.getSeconds();
        angle = ((Math.PI * 2) * (sec / 60)) - ((Math.PI * 2) / 4);
        context.lineWidth = 0.8; // HAND WIDTH.

        context.beginPath();
        // START FROM CENTER OF THE CLOCK.
        context.moveTo(canvas.width / 2, canvas.height / 2);
        // DRAW THE LENGTH.
        context.lineTo((canvas.width / 2 + Math.cos(angle) * radius),
            canvas.height / 2 + Math.sin(angle) * radius);

        // DRAW THE TAIL OF THE SECONDS HAND.
        context.moveTo(canvas.width / 2, canvas.height / 2); // START FROM CENTER.
        // DRAW THE LENGTH.
        context.lineTo((canvas.width / 2 - Math.cos(angle) * 20),
            canvas.height / 2 - Math.sin(angle) * 20);

        context.strokeStyle = '#586A73'; // COLOR OF THE HAND.
        context.stroke();
    }

    function showMinutes() {

        var min = date.getMinutes();
        angle = ((Math.PI * 2) * (min / 60)) - ((Math.PI * 2) / 4);
        context.lineWidth = 1.5; // HAND WIDTH.

        context.beginPath();
        context.moveTo(canvas.width / 2, canvas.height / 2); // START FROM CENTER.
        // DRAW THE LENGTH.
        context.lineTo((canvas.width / 2 + Math.cos(angle) * radius / 1.1),
            canvas.height / 2 + Math.sin(angle) * radius / 1.1);

        context.strokeStyle = '#FFFFFF'; // COLOR OF THE HAND.
        context.stroke();
    }

    function showHours() {

        var hour = date.getHours();
        var min = date.getMinutes();
        angle = ((Math.PI * 2) * ((hour * 5 + (min / 60) * 5) / 60)) - ((Math.PI * 2) / 4);
        context.lineWidth = 1.5; // HAND WIDTH.

        context.beginPath();
        context.moveTo(canvas.width / 2, canvas.height / 2); // START FROM CENTER.
        // DRAW THE LENGTH.
        context.lineTo((canvas.width / 2 + Math.cos(angle) * radius / 1.5),
            canvas.height / 2 + Math.sin(angle) * radius / 1.5);

        context.strokeStyle = '#FFF'; // COLOR OF THE HAND.
        context.stroke();
    }

}
