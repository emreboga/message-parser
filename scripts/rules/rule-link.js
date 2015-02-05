var RuleLink = (function(RuleBase, utils) {
    var RuleLink = RuleBase.extend({

        // function to be executed after regex parsing of the message
        // results: array returned as the results of regex parsing
        // returns a promise to be resolved when post processing completed
        postProcess: function(results) {
            var promise;
            var values = results[this.name];
            var fetchUrl = this.options.fetchUrl;
            if (!utils.isEmptyArray(values) && !utils.isUndefinedOrNull(fetchUrl)) {
                // resolve with page titles recieved from the service
                promise = this.getPageTitles(values, fetchUrl);
            } else {
                // log error if no fetchUrl defined
                var error;
                if (utils.isUndefinedOrNull(fetchUrl)) {
                    error = utils.logError(this, 'Empty fetch url');
                }
                // resolve with the error log
                promise = Promise.resolve(error);
            }
            return promise;
        },

        // fetchs the titles for the links specified
        // links
        getPageTitles: function(links, fetchUrl) {
            var that = this;
            // create and return a promise
            return new Promise(function(resolve) {
                if (!utils.isEmptyArray(links)) {
                    // craeate a body to use in POST call
                    var body = {};
                    body.links = links;
                    // make the POST call to the specified fetchUrl
                    utils.makeXHttpRequest(fetchUrl, 'POST', JSON.stringify(body)).then(function(response) {
                        if (!utils.isUndefinedOrNull(response)) {
                            // resolve with the response
                            resolve(JSON.parse(response));
                        } else {
                            // resolve with the error in case of no response
                            resolve(utils.logError(that, 'Empty response for the link collection: ' + links));
                        }
                    }, function(error) {
                        // resolve with the error from XmlHttp promise in case of a reject
                        resolve(utils.logError(error.context, error.message));
                    });
                } else {
                    // in case of no links we still need to resolve to continue execution on the caller's side
                    resolve();
                }
            });
        }
    });

    return RuleLink;
}(RuleBase, Utility));
