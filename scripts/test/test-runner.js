var testRunner = (function(utils) {
    var testrunner = {};

    testrunner.reportHtml = '';

    testrunner.run = function(parser, tests) {
        if (utils.isEmptyObject(parser)) {
            return 'Parser not found';
        }
        if (utils.isEmptyObject(tests)) {
            return 'Test cases not found';
        }

        testrunner.reportHtml = '';
        var promises = [];
        for (var i = 0, l = tests.cases.length; i < l; i++) {
            var testCase = tests.cases[i];
            promises.push(parser.parse(testCase.input).then(makeTestCaseCallback(testCase)));
        }
        // return the promise which will resolve when all cases resolve and pass the report
        return Promise.all(promises);
    };

    function makeTestCaseCallback(testCase) {
        return function(results) {
            var actual = JSON.stringify(results);
            var expected = JSON.stringify(testCase.expected);
            var success = actual === expected ? '<span class="passed">PASSED</span>' : '<span class="failed">FAILED</span>';
            testrunner.reportHtml += '<p><span class="test-header"><b>' + 'Running test case "' + testCase.name + '" :</b></span><br>';
            testrunner.reportHtml += '<span class="test-topic">Input: </span>' + testCase.input + '<br>';
            testrunner.reportHtml += '<span class="test-topic">Expected: </span>' + expected + '<br>';
            testrunner.reportHtml += '<span class="test-topic">Actual: </span>' + actual + '<br>';
            testrunner.reportHtml += '<span class="test-topic">Result: </span>' + success + '</p>';
        };
    }

    return testrunner;
}(Utility));
