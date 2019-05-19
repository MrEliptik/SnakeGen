// Mother class of Snake and Fruit
class Component {
    constructor( pos, color, sprite) {
        this.pos    = pos;
        this.color  = color;
        this.sprite = sprite;
    }

    getPosition() {
      return this.pos;
    }
};
