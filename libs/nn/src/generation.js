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
  crossOver(AgentA, AgentB, type="patch") {
    var newAgent;

    if(type == "row"){
      // Random row index is generated
      var i = Math.floor(Math.random() * AgentA.nn.input_weights.length) + 1; 

      // Agent takes all rows of AgentA but not the i-th,
      // that is taken from AgentB
      // Deepcopy to ensure no reference and modification of the parents
      newAgent.nn.input_weights = Array.from(AgentA.nn.input_weights[i]) = Array.from(AgentB.nn.input_weights)[i].splice(0);

      // Same for output weights
      var i = Math.floor(Math.random() * AgentA.nn.input_weights.length) + 1;
      newAgent.nn.output_weights = Array.from(AgentA.nn.output_weights[i]) = Array.from(AgentB.nn.output_weights)[i].splice(0);
    }
    // TODO: finish this case
    else if(type == "column"){
      // Random column index is generated
      var j = Math.floor(Math.random() * AgentA.nn.input_weights[0].length) + 1

      // return an array [x,y,z] representing the selected column
      var col = two_d.map(function(value,index) { return value[j]; });
    }
    else if(type == "patch"){
      // starting coordinates
      var i_start = Math.floor(Math.random() * AgentA.nn.input_weights.length) + 1;
      var j_start = Math.floor(Math.random() * AgentA.nn.input_weights[0].length) + 1
      // dimensions of the patch
      var height = Math.floor(Math.random() * AgentA.nn.input_weights.length) + 1;
      var width = Math.floor(Math.random() * AgentA.nn.input_weights[0].length) + 1

      var tmp = Array.from(AgentA.nn.input_weights);
      for(var i = i_start; i < i_start + height; i++){
        col = AgentA.nn.input_weights.length[i];
        for(var j = j_start; i < j_start + width; j++){
          tmp[i][j] = AgentB.nn.input_weights[i][j];
        }
      }

      newAgent.nn.input_weights = Array.from(tmp);

      // Same for output weights
      var i_start = Math.floor(Math.random() * AgentA.nn.output_weights.length) + 1;
      var j_start = Math.floor(Math.random() * AgentA.nn.output_weights[0].length) + 1
      // dimensions of the patch
      var height = Math.floor(Math.random() * AgentA.nn.output_weights.length) + 1;
      var width = Math.floor(Math.random() * AgentA.nn.output_weights[0].length) + 1

      var tmp = Array.from(AgentA.nn.output_weights);
      for(var i = i_start; i < i_start + height; i++){
        col = AgentA.nn.output_weights.length[i];
        for(var j = j_start; i < j_start + width; j++){
          tmp[i][j] = AgentB.nn.output_weights[i][j];
        }
      }
      newAgent.nn.output_weights = Array.from(tmp);

    }

    return newAgent;
  }

  /**
   * Apply the Stochastic mutation policy to an Agent object
   * @param   agent   Agent to mutate
   */
  mutate(agent) {
    
    var mutationSSP = this.gaussianPertubation(0, this.stepSizeParameter);
    agent.mutationIntensity += this.gaussianPertubation(0, mutationSSP);

    // Weight matrix W1 mutation
    this.matrixMutation(agent.nn.input_weights, 
      agent.mutationIntensity, 
      this.mutationProb)

    // Weight matrix W2 mutation
    this.matrixMutation(agent.nn.output_weights, 
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
          matrix[i][j] += this.gaussianPertubation(0, mutationIntensity)
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
    var numberOfAgents = Math.round(this.populationSize * this.selectionPerCentage / 100.0)
    
    // TODELETE
    console.log(
      numberOfAgents
    )

    // Sort the agents by using their score
    var agentsArray = agents.sort(function(a,b) {
      return b.getScore() - a.getScore();
    });

    // Selection
    var agentsToSelect = [];
    for(var i=0; i<numberOfAgents; i++) {
      agentsToSelect.push(agentsArray[i]);
    }
    
    // Deepcopy
    return Array.from(agentsToSelect);
  }

  createNextGen(agents){

    // TODELETE
    agents[4].game.score = 25;
    
    // increment gen ID
    this.id++;

    // Selection
    var selectedAgents = this.selection(agents);
    
    // TODELETE
    console.log(
      "Agents : ", selectedAgents)

    // Breeding == crossover and then mutate
    for(var i = 0; i < agents.length ; i++){
      // Crossover == create a children from two randoms parents
      // from the selectedAgents

      // Shuffle array
      const shuffled = selectedAgents.sort(() => 0.5 - Math.random());

      // Get sub-array of first n elements after shuffled
      let selected = shuffled.slice(0, 2);
      
      // TODO: implement crossOver
      agents[i] = this.crossOver(selected[0], selected[1]);

      // Mutate the newly breed agent
      this.mutate(agents[i]);
    }
    
    return agents;
  }
}
