class Generation {
  /**
   * Takes in the number of input nodes, hidden node and output nodes
   * @constructor
   * @param {number} number
   * @param {number} selectionPerCentage
   * @param {number} timeUnit
   * @param {number} input_nodes
   * @param {number} hidden_nodes
   * @param {number} output_nodes
   */
  constructor(
    selectionPerCentage
  ) {
    this.selectionPerCentage = selectionPerCentage;
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
  mutate(Agent) {

  }

  /**
   * Return the value of the Gaussian Distribution at x=0
   * @param   mu    expected value
   * @param   sigma standard deviation
   * @returns gaussian pertubation
   */
  gaussianPertubation(mu, sigma) {
    return 1/(sigma*Math.sqrt(2*Math.PI)) * Math.exp(-1/2*Math.pow(-mu/sigma,2))
  }

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
