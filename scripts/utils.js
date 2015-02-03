// Utilities
var Utility = (function() {
    var utils = {};

    // check an object's null or undefined state
    utils.isUndefinedOrNull = function(obj) {
        return typeof obj === 'undefined' || obj === null;
    };

    // check empty object
    utils.isEmptyObject = function(obj) {
        return this.isUndefinedOrNull(obj) || obj === {};
    };

    // check empty string
    utils.isEmptyString = function(str) {
        return this.isUndefinedOrNull(str) || str === '';
    };

    // check empty array
    utils.isEmptyArray = function(array) {
        return this.isUndefinedOrNull(array) || array.length === 0;
    };

    // Our internal utility to make Xml Http requests
    // This function returns a 'promise' to be used by the caller
    utils.makeXHttpRequest = function(url, method, body) {
        var promise = new Promise(function(resolve) {
            var request = new XMLHttpRequest();
            if (typeof request !== 'undefined' && request !== null) {
                request.onreadystatechange = function() {
                    if (request.readyState === 4) {
                        if (request.status === 200) {
                            resolve(request.response);
                        } else {
                            resolve(utils.logError(null, 'Error status: ' + request.status + ' returned for url: ' + request.url));
                        }
                    }
                };
                request.open(method, url);
                request.setRequestHeader('Content-type', 'application/json');
                request.send(body);
            } else {
                resolve(utils.logError(null, 'Error creating XMLHttpRequest'));
            }
        });

        return promise;
    };

    utils.logError = function(context, message) {
        var errorObj = {};
        if (context.name) {
            errorObj[context.name] = {
                error: {
                    context: context, message: message
                }
            };
        } else {
            errorObj = {
                error: {
                    context: context, message: message
                }
            };
        }
        return errorObj;
    };

    return utils;
}());
