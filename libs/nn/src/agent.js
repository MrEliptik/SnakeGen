class Agent {
  /**
   * Takes in the number of input nodes, hidden node and output nodes
   * @constructor
   * @param {number} input_nodes
   * @param {number} hidden_nodes
   * @param {number} output_nodes
   */
  constructor(
    gridRows,
    gridColumns,
    canvasHeight,
    canvasWidth,
    canvas,
    nb_snakes,
    nb_fruits,
    mode,
    display,
    timeUnit,
    input_nodes,
    hidden_nodes,
    output_nodes
  ) {
    this.gridRows = gridRows;
    this.gridColumns = gridColumns;
    this.canvasHeight = canvasHeight;
    this.canvasWidth = canvasWidth;
    this.canvas = canvas;
    this.nb_snakes = nb_snakes;
    this.nb_fruits = nb_fruits;
    this.mode = mode;
    this.display = display;
    this.timeUnit = timeUnit;
    this.input_nodes = input_nodes;
    this.hidden_nodes = hidden_nodes;
    this.output_nodes = output_nodes;

    this.nn = new NeuralNetwork(
      this.input_nodes,
      this.hidden_nodes,
      this.output_nodes
    );

    this.game = new Game(
      this.gridRows,
      this.gridColumns,
      this.canvasHeight,
      this.canvasWidth,
      this.canvas,
      this.nb_snakes,
      this.nb_fruits,
      this.mode,
      this.display
    );
  }

  /**
   * Play X games until timeout
   * @param {iterations} Number of games to be played before averaging
   * @param {timeOut} Time units before the end of the game
   */
  play(iterations, timeOut) {}
}
