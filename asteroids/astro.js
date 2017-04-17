// Get the canvas object
var canvas = document.getElementById('canvas');

// Create the CS312 drawing context
var ctx = new cs312Context(canvas);

var canvasWidth = canvas.width;
var canvasHeight = canvas.height;

var gameBoardMin = -canvasWidth / 2;
var gameBoardMax = canvasHeight / 2;

console.log("gameBoardMin:" + gameBoardMin);
console.log("gameBoardMax:" + gameBoardMax);

// Game Constants
const kMode_Play      = 1;
const kMode_Init      = 2;
const kMode_Lose      = 3;
const kMode_Win       = 4;

// Game objects
var ship = new Ship(ctx, 0, 0);
var stars = [];
var rocks = [];
var bullets = [];
var gameMode = kMode_Init;
var rotationAngle = 0;

// Variables for handling UI form the user
var keyState = {};
window.addEventListener('keydown', function(e) {
    keyState[e.keyCode || e.which] = true;
  }, true);

window.addEventListener('keyup', function(e) {
    keyState[e.keyCode || e.which] = false;
  }, true);

var startButton = document.getElementById("start");
startButton.addEventListener("click", function(e) {
  gameMode = kMode_Play;
  console.log('start game');
  startButton.blur();
  initGame();
}, false);

var rotateButtonUp = document.getElementById("rotateUp");
rotateButtonUp.addEventListener("click", function(e) {
  gameMode = kMode_Play;
  console.log('Rotate Game Up');
  rotateButtonUp.blur();
  rotationFactor++;
}, false);

var rotateButtonDown = document.getElementById("rotateDown");
rotateButtonDown.addEventListener("click", function(e) {
  gameMode = kMode_Play;
  console.log('Rotate Game Down');
  rotateButtonDown.blur();
  rotationFactor--;
}, false);

/*****************************************************************************
 * initial the game
 ****************************************************************************/
function initGame() {
  ship.setLiving();
  ship.setPosition(0, 0);
  ship.stop();

  // delete any bullets
  bullets = [];

  // create rocks
  rocks = [];
  for (var i = 0; i < 3; i++) {
    rocks.push(new Rock(ctx, -gameBoardMin,
                             getRandomInt(-gameBoardMax, gameBoardMax)));
    rocks.push(new Rock(ctx, gameBoardMin,
                             getRandomInt(-gameBoardMax, gameBoardMax)));
    rocks.push(new Rock(ctx, getRandomInt(-gameBoardMin, gameBoardMin),
                             -gameBoardMax));
    rocks.push(new Rock(ctx, getRandomInt(-gameBoardMin, gameBoardMin),
                             gameBoardMax));
  }

  console.log("rocks: " + rocks.length);

  gameMode = kMode_Play;
  rotationFactor = 0;
  rotationAngle = 0;

  console.log('canvasWidth = ' + canvasWidth);
  console.log('canvasHeight = ' + canvasHeight);

  console.log('gameBoardMin = ' + gameBoardMin);
  console.log('gameBoardMax = ' + gameBoardMax);
}

/*****************************************************************************
 * detect hits between objects
 ****************************************************************************/
function detectHits() {

  if (gameMode != kMode_Play)
    return;

  if (!rocks.length) {
    gameMode = kMode_Win;
    return;
  }

  // See if the ship hit a rock
  for (var j = 0; j < rocks.length; j++) {
    if (!rocks[j].isDead()) {
      var dist = rocks[j].pos.distance(ship.getPosition());

      if (dist < (15 * rocks[j].scaleSize)) {
        rocks[j].setDead();
        ship.setDead();
        gameMode = kMode_Lose;
      }
    }
  }

  // See if a bullet hit a rock
  for (var i = 0; i < bullets.length; i++) {
    if (!bullets[i].isDead()) {
      for (var j = 0; j < rocks.length; j++) {
        if (!rocks[j].isDead()) {
          var dist = bullets[i].pos.distance(rocks[j].pos);
          if (dist < (15 * rocks[j].scaleSize)) {
            bullets[i].setDead();
            //If hit, make rock smaller
            //If rock is already small enough, kill rock
            if (rocks[j].scaleSize < 1.1)
              rocks[j].setDead();
            else
              rocks[j].scaleSize -= .03;
          }
        }
      }
    }
  }
}

/*****************************************************************************
 * Advance all objects in the game and detect hits
 ****************************************************************************/
function cleanUpTheDead() {

  if (gameMode != kMode_Play)
    return;

  // Remove bullets
  for (var i = 0; i < bullets.length; i++) {
    if (bullets[i].isDead()) {
      bullets.splice(i, 1);
    }
  }

  // Remove rocks
  for (var i = 0; i < rocks.length; i++) {
    if (rocks[i].isDead()) {
      rocks.splice(i, 1);
    }
  }
}

/*****************************************************************************
 * Advance all objects in the game and detect hits
 ****************************************************************************/
function advance() {

  // Handle ship
  ship.advance();

  // Move rocks
  for (var i = 0; i < rocks.length; i++) {
    rocks[i].advance();
  }

  // Move bullets
  for (var i = 0; i < bullets.length; i++) {
    bullets[i].advance();
  }

  detectHits();
  cleanUpTheDead();
}

/*****************************************************************************
 * fire a bullet
 ****************************************************************************/
function fireBullet() {
  console.log("Fire!");

  var theBullet = new Bullet(ctx,ship.pos.x,ship.pos.y);
  theBullet.setVelocity(ship.getAngle() - 90, ship.getSpeed() + 5 );
  bullets.push(theBullet);

  theBullet.log();

}

/*****************************************************************************
 * Handle all UI from the user
 ****************************************************************************/
function handleUI() {
  if (keyState[32]) {
    fireBullet();
  }

  if (keyState[37]) {
    ship.turnLeft();
  }

  if (keyState[38]) {
    ship.stop();
  }

  if (keyState[39]) {
    ship.turnRight();
  }

  if (keyState[40]) {
    ship.thrust();
  }
}

/*****************************************************************************
 * Draw all items in the game
 ****************************************************************************/
function drawAll() {

  // color in the background
  ctx.fillStyle = "#000000";
  ctx.fill(0, 0, canvasWidth, canvasHeight);

  // draw ship
  ship.draw();

  // draw rocks
  for (var i = 0; i < rocks.length; i++) {
    rocks[i].draw();
  }

  // draw bullets
  for (var i = 0; i < bullets.length; i++) {
    bullets[i].draw();
  }

  // draw stars
  for (var i = 0; i < stars.length; i++) {
    stars[i].draw();
  }

  // draw everything else
}

/*****************************************************************************
 * Move the game to the next frame
 ****************************************************************************/
function gameLoop() {

  handleUI();

  switch (gameMode) {
    case kMode_Init:
      ctx.clear(0, 0, canvasWidth, canvasHeight);
      ctx.drawText('Click on "Start Game"', 110, 200);
      break;

    case kMode_Play:
      rotationAngle += rotationFactor;
      ctx.rotation(rotationAngle);

      advance();
      drawAll();
      break;

    case kMode_Lose:
      ctx.clear(0, 0, canvasWidth, canvasHeight);
      ctx.drawText('Game over!', 140, 200);
      break;

    case kMode_Win:
      ctx.clear(0, 0, canvasWidth, canvasHeight);
      ctx.drawText('You win!', 155, 200);
      break;

  }
}

/*****************************************************************************
 * Main - the game
 ****************************************************************************/
function main() {

  initGame();

  // 30 times a second
  setInterval(gameLoop, 1000 / 30);
}
