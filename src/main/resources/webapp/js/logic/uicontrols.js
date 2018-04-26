define(function() {

    var UIControls = function() {

        this.container = document.createElement("div");
        this.container.id = "div-info";
    };

    UIControls.prototype = {
        getBody: function() {
            return this.container;
        },
        update: function(data) {
            this.container.visible = false;
        }
    };

    return UIControls;
});