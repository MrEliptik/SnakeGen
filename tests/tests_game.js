// RUN TESTS WHEN LAUNCHING
console.log("[INFO] Testing started..");

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

console.log(">>> Test calculateLinesOfSight");
// TODO
console.assert(
  JSON.stringify(test_calculateConesOfSight(10, [5, 5], "up", [5, 0])) ===
    JSON.stringify([0.4, 0.5, 0.5]),
  { error: "[ERROR] Calculated COS don't correspond" }
);
console.assert(
    JSON.stringify(test_calculateConesOfSight(10, [5, 5], "down", [5, 0])) ===
      JSON.stringify([[(14-5)/61,0], [(14-3)/61,0], [14/61,0], [19/61,0]]),
    { error: "[ERROR] Calculated COS (x2) don't correspond" }
  );

console.log(JSON.stringify([[(14-5)/61,0], [(14-3)/61,0], [14/61,0], [19/61,0]]))
console.log("[INFO] Testing done!");

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

  game.snakes[0].tail.push([9,5]);
  game.snakes[0].tail.push([8,5]);
  game.snakes[0].tail.push([8,6]);
  game.snakes[0].tail.push([7,6]);
  game.snakes[0].tail.push([7,7]);
  game.snakes[0].tail.push([7,8]);
  game.snakes[0].tail.push([7,9]);

  console.log(game.snakes[0].tail)

  console.log(game.calculateConesOfSight());

  return game.calculateConesOfSight();
}
