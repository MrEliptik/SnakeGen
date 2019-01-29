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

console.log(getIndexesOf(grid, objects.snake), getIndexesOf(grid, objects.food));
console.log(getCoordinates(getIndexesOf(grid, objects.snake)), getCoordinates(getIndexesOf(grid, objects.food)))

var coordinates = getCoordinates(getIndexesOf(grid, objects.snake));
var snake = new component(coordinates[0], coordinates[1], snake_size, "#000000", 0, 0, "snake");
coordinates = getCoordinates(getIndexesOf(grid, objects.food));
var food = new component(coordinates[0], coordinates[1], food_size, "#00FF00", 0, 0, "food");

draw(grid);

function draw(grid) {
    //Clear previous component position to prevent traces
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBoard(gridRows, gridColumns, canvasHeight, canvasWidth);
    snake.newPos();
    food.newPos();

    snake.update();
    food.update();

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

function component(posX, posY, size, color, length_x, length_y, type){
    if(type == "snake"){
        this.size   = size;
        this.x      = posX;
        this.y      = posY;
        this.color  = color;
        this.speedX = 0;
        this.speedY = 0;
    }
    else if(type == "food"){
        this.size   = size;
        this.x      = posX;
        this.y      = posY;
        this.color  = color;
        this.speedX = 0;
        this.speedY = 0;
    }
    

    this.update = function() {
        if(type == "snake"){
            ctx.rect(this.x, this.y, this.size, this.size);
            ctx.strokeStyle = this.color;
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        if(type == "food"){
            ctx.rect(this.x, this.y, this.size, this.size);
            ctx.strokeStyle = this.color;
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    this.newPos = function() {
        if(type == "snake"){
            this.x += this.speedX;
            this.y += this.speedY;
            this.hitBottom();
            this.hitTop();
            this.hitRightSide();
            this.hitLeftSide();
        }
    }

    this.hitBottom = function() {
        var rockbottom = canvasHeight - size;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.speedY *= -1;
        }
    }
    this.hitTop = function(){
        var rocktop = 0 + size;
        if (this.y < rocktop) {
            this.y = rocktop;
            this.speedY *= -1;
        }
    }
    this.hitLeftSide = function(){
        var rockleftside = 0 + size;
        if (this.x < rockleftside) {
            this.x = rockleftside;
            this.speedX *= -1;
        }
    }
    this.hitRightSide = function(){
        var rockrightside = canvasWidth - size;
        if (this.x > rockrightside) {
            this.x = rockrightside;
            this.speedX *= -1;
        }
    }
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