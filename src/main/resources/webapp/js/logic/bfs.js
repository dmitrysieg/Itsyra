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
            var stack = this.getNext(this.graph.root);
            while (stack.length > 0) {
                var frontStack = [];
                while (stack.length > 0) {
                    var el = stack.pop();
                    var nextEls = this.getNext(el);
                    for (var nextEl in nextEls) {
                        if (!nextEl.passed) {
                            this.action.call(this.scope, nextEl);
                            frontStack.push(nextEl);
                        }
                    }
                }
                stack = frontStack;
            }
        }
    };

    return BFS;
});