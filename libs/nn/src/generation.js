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
    populationSize,
    selectionPerCentage,
    stepSizeParameter,
    mutationProb
  ) {
    this.populationSize = populationSize;
    this.selectionPerCentage = selectionPerCentage;
    this.stepSizeParameter = stepSizeParameter;
    this.mutationProb = mutationProb;
    this.bestScore = 0;
    this.id = 0;
    this.constants = [1, 0.5];
  }

  /**
   * NotImplemented
   * @param {} -
   */
  calculateQfit(agent, maxScore, tickMax) {
    return (
      this.constants[0] * agent.getScore() / maxScore +
      (this.constants[1] * agent.getTickAlive()) / tickMax
    );
  }

  randomG(v) {
    var r = 0;
    for (var i = v; i > 0; i--) {
      r += Math.random();
    }
    return r / v;
  }

  /**
   * NotImplemented
   * @param {agentA}
   * @param {agentB}
   * @param {offspring}
   * @param {type}
   */
  crossOver(agentA, agentB, offspring, type = "patch") {
    var clone = offspring.nn.clone();
    offspring.nn.dispose();
    offspring.nn = clone;

    var agentA_clone = agentA.nn.clone();
    var agentB_clone = agentB.nn.clone();

    if (type == "row") {
      // Random row index is generated
      var i =
        Math.floor(Math.random() * (agentA_clone.input_weights.shape[0] - 1)) +
        0;

      // Agent takes all rows of agentA but not the i-th,
      // that is taken from agentB
      var tmp = agentA_clone.input_weights.arraySync();
      var weights = agentB_clone.input_weights.arraySync();
      tmp[i] = weights[i].splice(0);
      offspring.nn.input_weights = tf.tensor(tmp);

      // Same for output weights
      var i =
        Math.floor(Math.random() * (agentA_clone.output_weights.shape[0] - 1)) +
        0;
      var tmp = agentA_clone.output_weights.arraySync();
      tmp[i] = agentB_clone.output_weights.arraySync()[i].splice(0);

      offspring.nn.output_weights = tf.tensor(tmp);
    }
    // TODO: finish this case
    else if (type == "column") {
      // Random column index is generated
      var j =
        Math.floor(Math.random() * (agentA_clone.input_weights.shape[1] - 1)) +
        0;

      // return an array [x,y,z] representing the selected column
      var col = two_d.map(function(value, index) {
        return value[j];
      });
    } else if (type == "patch") {
      // starting coordinates
      var i_start =
        Math.floor(Math.random() * (agentA_clone.input_weights.shape[0] - 1)) +
        0;
      var j_start =
        Math.floor(Math.random() * (agentA_clone.input_weights.shape[1] - 1)) +
        0;
      // dimensions of the patch
      var height =
        Math.floor(
          Math.random() * (agentA_clone.input_weights.shape[0] - 1 - i_start)
        ) + 0;
      var width =
        Math.floor(
          Math.random() * (agentA_clone.input_weights.shape[1] - 1 - j_start)
        ) + 0;

      var tmpA = agentA_clone.input_weights.arraySync();
      var tmpB = agentB_clone.input_weights.arraySync();
      // Replace only patch values in agentA copy
      // !!! This hangs and throw out of error...
      for (var i = i_start; i < i_start + height; i++) {
        for (var j = j_start; j < j_start + width; j++) {
          tmpA[i][j] = tmpB[i][j];
        }
      }

      offspring.nn.input_weights = tf.tensor(tmpA);

      // Same for output weights
      var i_start =
        Math.floor(Math.random() * (agentA_clone.output_weights.shape[0] - 1)) +
        0;
      var j_start =
        Math.floor(Math.random() * (agentA_clone.output_weights.shape[1] - 1)) +
        0;
      // dimensions of the patch
      var height =
        Math.floor(
          Math.random() * (agentA_clone.output_weights.shape[0] - 1 - i_start)
        ) + 0;
      var width =
        Math.floor(
          Math.random() * (agentA_clone.output_weights.shape[1] - 1 - j_start)
        ) + 0;

      var tmpA = agentA_clone.output_weights.arraySync();
      var tmpB = agentB_clone.output_weights.arraySync();

      for (var i = i_start; i < i_start + height; i++) {
        for (var j = j_start; j < j_start + width; j++) {
          tmpA[i][j] = tmpB[i][j];
        }
      }
      offspring.nn.output_weights = tf.tensor(tmpA);
    }
  }

  /**
   * Apply the Stochastic mutation policy to an Agent object
   * @param   agent   Agent to mutate
   */
  mutate(agent) {
    var mutationSSP = this.gaussianPertubation(0, this.stepSizeParameter);
    agent.mutationIntensity += this.gaussianPertubation(0, mutationSSP);

    // Weight matrix W1 mutation
    var input_weights = this.matrixMutation(
      agent.nn.input_weights.arraySync(),
      agent.mutationIntensity,
      this.mutationProb
    );
    agent.nn.input_weights = tf.tensor(input_weights);

    // Weight matrix W2 mutation
    var output_weights = this.matrixMutation(
      agent.nn.output_weights.arraySync(),
      agent.mutationIntensity,
      this.mutationProb
    );
    agent.nn.output_weights = tf.tensor(output_weights);
  }

  /**
   * Mutates the weight matrix using the Stochastic
   * mutation policy
   * @param   matrix            Weight matrix
   * @param   mutationIntensity Mutation intensity to apply
   * @param   mutationProb      Probability to apply the mutation
   */
  matrixMutation(matrix, mutationIntensity, mutationProb) {
    for (var i = 0; i < matrix.length; i++) {
      for (var j = 0; j < matrix[0].length; j++) {
        if (Math.random() <= mutationProb) {
          //matrix[i][j] += this.gaussianPertubation(0, mutationIntensity);
          matrix[i][j] += this.randomG(3);
        }
      }
    }

    return matrix;
  }

  /**
   * Return the value of the Gaussian Distribution at x=0
   * @param   mu    expected value
   * @param   sigma standard deviation
   * @returns gaussian pertubation
   */
  gaussianPertubation(mu, sigma) {
    return (
      (1 / (sigma * Math.sqrt(2 * Math.PI))) *
      Math.exp((-1 / 2) * Math.pow(-mu / sigma, 2))
    );
  }

  /**
   * Return an array of selected agents from the list
   * @param   agents  Array of agents that we have to divide
   * @returns Agents selected
   */
  selection(agents, maxScore, numberOfTick) {
    // Select the number of agents to select
    var numberOfAgents = Math.round(
      (this.populationSize * this.selectionPerCentage) / 100.0
    );

    var that = this;

    // Sort the agents by using their score
    var agentsArray = agents.sort(function(a, b) {
      return (
        that.calculateQfit(b, maxScore, numberOfTick) -
        that.calculateQfit(a, maxScore, numberOfTick)
      );
    });

    // Selection
    var agentsToSelect = [];
    for (var i = 0; i < numberOfAgents; i++) {
      agentsToSelect.push(agentsArray[i]);
    }

    // Deepcopy
    return Array.from(agentsToSelect);
  }

  createNextGen(agents, numberOfTick, maxScore) {
    // increment gen ID
    this.id++;

    // Selection
    var selectedAgents = this.selection(agents, maxScore, numberOfTick);

    for (var i = 0; i < selectedAgents.length; i++) {
      agents[i] = selectedAgents[i];
    }

    // Breeding == crossover and then mutate
    for (var i = selectedAgents.length; i < agents.length; i++) {
      // Crossover == create a children from two randoms parents
      // from the selectedAgents

      // Shuffle array
      const shuffled = selectedAgents.sort(() => 0.5 - Math.random());

      // Get sub-array of first n elements after shuffled
      let selected = shuffled.slice(0, 2);

      this.crossOver(selected[0], selected[1], agents[i], "patch");

      // Mutate the newly breed agent
      this.mutate(agents[i]);
    }

    return agents;
  }
}
