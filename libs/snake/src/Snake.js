class Snake extends Component {
  constructor(pos, color, sprite) {
    super(pos, color, sprite);
    this.length = 1;
    this.tail = [];
    this.orientation = "up";
  }

  getOrientation() {
    return this.orientation;
  }

  getTail() {
    return this.tail;
  }

  // Return true if the movement is possible
  // a movement is possible if the new pos is not the pos of the first
  // element of the tail
  move(direction) {
    var newPos = [0, 0];
    var newOrientation;

    if (direction == "up") {
      newPos = [this.pos[0], this.pos[1] - 1];
      newOrientation = "up";
    } else if (direction == "left") {
      newPos = [this.pos[0] - 1, this.pos[1]];
      newOrientation = "left";
    } else if (direction == "right") {
      newPos = [this.pos[0] + 1, this.pos[1]];
      newOrientation = "right";
    } else if (direction == "down") {
      newPos = [this.pos[0], this.pos[1] + 1];
      newOrientation = "down";
    } else {
      return false;
    }

    // Check if the snake can moove in this position
    if (this.length >= 2) {
      var impossiblePos = this.tail[0];
      if (impossiblePos[0] != newPos[0] || impossiblePos[1] != newPos[1])
      {
        // Update the tail
        for (var i = this.length - 2; i > 0; i--) {
          //Propagate the new positions along the tail
          this.tail[i] = this.tail[i - 1];
        }
        this.tail[0] = this.pos;
      } else {
        return false;
      }
    }

    // Update snake before living the function
    this.pos = newPos;
    this.orientation = newOrientation;
    return true;
  }

  // Increase the length of the snake
  grow() {
    this.length++;
    this.tail.push(this.pos);
  }

  // Return true if the position given in parameter is one element of
  // the tail array
  isOnTail(posToTest) {
    for (var x = 0; x < this.length - 1; x++) {
      var posToCheck = this.tail[x];
      if (posToTest[0] == posToCheck[0] && posToTest[1] == posToCheck[1]) {
        return true;
      }
    }
    return false;
  }
}
