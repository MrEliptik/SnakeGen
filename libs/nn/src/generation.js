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
   * Apply the Stochastic mutation policy to an Agent object
   * @param   agent   Agent to mutate
   */
  mutate(agent) {
    
    var mutationSSP = gaussianPertubation(0, this.stepSizeParameter);
    agent.mutationIntensity += gaussianPertubation(0, mutationSSP);

    // Weight matrix W1 mutation
    matrixMutation(agent.nn.input_weights, 
      agent.mutationIntensity, 
      this.mutationProb)

    // Weight matrix W2 mutation
    matrixMutation(agent.nn.output_weights, 
      agent.mutationIntensity, 
      this.mutationProb)
  }

  /**
   * Mutates the weight matrix using the Stochastic
   * mutation policy
   * @param   matrix            Weight matrix
   * @param   mutationIntensity Mutation intensity to apply
   * @param   mutationProb      Probability to apply the mutation
   */
  matrixMutation(matrix, mutationIntensity, mutationProb) {
    
    for(var i=0; i<matrix.length; i++) {
      for(var j=0; j<matrix[0].length; j++) {
        if(Math.random() <= mutationProb) {
          matrix[i][j] += gaussianPertubation(0, mutationIntensity)
        }
      }
    }
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
   * Return an array of selected agents from the list
   * @param   agents  Array of agents that we have to divide
   * @returns Agents selected
   */
  selection(agents) {
    
    // Select the number of agents to select
    var numberOfAgents = Math.round(this.populationSize * this.selectionPerCentage)
    
    // Sort the agents by using their score
    var agentsArray = agents.sort(function(a,b) {
      return a.getScore() - b.getScore();
    });

    // Selection
    var agentsToSelect = [];
    for(var i=0; i<numberOfAgents; i++) {
      agentsToSelect.push(agentsArray[i])
    }
    
    return agentsToSelect;
  }

  createNextGen(agents){
    var newAgents = agents;

    // increment gen ID
    this.id++;

    //TODO

    return newAgents;
  }
}
