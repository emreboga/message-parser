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
message (string): Message to be parsed.  
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

### Rule Generator
Rule Generator is a object which creates and returns a set of rules given a configuration.
#### Methods
```javascript
generate(config)
```
Generates an array of rules from the specified configuration.  
config (object): A configuration objects consists of an array of rule options.
```javascript
'rules' : [
  {
    'type': 'mention',
    'name': 'mentions',
    'regex': {
      'pattern': /\B@([a-z0-9]+)/ig,
      'matchGroup': 1
    }
  }
]
```
returns: An object with an array of rules.

## Test Framework
Message Parser comes with a test framework which is written for both manual and unit tests. The main page for the Message Parser site (http://winbythenose.github.io/message-parser/) is where you can use the test framework to run both manual and unit tests.

### Manual testing
The first screen in the Message Parser testing page is for manual testing where the user can enter any message text and click 'parse' to get the results.

### Unit testing
The unit test section in the Message Parser testing page gives the user a quick verification for all the rules currently defined in scripts/rules/all-rules.js configuration file.  
The definitions for the unit tests to be run can be found in scripts/test/unit-tests.js file. A sample unit test case looks like:
```javascript
{
  'name': 'mentions',
  'input': 'The quick brown @fox jumps over the lazy @dog',
  'expected': {
    'mentions': [
      'fox',
      'dog'
    ]
  }
}
```
A sample output for the case above will be:
```javascript
Running test case "mentions" :
Input: The quick brown @fox jumps over the lazy @dog
Expected: {"mentions":["fox","dog"]}
Actual: {"mentions":["fox","dog"]}
Result: PASSED
```
As needed, more tests can be added to the unit-tests.js file for verification. 'Run all tests' action on the unit tests section will run all unit tests in this file and report the results in the same page.
