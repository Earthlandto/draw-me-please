$(document).ready(function() {

    //Get the canvas and calculate canvas size and max-size
    var canvas = document.getElementById("mycanvas");
    var ctx = canvas.getContext('2d');

    var curves = [];
    var points = [];
    var index = 0;
    // Catch click event to create lines into canvas
    $('#mycanvas').click(function(event) {
        var mouseX = event.pageX - $(this).offset().left;
        var mouseY = event.pageY - $(this).offset().top;
        points[index] = {
            x: mouseX,
            y: mouseY
        };
        index = (index + 1) % 4;
    });

    $("#button-create-line").click(function() {
        if (points.length > 2) {
            curves.push(new Bezier(points));
            points = [];
            index = 0;
        }
    });

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        curves.forEach(function(elem) {
            drawBezier(ctx, elem.points);
        });
        points.forEach(function(elem) {
            drawCircle(ctx, elem, 3);
        });
    }

    window.setInterval(update, 1000 / 60);
});




function drawCircle(ctx, center, radius) {

    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    ctx.stroke();
}

function drawBezier(ctx, data) {

    if (data.length < 3) return;

    var points = [];
    data.forEach(function(elem) {
        drawCircle(ctx, elem, 2);
        ctx.fillStyle = "blue";
        ctx.fill();
        points.push(elem.x);
        points.push(elem.y);
    });
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(points[0], points[1]);

    if (data.length > 3) {
        ctx.bezierCurveTo(points[2], points[3], points[4], points[5], points[6], points[7]);
    } else  {
        ctx.quadraticCurveTo(points[2], points[3], points[4], points[5]);
    }
    ctx.stroke();
}


function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}
