
// Message Parser for HipChat
var MessageParser = (function(utils) {
    var mp = function(options) {
        this.rules = {};
        if (!utils.isEmptyArray(options.rules)) {
            for (var i = 0, l = options.rules.length; i < l; i++) {
                var rule = options.rules[i];
                this.rules[rule.name] = rule;
            }
        }
    };

    mp.prototype.rules = null;

    mp.prototype.addRule = function(rule) {
        if (!utils.isUndefinedOrNull(rule)) {
            this.rules[rule.name] = rule;
        }
    };

    mp.prototype.removeRule = function(name) {
        if (!utils.isEmptyString(name) && this.rules.hasOwnProperty(name)) {
            delete this.rules[name];
        }
    };

    mp.prototype.parse = function(message) {
        var that = this;
        var promises = [];
        if (utils.isEmptyString(message)) {
            return Promise.resolve(utils.logError(that, 'Empty message'));
        } else {
            for (var name in this.rules) {
                if (this.rules.hasOwnProperty(name)) {
                    var rule = this.rules[name];
                    promises.push(rule.apply(message));
                }
            }
            return Promise.all(promises).then(function(results) {
                var parsed = {};
                for (var i = 0, l = results.length; i < l; i++) {
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

    mp.prototype.getRules = function() {
        return this.rules;
    };

    return mp;
}(Utility));
