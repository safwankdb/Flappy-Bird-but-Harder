var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

// load images

var bird = new Image();
var bg = new Image();
var fg = new Image();
var pipeNorth = new Image();
var pipeSouth = new Image();

bird.src = "images/bird.png";
bg.src = "images/bg.png";
fg.src = "images/fg.png";
pipeNorth.src = "images/pipeNorth.png";
pipeSouth.src = "images/pipeSouth.png";


// some variables

var gap = 85;
var constant;

var bX = 50;
var bY = 150;
var t = 0;
var jump = 2;
var gravity = 0.035;
var vY = 0;
var score = 0;
var paused = false;
// audio files

var fly = new Audio();
var scor = new Audio();

fly.src = "sounds/fly.mp3";
scor.src = "sounds/score.mp3";

// on key down

document.addEventListener("keydown", moveUp);
document.addEventListener('keydown', pauseGameKeyHandler, false);

function togglePause() {
    paused = !paused;
    draw();
}

function pauseGameKeyHandler(e) {
    var keyCode = e.keyCode;
    switch (keyCode) {
        case 32: //space
            togglePause();
            break;
    }
}

function moveUp() {
    vY = jump;
    t = 0;
    fly.play();
}

function gaussianRandom(samples) {
    var ans = 0;
    for (let i = 0; i < samples; i++) {
        ans += Math.random();
    }
    return ans / samples;
}

// pipe coordinates
var pipe = [];
for (var i = 0; i < 3; i++) {
    pipe.push({
        x: cvs.width + 200 * i + Math.floor(100 * gaussianRandom(5)),
        y: Math.floor(gaussianRandom(3) * pipeNorth.height) - pipeNorth.height
    }
    )
}

// draw images
function draw() {
    ctx.drawImage(bg, 0, 0, cvs.height, cvs.height);
    pipe = pipe.filter(function (item) {
        return item.x > -60
    })
    for (var i = 0; i < pipe.length; i++) {
        constant = pipeNorth.height + 80+40*Math.floor(gaussianRandom(3));
        ctx.drawImage(pipeNorth, pipe[i].x, pipe[i].y);
        ctx.drawImage(pipeSouth, pipe[i].x, pipe[i].y + constant);
        pipe[i].x--;
        if (pipe[i].x == 0) {
            pipe.push({
                x: pipe[pipe.length-1].x + 150 + Math.floor(120 * gaussianRandom(5)),
                y: Math.floor(gaussianRandom(3) * pipeNorth.height) - pipeNorth.height
            });
        }
        // detect collision
        if (bX + bird.width - 2 >= pipe[i].x && bX <= pipe[i].x + pipeNorth.width && (bY <= pipe[i].y + pipeNorth.height || bY + bird.height - 2 >= pipe[i].y + constant)) {
            location.reload(); // reload the page
        }
        if (pipe[i].x == 5) {
            score++;
            scor.play();
        }
    }

    ctx.drawImage(fg, 0, cvs.height - fg.height, cvs.height, fg.height);

    ctx.drawImage(bird, bX, bY);

    bY += -vY + gravity * (2 * t + 1);
    t++;

    if (bY + bird.height >= cvs.height - fg.height) {
        location.reload();
    }

    ctx.fillStyle = "#000";
    ctx.font = "20px Verdana";
    ctx.fillText("Score : " + score, 10, cvs.height - 20);

    if (!paused) {
        requestAnimationFrame(draw);
    }


}

draw();
