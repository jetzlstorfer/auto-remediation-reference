const config = require('../config/main');

const remediationHandler = require('../remediation');

module.exports = function (context, req) {
  context.log('Function received a request.');

  if (req.method == 'POST') {
    // context.log('payload: ' + JSON.stringify(req.body));
    remediationHandler.handler(req.body, context, function (err, res) {
      if (err) {
        context.log.error("error executing azure script: " + JSON.stringify(err));
      } else {
        context.log.info("executing azure function finished successfully ");
        context.res = {
          // status: 200, /* Defaults to 200 */
          body: "Function successfully executed."
        };
      }
      context.done();
    });

  } // end req.method == POST
  else {
    context.log('wrong HTTP method type (only POST is currently supported).');
    context.done();
  }
};