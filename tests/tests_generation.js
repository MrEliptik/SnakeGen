
// RUN TESTS WHEN LAUNCHING
console.log("[INFO] Testing started..");

console.log(">>> Test gaussianPerturbation");
// TODO
console.assert(false, {error:"[ERROR] "});
console.assert(false, {error:"[ERROR] "});

console.log(">>> Test matrixMutation");

console.assert(JSON.stringify(test_matrixMutation([[1, 2], [3, 4]], 0.5, 1)) != JSON.stringify([[1, 2], [3, 4]]), {error:"[ERROR] Matrices are the same"});
console.assert(JSON.stringify(test_matrixMutation([[1, 2], [3, 4]], 0.5, 0)) === JSON.stringify([[1, 2], [3, 4]]), {error:"[ERROR] Matrices are the same"});


console.log("[INFO] Testing done!");

/* MUTATION TEST */
function test_mutation(){

}

/* CROSSOVER TEST */
function test_crossOver(){

}

/* SELECTION TEST */
function test_selection(){

}

/* GAUSSIAN PERTURBATION TEST */
function test_gaussianPerturbation(){

}

/* MATRIX MUTATION TEST */
function test_matrixMutation(matrix, mutationIntensity, mutationProb){
    var copy = [...matrix];
    var gen = new Generation(100, 10, 0.5, 1);

    gen.matrixMutation(copy, mutationIntensity, mutationProb);

    return copy;
}