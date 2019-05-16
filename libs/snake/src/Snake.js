class Snake extends Component{
    constructor( pos, color, sprite){
        super( pos, color, sprite);
        this.length = 1;
        this.tail = [];
        this.orientation = "up";
    }

    getOrientation(){
      return this.orientation;
    }

    getTail(){
      return this.tail;
    }

    // Return true if the movement is possible
    // a movement is possible if the new pos is not the pos of the first
    // element of the tail
    move( direction){
      var newPos = [0,0];

      if( direction == "up") {
        newPos = [this.pos[0], this.pos[1]-1];
        this.orientation = "up";
      }else if( direction == "left"){
        newPos = [this.pos[0]-1, this.pos[1]];
        this.orientation = "left";
      }else if( direction == "right"){
        newPos = [this.pos[0]+1, this.pos[1]];
        this.orientation = "right";
      }else if( direction == "down"){
        newPos = [this.pos[0], this.pos[1]+1];
        this.orientation = "down";
      }else{
        return false;
      }

      // Check if the snake can moove in this position
      var impossiblePos = this.tail[0];
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

    // Increase the length of the snake
    grow(){
      this.length++;
      this.tail.push(this.pos);
    }

    // Return true if the position given in parameter is one element of
    // the tail array
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
