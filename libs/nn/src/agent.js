class Agent {
  /**
   * Takes in the number of input nodes, hidden node and output nodes
   * @constructor
   * @param {number} input_nodes
   * @param {number} hidden_nodes
   * @param {number} output_nodes
   */
  constructor(timeUnit, input_nodes, hidden_nodes, output_nodes) {
    this.timeUnit = timeUnit;
    this.input_nodes = input_nodes;
    this.hidden_nodes = hidden_nodes;
    this.output_nodes = output_nodes;
  }

  /**
   * Play X games until timeout
   * @param {iterations} Number of games to be played before averaging
   * @param {timeOut} Time units before the end of the game
   */
  play(iterations, timeOut) {
    let Qacc;
    
    return Qacc;
  }
}
