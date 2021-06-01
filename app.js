//@TODO
/*
[ ] Při střetnutí úkoly
    + Random slovo ze seznamu, zamíchané a musí uhodnout
    + Výpočet (časově omezený)
[ ] Score
[ ] Neprůchozí


*/

// Canvas setting
const canvas = document.getElementById("game_window");
const ctx = canvas.getContext("2d");

const canvasWidth = 500;
const canvasHeight = 500;

const canvasWidthInit = (canvas.width = canvasWidth);
const canvasHeightInit = (canvas.height = canvasHeight);

//Game setting
let treesNum = 1;
let enemiesNum = 0;

let score = 100;

//Game loop setting

let gameRuns = true;
let fps = 20;

//Color palette
const colors = {
    backgroundColor: "lightblue",
    heroColor: "green",
    enemyColor: "pink"
}


// Basic draw functions

function drawRect(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

function drawLine(sX, sY, eX, eY) {
  ctx.moveTo(sX, sY);
  ctx.lineTo(eX, eY);
  ctx.stroke();
}

function drawImg(src, dx, dy, dWidth, dHeight) {
  ctx.drawImage(src, dx, dy, dWidth, dHeight);
}

//Draw items function

var drawBackgroundGraphics = {
  background: function () {
    drawRect(0, 0, canvasWidth, canvasHeight, colors.backgroundColor);
  },
};

//Other functions
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//Movement & controller

let moveY = 1;
let moveX = 1;

let moveSpeed = 5;
let sprint = 0; //default state
let sprintSpeed = 2.5;

function normalSpeed() {
  sprint = 0;
}

function sprintBoost() {
  sprint = sprintSpeed;
}

function moveUp() {
  if (moveY > wallCollision.borderMin) {
    moveY = moveY - moveSpeed - sprint;
  }
}

function moveDown() {
  if (moveY < wallCollision.borderMax) {
    moveY = moveY + moveSpeed + sprint;
  }
}

function moveLeft() {
  if (moveX > wallCollision.borderMin) {
    moveX = moveX - moveSpeed - sprint;
  }
}

function moveRight() {
  if (moveX < wallCollision.borderMax) {
    moveX = moveX + moveSpeed + sprint;
  }
}

function shoot() {
  console.log(moveX, moveY);
}

let controller = {
  up: false,
  down: false,
  left: false,
  right: false,
  sprint: false,
  shoot: false,
  fireDirection: 1,
  keyListener: (e) => {
    var key_state = event.type == "keydown" ? true : false;

    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        controller.up = key_state;
        controller.fireDirection = 1;
        break;
      case "ArrowDown":
      case "KeyS":
        controller.down = key_state;
        controller.fireDirection = 3;

        break;
      case "ArrowLeft":
      case "KeyA":
        controller.left = key_state;
        controller.fireDirection = 4;

        break;
      case "ArrowRight":
      case "KeyD":
        controller.right = key_state;
        controller.fireDirection = 2;
        break;
      case "Space":
        controller.shoot = key_state;
      case "ShiftLeft":
        controller.sprint = key_state;
    }
  },
  movement: (e) => {
    if (controller.left) {
      moveLeft();
    }
    if (controller.right) {
      moveRight();
    }
    if (controller.up) {
      moveUp();
    }
    if (controller.down) {
      moveDown();
    }
    if (!controller.sprint) {
      normalSpeed();
    }
    if (controller.sprint) {
      sprintBoost();
    }
    if (controller.shoot) {
      shoot();
    }
  },
};

//Player
let character = {
  width: 30,
  height: 30,
  startPosX: 0,
  startPosY: 0,
  color: colors.heroColor,
  draw: function () {
    drawRect(
      this.startPosX + moveX,
      this.startPosY + moveY,
      this.width,
      this.height,
      this.color
    );
  },
  posX: function () {
    let posX = moveX;
    return posX;
  },
  posY: function () {
    let posY = moveY;
    return posY;
  },
};

//Enemy
class enemy {
  constructor(x, y) {
    this.width = 20;
    this.height = 20;
    this.posX = x;
    this.posY = y;
    this.color = colors.enemyColor;
  }

  draw() {
    drawRect(this.posX, this.posY, this.width, this.height, this.color);
  }

  fight() {
    let hitBox = this.width + 10;
    const formula =
      character.posX() < this.posX + hitBox &&
      character.posX() > this.posX - hitBox &&
      character.posY() < this.posY + hitBox &&
      character.posY() > this.posY - hitBox;

    if (formula) {
      console.log("ENEMY");
    }
  }
}

function createEnemies(number) {
  let enemies = [];

  for (let i = 0; i < number; i++) {
    enemies[i] = new enemy(getRndInteger(10, 450), getRndInteger(10, 450));
  }

  return enemies;
}

let enemies = [];
enemies = createEnemies(enemiesNum);

//Collisions
let wallCollision = {
  borderMax: canvasHeight - character.height + 1,
  borderMin: 1,
};

class spaceCollisions {
  constructor(x, y) {
    this.width = 20;
    this.height = 20;
    this.posX = x;
    this.posY = y;
    this.color = "purple";

    this.left = this.posX - character.width;
    this.right = this.posX + this.width;
    this.top = this.posY - character.height;
    this.bot = this.posY + this.height;
  }

  draw() {
    drawRect(this.posX, this.posY, this.width, this.height, this.color);
  }
}

function createSpaceCollisions(number) {
  let collisions = [];

  for (let i = 0; i < number; i++) {
    collisions[i] = new spaceCollisions(
      getRndInteger(10, 450),
      getRndInteger(10, 450)
    );
  }

  return collisions;
}

let trees = [];
trees = createSpaceCollisions(treesNum);

let treesTop = [];
let treesBot = [];
let treesLeft = [];
let treesRight = [];

for (i in trees) {
  treesTop.push(trees[i].top);
  treesBot.push(trees[i].bot);
  treesLeft.push(trees[i].left);
  treesRight.push(trees[i].right);
}

//Draw all Graphics
function drawAllGraphics() {
  drawBackgroundGraphics.background();
  character.draw();

  //Draw Enemies
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].draw();
    enemies[i].fight();
  }

  //Draw Trees
  for (let i = 0; i < trees.length; i++) {
    trees[i].draw();
  }
}

//Main function (dynamic, fps)
function gameDraw() {
  if (gameRuns) {
    drawAllGraphics();
    controller.movement();
    setTimeout(gameDraw, 1000 / fps);
  }
}

//Event listeners
window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);

//Main function call
gameDraw();
