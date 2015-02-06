// A Rule generator for a given set of Rule configurations
var RuleGenerator = (function(utils, RuleBase, RuleLink) {

    var ruleGen = {};

    // generate rules for the given configurations
    // config: rule configurations
    // returns an array or Rules
    ruleGen.generate = function(config) {
        var rules = [];
        for (var i = 0, l = config.rules.length; i < l; i++) {
            // get each rule configuration
            var rule = config.rules[i];
            var options = {};
            // set common properties
            options.name = rule.name;
            options.regex = rule.regex;
            // set specific properties for each type
            switch (rule.type) {
                case 'link':
                    options.fetchUrl = rule.fetchUrl;
                    rules.push(new RuleLink(options));
                    break;
                case 'mention':
                case 'emoticon':
                    // no specific options
                    rules.push(new RuleBase(options));
                    break;
                default:
                    break;
            }
        }
        return {
            'rules': rules
        };
    };

    return ruleGen;
}(Utility, RuleBase, RuleLink));
