// sketch.js

let stickFigures = [];
let maxStickFigures = 20;
let circleSize = 300;
let opennessThreshold = 0.5; // Controls the openness of the crowd
let dischargeRate = 0.1; // Controls the rate of new entries
let closenessThreshold; // Calculated from openness
let numDoors = 8;
let minDistance = 100; // Minimum distance for repulsion

document.getElementById('settingsForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting in the traditional way

    maxStickFigures = parseInt(document.getElementById('maxStickFigures').value);
    opennessThreshold = parseFloat(document.getElementById('opennessThreshold').value);
    dischargeRate = parseFloat(document.getElementById('dischargeRate').value);
    closenessThreshold = 1 - opennessThreshold;

    stickFigures = []; // Reset the stick figures for a fresh start
    setup(); // Call setup to reinitialize the sketch with the new settings
});

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
    background(240);
    noFill();
    stroke(0);
    ellipse(width / 2, height / 2, circleSize * 2);

    // Manage stick figures
    if (stickFigures.length < maxStickFigures && random() < dischargeRate) {
        let angle = random(TWO_PI);
        let x = width / 2 + cos(angle) * circleSize;
        let y = height / 2 + sin(angle) * circleSize;
        stickFigures.push(new StickFigure(x, y));
    }

    stickFigures.forEach(figure => {
        figure.update();
        figure.display();
    });

    // Display the number of stick figures
    fill(0);
    noStroke();
    textSize(16);
    text(`Stick Figures: ${stickFigures.length}`, 10, 20);
}

class StickFigure {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = createVector(random(-1, 1), random(-1, 1));
        this.color = color(random(360), 80, 80);
    }

    update() {
        let center = createVector(width / 2, height / 2);
        let force = p5.Vector.sub(center, this.pos);
        force.setMag(0.05 * (1 - closenessThreshold)); // Attract force decreases with more closeness
        this.pos.add(force);
    }

    display() {
        fill(this.color);
        noStroke();
        ellipse(this.pos.x, this.pos.y, 10, 10);
    }
}
