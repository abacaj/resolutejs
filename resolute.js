(function() {
  var Resolute = function(opt, callback) {
    opt = opt || {};
    this.maxRetry = opt.maxRetry || 3;
    this.fn = (function() {
      switch (opt.operation.constructor.name) {
        case "Promise":
          return opt.operation;
        case "Function":
          return opt.operation;
        default:
          throw new Error("Operation was not a function: " + opt.operation);
      }
    })();
    this.callback = callback;
    this.delay = opt.delay || 1000;
  };
  Resolute.prototype.run = function() {
    var self = this;
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
      return self.fn().then(null, retryMechanism);
    };

    return _retry(0, self.maxRetry, self.fn, self.delay);
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