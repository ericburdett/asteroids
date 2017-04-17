/****************************************************************************
 * Rock Object
 ***************************************************************************/

function Rock(ctx, x, y) {
    this.ctx = ctx;
    this.pos = new Point(x, y);
    this.bLiving = true;
    this.angle = 0;
    this.angleIncrease = getRandomInt(-20, 20);
    this.vec = new Vector(getRandomInt(-3, 3), getRandomInt(-3, 3));
    this.scaleFactor = .003;
    this.scaleSize = 1;
}

/***************************************************************************
 * prototype functions
 ***************************************************************************/
Rock.prototype = {

  constructor: Rock,

  rotation: function(angle) {
    this.angle = angle;
  },

  advance: function() {
    if (!this.bLiving) {
      return;
    }

    //If the difficulty is set to Hard, scale the rocks
    if (document.getElementById("difficulty").value == "Hard") {
      if (this.scaleFactor < 2)
        this.scaleSize += this.scaleFactor;
    }
    else {
      this.scaleSize = 1;
    }


    //this.pos.addPoint(this.pos.getX() + this.vec.dx,
      //                this.pos.getY() + this.vec.dy);

    this.pos.x = this.pos.x + this.vec.dx;
    this.pos.y = this.pos.y + this.vec.dy;

    if (this.pos.getX() < gameBoardMin)
      this.pos.x += canvasWidth;
    if (this.pos.getX() > gameBoardMax)
      this.pos.x -= canvasWidth;
    if (this.pos.getY() < gameBoardMin)
      this.pos.y += canvasHeight;
    if (this.pos.getY() > gameBoardMax)
      this.pos.y -= canvasHeight;
  },

  setDead: function() {
    this.bLiving = false;
  },

  isDead: function() {
    return (!this.bLiving);
  },

  // Display the ship at the current position and rotation
  draw: function() {
    // Create the points for the ship pointing up 11
    var points = [];
    points.push(new Point(2, -8));
    points.push(new Point(8, -15));
    points.push(new Point(12, -8));
    points.push(new Point(6, -2));
    points.push(new Point(12, 6));
    points.push(new Point(2, 15));
    points.push(new Point(-6, 15));
    points.push(new Point(-14, 10));
    points.push(new Point(-15, 0));
    points.push(new Point(-4, -15));
    points.push(new Point(2, -8));

    var mat = new Matrix();
    mat.scale(this.scaleSize,this.scaleSize);
    mat.rotate(rotationAngle);
    mat.translate(this.pos.getX(),this.pos.getY());
    ctx.drawLines(mat,points);
  },

  log: function (title) {
    if (title != null) {
      console.log('Ship: ' + title + ' - ' + this.pos.x + ', ' + this.pos.y);
    } else {
      console.log('Ship: ' + this.pos.x + ', ' + this.pos.y);
    }
  }

};
