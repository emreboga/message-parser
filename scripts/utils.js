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

    // internal utility to make Xml Http requests
    // returns a 'promise' to be used by the caller
    utils.makeXHttpRequest = function(url, method, body) {
        // create promise to be returned to the caller
        var promise = new Promise(function(resolve) {
            var request = new XMLHttpRequest();
            if (typeof request !== 'undefined' && request !== null) {
                request.onreadystatechange = function() {
                    // take action only when readystate is 'request finished and response is ready'
                    if (request.readyState === 4) {
                        if (request.status === 200) {
                            // resolve for html 200 responses
                            resolve(request.response);
                        } else {
                            // we still resolve for all other cases, but with an error message
                            resolve(utils.logError(null, 'Error status: ' + request.status + ' returned for url: ' + request.url));
                        }
                    }
                };
                // set the method and url for the request
                request.open(method, url);
                // set the content-type as json
                request.setRequestHeader('Content-type', 'application/json');
                // send the request with the body only for POST requests
                if (method === 'POST' && body) {
                    request.send(body);
                } else {
                    request.send();
                }
            } else {
                // in case of any XMLHttpRequest creation errors resolve with the error mesage
                resolve(utils.logError(null, 'Error creating XMLHttpRequest'));
            }
        });

        return promise;
    };

    // returns an error object with the context and message specifiec
    utils.logError = function(context, message) {
        var errorObj = {};
        // if there is a 'name' property (e.g. for Rule objects)
        // we use it to wrap the specific error message within
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
