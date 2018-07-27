define([
    'lib/three.min'
], function(THREE) {

    var ShapeHelper = function() {
        };

    ShapeHelper.prototype = {
        getNormal: function(v0, v1) {
            var dv = v1.clone().sub(v0);
            dv.set(-dv.y, dv.x).normalize();
            return dv;
        },
        getAverage: function(v0, v1) {
            return v0.set(v0.x + v1.x, v0.y + v1.y).normalize();
        },
        createOutline: function(shape, thickness) {

            var points = shape.getPoints().slice(),
                count = points.length,
                addLast = false;

            if (points[0].x == points[count - 1].x &&
                points[0].y == points[count - 1].y) {
                addLast = true;
                points.pop();
                count--;
            }

            // vertex normals
            var vns = [];
            for (var i = 0; i < count; i++) {

                // normal between previous and this vertex
                var n0 = this.getNormal(points[i], points[(count + i - 1) % count]);

                // normal between this and next vertex
                var n1 = this.getNormal(points[(i + 1) % count], points[i]);

                var vn = this.getAverage(n0, n1);
                vns.push(vn);
            }

            // outlining
            var result = new THREE.Shape();

            var _x0 = points[0].x + vns[0].x * thickness,
                _y0 = points[0].y + vns[0].y * thickness;
            result.moveTo(_x0, _y0);

            for (var i = 1; i < count; i++) {
                var _xi = points[i].x + vns[i].x * thickness,
                    _yi = points[i].y + vns[i].y * thickness;
                result.lineTo(_xi, _yi);
            }
            result.lineTo(_x0, _y0);

            return result;
        },
        /**
         * @param faces - Array of geometry.faces.
         * @param v - Array of vertices indexes in a clockwise order.
         */
        drawFace4: function(faces, v) {
            faces.push(new THREE.Face3(v[0], v[1], v[2]));
            faces.push(new THREE.Face3(v[0], v[2], v[3]));
        },

        /**
         * Draw a face for 4 last vertices added.
         * @param faces geometry.faces
         * @param vertices geometry.vertices
         */
        drawFace4_last: function(faces, vertices, direction) {
            var e = vertices.length - 4;
            if (direction > 0) {
                this.drawFace4(faces, [e, e + 1, e + 2, e + 3]);
            } else {
                this.drawFace4(faces, [e + 3, e + 2, e + 1, e]);
            }
        },

        addTriangulatedOutlinedManhattanShape: function(geometry, points, holePoints, heightLevel, faceSign) {

            var p = points, ip = holePoints;
            var l = p.length;
            if (l !== ip.length) {
                throw "Hole points count is not correspondent to original shape points count!";
            }

            for (var i = 0; i < l; i++) {
                var next_i = (i + 1) % l;
                geometry.vertices.push(new THREE.Vector3(p[i].x, p[i].y, heightLevel));
                geometry.vertices.push(new THREE.Vector3(p[next_i].x, p[next_i].y, heightLevel));
                geometry.vertices.push(new THREE.Vector3(ip[next_i].x, ip[next_i].y, heightLevel));
                geometry.vertices.push(new THREE.Vector3(ip[i].x, ip[i].y, heightLevel));
                this.drawFace4_last(geometry.faces, geometry.vertices, faceSign);

                geometry.faceVertexUvs[0].push([new THREE.Vector2(0, 0), new THREE.Vector2(0, 1), new THREE.Vector2(0.1, 1 - 0.1)]);
                geometry.faceVertexUvs[0].push([new THREE.Vector2(0, 0), new THREE.Vector2(0.1, 1 - 0.1), new THREE.Vector2(0.1, 0.1)]);
            }
        },

        /**
         * Return a Geometry extruded from the given shape; counting holes if present.
         * @param shape Can have: {points, holes {points}}.
         * @param height Total height of a resulted mesh.
         */
        extrudeShape: function(shape, height) {
            var geometry = new THREE.Geometry();

            var points = shape.getPoints().slice(),
                holePoints = shape.holes[0].getPoints(),
                count = points.length;

            if (points[0].x == points[count - 1].x &&
                points[0].y == points[count - 1].y) {
                points.pop();
                holePoints.pop();
                count--;
            }

            geometry.faceVertexUvs[0] = [];

            /*     1----------5-------(*) + 1
             *    /|         /|       /|
             *  (3)-------(7)-------(*)| + 3
             *   | |       |  |      | |
             *   | |       |  |      | |
             *   | |       |  |      | |                  -> outer
             *   | 0-------|--4------|(*) = count * 4     |
             *   |/        | /       |/                             ^
             *  (2)-------(6)-------(*) = count * 4 + 2            -| inner
             */
            for (var i = 0; i < count; i++) {

                // outer
                geometry.vertices.push(new THREE.Vector3(points[i].x, points[i].y, 0.0));
                geometry.vertices.push(new THREE.Vector3(points[i].x, points[i].y, height));
                // inner
                geometry.vertices.push(new THREE.Vector3(holePoints[i].x, holePoints[i].y, 0.0));
                geometry.vertices.push(new THREE.Vector3(holePoints[i].x, holePoints[i].y, height));

                // if the rect with prev.vertices already exists
                if (i > 0) {

                    // outer
                    this.drawFace4(geometry.faces, [
                        i * 4 - 4,
                        i * 4 - 3,
                        i * 4 + 1,
                        i * 4
                    ]);
                    geometry.faceVertexUvs[0].push([new THREE.Vector2(0, 0), new THREE.Vector2(0, 1), new THREE.Vector2(1, 1)]);
                    geometry.faceVertexUvs[0].push([new THREE.Vector2(0, 0), new THREE.Vector2(1, 1), new THREE.Vector2(1, 0)]);

                    // inner
                    this.drawFace4(geometry.faces, [
                        i * 4 + 2 - 4,
                        i * 4 + 2,
                        i * 4 + 3,
                        i * 4 + 3 - 4
                    ]);
                    geometry.faceVertexUvs[0].push([new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1)]);
                    geometry.faceVertexUvs[0].push([new THREE.Vector2(0, 0), new THREE.Vector2(1, 1), new THREE.Vector2(0, 1)]);
                }
            }

            // outer finish
            this.drawFace4(geometry.faces, [
                (count - 1) * 4,
                (count - 1) * 4 + 1,
                1,
                0
            ]);
            geometry.faceVertexUvs[0].push([new THREE.Vector2(0, 0), new THREE.Vector2(0, 1), new THREE.Vector2(1, 1)]);
            geometry.faceVertexUvs[0].push([new THREE.Vector2(0, 0), new THREE.Vector2(1, 1), new THREE.Vector2(1, 0)]);

            // inner finish
            this.drawFace4(geometry.faces, [
                (count - 1) * 4 + 2,
                2,
                3,
                (count - 1) * 4 + 3
            ]);
            geometry.faceVertexUvs[0].push([new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1)]);
            geometry.faceVertexUvs[0].push([new THREE.Vector2(0, 0), new THREE.Vector2(1, 1), new THREE.Vector2(0, 1)]);

            this.addTriangulatedOutlinedManhattanShape(geometry, points, holePoints, 0, 1);
            this.addTriangulatedOutlinedManhattanShape(geometry, points, holePoints, height, -1);

            geometry.computeFaceNormals();

            return geometry;
        }
    };

    return ShapeHelper;
});