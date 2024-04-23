let nodes = [];
let edges = [];
let canvasWidth = 800;
let canvasHeight = 600;
let minConnections, maxConnections, persecutionThreshold;

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    frameRate(30);
    noLoop(); // Do not start the drawing loop until the user starts the simulation

    // Attach event listener to HTML button
    document.getElementById('startButton').addEventListener('click', initializeSimulation);

    document.getElementById('persecuteButton').addEventListener('click', persecuteNode);
}

function initializeSimulation() {
    let numNodes = parseInt(document.getElementById('numNodes').value);
    minConnections = parseInt(document.getElementById('minConnections').value);
    maxConnections = parseInt(document.getElementById('maxConnections').value);
    persecutionThreshold = parseInt(document.getElementById('persecutionThreshold').value);

    nodes = [];
    edges = [];

    for (let i = 0; i < numNodes; i++) {
        nodes.push(new Node(random(width), random(height)));
    }

    // Create connections
    nodes.forEach((node, index) => {
        let connections = floor(random(minConnections, maxConnections + 1));
        for (let j = 0; j < connections; j++) {
            let targetIndex = floor(random(numNodes));
            if (targetIndex !== index) { // Prevent connecting to itself
                let edge = new Edge(node, nodes[targetIndex]);
                edges.push(edge);
            }
        }
    });

    loop(); // Start the drawing loop
    
}

function draw() {
    background(255);
    edges.forEach(edge => edge.display());
    nodes.forEach(node => {
        node.update();
        node.display();
    });
}

function persecuteNode() {
    let index = floor(random(nodes.length));
    let selectedNode = nodes[index];
    let connections = edges.filter(edge => edge.node1 === selectedNode || edge.node2 === selectedNode);

    if (connections.length >= persecutionThreshold) {
        selectedNode.persecute();
    } else {
        selectedNode.showMercy();
    }
}

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = 8; // Standard radius
        this.color = color(100, 200, 255);
        this.toBeRemoved = false;
    }

    update() {
        if (!this.toBeRemoved) {
            this.x += random(-1, 1);
            this.y += random(-1, 1);
        }
    }

    display() {
        fill(this.color);
        ellipse(this.x, this.y, this.r * 2, this.r * 2);
    }

    persecute() {
        this.color = color(255, 0, 0); // Red for persecution
        this.toBeRemoved = true;
        setTimeout(() => {
            let index = nodes.indexOf(this);
            nodes.splice(index, 1);
            edges = edges.filter(edge => edge.node1 !== this && edge.node2 !== this);
        }, 1000);
    }

    showMercy() {
        let originalColor = this.color;
        this.color = color(0, 0, 255); // Blue for mercy
        setTimeout(() => {
            this.color = originalColor;
        }, 1000);
    }
}

class Edge {
    constructor(node1, node2) {
        this.node1 = node1;
        this.node2 = node2;
    }

    display() {
        stroke(0);
        line(this.node1.x, this.node1.y, this.node2.x, this.node2.y);
    }
}

