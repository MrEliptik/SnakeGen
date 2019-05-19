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

    this.actions = { 0: "left", 1: "up", 2: "right" };
  }

  /**
   * Use the Neural Network to decide the next move of the snake
   */
  step() {
    // Calculates the inputs for the NN
    var los = this.game.calculateLinesOfSight();
    var cos = this.game.calculateConesOfSight();

    // Run a forward pass on the NN
    var action = this.nn.predict(
      [los[0],
      los[1],
      los[2],
      cos[0][0],
      cos[1][0],
      cos[2][0],
      cos[3][0],
      cos[0][1],
      cos[1][1],
      cos[2][1],
      cos[3][1]]
    );

    // Get the index of the array's max value
    // it'll give us the most likely action to take
    let i = action.indexOf(Math.max(...action));

    //console.log(this.actions[i]);

    // Call the game update with the action calculated 
    // by the NN
    this.game.update(this.actions[i], true);
  }

  getScore(){
    return this.game.score;
  }
}
