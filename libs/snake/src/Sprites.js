function sprite (options) {

    var that = {};

    that.context = options.context;
    that.sX = options.sX;
    that.sY = options.sY;
    that.sWidth = options.sWidth;
    that.sHeight = options.sHeight;
    that.dX = options.dX;
    that.dY = options.dY;
    that.dWidth = options.dWidth;
    that.dHeight = options.dHeight;

    that.setPos = function ( x, y){
      that.dX = x;
      that.dY = y;
    };

    that.render = function (){

        var coinImage = new Image();
        coinImage.src = "./libs/snake/ressources/sprites.png";
        coinImage.onload=function(){

        // Draw the animation
        that.context.drawImage(
          coinImage,
          that.sX,
          that.sY,
          that.sWidth,
          that.sHeight,
          that.dX,
          that.dY,
          that.dWidth,
          that.dHeight);
        }
    };

    return that;
}

// Exportation of the class Fruit
module.exports = {
  Sprite: sprite
};
