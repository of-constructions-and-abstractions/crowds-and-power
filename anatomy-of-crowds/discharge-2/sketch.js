// sketch.js

let stickFigures = [];
let maxStickFigures = 20;
let circleSize = 300;
let opennessThreshold = 0.01; // Controls the openness of the crowd
let dischargeRate = 0.1; // Controls the rate of new entries
let closenessThreshold; // Calculated from openness
let doors = [];
let numDoors = 8;
let minDistance = 100; // Minimum distance for repulsion
let auraVisibleDistance = 85; // Distance at which aura is visible

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
  // Initialize the doors
  for (let i = 0; i < numDoors; i++) {
    let angle = map(i, 0, numDoors, 0, TWO_PI);
    let x = width / 2 + cos(angle) * circleSize;
    let y = height / 2 + sin(angle) * circleSize;
    doors.push(new Door(x, y, angle));
  }
  closenessThreshold = 1 - opennessThreshold;
}

function draw() {
  background(255);
  stroke(0);
  noFill();
  ellipse(width / 2, height / 2, circleSize * 2);

  // Draw and update doors
  for (let door of doors) {
    door.update();
    door.display();
  }

  // Update and draw each stick figure
  stickFigures.forEach((fig, index) => {
    fig.update(stickFigures, minDistance);
    fig.display();
  });

  // Entry of new stick figures based on openness and discharge rate
  if (stickFigures.length < maxStickFigures && random() < dischargeRate + opennessThreshold) {
    let angle = random(TWO_PI);
    let x = width / 2 + cos(angle) * circleSize * 0.9; // Slightly inside the circle
    let y = height / 2 + sin(angle) * circleSize * 0.9;
    stickFigures.push(new StickFigure(x, y));
  }

  // Display current number of stick figures
  fill(0);
  noStroke();
  textSize(16);
  textAlign(RIGHT, TOP);
  text(`Stick Figures: ${stickFigures.length}`, width - 20, 20);
}

class StickFigure {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.hue = 240; // Initial color
    this.auraSize = 70; // Initial aura size
  }

  update(others, minDistance) {
    // Move towards the center of the circle slightly
    let center = createVector(width / 2, height / 2);
    let force = p5.Vector.sub(center, this.pos);
    force.setMag(0.5);
    this.pos.add(force);

    // Repulsion from other stick figures
    others.forEach(other => {
      let d = p5.Vector.dist(this.pos, other.pos);
      if (other !== this && d < minDistance) {
        let repelForce = p5.Vector.sub(this.pos, other.pos);
        repelForce.setMag(5);
        this.pos.add(repelForce);
      }
    });

    // Update aura based on proximity to nearest neighbor
    let closestDist = others.reduce((min, other) => {
      if (other !== this) {
        let d = p5.Vector.dist(this.pos, other.pos);
        return Math.min(min, d);
      }
      return min;
    }, minDistance);

    this.auraSize = map(closestDist, 0, minDistance, 100, 70);
    this.hue = map(closestDist, 0, minDistance, 0, 240);
  }

  display() {
    // Draw aura if within visible distance
    fill(this.hue, 100, 100, 0.3);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.auraSize * 2);

    // Draw stick figure
    stroke(0);
    push();
    translate(this.pos.x, this.pos.y);
    line(0, 0, 0, -20); // Body
    line(0, -20, -10, -30); // Left arm
    line(0, -20, 10, -30); // Right arm
    line(0, 0, -10, 10); // Left leg
    line(0, 0, 10, 10); // Right leg
    ellipse(0, -30, 10); // Head
    pop();
  }
}

class Door {
  constructor(x, y, angle) {
    this.pos = createVector(x, y);
    this.angle = angle;
  }

  update() {
    // Door logic can be expanded if needed
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    stroke(50);
    line(0, 0, 50, 0); // Door representation
    pop();
  }
}
