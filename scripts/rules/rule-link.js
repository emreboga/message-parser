var LinkRule = (function(Rule, utils) {
    var linkRule = Rule.extend({
        // function to be executed after regex parsing of the message
        // results: array returned as the results of regex parsing
        postProcess: function(results) {
            var promise;
            var values = results[this.name];
            var fetchUrl = this.options.fetchUrl;
            if (!utils.isEmptyArray(values) && !utils.isUndefinedOrNull(fetchUrl)) {
                promise = this.getPageTitles(values, fetchUrl);
            } else {
                var error;
                if (utils.isUndefinedOrNull(fetchUrl)) {
                    error = utils.logError(this, 'Empty fetch url');
                }
                promise = Promise.resolve(error);
            }
            return promise;
        },

        getPageTitles: function(links, fetchUrl) {
            var that = this;
            return new Promise(function(resolve) {
                if (!utils.isEmptyArray(links)) {
                    var body = {};
                    body.links = links;
                    utils.makeXHttpRequest(fetchUrl, 'POST', JSON.stringify(body)).then(function(response) {
                        if (!utils.isUndefinedOrNull(response)) {
                            resolve(JSON.parse(response));
                        } else {
                            resolve(utils.logError(that, 'Empty response for the link collection: ' + links));
                        }
                    }, function(error) {
                        // XmlHttp call rejected
                        resolve(utils.logError(error.context, error.message));
                    });
                } else {
                    resolve();
                }
            });
        }
    });

    return linkRule;
}(Rule, Utility));
