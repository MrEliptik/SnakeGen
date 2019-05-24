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
    super(populationSize,
      selectionPerCentage,
      stepSizeParameter,
      mutationProb)

    this.speed = speed;
    this.tickout = tickout;
    this.state = state;

    var visible = 0;
    this.agentsAlive = this.populationSize;
    this.agents = [];
    this.currGenHighScore = 0;

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

  getAllScores() {
    var scores = [];
    var that = this;
    for (let i = 0; i < this.agents.length; i++) {
      scores.push(this.agents[i].getScore());
    }
    return scores;
  }

  getHighestScore() {
    //notImplemented
  }

  getCurrGenHighestScore() {
    if (this.currGenHighScore < Math.max(...this.getAllScores())) {
      this.currGenHighScore = Math.max(...this.getAllScores());
    }
    return this.currGenHighScore;
  }

  getCurrGenID() {
    return this.id;
  }

  setPlayPauseState(state) {
    this.state = state;
  }

  getPlayPauseState() {
    return this.state;
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  getTickCount() {
    return this.tickCount;
  }

  tick() {
    // Tell each agent to take one step in the
    // game
    this.agents.forEach(agent => {
      // if return false, agent is dead
      if (agent.step() == false) {
        this.agentsAlive--;
      }
    });

    return this.agentsAlive != 0;
  }

  dispatchNewGenEvent(){
    var event = new Event('newgeneration');

    window.dispatchEvent(event);
  }

  update() {
    if (this.state == "pause") {
      return;
    }

    if (this.tickCount < this.tickout) {

      // No agents left, next gen
      if (!this.tick()) {
        this.dispatchNewGenEvent();
        this.agents = this.createNextGen(this.agents);
        this.tickCount = 0;
        this.agentsAlive = this.populationSize;
        // reset games
        this.agents.forEach(agent => {
          agent.resetGame();
        });
      }
    } else {
      this.dispatchNewGenEvent();
      this.agents = this.createNextGen(this.agents);
      this.tickCount = 0;
      this.agentsAlive = this.populationSize;
      // reset games
      this.agents.forEach(agent => {
        agent.resetGame();
      });
    }

    var that = this;

    setTimeout(function () {
      that.tickCount += 1;
      that.update();
    }, 1000 / this.speed);
  }
}
