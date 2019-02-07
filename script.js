// Include the module from lib/snake
var lib = require('./libs/snake/src/Game.js');

var canvas = document.getElementById("canvas");
var game = new lib.Game( 12, 12, 100, 600, 600, canvas.getContext("2d"), 1, 1, 1)

// test
game.drawGrid()
