'use strict';
/* jshint node: true */
const config = require('./config/main');

const DynatraceUtils = require('./dynatrace_utils');
const dtUtils = new DynatraceUtils(config.cluster + config.environment, config.apiToken);

const Event = require('./event');




exports.handler = function (event, context, callback) {
  // check if called from azure, since azure does not support console.log
  
  console.log('azure remediation start (console)');
  console.info("--- remediation script start ---");
  // console.info(JSON.stringify(event));
  var myEvent = new Event(event);
  var myProblem = myEvent; //.parseEvent();

  console.info("parsed problem: ");
  console.info(myProblem.toString());

  if (!myProblem.isOpen) {
    // problem already resolved
    console.info("adding status comment for " + myProblem.pid + ": " + myProblem.state);
    addStatusComment(myProblem, function (err, res) {
      if (err != null) {
        console.error("status comment not added to problem " + myProblem.pid);
        return callback(err);
      } else {
        console.info(res.Result);
        return callback(null, res);
      }
    });

  } else {
    console.info("adding status comment for " + myProblem.pid + ": " + myProblem.state);
    addStatusComment(myProblem, function (err, res) {
      if (err != null) {
        console.error("status comment not added to problem " + myProblem.pid);
        console.error("error: " + JSON.stringify(err));
        //return callback(err);
      }
    });

    // remediation
    dtUtils.getProblemDetails(myProblem.pid, function (err, resp) {
      if (err || !resp.ok) {
        console.error("error getProblemDetails for pid " + myEvent.pid + ": " + JSON.stringify(err));
        return callback(err);
      }

      var myRankedEvents = resp.body.result.rankedEvents;
      console.info("rankedEvents: " + JSON.stringify(myRankedEvents));
      if (myRankedEvents != null) {
        var myRootCause = getRootCause(myRankedEvents);
        if (myRootCause != undefined) {
          // root cause found
          console.info("root cause for PID " + myEvent.pid + ": " + JSON.stringify(myRootCause.eventType));
          triggerRemediationAction(myProblem, myRootCause, function (err, res, remediationAction) {
            if (err) {
              console.error("error for remediation of " + myEvent.pid + " (" + myRootCause.eventType + "): " + JSON.stringify(err));
              addComment(myEvent.pid, "error when performing remediation " + JSON.stringify(err), function (err, res) {
                if (err) {
                  return callback(err);
                }
              });
              return callback(err);
            }

            var remediationLog = "Auto-remediation: " + remediationAction.title + " executed:\n " + remediationAction.description;
            console.info("adding comment for executed remediation");
            addComment(myEvent.pid, remediationLog, function (err, res) {
              if (err) {
                console.error("comment not added: " + remediationLog.replace("\n", ""));
                return callback(err);
              } else {
                console.info("comment added: " + remediationLog.replace("\n", ""));
              }

               return callback(err, res);
            });


          });
        } else {
          console.info("triggerRelayAction"); 
          // no root cause found
          triggerRelayAction(myProblem, function (err, res, relayAction) {
            if (err) {
              console.error("error for relay of " + myEvent.pid);
              addComment(myEvent.pid, "error when performing relay " + JSON.stringify(err), function (err, res) {
                if (err) {
                  return callback(err);
                }
              });
              return callback(err);
            }
            var relayLog = "Auto-relay: " + relayAction.title + " executed:\n " + relayAction.description;
            addComment(myEvent.pid, relayLog, function (err, res) {
              if (err) {
                console.error("comment not added: " + relayLog);
                return callback(err);
              } else {
                console.info("comment added: " + relayLog);
              }

              callback(err, res);
            });
          });
        }

      }

    }); // end getProblemDetails
  }



};

function checkAzureEnvironment(context) {
  if (process.env['AzureWebJobsStorage'] != undefined) {
    console.log = function(msg) {
      context.log(msg);
    }    
    console.info = function(msg) {
      context.log.info(msg);
    }
    console.warn = function(msg) {
      context.log.warn(msg);
    }
    console.error = function(msg) {
      context.log.error(msg);
    }
  }
}

function getRootCause(rankedEvents) {
  var rc = rankedEvents.find(function (element) {
    //console.info("found: " + JSON.stringify(element));
    return element.isRootCause;
  });
  return rc;
}

function triggerRemediationAction(problem, rootCause, callback) {
  let remediationAction = {
    title: '',
    description: ''
  };
  let payload;
  //let payload;
  switch (rootCause.eventType) {

    case "CONNECTION_LOST":
    case "PGI_OF_SERVICE_UNAVAILABLE":
      remediationAction.title = "service now remediation";
      remediationAction.description = "restarting vm with servicenow workflow";
      console.info("remediation for rootCause: " + rootCause.eventType);
      const ServiceNowRemediationAction = require('./remediationactions/snow-restart-vm');
      const snowAction = new ServiceNowRemediationAction();
      payload = {
        "source": "DYNATRACE",
        "node": "",
        "type": "problem sent from REMEDIATION DEMO",
        "resource": "",
        "severity": 1,
        "description": "TEST: more infos ...",
        "additional_info": "{ 'correlation_id':'SERVICE-E3B61833DCF7B19A'}", "ci_identifier": "{ 'correlation_id':'SERVICE-E3B61833DCF7B19A' }",
        "event_class": "", "message_key": "{" + problem.pid + "}"
      }
      snowAction.trigger(payload, function (err, res) {
        if (err) {
          console.error("error: " + JSON.stringify(err));
        }
        return callback(err, res, remediationAction);
      });
      break;

    // OTHER CASES GO HERE
    case "TO BE DEFINED":
      remediationAction.title = "restart apache2";
      remediationAction.description = "restarting apache with stackstorm remediation rule";
      console.info("remediation for rootCause: " + rootCause.eventType);
      const StackStormRemediationAction = require('./remediationactions/stackstorm');
      const st2action = new StackStormRemediationAction(config.st2ApiUrl, config.st2Token);
      
      st2action.restart(payload, function (err, res) {
        if (err) {
          console.error("error st2action: " + JSON.stringify(err));
        }
        return callback(err, res, remediationAction);
      });
      break;


    // DEFAULT  
    default:
      remediationAction.title = 'Default remediation - no action';
      remediationAction.description = 'no action found for root cause: ' + rootCause.eventType;
      return callback(null, null, remediationAction);
  } // end switch
} // triggerRemediationAction


function triggerRelayAction(problem, callback) {
  let relayAction = {
    title: '',
    description: ''
  };

  // execute relay 
  // add relayAction to callback

}

function addStatusComment(problemInfo, callback) {
  let status = `Problem ${problemInfo.problemTitle} (${problemInfo.pid}): ${problemInfo.state}`;
  addComment(problemInfo.pid, status, function (err) {
    if (err) {
      console.log("Error adding status comment: ", JSON.stringify(err, null, 2));
      callback(err);
    } else {
      callback(null, { "Result": "status comment added: " + status });
    }
  });
}

function addComment(problemId, commentText, callback) {
  let comment = {
    "comment": commentText,
    "user": config.useremail,
    "context": config.commentContext
  };

  dtUtils.addComment(problemId, comment, function (err, resp) {
    return callback(err, resp);
  });
}
