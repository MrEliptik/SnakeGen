// Include the modules from lib/snake
var libFruit = require('./Fruit.js');
var libSnake = require('./Snake.js');

const objects       = {}
objects.food        = 3
objects.snake       = 1
objects.snake_tail  = 2
objects.empty       = -1

const colorSnake = "#000000";
const colorFruit = "#00FF00";

class Game{
  constructor( gridRows, gridColumns, size, canvasHeight, canvasWidth, canvasCtx, nb_snakes, nb_fruits, mode) {

    // Creation of the grid
    // 2D array initialized with -1
    this.grid = Array.from(Array(gridRows), _ => Array(gridColumns).fill(objects.empty));

    // Parameters of the draw grid
    // number of cells
    this.gridRows = gridRows;
    this.gridColumns = gridColumns;
    // in pixel
    this.size = canvasWidth / gridRows;
    this.canvasHeight = canvasHeight;
    this.canvasWidth = canvasWidth;
    // Object containing the canvas
    this.canvasCtx = canvasCtx;

    // Creation of the components
    this.nb_snakes = nb_snakes;
    this.nb_fruits = nb_fruits;

    // Choose the food position
    var fruit_x = Math.floor(Math.random() * ((gridColumns-1) - 0 + 1)) + 0;
    var fruit_y = Math.floor(Math.random() * ((gridRows-1) - 0 + 1)) + 0;

    // Make sure snake is not on an occupied cell
    var snake_x = Math.floor(Math.random() * ((gridColumns-1) - 0 + 1)) + 0;
    var snake_y = Math.floor(Math.random() * ((gridRows-1) - 0 + 1)) + 0;
    while( [snake_x, snake_y] == [fruit_x, fruit_y]){
      snake_x = Math.floor(Math.random() * ((gridColumns-1) - 0 + 1)) + 0;
      snake_y = Math.floor(Math.random() * ((gridRows-1) - 0 + 1)) + 0;
    }

    // Components of the game
    this.fruits = [new libFruit.Fruit( [fruit_x, fruit_y], colorFruit, null)];
    this.snakes = [new libSnake.Snake( [snake_x, snake_y], colorSnake, null)];
  }

  // Draw the grid layout
  drawGrid(){
      this.canvasCtx.beginPath();

      for(var i = 0; i <= this.gridRows; i++){
          this.canvasCtx.moveTo(0, (this.canvasHeight/this.gridRows)*i);
          this.canvasCtx.lineTo(this.canvasWidth, (this.canvasHeight/this.gridRows)*i);
      }

      for(var i = 0; i <= this.gridColumns; i++){
          this.canvasCtx.moveTo((this.canvasWidth/this.gridColumns)*i, 0);
          this.canvasCtx.lineTo((this.canvasWidth/this.gridColumns)*i, this.canvasHeight);
      }

      this.canvasCtx.strokeStyle = "black";
      this.canvasCtx.stroke();
  }

  // Draw the game at every state
  draw(){

      console.log("draw");

      //Clear previous component position to prevent traces
      this.canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

      //snake.newPos(1, 2);
      //snake.update();

      this.canvasCtx.strokeStyle = "black";

      // Draw the fruits
      for(var i=0; i<this.nb_fruits; i++){
        // get the color
        this.canvasCtx.fillStyle = this.fruits[i].color;
        // get the coordinates
        var coord = this.getCoordinates(this.fruits[i].getPos());
        // draw the color
        this.canvasCtx.fillRect(coord[0], coord[1], this.size, this.size);
      }

      //this.canvasCtx.fill()

      // Draw the snake
      for(var i=0; i<this.nb_snakes; i++){
        // get the color
        this.canvasCtx.fillStyle = this.snakes[i].color;
        // get the coordinates$log
        var coord = this.getCoordinates(this.snakes[i].getPos());
        // draw the color
        this.canvasCtx.fillRect(coord[0], coord[1], this.size, this.size);
        // draw the tail
        for(var j=0; j < this.snakes[i].length-1; j++){
          // get the coordinates
          coord = this.getCoordinates(this.snakes[i].tail[j]);
          // draw the color
          this.canvasCtx.fillRect(coord[0], coord[1], this.size, this.size);
        }
      }

      // Draw board after to have the edges
      this.drawGrid();
  }

  update( index, direction){

      // move the snake
      if( this.snakes[0].move( direction)){

        console.log(this.snakes[0].getPos());

        // f true -> Reset the Snake
        if( this.hitBoundaries( this.snakes[0])){

          // Make sure food is not on an occupied cell
          var snake_x = Math.floor(Math.random() * ((this.gridColumns-1) - 0 + 1)) + 0;
          var snake_y = Math.floor(Math.random() * ((this.gridRows-1) - 0 + 1)) + 0;
          while( [snake_x, snake_y] == this.fruits[0].getPos()){
            snake_x = Math.floor(Math.random() * ((this.gridColumns-1) - 0 + 1)) + 0;
            snake_y = Math.floor(Math.random() * ((this.gridRows-1) - 0 + 1)) + 0;
          }

          this.snakes[0] = new libSnake.Snake( [snake_x, snake_y], colorSnake, null);

        }else {

          var hitIndex = this.hitFruit( this.snakes[0]);

          // != -1 -> Snake grows & reset the fruit
          if( hitIndex != -1){

            console.log("hit! : " + hitIndex);

            var findGoodPos = false;
            var fruit_x;
            var fruit_y;

            // Make sure fruit is not on an occupied cell
            while( !findGoodPos){

              fruit_x = Math.floor(Math.random() * ((this.gridColumns-1) - 0 + 1)) + 0;
              fruit_y = Math.floor(Math.random() * ((this.gridRows-1) - 0 + 1)) + 0;

              findGoodPos = true;

              // Check fruits
              for(var j=0; j < this.nb_fruits; j++){
                if([fruit_x, fruit_y] == this.fruits[j].getPos()){
                  findGoodPos = false;
                  continue;
                }
              }

              // Check snakes
              for( var j=0; j < this.nb_snakes; j++){
                if([fruit_x, fruit_y] == this.snakes[j].getPos()){
                  findGoodPos = false;
                  continue;
                }
                for( var x=0; x < this.snakes[j].length-1; x++){
                  if([fruit_x, fruit_y] == this.snakes[j].tail[x]){
                    findGoodPos = false;
                    continue;
                  }
                }
              }
            }

            // Reset the fruit
            this.fruits[hitIndex] = new libFruit.Fruit( [fruit_x, fruit_y], colorFruit  , null);
            // Update the snake
            this.snakes[0].grow();
          }
        }

        this.draw();
      }
  }

  // Checks if the snake object is going out of boundaries
  hitBoundaries( snakeToTest) {

      var posToTest = snakeToTest.getPos();

      if(typeof this.grid[posToTest[0]] === 'undefined' || typeof this.grid[posToTest[1]] === 'undefined') {
          console.log("you died!")
          return true;
      }
      else{
          return false
      }
  }

  // Checks if a snake hits a fruit
  // Returns the index of the fruit, otherwise return -1
  hitFruit( snakeToTest){

    var posToTest = snakeToTest.getPos();

    for(var i=0; i < this.nb_fruits; i++){

      var currentPos = this.fruits[i].getPos();
      if( posToTest[0] == currentPos[0] && posToTest[1] == currentPos[1]){
        return i;
      }
    }

    // The snake did not hit a fruit
    return -1;
  }

  // Returns the coordinates in pixel of the cell with the index given in parameter
  getCoordinates(index){
      var x = index[0] * (this.canvasWidth/this.gridRows);
      var y = index[1] * (this.canvasHeight/this.gridColumns);

      return [x,y];
  }
};

// Exportation of the class Game
module.exports = {
  Game: Game
};
