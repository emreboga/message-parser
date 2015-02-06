# Message Parser
Message Parser is specifically built for a HipChar coding challenge.

## Library
This section gives details about each type in the Message Parser library.
### Message Parser
Main executer of the parsing functionality. Source code can be found in scripts/message-parser.js

#### Constructor
```javascript
new MessageParser(options)
```
Options (object): Specifies any predefined rule for the parser. The key of a rule in options is the name of the rule and the value is the rule object. Please see below for more details on rules.

#### Methods
```javascript
addRule(rule)
```
Adds a rule to the parser.
rule (object): Rule to be added.

```javascript
removeRule(name)
```
Removes a rule from the parser.
name (string): Name of the rule to be removed.

```javascript
parse(message)
```
Parses a specified string with the current rules.
message (string): Message to be parsed
returns: A Promise object that resolves with the results of the parse operation.

```javascript
getRules()
```
Gets all the rules of the parser.
returns: An array of rules. 

### Base Rule
Base functionality for any basic rule. Source code can be found in scripts/rules/rule-base.js

#### Constructor
```javascript
new RuleBase(options)
```
Options (object): Specifies all the options for a rule. A sample rule options look like:
```javascript
{
  'type': 'mention',
  'name': 'mentions',
  'regex': {
    'pattern': /\B@([a-z0-9]+)/ig,
    'matchGroup': 1
  }
  'fetchUrl': ''
}
```
**type (required):** Specifies the type of the rule. This is necessary to automate the rule generation from a options JSON object.  
**name (required):** Identifier of this specific rule object. Name can be different for each rule object, although they implement the same parsing rule.  
**regex (required):** Specifies the regular expression details for the rule. Regular expression is the main identifier of how a rule behaves.  
*pattern (required):* The pattern of the regular expression.  
*matchGroup (required):* Index of the regular expression group to be used in a matched pattern.
**fetchUrl (optional):** Url for an API end-point to be called with the results of a rule during the post-processing. Please see Link Rule details below for a sample usage.

#### Methods
```javascript
apply(message)
```
Applies the rule to the message specified.
message (string): Message that the rule will be applied on.
returns: A Promise object that resolves with the result of the rule application.

```javascript
postProcess(results)
```
Executed after all apply calls with the results.
results (array): Array of results from the rule application.
returns: A Promise object that resolves with the results after post-processing the passed-in results.

### Link Rule
Link rule is a specialized rule that inherits all the base functionality from Base Rule. Link Rule overrides the postProcess function to add the title retrieval mechanism for each link. For that purpose Link Rule calls the API end-point url specified by the fetchUrl property in rule options (see above for options object definition). For the Link Rule there is an API end-point (http://title-service.azurewebsites.net/links) to get the titles for the pages these links are pointing to. For more details please see the repo of the title retrieval service (https://github.com/winbythenose/title-retrieval-service).  
