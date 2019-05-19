class Environment extends Generation {
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
    selectionPerCentage,
    stepSizeParameter,
    mutationProb,
    speed,
    input_nodes,
    hidden_nodes,
    output_nodes,
    tickout,
    state
  ) {

    // Generation Constructor
    super(selectionPerCentage, stepSizeParameter, mutationProb)
    
    this.populationSize = populationSize;
    this.speed = speed;
    this.tickout = tickout;
    this.state = state;

    var visible = 0;
    this.agents = [];

    // Create the required number of Agent
    for (var i = 0; i < this.populationSize; i++) {
      if (visible < canvases.length) {
        this.agents.push(
          new Agent(
            gridRows,
            gridColumns,
            canvases[visible].height,
            canvases[visible].width,
            canvases[visible],
            nb_snakes,
            nb_fruits,
            mode,
            true,
            speed,
            input_nodes,
            hidden_nodes,
            output_nodes
          )
        );
        visible++;
      } else {
        this.agents.push(
          new Agent(
            gridRows,
            gridColumns,
            canvases[visible].height,
            canvases[visible].width,
            canvases[visible],
            nb_snakes,
            nb_fruits,
            mode,
            false,
            speed,
            input_nodes,
            hidden_nodes,
            output_nodes
          )
        );
      }
    }

    this.tickCount = 0;
  }

  setPlayPauseState(state){
    this.state = state;
  }

  getPlayPauseState(){
    return this.state;
  }

  setSpeed(speed){
    this.speed = speed;
  }

  getTickCount(){
    return this.tickCount;
  }

  tick(){
    // Tell each agent to take one step in the
    // game
    this.agents.forEach(agent => {
      agent.step();
    });
  }

  update(){
    if(this.tickCount < this.tickout && this.state == "play") {
      this.tick();
      var that = this;
  
      setTimeout(function(){
        that.tickCount += 1;
        that.update();
      }, 1000/this.speed);
    }
  }
}
