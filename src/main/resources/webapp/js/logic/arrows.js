define([
    'lib/three.min'
], function(THREE) {

    var Arrows = function(length) {

        this.axis1 = new THREE.Vector3(1.0, 0.0, 0.0);
        this.axis2 = new THREE.Vector3(0.0, 1.0, 0.0);
        this.axis3 = new THREE.Vector3(0.0, 0.0, 1.0);
        this.position = new THREE.Vector3(0.0, 0.0, 0.0);

        this.arrow1 = new THREE.ArrowHelper(this.axis1, this.position, length, 0xFF0000);
        this.arrow2 = new THREE.ArrowHelper(this.axis2, this.position, length, 0x00FF00);
        this.arrow3 = new THREE.ArrowHelper(this.axis3, this.position, length, 0x0000FF);

        var group = new THREE.Group();
        group.add(this.arrow1);
        group.add(this.arrow2);
        group.add(this.arrow3);

        this.mesh = group;
    };

    Arrows.prototype = {
        getMesh: function() {
            return this.mesh;
        },
        // todo: is it possible to get rid of extra axis vectors rotation?
        rotate: function(quaternion) {
            this.arrow1.applyQuaternion(quaternion);
            this.arrow2.applyQuaternion(quaternion);
            this.arrow3.applyQuaternion(quaternion);
            this.axis1.applyQuaternion(quaternion);
            this.axis2.applyQuaternion(quaternion);
            this.axis3.applyQuaternion(quaternion);
        },
        move: function(position) {
            this.arrow1.position.copy(position);
            this.arrow2.position.copy(position);
            this.arrow3.position.copy(position);
        }
    };

    return Arrows;
});