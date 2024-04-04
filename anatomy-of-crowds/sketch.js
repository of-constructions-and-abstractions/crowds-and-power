let particles = [];
let numParticles = 100;
let minDistance = 50;
let transitionDuration = 0.001; // Duration of the transition in seconds
let bodyTransitionDuration = 0.1;
let spikeInterval = 2000; // Spike interval in milliseconds

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      position: createVector(random(width), random(height)),
      hue: 240,
      auraSize: 70,
      targetHue: 240,
      targetAuraSize: 70,
      headPosition: createVector(0, -5),
      targetHeadPosition: createVector(0, -5),
      bodyPosition: createVector(0, 0),
      targetBodyPosition: createVector(0, 0)
    });
  }

  // Set interval for spiking the aura
  setInterval(spikeRandomAura, spikeInterval);
}

function draw() {
  background(255);

  for (let i = 0; i < particles.length; i++) {
    let particle = particles[i];
    let repulsionSum = createVector(0, 0);

    // Check distance from mouse
    let mouseDistance = dist(particle.position.x, particle.position.y, mouseX, mouseY);
    if (mouseDistance < minDistance) {
      // Calculate repulsion force
      let repelForce = p5.Vector.sub(particle.position, createVector(mouseX, mouseY));
      repelForce.normalize();
      repelForce.mult(100);
      repulsionSum.add(repelForce);
    }

    // Check distance from other particles
    for (let j = 0; j < particles.length; j++) {
      if (i !== j) {
        let otherParticle = particles[j];
        let particleDistance = dist(particle.position.x, particle.position.y, otherParticle.position.x, otherParticle.position.y);
        if (particleDistance < minDistance) {
          // Calculate repulsion force
          let repelForce = p5.Vector.sub(particle.position, otherParticle.position);
          repelForce.normalize();
          repelForce.mult(1);
          repulsionSum.add(repelForce);
        }
      }
    }

    // Update particle position
    particle.position.add(repulsionSum);
    particle.position.x += random(-1, 1);
    particle.position.y += random(-1, 1);

    // Keep particles within canvas bounds
    particle.position.x = constrain(particle.position.x, 0, width);
    particle.position.y = constrain(particle.position.y, 0, height);

    // Calculate target color and size based on repulsion force magnitude
    particle.targetHue = map(repulsionSum.mag(), 0, 1, 240, 0);
    particle.targetAuraSize = map(repulsionSum.mag(), 0, 1, 70, 100);

    // Calculate target head and body positions based on repulsion force
    let targetHeadOffset = p5.Vector.mult(repulsionSum.normalize(), 5);
    particle.targetHeadPosition = p5.Vector.add(particle.headPosition, targetHeadOffset);
    particle.targetBodyPosition = p5.Vector.add(particle.bodyPosition, repulsionSum);

    // Smoothly transition to the target color, size, and positions
    particle.hue = lerp(particle.hue, particle.targetHue, bodyTransitionDuration);
    particle.auraSize = lerp(particle.auraSize, particle.targetAuraSize, bodyTransitionDuration);
    particle.headPosition = p5.Vector.lerp(particle.headPosition, particle.targetHeadPosition, transitionDuration);
    particle.bodyPosition = p5.Vector.lerp(particle.bodyPosition, particle.targetBodyPosition, bodyTransitionDuration);

    // Draw particle as a human-like shape
    push();
    translate(particle.position.x, particle.position.y);

    // Draw aura around the individual
    noStroke();
    fill(particle.hue, 100, 100, 0.3);
    ellipse(0, 0, particle.auraSize);

    // Draw body
    stroke(0);
    fill(0);
    line(particle.bodyPosition.x, particle.bodyPosition.y, particle.bodyPosition.x, particle.bodyPosition.y + 20); // Body
    line(particle.bodyPosition.x, particle.bodyPosition.y + 5, particle.bodyPosition.x - 10, particle.bodyPosition.y + 15); // Left arm
    line(particle.bodyPosition.x, particle.bodyPosition.y + 5, particle.bodyPosition.x + 10, particle.bodyPosition.y + 15); // Right arm
    line(particle.bodyPosition.x, particle.bodyPosition.y + 20, particle.bodyPosition.x - 10, particle.bodyPosition.y + 30); // Left leg
    line(particle.bodyPosition.x, particle.bodyPosition.y + 20, particle.bodyPosition.x + 10, particle.bodyPosition.y + 30); // Right leg

    // Draw head
    ellipse(particle.headPosition.x, particle.headPosition.y, 10, 10);

    // Draw speech bubble with "ew, get away" text if aura size is between 50% and 100% of its maximum
    if (particle.auraSize >= 76) {
      fill(255);
      stroke(0);
      ellipse(particle.headPosition.x + 20, particle.headPosition.y - 20, 80, 20);
      noStroke();
      fill(0);
      textSize(8);
      text("distance !", particle.headPosition.x + 10, particle.headPosition.y - 18);
    }

    pop();
  }
}

function spikeRandomAura() {
  if (particles.length > 0) {
    let randomIndex = floor(random(particles.length));
    particles[randomIndex].targetAuraSize += 100;
  }
}
