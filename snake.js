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
objects.food        = 3
objects.snake       = 1
objects.snake_tail  = 2 

class Grid{
    constructor(gridRows, gridColumns, snake_idxs, food_idxs) {
        // 2D array initialized with -1
        this.grid = Array.from(Array(gridRows), _ => Array(gridColumns).fill(-1));

        this.grid[snake_idxs[0]][snake_idxs[1]] = objects.snake;
        this.grid[food_idxs[0]][food_idxs[1]] = objects.food;
    }

    //TODO : Use that instead of directly modifying the grid from other classes
    update(idxs, value){
        this.grid[idxs[0]][idxs[1]] = value;
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
        var idxs   = [];
    
        for(var i = 0; i < this.grid.length; i++){
            for(var j = 0; j < this.grid[i].length; j++){
                if(this.grid[i][j] == val){
                    if(val == objects.snake_tail){
                        idxs.push([i,j])
                    }
                    else{
                        idxs = [i,j];
                        break;
                    }      
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
            this.tail   = [];
        }
    }

    // Update grid visualization
    update() {
        var coordinates = null;

        ctx.strokeStyle     = "black";
        ctx.fillStyle       = this.color;    

        if(this.type == 'snake'){
            coordinates = grid1.getCoordinates(grid1.getIndexesOf(objects.snake));
            grid1.getIndexesOf(objects.snake_tail).forEach((entry) => {
                tail_coor = grid1.getCoordinates(entry);
                ctx.fillRect(tail_coor[0], tail_coor[1], this.size, this.size);
            });
        }
        else if(this.type == 'food'){
            coordinates = grid1.getCoordinates(grid1.getIndexesOf(objects.food));
        }    
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

        if(this.hitBoundaries()){
            this.length = 1;
            this.i = Math.floor(Math.random() * ((gridRows-1) - 0 + 1)) + 0;
            this.j = Math.floor(Math.random() * ((gridRows-1) - 0 + 1)) + 0;
        }

        this.hitFood();

        // TODO: Fix logic for tail
        var idxs = grid1.getIndexesOf(objects.snake);
        // Update the tail
        for(var i = this.length; i >= 0; i--){
            // Take old head position
            if(i == 0){
                this.tail[0] = idxs;
            }
            //Propagate the path along the tail
            else{
                this.tail[i] = this.tail[i-1];
            }
        }
        grid1.grid[idxs[0]][idxs[1]] = 0;
        grid1.grid[this.i][this.j] = objects.snake;      
    }

    // Check if object is going out of boundaries
    hitBoundaries() {
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

            // New random position for food
            food.i = Math.floor(Math.random() * ((gridRows-1) - 0 + 1)) + 0;
            food.j = Math.floor(Math.random() * ((gridRows-1) - 0 + 1)) + 0;
            grid1.grid[food.i][food.j] = objects.food;

            // Snake grows
            this.length += 1;
            this.tail.push = [this.i, this.j];
            console.log("Snake length: " + this.length);
        }
    }
}

var snake_x = Math.floor(Math.random() * ((gridRows-1) - 0 + 1)) + 0;
var snake_y = Math.floor(Math.random() * ((gridRows-1) - 0 + 1)) + 0;
var food_x = Math.floor(Math.random() * ((gridRows-1) - 0 + 1)) + 0;
var food_y = Math.floor(Math.random() * ((gridRows-1) - 0 + 1)) + 0;

var snake = new Component(snake_x, snake_y, snake_size, "#000000", "snake");
var food = new Component(food_x, food_y, food_size, "#00FF00", "food");


grid1 = new Grid(gridRows, gridColumns, [snake_x, snake_y], [food_x, food_y]);
grid1.draw()