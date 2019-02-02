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

class Grid{
    constructor(gridRows, gridColumns, snake_idxs, food_idxs) {
        // 2D array initialized with -1
        this.grid = Array.from(Array(gridRows), _ => Array(gridColumns).fill(-1));

        this.grid[snake_idxs[0]][snake_idxs[1]] = objects.snake;
        this.grid[food_idxs[0]][food_idxs[1]] = objects.food;
    }

    update(idxs, value){

    }

    draw(){
        //Clear previous component position to prevent traces
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        //snake.newPos(1, 2);
        snake.update();

        //food.newPos(5, 5);
        food.update();

        // Draw board after to have the edges 
        this.drawBoard(gridRows, gridColumns, canvasHeight, canvasWidth);

        window.requestAnimationFrame(() => {
            this.draw(this.grid)
        });
        frameCounter++;
    }   

    drawBoard(gridRows, gridColumns, canvasHeight, canvasWidth){
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

    getCoordinates(index){
        var x = index[0] * (canvasWidth/gridRows);
        var y = index[1] * (canvasHeight/gridColumns);
    
        return [x,y]
    }
    
    getIndexesOf(val){
        var idxs   = [-1, -1];
    
        for(var i = 0; i < this.grid.length; i++){
            for(var j = 0; j < this.grid[i].length; j++){
                if(this.grid[i][j] == val){
                    idxs = [i,j];
                    break;
                }
            }
        }
    
        return idxs;
    }
}

class Component {
    constructor(i, j, size, color, type) {
        this.size   = size;
        this.x      = 0;
        this.y      = 0;
        this.color  = color;
        this.i      = i;
        this.j      = j;
        this.type   = type;
        if(type == 'snake'){
            this.length = 1;
        }
    }

    // Update grid visualization
    update() {
        var coordinates = null;
        if(this.type == 'snake'){
            coordinates = grid1.getCoordinates(grid1.getIndexesOf(objects.snake));
        }
        else if(this.type == 'food'){
            coordinates = grid1.getCoordinates(grid1.getIndexesOf(objects.food));
        }
        ctx.strokeStyle     = "black";
        ctx.fillStyle       = this.color;
        ctx.fillRect(coordinates[0], coordinates[1], this.size, this.size);
    }

    // Define new position of object
    newPos(direction) {

        if(direction == "up"){
            this.j -= 1;
        }
        else if(direction == "left"){
            this.i -= 1;
        }
        else if(direction == "right"){
            this.i += 1;
        }
        else if(direction == "down"){
            this.j += 1;
        }

        if(this.hitBox()){
            this.length = 1;
            this.i = Math.floor(Math.random() * ((gridRows-1) - 0 + 1)) + 0;
            this.j = Math.floor(Math.random() * ((gridRows-1) - 0 + 1)) + 0;
        }

        this.hitFood();

        var idxs = grid1.getIndexesOf(objects.snake);
        grid1.grid[idxs[0]][idxs[1]] = 0;
        grid1.grid[this.i][this.j] = objects.snake;

        
    }

    // Check if object is going out of boundaries
    hitBox() {
        if(typeof grid1.grid[this.i] === 'undefined' || typeof grid1.grid[this.j] === 'undefined') {
            console.log("you died!")
            return true;
        }
        else{
            return false
        }
    }

    // Check if object hits food cell
    hitFood(){
        if(grid1.grid[this.i][this.j] == objects.food){
            var idxs = grid1.getIndexesOf(objects.food);
            grid1.grid[idxs[0]][idxs[1]] = 0;

            /*TODO: Use newPos() , for that overload the method to 
                accept indexes and not only direction 
            */
            food.i = Math.floor(Math.random() * ((gridRows-1) - 0 + 1)) + 0;
            food.j = Math.floor(Math.random() * ((gridRows-1) - 0 + 1)) + 0;
            grid1.grid[food.i][food.j] = objects.food;
            this.length += 1;
            console.log("Snake length: " + this.length);
        }
    }
}

var rand1 = Math.floor(Math.random() * ((gridRows-1) - 0 + 1)) + 0;
var rand2 = Math.floor(Math.random() * ((gridRows-1) - 0 + 1)) + 0;
var rand3 = Math.floor(Math.random() * ((gridRows-1) - 0 + 1)) + 0;
var rand4 = Math.floor(Math.random() * ((gridRows-1) - 0 + 1)) + 0;

var snake = new Component(rand1, rand2, snake_size, "#000000", "snake");
var food = new Component(rand3, rand4, food_size, "#00FF00", "food");

document.addEventListener('keyup', (event) => {
    const key = event.keyCode;

    if (key == '38') {
        snake.newPos("up");
    }
    else if (key == '40') {
        snake.newPos("down");
    }
    else if (key == '37') {
        snake.newPos("left");
    }
    else if (key == '39') {
        snake.newPos("right");
    }
}, false);


grid1 = new Grid(gridRows, gridColumns, [rand1, rand2], [rand3, rand4]);
grid1.draw()