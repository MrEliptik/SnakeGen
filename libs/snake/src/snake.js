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

      // Check if the snake can moove in this position
      var impossiblePos = this.tail[0];
      console.log(newPos + " VS " + impossiblePos);
      if( this.length<2 || (this.length>1 && (impossiblePos[0] != newPos[0] || impossiblePos[1] != newPos[1]))){

        // Update the tail
        if( this.length > 1){
          for(var i=this.length-2; i > 0; i--){
            //Propagate the draw along the tail
            this.tail[i] = this.tail[i-1];
          }
          this.tail[0] = this.pos;
        }
        this.pos = newPos;
        return true;
      }

      return false;
    }

    grow(){
      this.length++;
      this.tail.push(this.pos);
    }

    isOnTail( posToTest){
      for( var x=0; x < this.length-1; x++){
        var posToCheck = this.tail[x];
        if( posToTest[0] == posToCheck[0] && posToTest[1] == posToCheck[1]){
          return true;
        }
      }
      return false;
    }
};

// Exportation of the class Fruit
module.exports = {
  Snake: Snake
};
