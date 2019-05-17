class Environment {
  /**
   * Takes in the number of input nodes, hidden node and output nodes
   * @constructor
   * @param {null} null
   */
  constructor(
    canvases,
    gridRows,
    gridColumns,
    nb_snakes,
    nb_fruits,
    mode = "DF",
    number,
    perCent,
    timeUnit,
    input_nodes,
    hidden_nodes,
    output_nodes,
    timeout
  ) {
    this.canvases = canvases;
    this.gridRows = gridRows;
    this.gridColumns = gridColumns;
    this.nb_snakes = nb_snakes;
    this.nb_fruits = nb_fruits;
    this.mode = mode;
    this.number = number;
    this.perCent = perCent;
    this.timeUnit = timeUnit;
    this.input_nodes = input_nodes;
    this.hidden_nodes = hidden_nodes;
    this.output_nodes = output_nodes;
    this.timeout = timeout;

    var visible = 0;
    this.agents = [];
    // Create the required number of Agent
    for (var i = 0; i < this.number; i++) {
      if (visible < this.canvases.length) {
        this.agents.push(
          new Agent(
            this.gridRows,
            this.gridColumns,
            this.canvases[visible].height,
            this.canvases[visible].width,
            this.canvases[visible],
            this.nb_snakes,
            this.nb_fruits,
            this.mode,
            true,
            this.timeUnit,
            this.input_nodes,
            this.hidden_nodes,
            this.output_nodes
          )
        );
        visible++;
      } else {
        this.agents.push(
          new Agent(
            this.gridRows,
            this.gridColumns,
            this.canvasHeight,
            this.canvasWidth,
            this.canvas,
            this.nb_snakes,
            this.nb_fruits,
            this.mode,
            false,
            this.timeUnit,
            this.input_nodes,
            this.hidden_nodes,
            this.output_nodes
          )
        );
      }
    }

    // Create the generation
    this.generation = new Generation(
      this.agents,
      this.perCent
    );
  }

  step() {}
}
