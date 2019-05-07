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

    if( mode=="SP") {
      // mode using sprites
      var spriteSnake = [Sprite({
                          context: this.canvasCtx,
                          sX: 0,
                          sY: 500,
                          sWidth: 500,
                          sHeight: 500,
                          dX: 0,
                          dY: 0,
                          dWidth: 50,
                          dHeight: 50}),
                        Sprite({
                          context: this.canvasCtx,
                          sX: 500,
                          sY: 500,
                          sWidth: 500,
                          sHeight: 500,
                          dX: 0,
                          dY: 0,
                          dWidth: 50,
                          dHeight: 50})];
       var spriteFruit = Sprite({
                          context: this.canvasCtx,
                          sX: 0,
                          sY: 0,
                          sWidth: 500,
                          sHeight: 500,
                          dX: 0,
                          dY: 0,
                          dWidth: 50,
                          dHeight: 50});
    }else { // DF mode or default mode
      var spriteSnake = null;
      var spriteFruit = null;
    }

    // Components of the game
    this.fruits = [new Fruit( [fruit_x, fruit_y], colorFruit, spriteFruit)];
    this.snakes = [new Snake( [snake_x, snake_y], colorSnake, spriteSnake)];
  }

  getSnakesPosition(){
    return this.snakes[0].pos;
  }

  // Returns the coordinates in pixel of the cell with the index given in parameter
  getCoordinates(index){
    var x = index[0] * (this.canvasWidth/this.gridRows);
    var y = index[1] * (this.canvasHeight/this.gridColumns);

    return [x,y];
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

        if( this.fruits[i].sprite==null) {
          // mode without sprites

          // get the color
          this.canvasCtx.fillStyle = this.fruits[i].color;
          // get the coordinates
          var coord = this.getCoordinates(this.fruits[i].getPos());
          // draw the color
          this.canvasCtx.fillRect(coord[0], coord[1], this.size, this.size);

        }else {
          // mode with sprites

          // get the coordinates
          var coord = this.getCoordinates(this.fruits[i].getPos());
          this.fruits[i].sprite.setPos( coord[0], coord[1]);
          // draw the sprite
          this.fruits[i].sprite.render();
        }
      }

      //this.canvasCtx.fill()

      // Draw the snake
      for(var i=0; i<this.nb_snakes; i++){

        if( this.fruits[i].sprite==null) {
          // mode without sprites

          // get the color
          this.canvasCtx.fillStyle = this.snakes[i].color;
          // get the coordinates
          var coord = this.getCoordinates(this.snakes[i].getPos());
          // draw the color
          this.canvasCtx.fillRect(coord[0], coord[1], this.size, this.size);
        }else {
          // mode with sprites

          // get the coordinates
          var coord = this.getCoordinates(this.snakes[i].getPos());
          this.snakes[i].sprite[0].setPos( coord[0], coord[1]);
          // draw the sprite
          this.snakes[i].sprite[0].render();
        }

        // Test for the sprite drawing
        var spiteToDraw = [this.snakes[i].length-1];

        // draw the tail
        for(var j=0; j < this.snakes[i].length-1; j++){
          if( this.fruits[i].sprite==null) {
            // mode without sprites

            // get the color
            this.canvasCtx.fillStyle = this.snakes[i].color;
            // get the coordinates
            coord = this.getCoordinates(this.snakes[i].tail[j]);
            // draw the color
            this.canvasCtx.fillRect(coord[0], coord[1], this.size, this.size);
          }else {
            // mode with sprites

            // get the coordinates
            coord = this.getCoordinates(this.snakes[i].tail[j]);
            spiteToDraw[j] = this.snakes[i].sprite[1];
            spiteToDraw[j].setPos( coord[0], coord[1]);
            // draw the sprite
            spiteToDraw[j].render();
          }
        }
      }

      // Draw board after to have the edges
      this.drawGrid();
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
    this.snakes[ index] = new Snake( newPos, colorSnake, this.snakes[ index].sprite);
  }

  // Reset the fruit with the index given in parameter
  resetFruit( index){

    var newPos = this.findNewPosition();

    // Reset the snake
    this.fruits[ index] = new Fruit( newPos, colorFruit, this.fruits[ index].sprite);
  }

  // Find coordinates for a new component
  // Make sure the component is not on an occupied cell
  findNewPosition(){

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

  // Update the grid by placing the components on it
  upgradeGrid(){

    // Creation of the grid : 2D array initialized with -1
    this.grid = Array.from(Array(this.gridRows), _ => Array(this.gridColumns).fill(objects.empty));

    for(var i=0; i<this.nb_snakes; i++){

      // Update the grid with the tails positions
      for(var j=0; j<this.snakes[i].length-1; j++){
        pos = this.snakes[i].tail[j];
        this.grid[pos[0]][pos[1]] = objects.snake_tail;
      }

      // Update the grid with the snakes positions
      var pos = this.snakes[i].getPos();
      this.grid[pos[0]][pos[1]] = objects.snake;
    }

    // Update the grid with the fruits positions
    for(var i=0; i<this.nb_fruits; i++){
      var pos = this.fruits[i].getPos();
      this.grid[pos[0]][pos[1]] = objects.food;
    }
  }

  // Update the entire game by moving one snake
  update(index, direction){

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

      // Draw the game
      this.draw();

      // Update and return the grid
      this.upgradeGrid();
      return this.grid;
    }
  }
};
