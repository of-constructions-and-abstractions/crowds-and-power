let particles = [];
let densitySlider;
let equalityButton;
let equalityState = false;

function setup() {
  createCanvas(800, 600);
  densitySlider = createSlider(0, 200, 100);
  densitySlider.position(10, height + 30);
  
  // Adjust the number of particles for initial density
  for (let i = 0; i < densitySlider.value(); i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(220);
  adjustDensity(densitySlider.value());
  
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      particles[i].interact(particles[j]);
    }
    particles[i].move();
    particles[i].display();
  }
}

function adjustDensity(density) {
  let difference = density - particles.length;
  if (difference > 0) {
    for (let i = 0; i < difference; i++) {
      particles.push(new Particle());
    }
  } else if (difference < 0) {
    particles.splice(0, -difference);
  }
}

class Particle {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.mult(random(3));
    this.size = random(5, 20);
    this.color = color(random(255), random(255), random(255));
  }
  
  move() {
    this.position.add(this.velocity);
    this.position.x = (this.position.x + width) % width;
    this.position.y = (this.position.y + height) % height;
  }
  
  display() {
  }
  
  interact(other) {
    let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
    if (d < 50) {
        // When equalityState is true, draw both particles with uniform size and color
        stroke(255, 0, 0);
        line(this.position.x, this.position.y, other.position.x, other.position.y);
        fill(100); // Uniform gray color
        ellipse(this.position.x, this.position.y, 15, 15); // Uniform size for this particle
        fill(100);
        ellipse(other.position.x, other.position.y, 15, 15); // Uniform size for the other particle
      } else {
        // When equalityState is false, draw individual features
        stroke(255, 0, 0);
        fill(this.color);
        // ellipse(this.position.x, this.position.y, this.size, this.size); // Individual features for this particle
        fill(other.color);
        ellipse(other.position.x, other.position.y, other.size, other.size); // Individual features for the other particle
      }
    }
  
}
