var Rule = (function(utils) {

    // Constructor
    var rule = function(options) {
        // validate and set known options
        if (!utils.isUndefinedOrNull(options.regex) && 
            !utils.isUndefinedOrNull(options.regex.pattern) && 
            !utils.isUndefinedOrNull(options.regex.matchGroup)) {
            this.regex = options.regex;
        }
        if (!utils.isUndefinedOrNull(options.name)) {
            this.name = options.name;
        }

        // cache all options for custom usage by extending rules
        this.options = options;
    };

    rule.prototype.apply = function(message) {
        var that = this;
        var resultsObj = {};
        var eachResult = [];
        if (!utils.isEmptyString(message)) {
            var results = [];
            while ((eachResult = that.regex.pattern.exec(message)) !== null) {
                results.push(eachResult[that.regex.matchGroup]);
            }
            resultsObj[that.name] = results;
        }
        var promise = (new Promise(function(resolve) {
            if (!utils.isEmptyArray(resultsObj[that.name])) {
                if (typeof that.postProcess === 'function') {
                    that.postProcess(resultsObj).then(function(linkResults) {
                        if (!utils.isUndefinedOrNull(linkResults)) {
                            resolve(linkResults);
                        } else {
                            resolve(utils.logError(that, 'Empty linkResults'));
                        }
                    }, function(error) {
                        resolve(utils.logError(error.context, error.message));
                    });
                } else {
                    resolve(resultsObj);
                }
            } else {
                resolve();
            }
        }));

        return promise;
    };

    rule.prototype.name = '';
    rule.prototype.regex = null;
    rule.prototype.matchGroup = 0;

    // Helper function to set up the prototype chain for subclasses
    // We cannot use underscore extend here, which only copies the properties not chaining prototypes
    rule.extend = function(protoProps) {
        var parent = this;
        var child;
        // The constructor function for the new subclass is either defined by the child
        // or defaulted to simply calling the parent's constructor
        if (!utils.isUndefinedOrNull(protoProps) && protoProps.hasOwnProperty('constructor')) {
            child = protoProps.constructor;
        } else {
            child = function() {
                return parent.apply(this, arguments);
            };
        }
        // Set the prototype chain to inherit from parent, without calling parent's constructor function
        var Surrogate = function() {
            this.constructor = child;
        };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate();
        // Add prototype properties (instance properties) to the subclass
        if (!utils.isUndefinedOrNull(protoProps)) {
            for (var property in protoProps) {
                child.prototype[property] = protoProps[property];
            }
        }
        // Set a convenience property in case the parent's prototype is needed later
        child.__super__ = parent.prototype;
        return child;
    };

    return rule;
}(Utility));
