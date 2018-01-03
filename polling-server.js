'use strict';
/* jshint node: true */
const config = require('./config/main');

const DynatraceUtils = require('./dynatrace_utils');
const dtUtils = new DynatraceUtils(config.cluster + config.environment, config.apiToken);


function fetchProblems() {
  console.info("fetching problems in relative timeframe: " + config.problemTimeframe);

  dtUtils.getProblems(config.problemTimeframe, function (err, res) {
    if (err) {
      console.error("error: " + err);
      return;
    } 

    var myResult = res.body.result;
    var myProblems = myResult.problems;

    console.info("number of problems: " + myProblems.length);
    console.info("open problems: " + getOpenProblems(myProblems).length);
  });

}


function getOpenProblems(problems) {
  var openProblems = problems.filter(problem => problem.status=="OPEN");
  return openProblems;
}

// fetch problems at start
fetchProblems();
// fetch problems periodically
var myInterval = setInterval(fetchProblems, config.pollingInterval*1000);
