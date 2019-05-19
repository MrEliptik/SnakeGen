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
    agents,
    perCent
  ) {
    this.agents = agents;
    this.perCent = perCent;
    this.bestScore = 0;
  }

  /**
   * NotImplemented
   * @param {} -
   */
  calculateQfit() {}

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
  mutate(Agent) {}

  /**
   * NotImplemented
   * @returns {}
   */
  selection() {}

  getAllScores(){
    var scores = [];
    this.agents.forEach(agent => {
      scores.push(agent.getScore());
    });
    return scores;
  }

  getHighestScore(){
    return Math.max(...this.getAllScores());
  }
}
