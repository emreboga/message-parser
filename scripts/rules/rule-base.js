// Base Rule implementation
var RuleBase = (function(utils) {

    // constructor
    // options: object that contains the functional options for the Rule
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

    // applies the Rule to a specified message string
    // message: a string value to apply the Rule on
    // returns: a promise that resolves when the operation completes
    rule.prototype.apply = function(message) {
        var that = this;
        var resultsObj = {};
        var eachResult = [];

        // apply the regex to the message and store the results
        if (!utils.isEmptyString(message)) {
            var results = [];
            while ((eachResult = that.regex.pattern.exec(message)) !== null) {
                results.push(eachResult[that.regex.matchGroup]);
            }
            resultsObj[that.name] = results;
        }

        // create a promise to be returned back to the caller
        var promise = (new Promise(function(resolve) {
            if (!utils.isEmptyArray(resultsObj[that.name])) {
                // hook-up the postProcess to the returned promise
                that.postProcess(resultsObj).then(function(results) {
                    resolve(results);
                }, function(error) {
                    // pass the error from the postProcess to this promise's resolve
                    resolve(utils.logError(error.context, error.message));
                });
            } else {
                // in case of no results, resolve with nothing
                resolve();
            }
        }));

        return promise;
    };

    // function to be executed after regex parsing of the message
    // results: array returned as the results of regex parsing
    // returns a promise to be resolved when post processing completed
    rule.prototype.postProcess = function(results) {
        // this function is intended to be overridden by extending types
        // base implemetation immediately returns a promise resolving the results
        return Promise.resolve(results);
    };

    // name of the rule
    rule.prototype.name = '';

    // regex object to keep the pattern and the group (matchGroup) to use in the matched pattern
    rule.prototype.regex = null;

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
