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
    mode='DF',
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

    // Create the generation
    this.generation = new Generation(
      this.canvases,
      this.gridRows,
      this.gridColumns,
      this.nb_snakes,
      this.nb_fruits,
      this.mode,
      this.number,
      this.perCent,
      this.timeUnit,
      this.input_nodes,
      this.hidden_nodes,
      this.output_nodes
    );
  }
}
