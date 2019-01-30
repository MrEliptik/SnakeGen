var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var frameCounter    = 0;

const canvasWidth   = 600;
const canvasHeight  = 600;

const gridRows      = 12;
const gridColumns   = 12;

// -1:nothing, 1:snake, 2:food
var grid            = Array.from(Array(gridRows), _ => Array(gridColumns).fill(-1));

const snake_size    = canvasWidth / gridRows;
const food_size     = snake_size;

const objects       = {}
objects.food        = 2
objects.snake       = 1

var rand1 = Math.floor(Math.random() * ((gridRows-1) - 0 + 1)) + 0;
var rand2 = Math.floor(Math.random() * ((gridRows-1) - 0 + 1)) + 0;
var rand3 = Math.floor(Math.random() * ((gridRows-1) - 0 + 1)) + 0;
var rand4 = Math.floor(Math.random() * ((gridRows-1) - 0 + 1)) + 0;

console.log(rand1, rand2, rand3, rand4);
grid[rand1][rand2] = objects.snake;
grid[rand3][rand4] = objects.food;

class Component {
    constructor(i, j, size, color, type) {
        this.size   = size;
        this.x      = 0;
        this.y      = 0;
        this.color  = color;
        this.i      = i;
        this.j      = j;
    }

    // Adding a method to the constructor
    update() {
        var coordinates = getCoordinates(getIndexesOf(grid, objects.snake));
        ctx.rect(coordinates[0], coordinates[1], this.size, this.size);
        ctx.strokeStyle     = "black";
        ctx.fillStyle       = this.color;
        ctx.fill();
    }

    newPos() {
        this.x = x;
        this.y = y;
        this.hitBottom();
        this.hitTop();
        this.hitRightSide();
        this.hitLeftSide();
    }

    hitBottom() {
        var rockbottom = canvasHeight - this.size;
        if (this.y > rockbottom) {
            this.y = rockbottom;     
        }
    }
    hitTop (){
        var rocktop = 0 + this.size;
        if (this.y < rocktop) {
            this.y = rocktop;
        }
    }
    hitLeftSide(){
        var rockleftside = 0 + this.size;
        if (this.x < rockleftside) {
            this.x = rockleftside;
        }
    }
    hitRightSide(){
        var rockrightside = canvasWidth - this.size;
        if (this.x > rockrightside) {
            this.x = rockrightside;
        }
    }
}

var snake = new Component(rand1, rand2, snake_size, "#000000", "snake");
var food = new Component(rand3, rand4, food_size, "#00FF00", "food");

draw(grid);

function draw(grid) {
    //Clear previous component position to prevent traces
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //#TODO: See why food is drawn at the same spot 
    //snake.newPos(1, 2);
    snake.update();

    //food.newPos(5, 5);
    food.update();

    // Draw board after to have the edges 
    drawBoard(gridRows, gridColumns, canvasHeight, canvasWidth);

    window.requestAnimationFrame(() => {
        draw(grid)
    });
    frameCounter++;
}

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

function getCoordinates(index){
    x = index[0] * (canvasWidth/gridRows);
    y = index[1] * (canvasHeight/gridColumns);

    return [x,y]
}

function getIndexesOf(arr, val){
    var idxs   = [-1, -1];

    for(var i = 0; i < arr.length; i++){
        for(var j = 0; j < arr[i].length; j++){
            if(arr[i][j] == val){
                idxs = [i,j];
                break;
            }
        }
    }

    return idxs;
}