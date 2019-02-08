(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// Mother class of Snake and Fruit
class Component {
    constructor( pos, color, sprite) {
        this.pos    = pos;
        this.color  = color;
        this.sprite = sprite;
    }

    getPos() {
      return this.pos;
    }
};

// Exportation of the class Component
module.exports = {
  Component: Component
};

},{}],2:[function(require,module,exports){
// Include the module from lib/snake
var lib = require('./Component.js');

class Fruit extends lib.Component{
    constructor( pos, color, sprite){
        super( pos, color, sprite);
    }
};

// Exportation of the class Fruit
module.exports = {
  Fruit: Fruit
};

},{"./Component.js":1}],3:[function(require,module,exports){
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

    console.log("Direction : " + direction);

    // move the snake
    if( this.snakes[0].move( direction)){

      console.log("New position : " + this.snakes[0].getPos());

      // f true -> Reset the Snake
      if( this.hitBoundaries( this.snakes[0]) || this.hitBody( 0, this.snakes[0])){

        console.log("You died!")

        // Reset the dead   snake
        this.resetSnake(0);

      }else {

        var hitIndex = this.hitFruit( this.snakes[0]);

        // != -1 -> Snake grows & reset the fruit
        if( hitIndex != -1){

          // Reset the fruit eaten
          this.resetFruit(0);

          // Update the snake
          this.snakes[0].grow();

          console.log("Fruit eaten, length : " + this.snakes[0].length);
        }
      }

      this.draw();
    }
  }

  // Checks if the snake object is going out of boundaries
  hitBoundaries( snakeToTest) {

      var posToTest = snakeToTest.getPos();

      if(typeof this.grid[posToTest[0]] === 'undefined' || typeof this.grid[posToTest[1]] === 'undefined') {
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

  // Check if the snake hits another boy or his own body
  hitBody( index, snakeToTest){

    var posToTest = snakeToTest.getPos();

    for(var i=0; i < this.nb_snakes; i++){

      if( i != index){
        var currentPos = this.snakes[i].getPos();
        if( posToTest[0] == currentPos[0] && posToTest[1] == currentPos[1]) {
          return true;
        }
      }

      if( this.snakes[i].isOnTail( posToTest)){
        return true;
      }
    }
  }

  // Reset the snake with the index given in parameter
  resetSnake( index){

    var newPos = this.findNewPosition();

    // Reset the snake
    this.snakes[ index] = new libSnake.Snake( newPos, colorSnake, null);
  }

  // Reset the fruit with the index given in parameter
  resetFruit( index){

    var newPos = this.findNewPosition();

    // Reset the snake
    this.fruits[ index] = new libFruit.Fruit( newPos, colorFruit, null);
  }

  // Find coordinates for a new component
  // Make sure the component is not on an occupied cell
  findNewPosition() {

    var findGoodPos = false;

    while( findGoodPos == false){

      findGoodPos = true;

      // Make sure food is not on an occupied cell
      var new_x = Math.floor(Math.random() * ((this.gridColumns-1) - 0 + 1)) + 0;
      var new_y = Math.floor(Math.random() * ((this.gridRows-1) - 0 + 1)) + 0;

      // Check fruits
      for(var j=0; j < this.nb_fruits; j++){
        var posToCheck = this.fruits[j].pos;
        if(new_x == posToCheck[0] && new_y == posToCheck[1] ){
          findGoodPos = false;
          break;
        }
      }

      if( findGoodPos){
        // Check snakes
        for( var j=0; j < this.nb_snakes; j++){
          posToCheck = this.snakes[j].getPos();
          if(new_x == posToCheck[0] && new_y == posToCheck[1] ){
            findGoodPos = false;
            break;
          }
          // Check the tail
          if( this.snakes[j].isOnTail( [new_x, new_y])){
            findGoodPos = false;
            break;
          }
        }
      }
    }

    return [new_x, new_y];
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

},{"./Fruit.js":2,"./Snake.js":4}],4:[function(require,module,exports){
// Include the module from lib/snake
var lib = require('./Component.js');

class Snake extends lib.Component{
    constructor( pos, color, sprite){
        super( pos, color, sprite);
        this.length = 1;
        this.tail = [];
    }

    // Return true if the movement is possible
    // a movement is possible if the new pos is not the pos of the first
    // element of the tail
    move( direction){
      var newPos = [0,0];

      if( direction == "up") {
        newPos = [this.pos[0], this.pos[1]-1];
      }else if( direction == "left"){
        newPos = [this.pos[0]-1, this.pos[1]];
      }else if( direction == "right"){
        newPos = [this.pos[0]+1, this.pos[1]];
      }else if( direction == "down"){
        newPos = [this.pos[0], this.pos[1]+1];
      }else{
        return false;
      }

      // Check if the snake can moove in this position
      var impossiblePos = this.tail[0];
      if( this.length<2 || (this.length>1 && (impossiblePos[0] != newPos[0] || impossiblePos[1] != newPos[1]))){

        // Update the tail
        if( this.length > 1){
          for(var i=this.length-2; i > 0; i--){
            //Propagate the draw along the tail
            this.tail[i] = this.tail[i-1];
          }
          this.tail[0] = this.pos;
        }
        this.pos = newPos;
        return true;
      }

      return false;
    }

    grow(){
      this.length++;
      this.tail.push(this.pos);
    }

    isOnTail( posToTest){
      for( var x=0; x < this.length-1; x++){
        var posToCheck = this.tail[x];
        if( posToTest[0] == posToCheck[0] && posToTest[1] == posToCheck[1]){
          return true;
        }
      }
      return false;
    }
};

// Exportation of the class Fruit
module.exports = {
  Snake: Snake
};

},{"./Component.js":1}],5:[function(require,module,exports){
// Include the modules from lib/snake
var lib = require('./libs/snake/src/Game.js');

var canvas = document.getElementById("canvas");
var game = new lib.Game( 12, 12, 100, 600, 600, canvas.getContext("2d"), 1, 1, 1)

// Add an event listener from the keyboard
document.addEventListener('keyup', (event) => {
    const key = event.keyCode;

    if (key == '38') {
        game.update( 0, "up");
    }
    else if (key == '40') {
        game.update( 0, "down");
    }
    else if (key == '37') {
        game.update( 0, "left");
    }
    else if (key == '39') {
        game.update( 0, "right");
    }
}, false);

// test
game.draw()

},{"./libs/snake/src/Game.js":3}]},{},[5]);
