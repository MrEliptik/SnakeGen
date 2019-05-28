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

console.assert(test_crossOver("patch") == true, { error: "[ERROR] Sum of the offsprings doesn't equal sum of parents" });
console.assert(test_crossOver("row") == true, { error: "[ERROR] Sum of the offsprings doesn't equal sum of parents" });

console.log("[INFO] Testing done!");

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