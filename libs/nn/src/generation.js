class Generation {
  /**
   * Takes in the number of input nodes, hidden node and output nodes
   * @constructor
   * @param {number} number
   * @param {number} perCent
   * @param {number} timeUnit
   * @param {number} input_nodes
   * @param {number} hidden_nodes
   * @param {number} output_nodes
   */
  constructor(
    canvases,
    gridRows,
    gridColumns,
    nb_snakes,
    nb_fruits,
    mode,
    number,
    perCent,
    timeUnit,
    input_nodes,
    hidden_nodes,
    output_nodes
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

    this.population = [];

    var visible = 0;
    // Create the required number of Agent
    for (var i = 0; i < this.number; i++) {
      if(visible < this.canvases.length){
        this.population.push(
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
      }
      else{
        this.population.push(
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
  }

  /**
   * NotImplemented
   * @param {} -
   */
  calculationQfit() {}

  /**
   * NotImplemented
   * @returns {}
   */
  calculationQnmse() {}

  /**
   * NotImplemented
   * @returns {}
   */
  calculationQcomp() {}

  /**
   * NotImplemented
   * @returns {NewAgent}
   */
  crossOver(AgentA, AgentB) {
    var newAgent;

    return NewAgent;
  }

  /**
   * NotImplemented
   * @returns {}
   */
  mutation(Agent) {}

  /**
   * NotImplemented
   * @returns {}
   */
  selection() {}
}
