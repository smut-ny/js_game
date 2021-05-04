

// Canvas setting
const canvas = document.getElementById('game_window')
const ctx = canvas.getContext('2d')

const canvasWidth = 500
const canvasHeight = 500

const canvasWidthInit = canvas.width = canvasWidth
const canvasHeightInit = canvas.height = canvasHeight

//game

let gameRuns = true

//Color palette
const backgroundColor = "lightblue"




// Basic functions

function drawRect(x, y, width, height, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}





//Draw items

var drawBackgroundGraphics = {
    background: function(){
        drawRect(0, 0, canvasWidth, canvasHeight, backgroundColor)
    }
}

//Basic movements

let moveY = 1
let moveX = 1

let moveSpeed = 20
let fps = 30

function moveUp() {
    moveY = (moveY - moveSpeed)
}

function moveDown(){
    moveY = (moveY + moveSpeed)
}

function moveLeft(){
    moveX = (moveX - moveSpeed)
}

function moveRight(){
    moveX = (moveX + moveSpeed)
}

//Event Listeners
let key = addEventListener("keyup",(e) => {
    let keyPressed = false

    switch(e.key){
        case "ArrowUp":
        case "w":
            moveUp()
            break
        case "ArrowDown":
        case "s":
            moveDown()
            break
        case "ArrowLeft":
        case "a":
            moveLeft()
            break
        case "ArrowRight":
        case "d":
            moveRight()
            break
        case "Shift":
    }
})

//Player

var character = {
    width: 20,
    height: 20,
    posX: 250,
    posY: 250,
    color: "red",
    draw: function(){
        drawRect(this.posX + moveX, this.posY + moveY, this.width, this.height, this.color)
    }
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
        setTimeout(gameDraw, 1000 / fps)
        
        
    }
    
    

}


gameDraw()