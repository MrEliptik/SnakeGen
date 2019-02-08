// Include the module from lib/snake
var lib = require('./Component.js');

class Snake extends lib.Component{
    constructor( pos, color, sprite){
        super( pos, color, sprite);
        this.length = 1;
        this.tail = [];
    }

    // Return true if the movement is possible
    // a movement is possible if the new pos is not the pos of the first
    // element of the tail
    move( direction){
      var possible = false;
      var newPos = [0,0];

      if( direction == "up") {
        newPos = [this.pos[0], this.pos[1]-1];
      }else if( direction == "left"){
        newPos = [this.pos[0]-1, this.pos[1]];
      }else if( direction == "right"){
        newPos = [this.pos[0]+1, this.pos[1]];
      }else if( direction == "down"){
        newPos = [this.pos[0], this.pos[1]+1];
      }else{
        return false;
      }

      if( this.length<2 || (this.length>1 && tail[length-2] != newPos)){
        this.pos = newPos;
        console.log(this.pos);
        return true;
      }

      return false;
    }
};

// Exportation of the class Fruit
module.exports = {
  Snake: Snake
};
