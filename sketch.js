let qt;

function setup() {
    createCanvas(400, 400);
    const boundary = new Rectangle(200, 200, 200, 200);
    qt = new QuadTree(boundary, 4);
    for (let i = 0; i < 400; i++) {
        const p = new Point(random(width), random(height));
        qt.insert(p);
    }
}

function draw() {
    background(255);
    qt.show();
    stroke(0, 185, 0);
    strokeWeight(2);
    rectMode(CENTER);
    const range = new Rectangle(mouseX, mouseY, 50, 50);
    rect(range.x, range.y, range.w * 2, range.h * 2);
    let points = [];
    qt.query(range, points);
    strokeWeight(4);
    for (const p of points) {
        point(p.x, p.y);
    }
}
