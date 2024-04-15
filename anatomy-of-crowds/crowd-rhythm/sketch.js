let crowds = []; // Array to hold multiple crowds
let numCrowds = 2; // Number of crowds
let particlesInACrowd = 100;
let particleSlider; // Slider to control the number of particles

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Slider to adjust the number of particles in a crowd
  particleSlider = createSlider(0, 200, particlesInACrowd);
  particleSlider.position(10, 10);
  
  // Initialize crowds with different rhythms and colors
  for (let i = 0; i < numCrowds; i++) {
    let rhythm = random(0.02, 0.1); // Each crowd has a unique rhythm speed
    let color = [random(255), random(255), random(255)]; // Unique color for each crowd
    crowds.push(new Crowd(particlesInACrowd, rhythm, color)); // Each crowd has particlesInACrowd particles
  }
}

function draw() {
  background(51);
  
  // Adjust the number of particles based on the slider value
  particlesInACrowd = particleSlider.value();
  crowds.forEach(crowd => {
    crowd.adjustParticleCount(particlesInACrowd);
  });
  
  // Update and display each crowd
  crowds.forEach((crowd, index) => {
    crowd.update();
    crowd.display();
  });
  
  // Draw lines between close particles of different crowds and unify them
  connectCrowds();
}

function connectCrowds() {
  stroke(255, 100);
  for (let i = 0; i < crowds.length; i++) {
    for (let j = i + 1; j < crowds.length; j++) {
      let crowdA = crowds[i].particles;
      let crowdB = crowds[j].particles;
      
      for (let a of crowdA) {
        for (let b of crowdB) {
          let d = dist(a.position.x, a.position.y, b.position.x, b.position.y);
          if (d < 50) { // If particles are close enough, draw a line
            line(a.position.x, a.position.y, b.position.x, b.position.y);
            a.unify(); // Change color and size to show equality
            b.unify(); // Change color and size to show equality
          } else {
            
            b.unUnify();
            a.unUnify();
          }
        }
      }
    }
  }
}

class Crowd {
  constructor(numParticles, rhythm, color) {
    this.particles = [];
    this.rhythm = rhythm; // Unique rhythm for the crowd
    this.color = color; // Unique color for the crowd
    
    // Create particles
    for (let i = 0; i < numParticles; i++) {
      this.particles.push(new Particle(this.color));
    }
  }
  
  adjustParticleCount(numParticles) {
    // Adjust the number of particles in the crowd
    if (numParticles > this.particles.length) {
      // Add more particles
      while (this.particles.length < numParticles) {
        this.particles.push(new Particle(this.color));
      }
    } else if (numParticles < this.particles.length) {
      // Remove particles
      this.particles.splice(numParticles);
    }
  }
  
  update() {
    this.particles.forEach(particle => {
      particle.update(this.rhythm);
    });
  }
  
  display() {
    this.particles.forEach(particle => {
      particle.display();
    });
  }
}

class Particle {
  constructor(color) {
    this.position = createVector(random(width), random(height));
    this.size = random(5, 15);
    this.color = color; // Color inherited from the crowd
    this.unifiedColor = [255, 255, 255]; // Color for unified particles
    this.unifiedSize = 10; // Size for unified particles
    this.isUnified = false; // State of the particle
  }
  
  update(rhythm) {
    // Oscillating movement based on the crowd's rhythm
    let angle = sin(frameCount * rhythm);
    this.position.x += angle; // Horizontal movement
    this.position.y += cos(frameCount * rhythm); // Vertical movement
  }
  
  display() {
    noStroke();
    if (this.isUnified) {
      fill(this.unifiedColor);
      ellipse(this.position.x, this.position.y, this.unifiedSize, this.unifiedSize);
    } else {
      fill(this.color);
      ellipse(this.position.x, this.position.y, this.size, this.size);
    }
  }
  
  unify() {
    // Change color and size to show equality
    this.isUnified = true;
  }
  
  unUnify() {
    this.isUnified = false;
  }
}
