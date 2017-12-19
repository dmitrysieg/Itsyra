define([
    'lib/three.min',
    'logic/bfs'
], function(THREE, BFS) {

    /**
     * System organization:
     * * Building - container with elements.
     * * Elements - set of elements with mutual constraints.
     * * Constraint - rule of dependency for an element from one/multiple other elements.
     */

    /**
     * Should return CW directed to the linked element ordered points.
     */
    var ConnectingShapeConstraint = function(shapePoints) {
        this.shapePoints = shapePoints;
    };

    var RectBasementElement = function(lengthX, lengthZ, height, material) {
        this.lengthX = lengthX;
        this.lengthZ = lengthZ;
        this.height = height;
        this.material = material;
        this.constraints = [
            new ConnectingShapeConstraint([
                new THREE.Vector3(-0.5 * lengthX, 0, -0.5 * lengthZ),
                new THREE.Vector3(-0.5 * lengthX, 0,  0.5 * lengthZ),
                new THREE.Vector3( 0.5 * lengthX, 0,  0.5 * lengthZ),
                new THREE.Vector3( 0.5 * lengthX, 0, -0.5 * lengthZ)
            ])
        ];
    };

    RectBasementElement.prototype = {
        createMesh: function() {
            this.geometry = new THREE.CubeGeometry(this.lengthX, this.height, this.lengthZ);
            this.mesh = new THREE.Mesh(this.geometry, this.material);

            this.mesh.position.setY(-0.5 * height);
            return this.mesh;
        },
        getConstraints: function() {
            return this.constraints;
        }
    };

    var RectPerimeterWallElement = function(height) {
        this.height = height;
        this.constraints
    };

    RectPerimeterWallElement.prototype = {
        createMesh: function() {
            this.mesh = new THREE.Group();

            this.wall_1 = {geometry: new THREE.CubeGeometry(sizeX, sizeY, wallWidth), material: this.wallMaterial};
            this.wall_1.mesh = new THREE.Mesh(this.wall_1.geometry, this.wall_1.material);
            this.wall_1.mesh.position.setZ(-0.5 * sizeZ + 0.5 * wallWidth);
            this.wall_1.mesh.position.setY(0.5 * sizeY);
            this.mesh.add(this.wall_1.mesh);

            this.wall_2 = {geometry: new THREE.CubeGeometry(sizeX, sizeY, wallWidth), material: this.wallMaterial};
            this.wall_2.mesh = new THREE.Mesh(this.wall_2.geometry, this.wall_2.material);
            this.wall_2.mesh.position.setZ(0.5 * sizeZ - 0.5 * wallWidth);
            this.wall_2.mesh.position.setY(0.5 * sizeY);
            this.mesh.add(this.wall_2.mesh);

            this.wall_3 = {geometry: new THREE.CubeGeometry(wallWidth, sizeY, sizeZ - 2.0 * wallWidth), material: this.wallMaterial};
            this.wall_3.mesh = new THREE.Mesh(this.wall_3.geometry, this.wall_3.material);
            this.wall_3.mesh.position.setX(-0.5 * sizeX + 0.5 * wallWidth);
            this.wall_3.mesh.position.setY(0.5 * sizeY);
            this.mesh.add(this.wall_3.mesh);

            this.wall_4 = {geometry: new THREE.CubeGeometry(wallWidth, sizeY, sizeZ - 2.0 * wallWidth), material: this.wallMaterial};
            this.wall_4.mesh = new THREE.Mesh(this.wall_4.geometry, this.wall_4.material);
            this.wall_4.mesh.position.setX(0.5 * sizeX - 0.5 * wallWidth);
            this.wall_4.mesh.position.setY(0.5 * sizeY);
            this.mesh.add(this.wall_4.mesh);

            return this.mesh;
        }/*,
        acceptConstraints: function(constraints) {
            for (var i = 0; i < constraints.length; i++) {
                if (constraints[i] typeof )
            }
        }*/
    };

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
    var shapeHelper = new ShapeHelper();

    var Building2 = function() {

        this.materials = {};

        this.materials["cement"] = new THREE.MeshPhongMaterial({color: 0x777777});

        var wallTexture = new THREE.TextureLoader().load('images/brick.jpg');
        wallTexture.wrapS = THREE.RepeatWrapping;
        wallTexture.wrapT = THREE.RepeatWrapping;
        wallTexture.repeat.set(4, 4);
        this.materials["brick"] = new THREE.MeshBasicMaterial({map: wallTexture});

        this.materials["floor"] = this.materials["brick"];

        var roofTexture = new THREE.TextureLoader().load('images/roof.jpg');
        roofTexture.wrapS = THREE.RepeatWrapping;
        roofTexture.wrapT = THREE.RepeatWrapping;
        roofTexture.repeat.set(4, 4);
        this.materials["roof"] = new THREE.MeshBasicMaterial({map: roofTexture, side: THREE.DoubleSide});

        var groundTexture = new THREE.TextureLoader().load('images/cobblestone.jpg');
        groundTexture.wrapS = THREE.RepeatWrapping;
        groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set(4, 4);
        this.materials["cobblestone"] = new THREE.MeshBasicMaterial({map: groundTexture, side: THREE.DoubleSide});

        this.graph = {
            elements: {
                "basement": {
                    "base": null,
                    "shape": {
                        "operation": "new",
                        "type": "rect",
                        "length-x": "16.0",
                        "length-z": "10.0"
                    },
                    "mesh": {
                        "operation": "extrude",
                        "height": "5.0",
                        "material": "cement"
                    }
                },
                "wall": {
                    "base": "basement",
                    "shape": {
                        "operation": "outline",
                        "outline-width": "0.5"
                    },
                    "mesh": {
                        "operation": "extrude",
                        "height": "10.0",
                        "material": "brick"
                    }
                },
                "floor": {
                    "base": "wall",
                    "shape": {
                        "operation": "inner-outline-shape"
                    },
                    "mesh": {
                        "operation": "extrude",
                        "height": "0.5",
                        "material": "floor"
                    }
                },
                "roof": {
                    "base": "wall",
                    "shape": {
                        "operation": "outer-outline-shape"
                    },
                    "mesh": {
                        "operation": "center-prism",
                        "height": "= 0.25 * wall.height",
                        "material": "roof"
                    }
                }
            },
            root: "basement"
        };
    };

    Building2.prototype = {
        createStraightGraph: function() {
            var elements = this.graph.elements;
            for (var key in elements) {
                var base = elements[key].base;
                if (!base) {
                    if (key != this.graph.root) {
                        throw "Non-root element " + key + " doesn't have a base element";
                    } else {
                        continue;
                    }
                }
                if (!elements[base].next) {
                    elements[base].next = [];
                }
                elements[base].next.push(key);
            }
        },
        getMesh: function() {
            if (!this.group) {
                this.build();
            }
            return this.group;
        },
        getNext: function(name) {
            var next = this.graph.elements[name].next;
            if (!next) {
                next = [];
            }
            return next;
        },
        build: function() {

            this.createStraightGraph();

            this.group = new THREE.Group();

            new BFS(
                this.graph,
                this.getNext,
                this.createElement,
                this // todo leave only "this"
            ).run();
        },
        createElement: function(name) {

            var el = this.graph.elements[name];
            var parentEl = this.graph.elements[el.base];
            var shape = new THREE.Shape();

            if (el.shape.operation == "new") {

                if (el.shape.type == "rect") {

                    var lengthX = Number.parseFloat(el.shape["length-x"]);
                    var lengthZ = Number.parseFloat(el.shape["length-z"]);

                    shape.moveTo(0, 0);
                    shape.lineTo(0, lengthZ);
                    shape.lineTo(lengthX, lengthZ);
                    shape.lineTo(lengthX, 0);
                    shape.lineTo(0, 0);

                } else {
                    throw "Unsupported shape: " + el.shape.shape;
                }

            } else if (el.shape.operation == "outline") {

                var outlineWidth = Number.parseFloat(el.shape["outline-width"]);
                // todo switch from inner/outer to initial/resulted
                el.shape.outerOutline = parentEl.shape.shape;

                shape = shapeHelper.createOutline(parentEl.shape.shape, outlineWidth);

                el.shape.innerOutline = shape;

            } else if (el.shape.operation == "inner-outline-shape") {

                shape = parentEl.shape.innerOutline;

            } else if (el.shape.operation == "outer-outline-shape") {

                shape = parentEl.shape.outerOutline;

            } else {
                throw "Shape operation \"" + el.shape.operation + "\" is unsupported";
            }
            el.shape.shape = shape;

            var mesh = null;

            if (el.mesh.operation == "extrude") {

                var height = Number.parseFloat(el.mesh.height);

                var geometry = new THREE.ExtrudeGeometry(shape, {steps: 2, amount: height});
                var material = new THREE.MeshBasicMaterial(this.materials[el.mesh.material]);
                mesh = new THREE.Mesh(geometry, material) ;

            } else if (el.mesh.operation == "center-prism") {

            } else {
                throw "Mesh operation \"" + el.mesh.operation + "\" is unsupported";
            }
            el.mesh.mesh = mesh;

            // add mesh to the group
            if (mesh) {
                this.group.add(mesh);
            }
        }
    };

    var Building = function(sizeX, sizeZ, sizeY){

        var floorHeight = 0.5;

        var groundLevel = 0.0;

        var wallWidth = 0.5;

        var roofHeight = 0.25 * sizeY;







        // Mandatory element - floor
        this.floor = {geometry: new THREE.CubeGeometry(sizeX, floorHeight, sizeZ), material: this.wallMaterial};
        this.floor.mesh = new THREE.Mesh(this.floor.geometry, this.floor.material);

        this.floor.mesh.position.setY(groundLevel + 0.5 * floorHeight);
        this.group.add(this.floor.mesh);

        // Mandatory elements - walls (supporting only rectangle now)


        // Mandatory element - roof (triangle prism now only)
        this.roof = {
            geometry: new THREE.Geometry(),
            material: this.roofMaterial
        };
        this.roof.geometry.vertices.push(new THREE.Vector3(-0.5 * sizeX, sizeY, -0.5 * sizeZ));
        this.roof.geometry.vertices.push(new THREE.Vector3(-0.5 * sizeX, sizeY, +0.5 * sizeZ));
        this.roof.geometry.vertices.push(new THREE.Vector3(-0.5 * sizeX, sizeY + roofHeight, 0.0));

        this.roof.geometry.vertices.push(new THREE.Vector3(0.5 * sizeX, sizeY, -0.5 * sizeZ));
        this.roof.geometry.vertices.push(new THREE.Vector3(0.5 * sizeX, sizeY, +0.5 * sizeZ));
        this.roof.geometry.vertices.push(new THREE.Vector3(0.5 * sizeX, sizeY + roofHeight, 0.0));

        // triangle sides
        this.roof.geometry.faces.push(new THREE.Face3(0, 1, 2));
        this.roof.geometry.faces.push(new THREE.Face3(3, 4, 5));
        // bottom
        this.roof.geometry.faces.push(new THREE.Face3(0, 1, 4));
        this.roof.geometry.faces.push(new THREE.Face3(0, 4, 3));
        // square sides
        this.roof.geometry.faces.push(new THREE.Face3(0, 2, 5));
        this.roof.geometry.faces.push(new THREE.Face3(0, 5, 3));
        this.roof.geometry.faces.push(new THREE.Face3(2, 1, 4));
        this.roof.geometry.faces.push(new THREE.Face3(2, 4, 5));
        this.roof.geometry.computeFaceNormals();

        this.roof.geometry.faceVertexUvs[0] = [];
        this.roof.geometry.faceVertexUvs[0].push([new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(0.5, 0.5)]);
        this.roof.geometry.faceVertexUvs[0].push([new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(0.5, 0.5)]);

        this.roof.geometry.faceVertexUvs[0].push([new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1)]);
        this.roof.geometry.faceVertexUvs[0].push([new THREE.Vector2(0, 0), new THREE.Vector2(1, 1), new THREE.Vector2(0, 1)]);

        this.roof.geometry.faceVertexUvs[0].push([new THREE.Vector2(1, 0), new THREE.Vector2(1, 1), new THREE.Vector2(0, 1)]);
        this.roof.geometry.faceVertexUvs[0].push([new THREE.Vector2(1, 0), new THREE.Vector2(0, 1), new THREE.Vector2(0, 0)]);
        this.roof.geometry.faceVertexUvs[0].push([new THREE.Vector2(0, 1), new THREE.Vector2(0, 0), new THREE.Vector2(1, 0)]);
        this.roof.geometry.faceVertexUvs[0].push([new THREE.Vector2(0, 1), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1)]);
        this.roof.geometry.uvsNeedUpdate = true;

        this.roof.mesh = new THREE.Mesh(this.roof.geometry, this.roof.material);
        this.group.add(this.roof.mesh);

        // ground
        // todo: to terrain class
        this.ground = {geometry: new THREE.Geometry(), material: this.groundMaterial};
        this.ground.geometry.vertices.push(new THREE.Vector3(- (sizeX + sizeZ), groundLevel, - (sizeX + sizeZ)));
        this.ground.geometry.vertices.push(new THREE.Vector3(- (sizeX + sizeZ), groundLevel, + (sizeX + sizeZ)));
        this.ground.geometry.vertices.push(new THREE.Vector3(+ (sizeX + sizeZ), groundLevel, - (sizeX + sizeZ)));
        this.ground.geometry.vertices.push(new THREE.Vector3(+ (sizeX + sizeZ), groundLevel, + (sizeX + sizeZ)));

        this.ground.geometry.faces.push(new THREE.Face3(0, 1, 3));
        this.ground.geometry.faces.push(new THREE.Face3(0, 3, 2));
        this.ground.geometry.computeFaceNormals();

        this.ground.geometry.faceVertexUvs[0] = [];
        this.ground.geometry.faceVertexUvs[0].push([
            new THREE.Vector2(0, 0),
            new THREE.Vector2(0, 1),
            new THREE.Vector2(1, 1)
        ]);
        this.ground.geometry.faceVertexUvs[0].push([
            new THREE.Vector2(0, 0),
            new THREE.Vector2(1, 1),
            new THREE.Vector2(1, 0)
        ]);
        this.ground.geometry.uvsNeedUpdate = true;

        this.ground.mesh = new THREE.Mesh(this.ground.geometry, this.ground.material);
        this.group.add(this.ground.mesh);

        return this;
    };

    Building.prototype = {
        getMesh: function() {
            return this.group;
        }
    };

    return Building2;
});