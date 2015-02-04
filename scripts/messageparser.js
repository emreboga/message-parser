
// Message Parser for IM messages
var MessageParser = (function(utils) {

    // constructor
    // options: object that contains predefined Rules for the Message Parser
    var mp = function(options) {
        this.rules = {};
        if (!utils.isEmptyArray(options.rules)) {
            // set each rule provided
            for (var i = 0, l = options.rules.length; i < l; i++) {
                var rule = options.rules[i];
                this.rules[rule.name] = rule;
            }
        }
    };

    // rules for the parser
    mp.prototype.rules = null;

    // adds a new rule to the parser
    // rule: rule object to be added
    mp.prototype.addRule = function(rule) {
        if (!utils.isUndefinedOrNull(rule)) {
            this.rules[rule.name] = rule;
        }
    };

    // removes an existing rule from the parser
    // name: name of the rule to be removed
    mp.prototype.removeRule = function(name) {
        if (!utils.isEmptyString(name) && this.rules.hasOwnProperty(name)) {
            delete this.rules[name];
        }
    };

    // parses the specified message according to the current rules
    // message: string to be parsed
    mp.prototype.parse = function(message) {
        var that = this;
        var promises = [];
        if (utils.isEmptyString(message)) {
            // resolve with an error message if no message specified
            return Promise.resolve(utils.logError(that, 'Empty message'));
        } else {
            for (var name in this.rules) {
                // apply each rule and store promises for each
                if (this.rules.hasOwnProperty(name)) {
                    var rule = this.rules[name];
                    promises.push(rule.apply(message));
                }
            }
            // return the promise that resolves when all Rules' promises resolves
            return Promise.all(promises).then(function(results) {
                var parsed = {};
                for (var i = 0, l = results.length; i < l; i++) {
                    // combine all results in a containing object (parsed)
                    var result = results[i];
                    for (var property in result) {
                        if (result.hasOwnProperty(property)) {
                            parsed[property] = result[property];
                        }
                    }
                }
                return parsed;
            });
        }
    };

    // get all rules for the message parser
    mp.prototype.getRules = function() {
        return this.rules;
    };

    return mp;
}(Utility));
