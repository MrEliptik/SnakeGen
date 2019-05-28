class Generation {
  /**
   * Constructor
   * @constructor
   * @param {number} populationSize       Number of agents
   * @param {number} selectionPerCentage  Per centage of agents selected at each mutaiton
   * @param {number} stepSizeParameter    Step size to apply to the mutation
   * @param {number} mutationProb         Probability of mutation
   * @param {number} constants            Factor of the QFit function
   */
  constructor(
    populationSize,
    selectionPerCentage,
    stepSizeParameter,
    mutationProb,
    constants
  ) {
    this.populationSize = populationSize;
    this.selectionPerCentage = selectionPerCentage;
    this.stepSizeParameter = stepSizeParameter;
    this.mutationProb = mutationProb;
    this.bestScore = 0;
    this.id = 0;
    this.constants = constants;
  }

  /**
   * Calculate the Qfit value of an agent. The formula can be
   * changed by the class's attibut nammed cosntants
   * @param agent     Agent to evaluate
   * @param maxScore  Maximum score of the generation
   * @param tickMax   Maximum tick of the generation
   */
  calculateQfit(agent, maxScore, tickMax) {

    //console.log(agent,maxScore,tickMax)
    return (
      (this.constants[0] * agent.getScore()) / maxScore +
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
   * @param {offspringA}
   * @param {offspringB}
   * @param {type}
   */
  crossOver(agentA, agentB, offspringA, offspringB, type = "patch") {
    var clone = offspringA.nn.clone();
    offspringA.nn.dispose();
    offspringA.nn = clone;

    var clone = offspringB.nn.clone();
    offspringB.nn.dispose();
    offspringB.nn = clone;

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
      offspringA.nn.input_weights = tf.tensor(tmp);

      // Same for offspringB
      var tmp = agentB_clone.input_weights.arraySync();

      var weights = agentA_clone.input_weights.arraySync();
      tmp[i] = weights[i].splice(0);
      offspringB.nn.input_weights = tf.tensor(tmp);


      // Same for output weights
      var i =
        Math.floor(Math.random() * (agentA_clone.output_weights.shape[0] - 1)) +
        0;

      var tmp = agentA_clone.output_weights.arraySync();
      tmp[i] = agentB_clone.output_weights.arraySync()[i].splice(0);

      offspringA.nn.output_weights = tf.tensor(tmp);

      // Same for offspringB
      var tmp = agentB_clone.output_weights.arraySync();
      tmp[i] = agentA_clone.output_weights.arraySync()[i].splice(0);

      offspringB.nn.output_weights = tf.tensor(tmp);
    }
    // TODO: finish this case
    else if (type == "column") {
      // Random column index is generated
      var j =
        Math.floor(Math.random() * (agentA_clone.input_weights.shape[1] - 1)) +
        0;

      // return an array [x,y,z] representing the selected column
      var col = two_d.map(function (value, index) {
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

      // Temps used for offspingA
      var tmpA_offA = agentA_clone.input_weights.arraySync();
      var tmpB_offA = agentB_clone.input_weights.arraySync();

      // Temps used for offspingB
      var tmpA_offB = agentA_clone.input_weights.arraySync();
      var tmpB_offB = agentB_clone.input_weights.arraySync();

      // Replace only patch values in agentA copy.
      for (var i = i_start; i < i_start + height; i++) {
        for (var j = j_start; j < j_start + width; j++) {
          tmpA_offA[i][j] = tmpB_offA[i][j];
          tmpB_offB[i][j] = tmpA_offB[i][j];
        }
      }

      offspringA.nn.input_weights = tf.tensor(tmpA_offA);
      offspringB.nn.input_weights = tf.tensor(tmpB_offB);

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

      // Temps used for offspingA
      var tmpA_offA = agentA_clone.output_weights.arraySync();
      var tmpB_offA = agentB_clone.output_weights.arraySync();

      // Temps used for offspingB
      var tmpA_offB = agentA_clone.output_weights.arraySync();
      var tmpB_offB = agentB_clone.output_weights.arraySync();

      for (var i = i_start; i < i_start + height; i++) {
        for (var j = j_start; j < j_start + width; j++) {
          tmpA_offA[i][j] = tmpB_offA[i][j];
          tmpB_offB[i][j] = tmpA_offB[i][j];
        }
      }
      offspringA.nn.output_weights = tf.tensor(tmpA_offA);
      offspringB.nn.output_weights = tf.tensor(tmpB_offB);
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
   * @param   mu    x offset
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
    var agentsArray = agents.sort(function (a, b) {
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

    // Selected agents are unchanged
    for (var i = 0; i < (selectedAgents.length); i++) {
      agents[i] = selectedAgents[i];
    }

    /* i goes only to length/2 because we breed 2 offspring
    each time */
    // Breeding == crossover and then mutate
    for (var i = selectedAgents.length; i < (agents.length / 2); i++) {
      // Shuffle array
      const shuffled = selectedAgents.sort(() => 0.5 - Math.random());

      // Get sub-array of first n elements after shuffled
      let selected = shuffled.slice(0, 2);

      /* Crossover == create a children from two randoms parents 
        from the selectedAgents */
      this.crossOver(selected[0], selected[1], agents[i], agents[i + (agents.length / 2)], "patch");

      // Mutate the newly breed agents
      this.mutate(agents[i]);
      this.mutate(agents[i + (agents.length / 2)]);
    }

    return agents;
  }
}
