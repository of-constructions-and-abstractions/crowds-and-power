let figures = [];
let initialNumFigures = 200;
let containerSize = 300;
let isEruption = false;

function setup() {
    createCanvas(windowWidth, windowHeight);
    initialNumFigures = int(document.getElementById('numFigures').value);
    containerSize = int(document.getElementById('containerSize').value);
    initializeFigures();
}

function draw() {
    background(220);
  
    textAlign(RIGHT, TOP);
    textSize(16);
    fill(0);
    text("Figures: " + (figures.length - initialNumFigures), width - 20, 20);
  
    if (isEruption) {
        figures.forEach(fig => {
            fig.update();
            fig.display();
        });
    } else {
        fill(0);
        noStroke();
        textAlign(CENTER, CENTER);
        text("Press the 'Erupt' button to start the simulation.", width / 2, height / 2);
    }
}

function initializeFigures() {
    for (let i = 0; i < initialNumFigures; i++) {
        figures.push(new Figure(width / 2 + random(-50, 50), height / 2 + random(-50, 50)));
    }
}

function triggerEruption() {
    isEruption = true;
    initialNumFigures = int(document.getElementById('numFigures').value);
    containerSize = int(document.getElementById('containerSize').value);
    initializeFigures();
}

class Figure {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = p5.Vector.random2D();
        this.vel.setMag(random(0.5, 3));
    }

    update() {
        this.pos.add(this.vel);
        this.edges();
    }

    display() {
        fill(255, 0, 0);
        noStroke();
        ellipse(this.pos.x, this.pos.y, 10, 10);
    }

    edges() {
        if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
        if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;
    }
}