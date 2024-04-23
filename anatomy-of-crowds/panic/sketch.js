let figures = [];
let numFigures = 200;
let panicThreshold = 10; // Distance threshold for panic influence

function setup() {
    createCanvas(windowWidth, windowHeight);
    for (let i = 0; i < numFigures; i++) {
        figures.push(new Figure(random(width), random(height)));
    }
    // Simulate a trigger event
    setTimeout(() => { figures[int(random(numFigures))].panicLevel = 1; }, 5000);
}

function draw() {
    background(220);
    figures.forEach(fig => {
        fig.update(figures);
        fig.display();
    });
}

class Figure {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = p5.Vector.random2D();
        this.vel.mult(random(3));
        this.panicLevel = 0; // 0 = calm, 1 = panic
    }

    update(others) {
        others.forEach(other => {
            let d = this.pos.dist(other.pos);
            if (d < panicThreshold && other.panicLevel > 0.5) {
                this.panicLevel = 1; // Panic spreads
            }
        });
        if (this.panicLevel > 0.5) {
            this.vel.rotate(random(-PI / 4, PI / 4));
            this.vel.setMag(random(2, 5)); // Increased speed in panic
        }
        this.pos.add(this.vel);
        this.edges();
    }

    display() {
        noStroke();
        fill(this.panicLevel > 0.5 ? color('red') : color('green'));
        ellipse(this.pos.x, this.pos.y, 10 + this.panicLevel * 10);
    }

    edges() {
        if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
        if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;
    }
}