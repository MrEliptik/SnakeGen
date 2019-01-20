var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvasWidth = canvasHeight = 600;

gridRows = 12;
gridColumns = 12;
grid = [[]];
p=10;

function drawBoard(gridRows, gridColumns, canvasHeight, canvasWidth){
    ctx.beginPath();

    for(var i = 0; i <= gridRows; i++){
        ctx.moveTo(0, (canvasHeight/gridRows)*i);
        ctx.lineTo(canvasWidth, (canvasHeight/gridRows)*i);
    }

    for(var i = 0; i <= gridColumns; i++){
        ctx.moveTo((canvasWidth/gridColumns)*i, 0);
        ctx.lineTo((canvasWidth/gridColumns)*i, canvasHeight);
    }

    ctx.strokeStyle = "black";
    ctx.stroke();
}

drawBoard(gridRows, gridColumns, canvasHeight, canvasWidth);