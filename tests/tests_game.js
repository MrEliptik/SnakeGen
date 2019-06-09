// RUN TESTS WHEN LAUNCHING
console.log("[INFO] Testing game started..");

console.log(">>> Test calculateLinesOfSight");
console.assert(
  JSON.stringify(test_calculateLineOfSight(10, [5, 5], "up")) ===
    JSON.stringify([0.5, 0.5, 0.4]),
  { error: "[ERROR] Calculated LOS don't correspond" }
);
console.assert(
  JSON.stringify(test_calculateLineOfSight(10, [5, 5], "left")) ===
    JSON.stringify([0.4, 0.5, 0.5]),
  { error: "[ERROR] Calculated LOS don't correspond" }
);

console.log(">>> Test calculateConesOfSight");
console.assert(
  JSON.stringify(test_calculateConesOfSight(10, [5, 5], "up", [5, 0])) ===
    JSON.stringify([
      [20 / 59, 0],
      [20 / 59, 1],
      [19 / 59, 1],
      [(14 - 2) / 59, 0]
    ]),
  { error: "[ERROR] Calculated COS don't correspond" }
);
console.assert(
  JSON.stringify(test_calculateConesOfSight(10, [5, 5], "down", [5, 0])) ===
    JSON.stringify([
      [(14 - 5) / 49, 0],
      [(14 - 3) / 49, 0],
      [14 / 49, 0],
      [19 / 49, 0]
    ]),
  { error: "[ERROR] Calculated COS (x2) don't correspond" }
);
console.assert(
  JSON.stringify(test_calculateConesOfSight(10, [5, 5], "left", [5, 0])) ===
    JSON.stringify([[14 / 59, 0], [19 / 59, 0], [20 / 59, 0], [20 / 59, 1]]),
  { error: "[ERROR] Calculated COS (x3) don't correspond" }
);
console.assert(
  JSON.stringify(test_calculateConesOfSight(10, [5, 5], "right", [9, 6])) ===
    JSON.stringify([
      [19 / 49, 0],
      [(14 - 2) / 49, 0],
      [(14 - 5) / 49, 1],
      [(14 - 3) / 49, 0]
    ]),
  { error: "[ERROR] Calculated COS (x4) don't correspond" }
);

console.log(">>> Test calculateEuclideanDistance");
console.assert(test_calculateEuclideanDistance(10, [9, 9], [0, 0]) === 1,
  { error: "[ERROR] Calculated Euclidean distance doesn't match" }
);
console.assert(test_calculateEuclideanDistance(10, [5, 5], [9, 9]) === (Math.hypot(5-9, 5-9)/Math.hypot(9, 9)),
  { error: "[ERROR] Calculated Euclidean distance doesn't match" }
);

console.log("[INFO] Testing game done!");
console.log("");

/* CONES OF SIGHT TEST */
function test_calculateLineOfSight(gridSize, snakePos, snakeOrientation) {
  var game = new Game(gridSize, gridSize, null, null, null, 1, 1, "df", false);
  game.snakes[0].pos = snakePos;
  game.snakes[0].orientation = snakeOrientation;

  return game.calculateLinesOfSight();
}

/* LINES OF SIGHT TEST */
function test_calculateConesOfSight(
  gridSize,
  snakePos,
  snakeOrientation,
  fruitPos
) {
  var game = new Game(gridSize, gridSize, null, null, null, 1, 1, "df", false);
  game.snakes[0].pos = snakePos;
  game.snakes[0].orientation = snakeOrientation;

  game.fruits[0].pos = fruitPos;

  game.snakes[0].tail.push([9, 5]);
  game.snakes[0].tail.push([8, 5]);
  game.snakes[0].tail.push([8, 6]);
  game.snakes[0].tail.push([7, 6]);
  game.snakes[0].tail.push([7, 7]);
  game.snakes[0].tail.push([7, 8]);
  game.snakes[0].tail.push([7, 9]);

  game.snakes[0].length = 8;

  result = game.calculateConesOfSight();

  //console.log(result);

  return result;
}

function test_calculateEuclideanDistance(gridSize, snakePos, fruitPos){
  var game = new Game(gridSize, gridSize, null, null, null, 1, 1, "df", false);
  game.snakes[0].pos = snakePos;

  game.fruits[0].pos = fruitPos;

  result = game.calculateEuclideanDistance(snakePos, fruitPos);

  return result;
}
