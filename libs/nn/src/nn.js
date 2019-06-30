class NeuralNetwork {
  /**
   * Takes in the number of input nodes, hidden node and output nodes
   * @constructor
   * @param {number} input_nodes
   * @param {number} hidden_nodes
   * @param {number} output_nodes
   */
  constructor(input_nodes, hidden_nodes, output_nodes, weights) {
    this.input_nodes = input_nodes;
    this.hidden_nodes = hidden_nodes;
    this.output_nodes = output_nodes;
    // Load weights from file
    if (weights != null) {
      this.input_weights = tf.tensor(weights["input_weights"]);
      this.output_weights = tf.tensor(weights["output_weights"]);
    } else {
      // Initialize random weights
      this.input_weights = tf.randomNormal([
        this.input_nodes,
        this.hidden_nodes
      ]);
      this.output_weights = tf.randomNormal([
        this.hidden_nodes,
        this.output_nodes
      ]);
    }

    this.input_index = [];
    for(var i=0; i<input_nodes; i++) {
      this.input_index[i] = [];
        for(var j=0; j<hidden_nodes; j++) {
          this.input_index[i][j] = 0;
        }
    }

    this.output_index = [];
    for(var i=0; i<hidden_nodes; i++) {
      this.output_index[i] = [];
        for(var j=0; j<output_nodes; j++) {
          this.output_index[i][j] = 0;
        }
    }
  }

  /**
   * Takes in a 1D array and feed forwards through the network
   * @param {array} - Array of inputs
   */
  predict(user_input) {
    let output;
    tf.tidy(() => {
      /* Takes a 1D array */
      let input_layer = tf.tensor(user_input, [1, this.input_nodes]);
      let hidden_layer = input_layer.matMul(this.input_weights).sigmoid();
      let output_layer = hidden_layer.matMul(this.output_weights).sigmoid();
      output = output_layer.dataSync();
    });
    return output;
  }

  /**
   * Returns a new network with the same weights as this Neural Network
   * @returns {NeuralNetwork}
   */
  clone() {
    let clonie = new NeuralNetwork(
      this.input_nodes,
      this.hidden_nodes,
      this.output_nodes
    );
    clonie.dispose();
    clonie.input_weights = tf.clone(this.input_weights);
    clonie.output_weights = tf.clone(this.output_weights);
    return clonie;
  }

  /**
   * Dispose the input and output weights from the memory
   */
  dispose() {
    this.input_weights.dispose();
    this.output_weights.dispose();
  }
}
