define(function() {

    /**
     * Create new BFS algorithm worker.
     * Contract for the target object:
     * - target.graph should contain graph: {elements: ..., root: ...}.
     * - target.getNext should be a function returning an array of the next elements for a given element.
     * - target.action should be a function to be called on a single vertex bypassing. Is called with a scope of 'target'.
     * All the properties can be redefined by calling the related fluent methods.
     */
    var BFS = function(target) {
        this.graph = target.graph;
        this.getNext = target.getNext;
        this.action = target.action;
        this.scope = target;
    };

    BFS.prototype = {
        withAction: function(action) {
            this.action = action;
            return this;
        },
        withGetNext: function(getNext) {
            this.getNext = getNext;
            return this;
        },
        withGraph: function(graph) {
            this.graph = graph;
            return this;
        },
        withScope: function(scope) {
            this.scope = scope;
            return this;
        },
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