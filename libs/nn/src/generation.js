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
    number,
    perCent,
    timeUnit,
    input_nodes,
    hidden_nodes,
    output_nodes
  ) {
    this.number = number;
    this.perCent = perCent;
    this.timeUnit = timeUnit;
    this.input_nodes = input_nodes;
    this.hidden_nodes = hidden_nodes;
    this.output_nodes = output_nodes;
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

    return NewAgent
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
