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
    speed,
    input_nodes,
    hidden_nodes,
    output_nodes,
    tickout,
    state
  ) {

    // Generation Constructor
    super(selectionPerCentage)

    this.canvases = canvases;
    this.gridRows = gridRows;
    this.gridColumns = gridColumns;
    this.nb_snakes = nb_snakes;
    this.nb_fruits = nb_fruits;
    this.mode = mode;
    this.populationSize = populationSize;
    this.selectionPerCentage = selectionPerCentage;
    this.speed = speed;
    this.input_nodes = input_nodes;
    this.hidden_nodes = hidden_nodes;
    this.output_nodes = output_nodes;
    this.tickout = tickout;
    this.state = state;

    var visible = 0;
    this.agentsAlive = this.populationSize;
    this.agents = [];
    this.currGenHighScore = 0;

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
            this.speed,
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
            this.speed,
            this.input_nodes,
            this.hidden_nodes,
            this.output_nodes
          )
        );
      }
    }

    this.tickCount = 0;
  }

  getAllScores(){
    var scores = [];
    var that = this;
    for(let i = 0; i < this.agents.length ; i++){
      scores.push(this.agents[i].getScore());
    }
    return scores;
  }

  getHighestScore(){
    //notImplemented
  }

  getCurrGenHighestScore()
  {
    if(this.currGenHighScore < Math.max(...this.getAllScores())){
      this.currGenHighScore = Math.max(...this.getAllScores());
    }
    return this.currGenHighScore;
  }

  getCurrGenID(){
    return this.id;
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
      // if return false, agent is dead
      if(!agent.step()){
        this.agentsAlive--;
      }
    });

     return this.agentAlive != 0;
  }

  update(){
    if(this.tickCount < this.tickout){
      if(this.state == "play") {
        // No agents left, next gen
        if(!this.tick()){
          this.agents = this.createNextGen(this.agents);
          this.tickCount = 0;
        }


        var that = this;
    
        setTimeout(function(){
          that.tickCount += 1;
          that.update();
        }, 1000/this.speed);
      }
    }
    else{
      this.agents = this.createNextGen(this.agents);
      this.tickCount = 0;

      var that = this;
    
      setTimeout(function(){
        that.tickCount += 1;
        that.update();
      }, 1000/this.speed);
    }
  }
}
