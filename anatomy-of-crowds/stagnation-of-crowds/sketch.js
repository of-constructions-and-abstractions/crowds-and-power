let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 100; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(51);
  
  // Draw lines between particles that are close to each other
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let distance = dist(particles[i].position.x, particles[i].position.y, particles[j].position.x, particles[j].position.y);
      if (distance < 100) { // Threshold distance to draw a line
        stroke(255, 255, 255, 150); // Semi-transparent white lines
        line(particles[i].position.x, particles[i].position.y, particles[j].position.x, particles[j].position.y);
      }
    }
  }
  
  // Update and display each particle
  particles.forEach(particle => {
    particle.update();
    particle.display();
  });
}

class Particle {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = createVector(0, 0); // Start with no velocity
    this.acceleration = p5.Vector.random2D().mult(0.005); // Very slight movement
    this.maxSpeed = 1; // Limit speed to keep movement minimal
    this.color = [random(100, 255), random(100, 255), random(100, 255), 255]; // Initial color
    this.changeRate = 0.2; // Rate at which the color changes
  }
  
  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    
    // Gradually change color to represent buildup of tension
    this.color[3] -= this.changeRate; // Decrease opacity
    if (this.color[3] < 50) { // Reset opacity to avoid complete fade
      this.color[3] = 255;
    }
  }
  
  display() {
    noStroke();
    fill(this.color);
    ellipse(this.position.x, this.position.y, 10, 10);
  }
}
