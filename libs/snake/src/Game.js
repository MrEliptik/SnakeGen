const objects       = {}
objects.food        = 3
objects.snake       = 1
objects.snake_tail  = 2
objects.empty       = -1

class Game{
  constructor( gridRows, gridColumns, size, canvasHeight, canvasWidth, canvasCtx, nb_snakes, nb_fruits, mode) {

    // Creation of the grid
    // 2D array initialized with -1
    this.grid = Array.from(Array(gridRows), _ => Array(gridColumns).fill(objects.empty));

    // Parameters of the draw grid
    this.gridRows = gridRows;
    this.gridColumns = gridColumns;
    this.size = size;
    this.canvasHeight = canvasHeight;
    this.canvasWidth = canvasWidth;
    this.canvasCtx = canvasCtx;

    // Creation of the components
    this.nb_snakes = nb_snakes;
    this.nb_fruits = nb_fruits;
  }

  drawGrid( canvasHeight, canvasWidth){
      this.canvasCtx.beginPath();

      for(var i = 0; i <= this.gridRows; i++){
          this.canvasCtx.moveTo(0, (this.canvasHeight/this.gridRows)*i);
          this.canvasCtx.lineTo(this.canvasWidth, (this.canvasHeight/this.gridRows)*i);
      }

      for(var i = 0; i <= gridColumns; i++){
          this.canvasCtx.moveTo((this.canvasWidth/this.gridColumns)*i, 0);
          this.canvasCtx.lineTo((this.canvasWidth/this.gridColumns)*i, this.canvasHeight);
      }

      this.canvasCtx.strokeStyle = "black";
      this.canvasCtx.stroke();
  }

  plot(){
    return "aaaaaa"
  }
};

module.exports = {
  Game: Game
};
