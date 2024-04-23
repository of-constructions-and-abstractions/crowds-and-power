let crowdA = [];
let crowdB = [];
let numFiguresA = 100;
let numFiguresB = 100;

function setup() {
    createCanvas(windowWidth, windowHeight - 40);
    initCrowds();
}

function draw() {
    background(220);
    handleCrowd(crowdA, crowdB, [255, 0, 0]);
    handleCrowd(crowdB, crowdA, [0, 0, 255]);
}

function handleCrowd(crowd, otherCrowd, color) {
    for (let figure of crowd) {
        figure.behave(crowd);
        figure.collide(otherCrowd);
        figure.update();
        figure.display(color);
    }
}

function initCrowds() {
    crowdA = [];
    crowdB = [];
    for (let i = 0; i < numFiguresA; i++) {
        crowdA.push(new StickFigure(random(width / 2), random(height), 0.02));
    }
    for (let i = 0; i < numFiguresB; i++) {
        crowdB.push(new StickFigure(random(width / 2, width), random(height), -0.02));
    }
}

function updateFigures() {
    numFiguresA = int(document.getElementById('crowdANum').value);
    numFiguresB = int(document.getElementById('crowdBNum').value);
    initCrowds();
}

class StickFigure {
    constructor(x, y, aggressionModifier) {
        this.pos = createVector(x, y);
        this.vel = p5.Vector.random2D();
        this.size = random(10, 20);
        this.aggression = random(0.5, 1);
        this.aggressionModifier = aggressionModifier;
        this.isDestroyed = false;
    }

    behave(others) {
        others.forEach(other => {
            let d = p5.Vector.dist(this.pos, other.pos);
            if (d < this.size * 2 && other !== this) {
                let repulse = p5.Vector.sub(this.pos, other.pos);
                repulse.setMag(this.aggression * 0.1);
                this.vel.add(repulse);
            }
        });
        this.aggression += this.aggressionModifier;
    }

    collide(others) {
        others.forEach(other => {
            let d = p5.Vector.dist(this.pos, other.pos);
            if (d < this.size + other.size) {
                this.isDestroyed = true;
                other.isDestroyed = true;
                this.vel.mult(-0.5); // Simulate impact
                other.vel.mult(-0.5);
            }
        });
    }

    update() {
        if (!this.isDestroyed) {
            this.pos.add(this.vel);
            this.edges();
        }
    }

    display(color) {
        if (this.isDestroyed) {
            fill(...color, 100);
            ellipse(this.pos.x, this.pos.y, this.size * 2.5); // Explosion effect
        } else {
            fill(...color, 100);
            ellipse(this.pos.x, this.pos.y, this.size);
        }
    }

    edges() {
        if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
        if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;
    }
}

