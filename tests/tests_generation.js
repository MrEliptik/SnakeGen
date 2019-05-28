// RUN TESTS WHEN LAUNCHING
console.log("[INFO] Testing generation started..");

console.log(">>> Test gaussianPerturbation");
// TODO
console.assert(false, { error: "[ERROR] " });
console.assert(false, { error: "[ERROR] " });

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
  JSON.stringify(test_calculateQfit(15, 15, 54, 54, [1, 0, 5])) ===
  JSON.stringify(1),
  { error: "[ERROR] Calculated Qfit don't correspond" }
);
console.assert(
  JSON.stringify(test_calculateQfit(2, 15, 42, 54, [1, 0.5])) ===
  JSON.stringify(2 / 15 + 0.5 * (42 / 54)),
  { error: "[ERROR] Calculated Qfit don't correspond" }
);

console.log(">>> Integration test calculateQfit (3 tests)");

console.assert(
  JSON.stringify(
    integrationTest_calculateQfit(
      10,
      [5, 5],
      ["left", "up", "up"],
      [5, 0],
      10,
      10,
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
      ["up", "up", "up", "up", "up", "up", "up"],
      [5, 0],
      10,
      10,
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
      ],
      [5, 0],
      2,
      15,
      [1, 0.2]
    )
  ) === JSON.stringify(1 / 2 + 0.2 * (10 / 15)),
  { error: "[ERROR] Calculated Qfit (x3) don't correspond" }
);

console.log(">>> Test roulette selection");
console.assert(JSON.stringify(test_rouletteSelection(10, 4, 10000000)) === JSON.stringify([0.3, 0.27, 0.23, 0.2]),
  { error: "[ERROR] Observed probabilities don't match expectations" }
);
// Nb run increased because more agents are selected
console.assert(JSON.stringify(test_rouletteSelection(50, 6, 100000000)) === JSON.stringify([0.18, 0.17, 0.17, 0.16, 0.16, 0.16]),
  { error: "[ERROR] Observed probabilities don't match expectations" }
);

console.log("[INFO] Testing generation done!");
console.log("");

/* MUTATION TEST */
function test_mutation() { }

/* CROSSOVER TEST */
function test_crossOver() { }

/* SELECTION TEST */
function test_selection() { }

/* GAUSSIAN PERTURBATION TEST */
function test_gaussianPerturbation() { }

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
    agents.push(new Agent(10, 10, null, null, null, 1, 1, "df", false, 1, 11, 100, 3));
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
    score_occurences[generation.rouletteSelection(agents, selectedAgents).getScore()] += 1;
  }

  /* Used to calculate expected probabilities */
  /*
  var expectedProbabilites = [];

  var fitnessSum = 0;
  selectedAgents.forEach(agent => {
    fitnessSum += agent.getScore();
  });

  selectedAgents.forEach(a => {
    expectedProbabilites.push(Math.round(a.getScore() / fitnessSum * 100) / 100);
  });
  */

  /* Go thourgh the dictionary, calculate probabilites by divinding 
  by NB_OF_RUN and round the result */
  for (const [key, value] of Object.entries(score_occurences)) {
    observedProbabilities.push(Math.round((value / NB_OF_RUN) * 100) / 100);
  }
  // Sort descending
  observedProbabilities.sort(function (a, b) { return b - a });

  //console.log(expectedProbabilites, observedProbabilities)
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

  agent.game.score = score;
  agent.tickAlive = tick;

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

  // Game creation and Tail placement
  agent.game.snakes[0].pos = snakePos;
  agent.game.snakes[0].orientation = snakeOrientations[0];

  agent.game.fruits[0].pos = fruitPos;

  agent.game.snakes[0].tail.push([9, 5]);
  agent.game.snakes[0].tail.push([8, 5]);
  agent.game.snakes[0].tail.push([8, 6]);
  agent.game.snakes[0].tail.push([7, 6]);
  agent.game.snakes[0].tail.push([7, 7]);
  agent.game.snakes[0].tail.push([7, 8]);
  agent.game.snakes[0].tail.push([7, 9]);

  agent.game.snakes[0].length = 8;

  for (var i = 0; i < tickMax; i++) {
    if (i + 1 >= snakeOrientations.length) {
      break;
    }

    if (agent.isAlive) {
      // step
      var ret = agent.game.update(snakeOrientations[i + 1], true);
      //console.log(agent.game.snakes[0].pos);
    }

    //console.log(ret);
    if (ret === false) {
      agent.isAlive = false;
      break;
    } else {
      agent.tickAlive++;
    }
  }

  ret = generation.calculateQfit(agent, maxScore, tickMax);

  //console.log(ret);

  return ret;
}
