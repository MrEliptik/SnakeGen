// RUN TESTS WHEN LAUNCHING
console.log("[INFO] Testing started..");

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

console.log("[INFO] Testing done!");

/* MUTATION TEST */
function test_mutation() {}

/* CROSSOVER TEST */
function test_crossOver() {}

/* SELECTION TEST */
function test_selection() {}

/* GAUSSIAN PERTURBATION TEST */
function test_gaussianPerturbation() {}

/* MATRIX MUTATION TEST */
function test_matrixMutation(matrix, mutationIntensity, mutationProb) {
  var copy = [...matrix];
  var gen = new Generation(100, 10, 0.5, 1, [1, 0, 5]);

  gen.matrixMutation(copy, mutationIntensity, mutationProb);

  return copy;
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
