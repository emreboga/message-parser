(function() {

    var elmButtonManual = document.getElementById('button-manual');

    var elmTextArea = document.getElementById('input');
    var elmOutput = document.getElementById('output');
    var elmNavManTest = document.getElementById('nav-manual-test');
    var elmNavUnitTest = document.getElementById('nav-unit-test');
    var elmManual = document.getElementById('manual');
    var elmUnit = document.getElementById('unit');

    window.mp = new window.MessageParser(window.RuleGenerator.generate(window.allRules));

    elmButtonManual.addEventListener('click', setupManualTesting);
    elmNavManTest.addEventListener('click', manuelTestSelected);
    elmNavUnitTest.addEventListener('click', unitTestSelected);

    function manuelTestSelected() {
        elmNavManTest.style.backgroundColor = '#A4A4A4';
        elmNavUnitTest.style.backgroundColor = '#f7f7f7';
        elmUnit.style.display = 'none';
        elmManual.style.display = 'block';
        elmButtonManual.addEventListener('click', setupManualTesting);
    }

    function unitTestSelected() {
        elmNavManTest.style.backgroundColor = '#f7f7f7';
        elmNavUnitTest.style.backgroundColor = '#A4A4A4';
        elmManual.style.display = 'none';
        elmUnit.style.display = 'block';
        setupUnitTesting();
    }

    function setupManualTesting() {
        elmButtonManual.innerHTML = 'Please wait...';
        elmButtonManual.setAttribute('disabled', 'disabled');
        mp.parse(elmTextArea.value).then(function(results) {
            elmButtonManual.removeAttribute('disabled');
            elmButtonManual.innerHTML = 'Parse';
            if (!results.error) {
                elmOutput.innerHTML = JSON.stringify(results, null, 2);
            } else {
                elmOutput.innerHTML = results.error.message;
            }
        }, function() {
            elmButtonManual.removeAttribute('disabled');
            elmButtonManual.innerHTML = 'Parse';
        });
    }

    function setupUnitTesting() {
        var elmButtonUnit = document.getElementById('button-unit');
        elmButtonUnit.addEventListener('click', runUnitTests);
    }

    function runUnitTests(e) {
        var elmButtonUnit = e.target;
        var elmResults = document.getElementById('unit-results');
        elmButtonUnit.innerHTML = 'Running all tests...';
        elmButtonUnit.setAttribute('disabled', 'disabled');
        elmResults.innerHTML = '';
        window.testRunner.run(window.mp, window.unitTests).then(function() {
            elmButtonUnit.removeAttribute('disabled');
            elmButtonUnit.innerHTML = 'Run all tests';
            elmResults.innerHTML = window.testRunner.reportHtml;
        });
    }

}());
