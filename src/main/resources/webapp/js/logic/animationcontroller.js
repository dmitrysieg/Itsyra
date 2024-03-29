/**
 * Defines interactions between objects at the scene and animation logic.
 */
define(function() {

    var AnimationController = function(clock, scene) {
        this.clock = clock;
        this.scene = scene;
    };

    AnimationController.prototype = {

        /**
         * Drives animation logic.
         */
        animate: function() {

            var delta = this.clock.getDelta();

        }
    };

    return AnimationController;
});