// Canvas setting
const canvas = document.getElementById('game_window')
const ctx = canvas.getContext('2d')

const canvasWidth = 500
const canvasHeight = 500

const canvasWidthInit = canvas.width = canvasWidth
const canvasHeightInit = canvas.height = canvasHeight


//Game loop setting

let gameRuns = true
let fps = 60


//Color palette
const backgroundColor = "lightblue"
const heroColor = "green"


// Basic draw functions

function drawRect(x, y, width, height, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawLine(sX, sY, eX, eY){
    ctx.moveTo(sX,sY) 
    ctx.lineTo(eX,eY)
    ctx.stroke();
}

function drawImg(src, dx, dy, dWidth, dHeight){
    ctx.drawImage(src, dx, dy, dWidth, dHeight)
}
//Draw items function

var drawBackgroundGraphics = {
    background: function(){
        drawRect(0, 0, canvasWidth, canvasHeight, backgroundColor)
    }
}

//Movement & controller

let moveY = 1
let moveX = 1

let moveSpeed = 5
let sprint = 0 //default state
let sprintSpeed = 2.5

function normalSpeed(){
    sprint = 0
}

function sprintBoost(){
    sprint = sprintSpeed
}

function moveUp() {
    if (moveY > collisions.borderMin){
        moveY = (moveY - moveSpeed) - sprint
    }
}

function moveDown(){
    if (moveY < collisions.borderMax){
        moveY = (moveY + moveSpeed) + sprint
    }
}

function moveLeft(){
    if (moveX > collisions.borderMin){
        moveX = (moveX - moveSpeed) - sprint
    }
}

function moveRight(){
    if (moveX < collisions.borderMax){
        moveX = (moveX + moveSpeed) + sprint

    }
}

function shoot(){
    console.log(controller.fireDirection)
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
        var key_state = (event.type == "keydown")?true:false;

        switch(event.code) {
            case "ArrowUp":
                case "KeyW":
                    controller.up = key_state
                    controller.fireDirection = 1
                    break
                case "ArrowDown":
                case "KeyS":
                    controller.down = key_state
                    controller.fireDirection = 3

                    break
                case "ArrowLeft":
                case "KeyA":
                    controller.left = key_state
                    controller.fireDirection = 4

                    break
                case "ArrowRight":
                case "KeyD":
                    controller.right = key_state
                    controller.fireDirection = 2
                    break
                case "Space":
                    controller.shoot = key_state
                case "ShiftLeft":
                    controller.sprint = key_state
    
        }
    },
    movement: (e) => {
        if (controller.left){ moveLeft();}
        if (controller.right){ moveRight();}
        if (controller.up){ moveUp();}
        if (controller.down){ moveDown();}
        if (!controller.sprint){ normalSpeed();}
        if (controller.sprint){ sprintBoost();}
        if (controller.shoot) { shoot();}
    }
}
 

//Player
let character = {
    width: 30,
    height: 30,
    posX: 0,
    posY: 0,
    color: heroColor,
    draw: function(){
        drawRect(this.posX + moveX, this.posY + moveY, this.width, this.height, this.color)
    }
}


//Collisions
let collisions = {  
    borderMax: (canvasHeight - character.height) + 1,
    borderMin: 1,
}


//Draw all Graphics
function drawAllGraphics(){
    drawBackgroundGraphics.background()
    character.draw()
}


//Main function (dynamic, fps)
function gameDraw(){
    if(gameRuns){
        drawAllGraphics()
        controller.movement()
        setTimeout(gameDraw, 1000 / fps)
    }
}


//Event listeners
window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);


//Main function call
gameDraw()