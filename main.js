var blob;
var blobs = [];
var blobColor = [];
var zoom = 1;
blobCount = 100;
var diff = 0;

var alive = true;
var easyHighScore = 0;
var easyYourScore = 0;
var hardYourScore = 0;
var hardHighScore = 0;
var timer = 0;

function easyMode() {
    diff = 0;
    reset();

    translate(width / 2, height / 2);
    var newzoom = 1.50;
    zoom = lerp(zoom, newzoom, 0.05);
    scale(zoom);
}

function hardMode() {
    diff = 1;
    reset();

    translate(width / 2, height / 2);
    var newzoom = 1.50;
    zoom = lerp(zoom, newzoom, 0.05);
    scale(zoom);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function setColor() {
    for (var i = 0; i < 20; i++) {
        blobColor.push('#' + Math.random().toString(16).slice(-6));
        fill(blobColor[i]);
    }
}

function clearYourScores() {
    easyYourScore = 0;
    hardYourScore = 0;
}

function clearHighScores() {
    hardHighScore = 0;
    easyHighScore = 0;
}

function reset() {
    //console.log("Difficulty: " + diff);
    timer = 0;
   clearYourScores();
    alive = true;
    blob = new Blob(0, 0, 20, [255], 0, 0);
    for (var i = 0; i < blobCount; i++) {
        var x = random(-width, height);
        var y = random(-height, width);
        var c = [random(255), random(255), random(255)];
        blobs[i] = new Blob(x, y, random(30), c, random(3)-1, random(3)-1);
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    reset();
}

function draw() {
    if(diff === 0) {
        timer += 0.5;
    } if (diff === 1) {
        timer += 2;
    }
    if(timer === 90) {
        timer = 0;
        blob.r -= 1;
    }
    if (alive === true) {

        background(18);
        translate(width / 2, height / 2);
        var newzoom = 1.50;
        zoom = lerp(zoom, newzoom, 0.05);
        scale(zoom);

        translate(-blob.pos.x, -blob.pos.y);
        for (var i = blobs.length - 1; i >= 0; i--) {
            blobs[i].botUpdate();
            blobs[i].show();
            if (blob.eats(blobs[i])) {
                blobs.splice(i, 1);
            }
        }
        blob.show();
        blob.update();
if (diff === 0) {
    document.getElementById("highScore").innerHTML = "High Score: " + easyHighScore;
    //console.log("Easy HS" + easyHighScore);
    document.getElementById("yourScore").innerHTML = "Your Score: " + easyYourScore;
    //console.log("Easy YS" + easyYourScore);
} else {
    document.getElementById("highScore").innerHTML = "High Score: " + hardHighScore;
    //console.log("Hard HS" + hardHighScore);
    document.getElementById("yourScore").innerHTML = "Your Score: " + hardYourScore;
    //console.log("Hard YS" + hardYourScore);
}

    } else {
        if(easyYourScore > easyHighScore || hardYourScore > hardHighScore) {
            easyHighScore = easyYourScore;
            hardHighScore = hardYourScore;
        }
        setColor();
        background(0);
        resetMatrix();
        line(0, 37, width, 107);
        textSize(width / 15);
        textAlign(CENTER, CENTER);
        text("You lost! Press space to have another go!", 0, 307, width);
    }
}

function timer() {

}

function keyPressed() {
    if(alive) {
        return;
    }

    if(keyCode === 32) {
        alive = true;
        reset();
    } else {
return false;
    }
}

function Blob(x, y, r, c, xV, xY) {
    this.pos = createVector(x, y);
    this.c = c;
    this.r = r;
    this.vel = createVector(xV,xY);

    this.update = function() {
        var newvel = createVector(mouseX-width/2, mouseY-height/2);
        if (diff === 0) {
            newvel.setMag(2);
        } else {
            newvel.setMag(4);
        }
        this.vel.lerp(newvel, 0.5);
        this.pos.add(this.vel);
    }

    this.botUpdate = function() {
        this.pos.add(this.vel);
    }

    this.eats = function(other) {
        var d = p5.Vector.dist(this.pos, other.pos);
        if (d < this.r + other.r) {
            if (this.r < other.r) {
                alive = false;
            } else {
                this.r += 2;
                if(diff === 0) {
                    easyYourScore += 1;
                }
                if(diff === 1) {
                    hardYourScore += 1;
                }
            }
            return true;
        }
        else {
            return false;
        }
    }
    this.show = function() {
        fill(c);
        ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);
    }
}