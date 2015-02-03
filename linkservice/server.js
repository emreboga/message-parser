// require the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var async = require('async');

// create Express application
var app = express();

// add body-parser middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Set port
var port = process.env.PORT || 7777;

// Routes
var router = express.Router();

// Middleware for all requests to all routes
router.use(function(req, res, next) {
    // Set Access-Control-Allow-* headers for all requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // continue to the next middleware
    next();
});

// Regular expression to match a title element
var titleRegex = /<title.*>(.+?)<\/title>/im;

// Process a link to return the title for that page
var processLink = function(link, callback) {
    request(link, function(error, response, body) {
        // set the result.link which we'll need for both success and error cases
        var result = {};
        result.link = link;
        if (!error && response.statusCode === 200) {
            // success: find the title in html body and set result.title
            var title = null;
            var titleResult = titleRegex.exec(body);
            if (titleResult !== null && titleResult.length > 1) {
                title = titleResult[1];
            } else {
                console.log(body);
            }
            result.title = title === null ? 'Not Found' : title;
        } else {
            // error: set result.error accordingly
            if (error) {
                result.error = error;
            } else {
                result.error = response.statusCode;
            }
        }
        // return the results
        // as noticed 'error' object is never used
        // this is because async stops executing further tasks in case of an error
        // we use the result object to report both the success and the error cases
        callback(null, result);
    });
};

// Post method to return page titles for specified links
router.route('/links')
    .post(function(req, res) {
        // get the links from POST body
        var links = req.body.links;
        // log requested links
        console.log('Request for links: ' + links);
        if (links) {
            var asyncTasks = [];
            // Create the async task for each link and push for parallel execution
            links.forEach(function(link) {
                asyncTasks.push(function(callback) {
                    processLink(link, callback);
                });
            });
            // Execute all async tasks
            async.parallel(asyncTasks, function(error, results) {
                // Links are processed by now
                var linkResults = {};
                linkResults.links = results;
                res.json(linkResults);
            });
        }
    });

// Hook up the router to root path
app.use('/', router);

// Start the server
app.listen(port);
console.log('Link Service is now listening on ' + port);
