// RUN TESTS WHEN LAUNCHING
console.log("[INFO] Testing generation started..");

console.log(">>> Test gaussianDistribution");
// Variance test
console.assert(test_gaussianDistribution(
  [
    [0, 0, 0.16],
    [0, 0, 0.2],
    [0, 0, 1],
    [0, 0, 5],
    [0, 0, 100]
  ],
  [0.997355701,
  0.892062058,
  0.398942280,
  0.178412412,
  0.039894228]
), { error: "[Variance tests]" });
// X test
console.assert(test_gaussianDistribution(
  [
    [0.005, 0, 0.16],
    [0.004, 0, 0.2],
    [-2.5, 0, 1],
    [-4.45, 0, 5],
    [15793, 0, 100]
  ],
  [0.997277786,
  0.892026376,
  0.017528300,
  0.024627108,
  0]
), { error: "[X tests]" });
// X test
console.assert(test_gaussianDistribution(
  [
    [0, 0, 5],
    [0, 0.01, 5],
    [10, 10, 5],
    [8.5, 5, 5],
    [-2.4, 5, 5]
  ],
  [0.178412412,
  0.178410628,
  0.178412412,
  0.052410020,
  0.000746842]
), { error: "[mu tests]" });

console.log(">>> Test matrixMutation");

console.assert(
  JSON.stringify(test_matrixMutation([[1, 2], [3, 4]], 0.5, 1)) !=
  JSON.stringify([[1, 2], [3, 4]]),
  { error: "[ERROR] Matrices are the same" }
);
console.assert(
  JSON.stringify(test_matrixMutation([[1, 2], [3, 4]], 0.5, 0)) ===
  JSON.stringify([[1, 2], [3, 4]]),
  { error: "[ERROR] Matrices are the same" }
);

console.log(">>> Test calculateQfit");

console.assert(
  JSON.stringify(test_calculateQfit([15], 15, [54], 54, [1, 0, 5])) ===
    JSON.stringify(1),
  { error: "[ERROR] Calculated Qfit don't correspond" }
);
console.assert(
  JSON.stringify(test_calculateQfit([2], 15, [42], 54, [1, 0.5])) ===
    JSON.stringify(2 / 15 + 0.5 * (42 / 54)),
  { error: "[ERROR] Calculated Qfit don't correspond" }
);

console.log(">>> Test calculateQfit with mean calculation");

console.assert(
  JSON.stringify(test_calculateQfit([15, 15], 15, [54, 54], 54, [1, 0, 5])) ===
    JSON.stringify(1),
  { error: "[ERROR] Calculated Qfit don't correspond" }
);
console.assert(
  JSON.stringify(
    test_calculateQfit([2, 5, 9], 15, [42, 7, 1], 54, [1, 0.5])
  ) ===
    JSON.stringify((2 + 5 + 9) / (15 * 3) + 0.5 * ((42 + 7 + 1) / (54 * 3))),
  { error: "[ERROR] Calculated Qfit don't correspond" }
);

console.log(">>> Integration test calculateQfit (4 tests)");

console.assert(
  JSON.stringify(
    integrationTest_calculateQfit(
      10,
      [5, 5],
      [["left", "up", "up"]],
      [5, 0],
      10,
      10,
      1,
      [1, 0.5]
    )
  ) === JSON.stringify(0 / 10 + 0.5 * (2 / 10)),
  { error: "[ERROR] Calculated Qfit (x1) don't correspond" }
);
console.assert(
  JSON.stringify(
    integrationTest_calculateQfit(
      10,
      [5, 5],
      [["up", "up", "up", "up", "up", "up", "up"]],
      [5, 0],
      10,
      10,
      1,
      [1, 0.5]
    )
  ) === JSON.stringify(1 / 10 + 0.5 * (5 / 10)),
  { error: "[ERROR] Calculated Qfit (x2) don't correspond" }
);
console.assert(
  JSON.stringify(
    integrationTest_calculateQfit(
      10,
      [5, 5],
      [
        [
          "up",
          "up",
          "up",
          "up",
          "up",
          "up",
          "right",
          "right",
          "left",
          "up",
          "up",
          "up"
        ]
      ],
      [5, 0],
      2,
      15,
      1,
      [1, 0.2]
    )
  ) === JSON.stringify(1 / 2 + 0.2 * (10 / 15)),
  { error: "[ERROR] Calculated Qfit (x3) don't correspond" }
);
console.assert(
  JSON.stringify(
    integrationTest_calculateQfit(
      10,
      [5, 5],
      [
        ["left", "up", "up"],
        ["up", "up", "up", "up", "up", "up", "up"],
        [
          "up",
          "up",
          "up",
          "up",
          "up",
          "up",
          "right",
          "right",
          "left",
          "up",
          "up",
          "up"
        ]
      ],
      [5, 0],
      2,
      15,
      3,
      [1, 0.2]
    )
  ) === JSON.stringify((1 + 1) / (2 * 3) + 0.2 * ((10 + 5 + 2) / (3 * 15))),
  { error: "[ERROR] Calculated Qfit (x4) don't correspond" }
);

console.log(">>> Test roulette selection");
console.assert(JSON.stringify(test_rouletteSelection(10, 4, 10000000.0)) === JSON.stringify([0.3, 0.27, 0.23, 0.2]),
  { error: "[ERROR] Observed probabilities don't match expectations" }
);
// Nb run increased because more agents are selected
console.assert(JSON.stringify(test_rouletteSelection(50, 6, 100000000.0)) === JSON.stringify([0.18, 0.17, 0.17, 0.16, 0.16, 0.16]),
  { error: "[ERROR] Observed probabilities don't match expectations" }
);

console.log("[INFO] Testing generation done!");
console.log("")

/* MUTATION TEST */
function test_mutation() { }

/* CROSSOVER TEST */
function test_crossOver() { }

/* SELECTION TEST */
function test_selection() { }

/* MATRIX MUTATION TEST */
function test_matrixMutation(matrix, mutationIntensity, mutationProb) {
  var copy = [...matrix];
  var gen = new Generation(100, 10, 0.5, 1, [1, 0, 5]);

  gen.matrixMutation(copy, mutationIntensity, mutationProb);

  return copy;
}

function test_rouletteSelection(nb_agents, nb_selected, nb_run) {
  const NB_OF_RUN = nb_run;
  const NB_SELECTION = nb_selected;
  var generation = new Generation(0, 10, 5, 10, [1, 0, 5]);
  var agents = [];

  // Dictionnary to count score occurence in roulette sel
  var score_occurences = {};

  /* Array of observed probabilites after the 
    NB_OF_RUN of slection */
  var observedProbabilities = [];

  // Create 10 agents and assign scores from 0 to 10
  for (var i = 0; i < nb_agents; i++) {
    agents.push(new Agent(10, 10, null, null, null, 1, 1, "df", false, 1, 11, 100, 3, null));
    agents[i].game.score = i;
  }

  // sort descending order
  var agentsSorted = agents.sort(function (a, b) {
    return (
      b.getScore() -
      a.getScore()
    );
  });

  // Select NB_SELECTION parents
  var selectedAgents = agentsSorted.slice(0, NB_SELECTION);

  /* Create a dictionnary with their score as keys,
    to count occurence */
  selectedAgents.forEach(selectedAgent => {
    score_occurences[selectedAgent.getScore()] = 0;
  });

  // Run a lot of rouletteSelection to see if proportion are right
  for (var i = 0; i < NB_OF_RUN; i++) {
    score_occurences[generation.rouletteSelection(selectedAgents).getScore()] += 1;
  }

  /* Used to calculate expected probabilities */
  
  var expectedProbabilites = [];

  var fitnessSum = 0;
  selectedAgents.forEach(agent => {
    fitnessSum += agent.getScore();
  });

  selectedAgents.forEach(a => {
    expectedProbabilites.push(Math.round(a.getScore() / fitnessSum * 100.0) / 100.0);
  });
  

  /* Go thourgh the dictionary, calculate probabilites by divinding 
  by NB_OF_RUN and round the result */
  for (const [key, value] of Object.entries(score_occurences)) {
    observedProbabilities.push(Math.round((value / NB_OF_RUN) * 100.0) / 100.0);
  }
  // Sort descending
  observedProbabilities.sort(function (a, b) { return b - a });

  console.log(expectedProbabilites, observedProbabilities)
  return observedProbabilities;
}

/**
 * @brief   QFIT TEST
 * @details CalculateQfit function's unit test based on the creation
 * of a Generation object. Also, an Agent object, that has its attibutes
 * modified, is used to simulate the agent to analyse.
 */
function test_calculateQfit(score, maxScore, tick, tickMax, constants) {
  var agent = new Agent(
    1,
    1,
    null,
    null,
    null,
    1,
    1,
    "df",
    false,
    1,
    10,
    10,
    10
  );

  var generation = new Generation(0, 10, 5, 10, constants);

  agent.statsScore = score;
  agent.statsTickAlive = tick;

  ret = generation.calculateQfit(agent, maxScore, tickMax);

  //console.log(ret);

  return ret;
}

/**
 * @brief   QFIT INTEGRATION TEST
 * @details CalculateQfit function's unit test based on the creation
 * of a Generation object. An Agent object, that will simulate a game.
 * At the end of the simulation the function is tested.
 *
 * @param gridSize          Game's grid size (square)
 * @param snakePos          First position of the snake
 * @param snakeOrientations Path of the snake to simulate. It is
 * an array of direction (Ex:["up",right",...])
 * @param fruitPos          Position of the fruit
 * @param maxScore          Simulate the highest score of the generation
 * @param tickMax           Simulate the tickOut value
 * @param constants         Qfit function factors
 */
function integrationTest_calculateQfit(
  gridSize,
  snakePos,
  snakeOrientations,
  fruitPos,
  maxScore,
  tickMax,
  attemptMax,
  constants
) {
  var agent = new Agent(
    gridSize,
    gridSize,
    null,
    null,
    null,
    1,
    1,
    "df",
    false,
    1,
    10,
    10,
    10
  );

  var generation = new Generation(0, 10, 5, 10, constants);

  agent.game.snakes[0].length = 8;

  for (var j = 0; j < attemptMax; j++) {
    //console.log("j : " + j);

    // Game creation and Tail placement
    agent.game.snakes[0].tail = [];
    agent.game.snakes[0].tail.push([9, 5]);
    agent.game.snakes[0].tail.push([8, 5]);
    agent.game.snakes[0].tail.push([8, 6]);
    agent.game.snakes[0].tail.push([7, 6]);
    agent.game.snakes[0].tail.push([7, 7]);
    agent.game.snakes[0].tail.push([7, 8]);
    agent.game.snakes[0].tail.push([7, 9]);

    agent.isAlive = true;

    agent.game.snakes[0].pos = snakePos;
    agent.game.snakes[0].orientation = snakeOrientations[j][0];
    agent.game.fruits[0].pos = fruitPos;
    agent.tickAlive = 0;
    agent.game.score = 0;

    for (var i = 0; i < tickMax; i++) {
      if (i + 1 >= snakeOrientations[j].length) {
        break;
      }

      if (agent.isAlive) {
        // step
        var ret = agent.game.update(snakeOrientations[j][i + 1], true);
        //console.log("pos :" + agent.game.snakes[0].pos);
      }

      //console.log(ret);
      if (ret == false) {
        agent.isAlive = false;
        break;
      } else {
        agent.tickAlive++;
      }
    }

    //console.log(agent.game.score, agent.tickAlive);
    agent.storeStats();
  }

  ret = generation.calculateQfit(agent, maxScore, tickMax);

  //console.log(ret);

  return ret;
}

/* The idea behind this test is that when we do the
  crossover we take part of parent A and parent B. 
  The two offspring take a different part of A and B,
  thus if we sum them, we should find the sum of the
  parents */
function test_crossOver(type) {
  var generation = new Generation(0, 10, 5, 10, [1, 0.2]);
  var agents = [];

  for (var i = 0; i < 4; i++) {
    agents.push(new Agent(10, 10, null, null, null, 1, 1, "df", false, 1, 11, 100, 3));
  }

  generation.crossOver(agents[0], agents[1], agents[2], agents[3], type);

  var res1 = add2dArrays(agents[2].nn.input_weights.arraySync(), agents[3].nn.input_weights.arraySync());
  var res2 = add2dArrays(agents[0].nn.input_weights.arraySync(), agents[1].nn.input_weights.arraySync());

  //console.log(JSON.stringify(res1) === JSON.stringify(res2));
  
  // Assumes both arrays are same size
  function add2dArrays(arr1, arr2) {
    var res = Array.from(Array(arr1.length), _ =>
      Array(arr1[0].length).fill(0)
    );
    for (var i = 0; i < arr1.length; i++) {
      var col = arr1[i].length;
      for (var j = 0; j < col; j++) {
        res[i][j] = arr1[i][j] + arr2[i][j];
      }
    }
    return res;
  }

  return JSON.stringify(res1) === JSON.stringify(res2);
}

/* GAUSSIAN DISTRIBUTION TEST */
function test_gaussianDistribution(parameters, results) {
  
  // Object creation
  var generation = new Generation(0, 10, 5, 10, [1, 0.2]);

  for(var i = 0; i < parameters.length; i++) {
    
    var value = Math.round(generation.gaussianDistribution(
      parameters[i][0],
      parameters[i][1],
      parameters[i][2]) * 1000000000) / 1000000000

    //console.log(value);

    if(results[i] != value ) {
      return false;
    }
  }

  return true;
}