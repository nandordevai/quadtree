class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contains(point) {
        return (
            point.x >= this.x - this.w &&
            point.x <= this.x + this.w &&
            point.y >= this.y - this.h &&
            point.y <= this.y + this.h
        );
    }

    intersects(other) {
        // intersects if the distance between them both horizontally AND vertically is less than 0
        const horizontalDistance = Math.abs(this.x - other.x) - this.w - other.w;
        const verticalDistance = Math.abs(this.y - other.y) - this.h - other.h;
        return horizontalDistance < 0 && verticalDistance < 0;
    }
}

class QuadTree {
    constructor(boundary, n) {
        this.boundary = boundary;
        this.capacity = n;
        this.points = [];
        this.divided = false;
    }

    insert(point) {
        if (!this.boundary.contains(point)) return false;

        if (this.points.length < this.capacity) {
            this.points.push(point);
        } else {
            if (!this.divided) {
                this.subdivide();
            }
            this.ne.insert(point)
                || this.nw.insert(point)
                || this.se.insert(point)
                || this.sw.insert(point);
        }
        return true;
    }

    subdivide() {
        const x = this.boundary.x;
        const y = this.boundary.y;
        const w = this.boundary.w;
        const h = this.boundary.h;
        this.ne = new QuadTree(
            new Rectangle(x + w / 2, y - h / 2, w / 2, h / 2),
            this.capacity
        );
        this.nw = new QuadTree(
            new Rectangle(x - w / 2, y - h / 2, w / 2, h / 2),
            this.capacity
        );
        this.se = new QuadTree(
            new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2),
            this.capacity
        );
        this.sw = new QuadTree(
            new Rectangle(x - w / 2, y + h / 2, w / 2, h / 2),
            this.capacity
        );
        this.divided = true;
    }

    show() {
        stroke(0);
        strokeWeight(1);
        noFill();
        rectMode(CENTER);
        rect(this.boundary.x, this.boundary.y, this.boundary.w * 2, this.boundary.h * 2);
        if (this.divided) {
            this.nw.show();
            this.ne.show();
            this.sw.show();
            this.se.show();
        }
        strokeWeight(3);
        for (let p of this.points) {
            point(p.x, p.y);
        }
    }

    query(range, found) {
        if (!this.boundary.intersects(range)) return;
        for (let p of this.points) {
            if (range.contains(p)) {
                found.push(p);
            }
        }
        if (this.divided) {
            this.ne.query(range, found);
            this.nw.query(range, found);
            this.se.query(range, found);
            this.sw.query(range, found);
        }
    }
}
