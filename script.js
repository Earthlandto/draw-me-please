$(document).ready(function() {

    //Get the canvas and calculate canvas size and max-size
    var canvas = document.getElementById("mycanvas");
    var ctx = canvas.getContext('2d');

    var curves = [];
    var points = [];
    var index = 0;
    var mousePos = {x:0,y:0};

    // Catch click event to create lines into canvas
    $('#mycanvas').click(function(event) {
        points[index] = mousePos;
        index = (index + 1) % 4;
    });

    $("#button-create-line").click(function() {
        if (points.length > 2) {
            curves.push(new Bezier(points));
            points = [];
            index = 0;
        }
    });

    canvas.addEventListener('mousemove', function(evt) {
        mousePos = getMousePos(canvas, evt);
    }, false);


    function update() {
        //clean canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //draw bezier curves
        curves.forEach(function(elem) {
            drawBezier(ctx, elem.points);
        });
        //draw points to make a new bezier curve
        points.forEach(function(elem) {
            drawCircle(ctx, elem, 3);
        });
        //draw mouse point and the closest point to all of curves
        drawCircle(ctx, mousePos, 3);
        curves.forEach(function(elem) {
            drawDistance(ctx, elem, mousePos);
        });

    }

    window.setInterval(update, 1000 / 60);
});



function drawDistance(ctx, curve, point) {
    var curvePoint = projection(curve, point);
    ctx.strokeStyle = "pink";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    ctx.lineTo(curvePoint.x, curvePoint.y);
    ctx.stroke();
    drawCircle(ctx, curvePoint, 3);
}

function projection(curve, point) {
    var luts = curve.getLUT();
    var i,
        end = luts.length,
        dist,
        minDist = distance(luts[0], point),
        sec = 0;
    for (i = 1; i < end; i++) {
        dist = distance(luts[i], point);
        if (dist < minDist) {
            sec = i;
            minDist = dist;
        }
    }
    var t = sec / (end - 1);
    return curve.get(t);
}

function distance(p, q) {
    return Math.abs(Math.sqrt(Math.pow((p.x - q.x), 2) + Math.pow((p.y - q.y), 2)));
}

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
    ctx.strokeStyle = 'gray';
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
    for (var i = 0; i < 6; i++) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}


function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
