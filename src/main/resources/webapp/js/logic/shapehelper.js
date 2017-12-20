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

            var points = shape.getPoints(),
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
        }
    };

    return ShapeHelper;
});