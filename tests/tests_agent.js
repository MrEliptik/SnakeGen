// RUN TESTS WHEN LAUNCHING
console.log("[INFO] Agent testing started..");

console.log(">>> Test getScoreMean");

console.assert(JSON.stringify(test_getScoreMean([4])) == JSON.stringify(4), {
  error: "[ERROR] [4] : The score is not correct"
});
console.assert(
  JSON.stringify(test_getScoreMean([4, 4, 4])) == JSON.stringify(4),
  { error: "[ERROR] [4,4,4] : The score is not correct" }
);
console.assert(
  JSON.stringify(test_getScoreMean([10, 7, 1])) == JSON.stringify(6),
  { error: "[ERROR] [10, 7, 1] : The score is not correct" }
);

console.log(">>> Test getTickAliveMean");

console.assert(JSON.stringify(test_getTickAliveMean([4])) == JSON.stringify(4), {
  error: "[ERROR] [4] : The tick is not correct"
});
console.assert(
  JSON.stringify(test_getTickAliveMean([4, 4, 4])) == JSON.stringify(4),
  { error: "[ERROR] [4,4,4] : The tick is not correct" }
);
console.assert(
  JSON.stringify(test_getTickAliveMean([10, 7, 1])) == JSON.stringify(6),
  { error: "[ERROR] [10, 7, 1] : The tick is not correct" }
);

console.log("[INFO] Testing done!");

/* GET SCORE MEAN TEST */
function test_getScoreMean(score) {
  var agent = new Agent(1, 1, 1, 1, null, 1, 1, "DF", false, 1, 10, 10, 10);

  agent.statsScore = score;
  return agent.getScoreMean();
}

/* GET TICK ALIVE TEST */
function test_getTickAliveMean(ticks) {
    var agent = new Agent(1, 1, 1, 1, null, 1, 1, "DF", false, 1, 10, 10, 10);
  
    agent.statsTickAlive = ticks;
    return agent.getTickAliveMean();
  }
  