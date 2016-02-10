(function() {
    var Resolute = function(opt, callback) {
        var self = this;
        opt = opt || {};
        this.operation = opt.operation;
        this.maxRetry = opt.maxRetry || 3;
        this.callback = callback;
        this.delay = opt.delay || 1000;
    };

    Resolute.prototype.run = function(operation) {
        var self = this;

        var checkForPromise = function(opt) {
            // Do we have a operation?
            var operation = (typeof opt === "undefined") ? this.operation : opt;

            switch (operation.constructor.name) {
                case "Promise":
                    return this.operation;
                case "Function":
                    return this.operation();
                default:
                    throw new Error("Operation was not a Function or Promise: " + opt.operation);
            }
        };

        var fn = checkForPromise.call(self, operation);

        var _delay = function(ms) {
            return new Promise(function(resolve, reject) {
                setTimeout(resolve, ms);
            });
        };

        var _retry = function(retryCount, maxRetry, fn, delay) {
            retryCount = retryCount || 0;
            var retryMechanism = function(err) {
                if (retryCount >= maxRetry) {
                    throw err;
                }
                return _delay(self.delay).then(_retry.bind(null, retryCount + 1, maxRetry, fn, delay));
            };

            if (typeof self.callback == "function") {
                self.callback(retryCount);
            }

            return fn.then(null, retryMechanism);
        };

        return _retry(0, self.maxRetry, fn, self.delay);
    };

    // CommonJS module
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = Resolute;
        }
        exports.Resolute = Resolute;
    }

    // Register as an anonymous AMD module
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return Resolute;
        });
    }

    // If there is a window object, that at least has a document property,
    // instantiate and define Resolute on the window
    if (typeof window === "object" && typeof window.document === "object") {
        window.Resolute = Resolute;
    }
})();
