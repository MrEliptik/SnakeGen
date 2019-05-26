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
  JSON.stringify(test_calculateQfit(15, 15, 54, 54, [1, 0,5])) !=
    JSON.stringify(2),
  { error: "[ERROR] Matrices are the same" }
);
console.assert(
    JSON.stringify(test_calculateQfit(2, 15, 42, 54, [1, 0,5])) !=
      JSON.stringify(2/15+0.5*42/54),
    { error: "[ERROR] Matrices are the same" }
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
  var gen = new Generation(100, 10, 0.5, 1, [1, 0,5]);

  gen.matrixMutation(copy, mutationIntensity, mutationProb);

  return copy;
}

/**
 * @brief   QFIT TEST 
 * @details CalculateQfit function's unit test based on the creation
 * of a Generation object. Also, an Agent object, that has its attibutes
 * modified, is used to simulate the agent to analyse.
 */
function test_calculateQfit(score, maxScore, tick, tickMax) {
  var agent = new Agent(1, 1, null, null, null, 1, 1, "df", false, 1, 10, 10, 10);

  var generation = new Generation(0, 10, 5, 10, [1, 0,5]);

  agent.game.score = score;
  agent.game.tickAlive = tick;

  ret = generation.calculateQfit(agent, maxScore, tickMax);

  console.log(ret)

  return ret;
}
