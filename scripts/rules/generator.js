var RuleGenerator = (function(utils, Rule, LinkRule) {
    var ruleGen = {};

    ruleGen.generate = function(config) {
        var rules = [];
        for (var i = 0, l = config.rules.length; i < l; i++) {
            var rule = config.rules[i];
            var options = {};
            // set common properties
            options.name = rule.name;
            options.regex = rule.regex;
            switch (rule.type) {
                case 'link':
                    options.fetchUrl = rule.fetchUrl;
                    rules.push(new LinkRule(options));
                    break;
                case 'mention':
                case 'emoticon':
                    // no specific options
                    rules.push(new Rule(options));
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
}(Utility, Rule, LinkRule));
