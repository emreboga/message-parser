// Test runner for a given parser and a set of unit-tests
var testRunner = (function(utils) {
    var testrunner = {};

    // test report for the results
    testrunner.reportHtml = '';

    // Runs the given set of unit tests with the specifiec parser
    // parser: a message-parser object
    // tests: a set of unit tests object
    // returns a promise that resolves when all tests complete
    testrunner.run = function(parser, tests) {
        // check parser and tests
        if (utils.isEmptyObject(parser) || utils.isEmptyObject(tests)) {
            Promise.reject('Parser or tests not found');
        }

        // empty the previous report, if any
        testrunner.reportHtml = '';

        var promises = [];
        for (var i = 0, l = tests.cases.length; i < l; i++) {
            // run each test case and store the promise
            var testCase = tests.cases[i];
            promises.push(parser.parse(testCase.input).then(makeTestCaseCallback(testCase)));
        }

        // return the promise which will resolve when all cases resolve and pass the report
        return Promise.all(promises);
    };

    // returns a callback which has the matching testCase in its scope
    function makeTestCaseCallback(testCase) {
        return function(results) {
            // get json strings for actual and expected results
            var actual = JSON.stringify(results);
            var expected = JSON.stringify(testCase.expected);
            // determine success case if both results are equal
            var success = actual === expected ? '<span class="passed">PASSED</span>' : '<span class="failed">FAILED</span>';
            // add the test results to the report
            testrunner.reportHtml += '<p><span class="test-header"><b>' + 'Running test case "' + testCase.name + '" :</b></span><br>';
            testrunner.reportHtml += '<span class="test-topic">Input: </span>' + testCase.input + '<br>';
            testrunner.reportHtml += '<span class="test-topic">Expected: </span>' + expected + '<br>';
            testrunner.reportHtml += '<span class="test-topic">Actual: </span>' + actual + '<br>';
            testrunner.reportHtml += '<span class="test-topic">Result: </span>' + success + '</p>';
        };
    }

    return testrunner;
}(Utility));
