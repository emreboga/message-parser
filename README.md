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
}
```
**type:** Specifies the type of the rule. This is necessary to automate the rule generation from a options JSON object.  
**name:** Identifier of this specific rule object. Name can be different for each rule object, although they implement the same parsing rule.  
**regex:** Specifies the regular expression details for the rule. Regular expression is the main identifier of how a rule behaves.  
*pattern:* The pattern of the regular expression.  
*matchGroup:* Index of the regular expression group to be used in a matched pattern.

#### Methods
```javascript
apply(message)
```
Applies the rule to the message specified.
message (string): Message that the rule will be applied on.



