
// RUN TESTS WHEN LAUNCHING
console.log("[INFO] Testing started..");

console.log(">>> Test calculateLinesOfSight");
console.assert(JSON.stringify(test_calculateLineOfSight(10, [5,5], "up")) === JSON.stringify([0.5, 0.5, 0.4]), {error:"[ERROR] Calculated LOS don't correspond"});
console.assert(JSON.stringify(test_calculateLineOfSight(10, [5,5], "left")) === JSON.stringify([0.4, 0.5, 0.5]), {error:"[ERROR] Calculated LOS don't correspond"});

console.log(">>> Test calculateLinesOfSight");
// TODO
console.assert(JSON.stringify(calculateConesOfSight(10, [5,5], "up", [0, 5])) === JSON.stringify([0.4, 0.5, 0.5]), {error:"[ERROR] Calculated COS don't correspond"});

console.log("[INFO] Testing done!");

/* CONES OF SIGHT TEST */
function test_calculateLineOfSight(gridSize, snakePos, snakeOrientation){
    var game = new Game(gridSize, gridSize, null, null, null, 1, 1, "df", false);
    game.snakes[0].pos = snakePos;
    game.snakes[0].orientation = snakeOrientation;

    return game.calculateLinesOfSight();
}

/* LINES OF SIGHT TEST */
function test_calculateConesOfSight(gridSize, snakePos, snakeOrientation, fruitPos){
    var game = new Game(gridSize, gridSize, null, null, null, 1, 1, "df", false);
    game.snakes[0].pos = snakePos;
    game.snakes[0].orientation = snakeOrientation;

    game.fruits[0].pos = fruitPos;

    console.log(game.calculateConesOfSight());

    return game.calculateConesOfSight();
}

