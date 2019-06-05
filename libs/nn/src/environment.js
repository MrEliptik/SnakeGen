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
    attemptNumber,
    state,
    constants
  ) {
    // Generation Constructor
    super(
      populationSize,
      selectionPerCentage,
      stepSizeParameter,
      mutationProb,
      constants
    );

    this.speed = speed;
    this.state = state;

    this.tickout = tickout;
    this.tickCount = 0;

    this.attemptNumber = attemptNumber; // It is the number of attempts that the snakes will play before a mutation
    this.attemptCount = 0; // Current attempt number

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
            null,
            null,
            null,
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
  }

  getAllScores() {
    var scores = [];
    var that = this;
    for (let i = 0; i < this.agents.length; i++) {
      scores.push(this.agents[i].getScoreMean());
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

  getCurrScore() {
    return Math.max(...this.getAllScores());
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
      if (agent.isAlive) {
        var ret = agent.step();
      }

      //console.log(ret);
      if (ret === false) {
        agent.isAlive = false;
        this.agentsAlive--;
        //console.log(this.agentsAlive);
      }
    });

    return this.agentsAlive != 0;
  }

  /**
   * @brief   Function that manages the learning
   * @details The generation will play a number of attemptNumber
   *          games that each have tickout movement max
   */
  update() {
    if (this.state == "pause") {
      return;
    }

    // Check if the current attempt is ended
    if (this.tickCount >= this.tickout) {
      this.attemptCount++;

      // Check if the current set of attempts is ended
      if (this.attemptCount >= this.attemptNumber) {
        // Mutation
        this.dispatchNewGenEvent();
        this.agents = this.createNextGen(
          this.agents,
          this.tickout,
          this.getCurrGenHighestScore()
        );

        // Reset the parameters before restart the set of attempts
        this.attemptCount = 0;
        this.tickCount = 0;
        this.agentsAlive = this.populationSize;

        // reset games
        this.agents.forEach(agent => {
          agent.resetGame();
          agent.isAlive = true;
          agent.tickALive = 0;
          agent.statsScore = [];
          agent.statsTickAlive = [];
        });
      } else {
        // Store the stats of the agents
        this.agents.forEach(agent => {
          agent.storeStats();
        });

        // Start a new attempt
        this.tickCount = 0;
        this.agentsAlive = this.populationSize;

        // reset games
        this.agents.forEach(agent => {
          agent.resetGame();
          agent.isAlive = true;
          agent.tickALive = 0;
        });
      }
    }

    if (!this.tick()) {
      this.tickCount = this.tickout;
    }

    var that = this;

    // Call the function like a loop
    setTimeout(function() {
      that.tickCount += 1;
      that.update();
    }, 1000 / this.speed);
  }

  dispatchNewGenEvent() {
    var event = new CustomEvent("newgeneration", {
      detail: {
        id: this.id,
        maxScore: this.getCurrGenHighestScore(),
        score: this.getCurrScore()
      }
    });

    window.dispatchEvent(event);
  }
}
