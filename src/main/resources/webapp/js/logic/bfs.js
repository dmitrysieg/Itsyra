define([
    'lib/three.min'
], function(THREE) { // todo reduce THREE dependency

    var BFS = function(graph, getNext, action, scope) {
        this.graph = graph;
        this.getNext = getNext;
        this.action = action;
        this.scope = scope;
    };

    BFS.prototype = {
        run: function() {

            var elements = this.graph.elements;
            var stack = [this.graph.root];

            while (stack.length > 0) {

                var frontStack = [];
                while (stack.length > 0) {
                    var el = stack.pop();
                    if (elements[el].passed) {
                        continue;
                    }
                    this.action.call(this.scope, el);
                    elements[el].passed = true;

                    var nextEls = this.getNext.call(this.scope, el);
                    Array.prototype.push.apply(frontStack, nextEls);
                }
                stack = frontStack;
            }
        }
    };

    return BFS;
});