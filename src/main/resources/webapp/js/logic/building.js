define([
    'lib/three.min'
], function(THREE) {

    var Building = function(sizeX, sizeZ, sizeY){

        var basementHeight = 5.0;
        var floorHeight = 0.5;

        var groundLevel = 0.0;

        var wallWidth = 0.5;

        var roofHeight = 0.25 * sizeY;

        this.cementMaterial = new THREE.MeshPhongMaterial({color: 0x777777});
        this.woodMaterial = new THREE.MeshPhongMaterial({color: 0x8B4513});
        this.roofMaterial = new THREE.MeshPhongMaterial({color: 0xA52A2A, side: THREE.DoubleSide});
        this.groundMaterial = new THREE.MeshPhongMaterial({color: 0x228B22, side: THREE.DoubleSide});

        this.group = new THREE.Group();

        // Mandatory element - basement
        this.basement = {geometry: new THREE.CubeGeometry(sizeX, basementHeight, sizeZ), material: this.cementMaterial};
        this.basement.mesh = new THREE.Mesh(this.basement.geometry, this.basement.material);

        this.basement.mesh.position.setY(groundLevel - 0.5 * basementHeight);
        this.group.add(this.basement.mesh);

        // Mandatory element - floor
        this.floor = {geometry: new THREE.CubeGeometry(sizeX, floorHeight, sizeZ), material: this.woodMaterial};
        this.floor.mesh = new THREE.Mesh(this.floor.geometry, this.floor.material);

        this.floor.mesh.position.setY(groundLevel + 0.5 * floorHeight);
        this.group.add(this.floor.mesh);

        // Mandatory elements - walls (supporting only rectangle now)
        this.wall_1 = {geometry: new THREE.CubeGeometry(sizeX, sizeY, wallWidth), material: this.woodMaterial};
        this.wall_1.mesh = new THREE.Mesh(this.wall_1.geometry, this.wall_1.material);
        this.wall_1.mesh.position.setZ(-0.5 * sizeZ + 0.5 * wallWidth);
        this.wall_1.mesh.position.setY(0.5 * sizeY);
        this.group.add(this.wall_1.mesh);

        this.wall_2 = {geometry: new THREE.CubeGeometry(sizeX, sizeY, wallWidth), material: this.woodMaterial};
        this.wall_2.mesh = new THREE.Mesh(this.wall_2.geometry, this.wall_2.material);
        this.wall_2.mesh.position.setZ(0.5 * sizeZ - 0.5 * wallWidth);
        this.wall_2.mesh.position.setY(0.5 * sizeY);
        this.group.add(this.wall_2.mesh);

        this.wall_3 = {geometry: new THREE.CubeGeometry(wallWidth, sizeY, sizeZ), material: this.woodMaterial};
        this.wall_3.mesh = new THREE.Mesh(this.wall_3.geometry, this.wall_3.material);
        this.wall_3.mesh.position.setX(-0.5 * sizeX + 0.5 * wallWidth);
        this.wall_3.mesh.position.setY(0.5 * sizeY);
        this.group.add(this.wall_3.mesh);

        this.wall_4 = {geometry: new THREE.CubeGeometry(wallWidth, sizeY, sizeZ), material: this.woodMaterial};
        this.wall_4.mesh = new THREE.Mesh(this.wall_4.geometry, this.wall_4.material);
        this.wall_4.mesh.position.setX(0.5 * sizeX - 0.5 * wallWidth);
        this.wall_4.mesh.position.setY(0.5 * sizeY);
        this.group.add(this.wall_4.mesh);

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
        this.roof.geometry.faces.push(new THREE.Face3(1, 4, 3));
        // square sides
        this.roof.geometry.faces.push(new THREE.Face3(0, 2, 5));
        this.roof.geometry.faces.push(new THREE.Face3(0, 5, 3));
        this.roof.geometry.faces.push(new THREE.Face3(2, 1, 4));
        this.roof.geometry.faces.push(new THREE.Face3(2, 4, 5));
        this.roof.geometry.computeFaceNormals();

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

        this.ground.mesh = new THREE.Mesh(this.ground.geometry, this.ground.material);
        this.group.add(this.ground.mesh);

        return this;
    };

    Building.prototype = {
        getMesh: function() {
            return this.group;
        }
    };

    return Building;
});