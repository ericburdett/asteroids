/****************************************************************************
 * Ship Object
 ***************************************************************************/

function Ship(ctx, x, y) {
    this.ctx = ctx;
    this.pos = new Point(x, y);
    this.angle = 0;
    this.vec = new Vector(0, 0);
    this.bLiving = true;
}

/***************************************************************************
 * prototype functions
 ***************************************************************************/
Ship.prototype = {

  constructor: Ship,

  setPosition: function(x, y) {
    this.pos.x = x;
    this.pos.y = y;
  },

  getPosition: function() {
    return this.pos;
  },

  setDead: function() {
    return this.bLiving;
  },

  setLiving: function() {
    this.bLiving = true;
  },

  rotation: function(angle) {
    this.angle = angle;
  },

  turnRight: function(inc = 12) {
    this.angle += inc;
  },

  turnLeft: function(inc = 12) {
    this.angle -= inc;
  },

  thrust: function() {
    var newVec = new Vector(0, 0);
    newVec.setVelocity(this.angle - 90, 0.5);
    this.vec.addVector(newVec);
  },

  stop: function() {
    this.vec.clear();
  },

  getAngle: function() {
    return this.angle;
  },

  getX: function() {
    return this.pos.getX();
  },

  getY: function() {
    return this.pos.getY();
  },

  getSpeed: function() {
    return this.vec.getMag();
  },

  advance: function() {
    if (!this.bLiving) {
      return;
    }

    this.pos.x = this.pos.x + this.vec.dx;
    this.pos.y = this.pos.y + this.vec.dy;

    if (this.pos.x > gameBoardMax)
      this.pos.x -= canvasWidth;
    if (this.pos.x < gameBoardMin)
      this.pos.x += canvasWidth;
    if (this.pos.y > gameBoardMax)
      this.pos.y -= canvasWidth;
    if (this.pos.y < gameBoardMin)
      this.pos.y += canvasWidth;

  },

  // Display the ship at the current position and rotation
  draw: function() {

    // Create the points for the ship pointing up
    var points = [];
    points.push(new Point(0, -6));
    points.push(new Point(6, 6));
    points.push(new Point(2, 3));
    points.push(new Point(-2, 3));
    points.push(new Point(-6, 6));
    points.push(new Point(0, -6));

    var mat = new Matrix();
    mat.rotate(this.angle);
    mat.translate(this.pos.getX(),this.pos.getY());
    this.ctx.drawLines(mat,points);
  },

  log: function (title) {
    if (title != null) {
      console.log('Ship: ' + title + ' - ' + this.pos.x + ', ' + this.pos.y);
    } else {
      console.log('Ship: ' + this.pos.x + ', ' + this.pos.y);
    }
  }

};
