
// RUN TESTS WHEN LAUNCHING
console.log("testing started..");
test_calculateLineOfSight();
test_calculateConesOfSight();

/* CONES OF SIGHT TEST */
function test_calculateLineOfSight(){
    var game = new Game(10, 10, null, null, null, 1, 1, "df", false);
    game.snakes[0].pos = [5,5];

    game.fruits[0].pos = [5,0];

    var los = game.calculateLinesOfSight();
    console.log(los);
    console.assert(JSON.stringify(los) == JSON.stringify([5, 5, 4]), {LOS: los, error:"Calculated LOS don't correspond"});
}

/* LINES OF SIGHT TEST */
function test_calculateConesOfSight(){

}

