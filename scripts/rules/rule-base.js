var Rule = (function(utils) {

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

        // create a promise to be returned to the caller
        var promise = (new Promise(function(resolve) {
            if (!utils.isEmptyArray(resultsObj[that.name])) {
                // If there is a postProcess defined for this Rule (by any extending Rule)
                // the postProcess will be hooked to this promise as well
                if (typeof that.postProcess === 'function') {
                    that.postProcess(resultsObj).then(function(linkResults) {
                        if (!utils.isUndefinedOrNull(linkResults)) {
                            resolve(linkResults);
                        } else {
                            resolve(utils.logError(that, 'Empty linkResults'));
                        }
                    }, function(error) {
                        // pass the error from the postProcess to this promise's resolve
                        resolve(utils.logError(error.context, error.message));
                    });
                } else {
                    // if no postProcess defined, immediately resolve the results
                    resolve(resultsObj);
                }
            } else {
                // in case of no results, resolve with nothing
                resolve();
            }
        }));

        return promise;
    };

    // name of the rule
    rule.prototype.name = '';

    // regex object to keep the pattern and the group (matchGroup) to use in the matched pattern
    rule.prototype.regex = null;

    // set the Rule's extend to the utility extend function,
    // so any extending objects can call it directly from the Rule's context
    rule.prototype.extend = utils.extend;

    return rule;
}(Utility));
