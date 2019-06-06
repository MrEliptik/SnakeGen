const objects = {};
objects.food = 3;
objects.snake = 1;
objects.snake_tail = 2;
objects.empty = -1;

const colorSnake = "#000000";
const colorFruit = "#00FF00";

class Game {
  constructor(
    gridRows,
    gridColumns,
    canvasHeight = null,
    canvasWidth = null,
    canvas = null,
    nb_snakes,
    nb_fruits,
    mode = "DF",
    display
  ) {
    this.display = display;
    this.canvas = canvas;

    // Parameters of the draw grid
    // number of cells
    this.gridRows = parseInt(gridRows);
    this.gridColumns = parseInt(gridColumns);

    this.maxGridDistance = Math.hypot(this.gridRows, this.gridColumns);

    var row = this.gridRows;
    var col = this.gridColumns;

    // Creation of the grid
    // 2D array initialized with -1
    this.grid = Array.from(Array(this.gridRows), _ =>
      Array(this.gridColumns).fill(objects.empty)
    );

    if (this.display) {
      // in pixel
      this.size = canvasWidth / gridRows;
      this.canvasHeight = canvasHeight;
      this.canvasWidth = canvasWidth;
      // Object containing the canvas
      this.canvasCtx = this.canvas.getContext("2d");

      if (mode == "SP") {
        // mode using sprites
        var spriteSnake = [
          Sprite({
            context: this.canvasCtx,
            sX: 0,
            sY: 500,
            sWidth: 500,
            sHeight: 500,
            dX: 0,
            dY: 0,
            dWidth: 50,
            dHeight: 50
          }),
          Sprite({
            context: this.canvasCtx,
            sX: 500,
            sY: 500,
            sWidth: 500,
            sHeight: 500,
            dX: 0,
            dY: 0,
            dWidth: 50,
            dHeight: 50
          })
        ];
        var spriteFruit = Sprite({
          context: this.canvasCtx,
          sX: 0,
          sY: 0,
          sWidth: 500,
          sHeight: 500,
          dX: 0,
          dY: 0,
          dWidth: 50,
          dHeight: 50
        });
      } else {
        // DF mode or default mode
        var spriteSnake = null;
        var spriteFruit = null;
      }
    }

    // Creation of the components
    this.nb_snakes = nb_snakes;
    this.nb_fruits = nb_fruits;

    this.score = 0;

    // Choose the food position
    var fruit_x = Math.floor(Math.random() * (gridColumns - 1 - 0 + 1)) + 0;
    var fruit_y = Math.floor(Math.random() * (gridRows - 1 - 0 + 1)) + 0;

    // Make sure snake is not on an occupied cell
    var snake_x = Math.floor(Math.random() * (gridColumns - 1 - 0 + 1)) + 0;
    var snake_y = Math.floor(Math.random() * (gridRows - 1 - 0 + 1)) + 0;
    while ([snake_x, snake_y] == [fruit_x, fruit_y]) {
      snake_x = Math.floor(Math.random() * (gridColumns - 1 - 0 + 1)) + 0;
      snake_y = Math.floor(Math.random() * (gridRows - 1 - 0 + 1)) + 0;
    }

    // Components of the game
    this.fruits = [new Fruit([fruit_x, fruit_y], colorFruit, spriteFruit)];
    this.snakes = [new Snake([snake_x, snake_y], colorSnake, spriteSnake)];

    // Initial drawing
    if (this.display) {
      this.draw();
    }
  }

  getDisplay() {
    return this.display;
  }

  getGrid() {
    return this.grid;
  }

  /**
   * Returns the euclidean distance between snake's head and fruit
   * @returns {distance} - The distance normalized by the max grid distance
   */
  getDistanceScore(){
    var snakePos = this.snakes[0].getPosition();
    var fruitPos = this.fruits[0].getPosition();
    return Math.hypot(fruitPos[0]-snakePos[0], fruitPos[1]-snakePos[1])/this.maxGridDistance;
  }

  /**
   * Returns an array of LOS from the snake's perspective
   * @returns {linesOfSight} - Array of LOS [up, left, right]
   */
  calculateLinesOfSight() {
    var snakePosition = this.snakes[0].getPosition();
    var snakeOrientation = this.snakes[0].getOrientation();
    var gridRows = this.gridRows;
    var gridColumns = this.gridColumns;
    var snake = this.snakes[0];

    var linesOfSight = [];

    function frontLineOfSight() {
      var i = snakePosition[0];
      var j = snakePosition[1];
      var distance = 0;
      do {
        distance += 1;

        if (snakeOrientation == "down") {
          j += 1;
        } else if (snakeOrientation == "up") {
          j -= 1;
        } else if (snakeOrientation == "left") {
          i -= 1;
        } else if (snakeOrientation == "right") {
          i += 1;
        }
      } while (
        j >= 0 &&
        j < gridRows &&
        i >= 0 &&
        i < gridColumns &&
        !snake.isOnTail([i, j])
      );
      return distance - 1;
    }

    function leftLineOfSight() {
      var i = snakePosition[0];
      var j = snakePosition[1];
      var distance = 0;
      do {
        distance += 1;

        if (snakeOrientation == "down") {
          i += 1;
        } else if (snakeOrientation == "up") {
          i -= 1;
        } else if (snakeOrientation == "left") {
          j += 1;
        } else if (snakeOrientation == "right") {
          j -= 1;
        }
      } while (
        j >= 0 &&
        j < gridRows &&
        i >= 0 &&
        i < gridColumns &&
        !snake.isOnTail([i, j])
      );
      return distance - 1;
    }

    function rightLineOfSight() {
      var i = snakePosition[0];
      var j = snakePosition[1];
      var distance = 0;
      do {
        distance += 1;

        if (snakeOrientation == "down") {
          i -= 1;
        } else if (snakeOrientation == "up") {
          i += 1;
        } else if (snakeOrientation == "left") {
          j -= 1;
        } else if (snakeOrientation == "right") {
          j += 1;
        }
      } while (
        j >= 0 &&
        j < gridRows &&
        i >= 0 &&
        i < gridColumns &&
        !snake.isOnTail([i, j])
      );
      return distance - 1;
    }

    function scale(los){
      // Scale with either nb of rows or nb of columns
      // as a reference, in the case they are different
      los[0] /= gridColumns;
      los[1] /= gridRows;
      los[2] /= gridColumns;

      return los;
    }

    linesOfSight[0] = leftLineOfSight();
    linesOfSight[1] = frontLineOfSight();
    linesOfSight[2] = rightLineOfSight();

    return scale(linesOfSight);
  }

  /**
   * Returns an array of COS from the snake's perspective
   * @returns {conesOfSight} - Array of COS [left, front_left, front_right, right]
   */
  calculateConesOfSight() {
    var snakePosition = this.snakes[0].getPosition();
    var snakeOrientation = this.snakes[0].getOrientation();
    var grid = this.grid;

    

    if (snakeOrientation == "down") {
      var beginX  = 0;
      var beginY  = snakePosition[1];
      var maxX    = this.gridRows;
      var maxY    = this.gridColumns;
    } else if (snakeOrientation == "up") {
      var beginX  = 0;
      var beginY  = 0;
      var maxX    = this.gridRows;
      var maxY    = snakePosition[1] + 1;
    } else if (snakeOrientation == "left") {
      var beginX  = 0;
      var beginY  = 0;
      var maxX    = snakePosition[0] + 1;
      var maxY    = this.gridColumns;
    } else if (snakeOrientation == "right") {
      var beginX  = snakePosition[0];
      var beginY  = 0;
      var maxX    = this.gridRows;
      var maxY    = this.gridColumns;
    }

    function updateCone(cone, i, j, snake, fruit) {
      if(snake.isOnTail([i, j])) {
        cone[1] += 1;
      } else if (fruit.getPosition()[0] == i
      && fruit.getPosition()[1] == j){
        cone[2] += 1;
      }
      cone[0] += 1;
      return cone;
    }
    var upRightCone  = [0, 0, 0];
    var upLeftCone   = [0, 0, 0];
    var leftCone     = [0, 0, 0];
    var rightCone    = [0, 0, 0];

    for (var i = beginX; i < maxX; i++) {
      for (var j = beginY; j < maxY; j++) {
        
        if (snakePosition[0] == i && snakePosition[1] == j) {
          continue;
        }

        if (snakeOrientation == "down") {
          if (i >= snakePosition[0]) {
            if (j <= i+snakePosition[1]-snakePosition[0]) {
              leftCone = updateCone(leftCone, i, j, this.snakes[0], this.fruits[0]);
            }
            if (j >= i+snakePosition[1]-snakePosition[0]) {
              upLeftCone = updateCone(upLeftCone, i, j, this.snakes[0], this.fruits[0]);
            }
          }
          if (i <= snakePosition[0]) {
            if (j >= -1*i+snakePosition[1]+snakePosition[0]) {
              upRightCone = updateCone(upRightCone, i, j, this.snakes[0], this.fruits[0]);
            }
            if (j <= -1*i+snakePosition[1]+snakePosition[0]) {
              rightCone = updateCone(rightCone, i, j, this.snakes[0], this.fruits[0]);
            }
          }

        } else if (snakeOrientation == "up") {
          if (i <= snakePosition[0]) {
            if (j >= i+snakePosition[1]-snakePosition[0]) {
              leftCone = updateCone(leftCone, i, j, this.snakes[0], this.fruits[0]);
            }
            if (j <= i+snakePosition[1]-snakePosition[0]) {
              upLeftCone = updateCone(upLeftCone, i, j, this.snakes[0], this.fruits[0]);
            }
          }
          if (i >= snakePosition[0]) {
            if (j <= -1*i+snakePosition[1]+snakePosition[0]) {
              upRightCone = updateCone(upRightCone, i, j, this.snakes[0], this.fruits[0]);
            }
            if (j >= -1*i+snakePosition[1]+snakePosition[0]) {
              rightCone = updateCone(rightCone, i, j, this.snakes[0], this.fruits[0]);
            }
          }

        } else if (snakeOrientation == "left") {
          if (j >= snakePosition[1]) {
            if (i >= -1*j+snakePosition[0]+snakePosition[1]) {
              leftCone = updateCone(leftCone, i, j, this.snakes[0], this.fruits[0]);
            }
            if (i <= -1*j+snakePosition[0]+snakePosition[1]) {
              upLeftCone = updateCone(upLeftCone, i, j, this.snakes[0], this.fruits[0]);
            }
          }
          if (j <= snakePosition[1]) {
            if (i <= j+snakePosition[0]-snakePosition[1]) {
              upRightCone = updateCone(upRightCone, i, j, this.snakes[0], this.fruits[0]);
            }
            if (i >= j+snakePosition[0]-snakePosition[1]) {
              rightCone = updateCone(rightCone, i, j, this.snakes[0], this.fruits[0]);
            }
          }

        } else if (snakeOrientation == "right") {
          if (j <= snakePosition[1]) {
            if (i <= -1*j+snakePosition[0]+snakePosition[1]) {
              leftCone = updateCone(leftCone, i, j, this.snakes[0], this.fruits[0]);
            }
            if (i >= -1*j+snakePosition[0]+snakePosition[1]) {
              upLeftCone = updateCone(upLeftCone, i, j, this.snakes[0], this.fruits[0]);
            }
          }
          if (j >= snakePosition[1]) {
            if (i >= j+snakePosition[0]-snakePosition[1]) {
              upRightCone = updateCone(upRightCone, i, j, this.snakes[0], this.fruits[0]);
            }
            if (i <= j+snakePosition[0]-snakePosition[1]) {
              rightCone = updateCone(rightCone, i, j, this.snakes[0], this.fruits[0]);
            }
          }
        }
      }
    }

    var totalCell = (maxX-beginX) * (maxY-beginY) - 1;

    return  [[(leftCone[0]-leftCone[1])/totalCell, leftCone[2]/this.fruits.length],
            [(upLeftCone[0]-upLeftCone[1])/totalCell, upLeftCone[2]/this.fruits.length],
            [(upRightCone[0]-upRightCone[1])/totalCell, upRightCone[2]/this.fruits.length],
            [(rightCone[0]-rightCone[1])/totalCell, rightCone[2]/this.fruits.length]];
  }

  getSnakeState() {
    return {
      position: this.snakes[0].getPosition(),
      orientation: this.snakes[0].getOrientation()
    };
  }

  // Returns the coordinates in pixel of the cell with the index given in parameter
  getCoordinates(index) {
    var x = index[0] * (this.canvasWidth / this.gridRows);
    var y = index[1] * (this.canvasHeight / this.gridColumns);

    return [x, y];
  }

  // Draw the grid layout
  drawGrid() {
    this.canvasCtx.beginPath();

    for (var i = 0; i <= this.gridRows; i++) {
      this.canvasCtx.moveTo(0, (this.canvasHeight / this.gridRows) * i);
      this.canvasCtx.lineTo(
        this.canvasWidth,
        (this.canvasHeight / this.gridRows) * i
      );
    }

    for (var i = 0; i <= this.gridColumns; i++) {
      this.canvasCtx.moveTo((this.canvasWidth / this.gridColumns) * i, 0);
      this.canvasCtx.lineTo(
        (this.canvasWidth / this.gridColumns) * i,
        this.canvasHeight
      );
    }

    this.canvasCtx.strokeStyle = "#cccccc";
    this.canvasCtx.stroke();
  }

  // Draw the game at every state
  draw() {
    //Clear previous component position to prevent traces
    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    //snake.newPos(1, 2);
    //snake.update();

    this.canvasCtx.strokeStyle = "black";

    // Draw the fruits
    for (var i = 0; i < this.nb_fruits; i++) {
      if (this.fruits[i].sprite == null) {
        // mode without sprites

        // get the color
        this.canvasCtx.fillStyle = this.fruits[i].color;
        // get the coordinates
        var coord = this.getCoordinates(this.fruits[i].getPosition());
        // draw the color
        this.canvasCtx.fillRect(coord[0], coord[1], this.size, this.size);
      } else {
        // mode with sprites

        // get the coordinates
        var coord = this.getCoordinates(this.fruits[i].getPosition());
        this.fruits[i].sprite.setPos(coord[0], coord[1]);
        // draw the sprite
        this.fruits[i].sprite.render();
      }
    }

    //this.canvasCtx.fill()

    // Draw the snake
    for (var i = 0; i < this.nb_snakes; i++) {
      if (this.fruits[i].sprite == null) {
        // mode without sprites

        // get the color
        this.canvasCtx.fillStyle = this.snakes[i].color;
        // get the coordinates
        var coord = this.getCoordinates(this.snakes[i].getPosition());
        // draw the color
        this.canvasCtx.fillRect(coord[0], coord[1], this.size, this.size);
      } else {
        // mode with sprites

        // get the coordinates
        var coord = this.getCoordinates(this.snakes[i].getPosition());
        this.snakes[i].sprite[0].setPos(coord[0], coord[1]);
        // draw the sprite
        this.snakes[i].sprite[0].render();
      }

      // Test for the sprite drawing
      var spiteToDraw = [this.snakes[i].length - 1];

      // draw the tail
      for (var j = 0; j < this.snakes[i].length - 1; j++) {
        if (this.fruits[i].sprite == null) {
          // mode without sprites

          // get the color
          this.canvasCtx.fillStyle = this.snakes[i].color;
          // get the coordinates
          coord = this.getCoordinates(this.snakes[i].tail[j]);
          // draw the color
          this.canvasCtx.fillRect(coord[0], coord[1], this.size, this.size);
        } else {
          // mode with sprites

          // get the coordinates
          coord = this.getCoordinates(this.snakes[i].tail[j]);
          spiteToDraw[j] = this.snakes[i].sprite[1];
          spiteToDraw[j].setPos(coord[0], coord[1]);
          // draw the sprite
          spiteToDraw[j].render();
        }
      }
    }

    // Draw board after to have the edges
    this.drawGrid();
  }

  // Checks if the snake object is going out of boundaries
  hitBoundaries(snakeToTest) {
    var posToTest = snakeToTest.getPosition();

    if (
      typeof this.grid[posToTest[0]] === "undefined" ||
      typeof this.grid[posToTest[1]] === "undefined"
    ) {
      return true;
    } else {
      return false;
    }
  }

  // Checks if a snake hits a fruit
  // Returns the index of the fruit, otherwise return -1
  hitFruit(snakeToTest) {
    var posToTest = snakeToTest.getPosition();

    for (var i = 0; i < this.nb_fruits; i++) {
      var currentPos = this.fruits[i].getPosition();
      if (posToTest[0] == currentPos[0] && posToTest[1] == currentPos[1]) {
        return i;
      }
    }

    // The snake did not hit a fruit
    return -1;
  }

  // Check if the snake hits another boy or his own body
  hitBody(index, snakeToTest) {
    var posToTest = snakeToTest.getPosition();

    for (var i = 0; i < this.nb_snakes; i++) {
      if (i != index) {
        var currentPos = this.snakes[i].getPosition();
        if (posToTest[0] == currentPos[0] && posToTest[1] == currentPos[1]) {
          return true;
        }
      }

      if (this.snakes[i].isOnTail(posToTest)) {
        return true;
      }
    }
    return false;
  }

  // Reset the snake with the index given in parameter
  resetSnake(index) {
    var newPos = this.findNewPosition();

    // Reset the snake
    this.snakes[index] = new Snake(
      newPos,
      colorSnake,
      this.snakes[index].sprite
    );
  }

  // Reset the fruit with the index given in parameter
  resetFruit(index) {
    var newPos = this.findNewPosition();

    // Reset the snake
    this.fruits[index] = new Fruit(
      newPos,
      colorFruit,
      this.fruits[index].sprite
    );
  }

  // Find coordinates for a new component
  // Make sure the component is not on an occupied cell
  findNewPosition() {
    var findGoodPos = false;

    while (findGoodPos == false) {
      findGoodPos = true;

      // Make sure food is not on an occupied cell
      var new_x =
        Math.floor(Math.random() * (this.gridColumns - 1 - 0 + 1)) + 0;
      var new_y = Math.floor(Math.random() * (this.gridRows - 1 - 0 + 1)) + 0;

      // Check fruits
      for (var j = 0; j < this.nb_fruits; j++) {
        var posToCheck = this.fruits[j].pos;
        if (new_x == posToCheck[0] && new_y == posToCheck[1]) {
          findGoodPos = false;
          break;
        }
      }

      if (findGoodPos) {
        // Check snakes
        for (var j = 0; j < this.nb_snakes; j++) {
          posToCheck = this.snakes[j].getPosition();
          if (new_x == posToCheck[0] && new_y == posToCheck[1]) {
            findGoodPos = false;
            break;
          }
          // Check the tail
          if (this.snakes[j].isOnTail([new_x, new_y])) {
            findGoodPos = false;
            break;
          }
        }
      }
    }

    return [new_x, new_y];
  }

  // Update the grid by placing the components on it
  upgradeGrid() {
    // Creation of the grid : 2D array initialized with -1
    this.grid = Array.from(Array(this.gridRows), _ =>
      Array(this.gridColumns).fill(objects.empty)
    );

    for (var i = 0; i < this.nb_snakes; i++) {
      // Update the grid with the tails positions
      for (var j = 0; j < this.snakes[i].length - 1; j++) {
        pos = this.snakes[i].tail[j];
        this.grid[pos[0]][pos[1]] = objects.snake_tail;
      }

      // Update the grid with the snakes positions
      var pos = this.snakes[i].getPosition();
      this.grid[pos[0]][pos[1]] = objects.snake;
    }

    // Update the grid with the fruits positions
    for (var i = 0; i < this.nb_fruits; i++) {
      var pos = this.fruits[i].getPosition();
      this.grid[pos[0]][pos[1]] = objects.food;
    }
  }

  // Update the entire game by moving one snake
  update(direction, toTranslate) {
    if (toTranslate) {
      
      var state = this.getSnakeState();
      if (state["orientation"] == "down") {
        if (direction == "left") {
          direction = "right";
        } else if (direction == "up") {
          direction = "down";
        } else if (direction == "right") {
          direction = "left";
        }
      } else if (state["orientation"] == "left") {
        if (direction == "left") {
          direction = "down";
        } else if (direction == "up") {
          direction = "left";
        } else if (direction == "right") {
          direction = "up";
        }
      } else if (state["orientation"] == "right") {
        if (direction == "left") {
          direction = "up";
        } else if (direction == "up") {
          direction = "right";
        } else if (direction == "right") {
          direction = "down";
        }
      }
    }

    // move the snake
    if (this.snakes[0].move(direction)) {
      //console.log("New position : " + this.snakes[0].getPosition());

      // f true -> Reset the Snake
      if (
        this.hitBoundaries(this.snakes[0]) ||
        this.hitBody(0, this.snakes[0])
      ) {
        //console.log("You died!");
        //this.score = -1;
        // Reset the dead snake
        //this.resetSnake(0);
        if(this.display==true) {
          this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          this.drawGrid(); 
        }
        //console.log("game: hitbody");

        return false;
      } else {
        var hitIndex = this.hitFruit(this.snakes[0]);

        // != -1 -> Snake grows & reset the fruit
        if (hitIndex != -1) {
          // Reset the fruit eaten
          this.resetFruit(0);

          // Update the snake
          this.snakes[0].grow();

          // Update score
          this.score++;
        }
      }

      if (this.display) {
        // Draw the game
        this.draw();
      }
      // Update and return the grid
      this.upgradeGrid();
      return true;
    }
    else{
      //console.log(this.snakes[0].getPosition(), "game, move false");
      return false;
    }
  }
}
