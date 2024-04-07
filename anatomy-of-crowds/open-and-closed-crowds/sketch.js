let stickFigures = [];
let maxStickFigures = 20;
let circleSize = 300;
let closenessThreshold = 0.99; // 0 to 1, higher value means more closed
let doors = [];
let numDoors = 8;
let minDistance = 100; // Minimum distance for repulsion
let auraVisibleDistance = 85; // Distance at which aura is visible

document.getElementById('settingsForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the form from submitting in the traditional way

  // Update variables based on form input
  maxStickFigures = parseInt(document.getElementById('maxStickFigures').value);
  opennessThreshold = parseFloat(document.getElementById('opennessThreshold').value);
  closenessThreshold = 1 - opennessThreshold;

  // Restart the sketch with new settings
  setup(); // Call setup to reinitialize the sketch with the new settings
});

function setup() {
  createCanvas(windowWidth, windowHeight);
  mouseStickFigure = new StickFigure(mouseX, mouseY, true);
  colorMode(HSB, 360, 100, 100, 1);

  // Create doors
  for (let i = 0; i < numDoors; i++) {
    let angle = map(i, 0, numDoors, 0, TWO_PI);
    let x = width / 2 + cos(angle) * circleSize;
    let y = height / 2 + sin(angle) * circleSize;
    doors.push(new Door(x, y, angle));
  }
}

function draw() {
  background(255);

  // Draw circle
  stroke(0);
  noFill();
  ellipse(width / 2, height / 2, circleSize * 2);

  // Update and draw doors
  for (let door of doors) {
    door.update();
    door.display();
  }

  // Update mouse stick figure position
  mouseStickFigure.pos.x = mouseX;
  mouseStickFigure.pos.y = mouseY;
  
  // Update and draw stick figures
  for (let i = 0; i < stickFigures.length; i++) {
    let stickFigure = stickFigures[i];
    stickFigure.update(stickFigures, minDistance);
    stickFigure.display();
  }

  // Add new stick figures if crowd is not full
  if (stickFigures.length < maxStickFigures && random() > closenessThreshold) {
    let angle = random(TWO_PI);
    let x = random(width) 
    let y = random(height)
    stickFigures.push(new StickFigure(x, y));
  }

  // Restart sketch if crowd is full
  if (stickFigures.length >= maxStickFigures) {
    stickFigures = [];
  }
  
  // Display the number of stick figures in the upper right-hand corner
  textAlign(RIGHT, TOP);
  textSize(24);
  fill(0);
  text("Stick Figures: " + stickFigures.length, width - 20, 20);
}

class StickFigure {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.hue = 240;
    this.auraSize = 70;
  }

  update(others, minDistance) {
    // Move towards center of circle
    let center = createVector(width / 2, height / 2);
    this.vel = p5.Vector.sub(center, this.pos);
    this.vel.normalize();
    this.vel.mult(2);
    this.pos.add(this.vel);

    // Repulsion from other stick figures
    for (let other of others) {
      let d = p5.Vector.dist(this.pos, other.pos);
      if (other !== this && d < minDistance) {
        let repelForce = p5.Vector.sub(this.pos, other.pos);
        repelForce.normalize();
        repelForce.mult(5);
        this.pos.add(repelForce);
      }
    }

    // Update aura size based on distance to other stick figures
    let closestDist = minDistance;
    for (let other of others) {
      let d = p5.Vector.dist(this.pos, other.pos);
      if (other !== this && d < closestDist) {
        closestDist = d;
      }
    }
    this.auraSize = map(closestDist, 0, minDistance, 100, 70);
    this.hue = map(closestDist, 0, minDistance, 0, 240);
  }

  display() {
    // Draw aura if within visible distance
    if (this.auraSize >= auraVisibleDistance) {
      noStroke();
      fill(this.hue, 100, 100, 0.3);
      ellipse(this.pos.x, this.pos.y, this.auraSize);
    }

    // Draw stick figure
    push();
    translate(this.pos.x, this.pos.y);
    stroke(0);
    line(0, 0, 0, -20); // Body
    line(0, -20, -10, -30); // Left arm
    line(0, -20, 10, -30); // Right arm
    line(0, 0, -10, 20); // Left leg
    line(0, 0, 10, 20); // Right leg
    ellipse(0, -30, 10); // Head
    pop();
  }
}

class Door {
  constructor(x, y, angle) {
    this.pos = createVector(x, y);
    this.angle = angle;
    this.openness = 1;
  }

  update() {
    this.openness = map(closenessThreshold, 0, 1, 1, 0);
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    stroke(50);
    line(0, 0, 1/this.openness * 100, -1000);
    pop();
  }
}
