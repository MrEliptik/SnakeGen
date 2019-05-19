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
    populationSize,
    perCent,
    timeUnit,
    input_nodes,
    hidden_nodes,
    output_nodes,
    tickout,
    state
  ) {
    this.canvases = canvases;
    this.gridRows = gridRows;
    this.gridColumns = gridColumns;
    this.nb_snakes = nb_snakes;
    this.nb_fruits = nb_fruits;
    this.mode = mode;
    this.populationSize = populationSize;
    this.perCent = perCent;
    this.timeUnit = timeUnit;
    this.input_nodes = input_nodes;
    this.hidden_nodes = hidden_nodes;
    this.output_nodes = output_nodes;
    this.tickout = tickout;
    this.state = state;

    var visible = 0;
    this.agents = [];

    // Create the required number of Agent
    for (var i = 0; i < this.populationSize; i++) {
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
    this.generation = new Generation(this.agents, this.perCent);
  }

  tick(){
    // Tell each agent to take one step in the
    // game
    this.agents.forEach(agent => {
      agent.step();
    });
  }

  update(cpt){
    if(cpt < 10) {
      this.tick();
      var that = this;
  
      setTimeout(function(){
        that.update(++cpt);
      }, 1000/60);
    }
  }
}
