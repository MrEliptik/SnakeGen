// Include the module from lib/snake
var lib = require('./Component.js');

class Fruit extends lib.Component{
    constructor( pos, color, sprite){
        super( pos, color, sprite);
    }
};

// Exportation of the class Fruit
module.exports = {
  Fruit: Fruit
};
