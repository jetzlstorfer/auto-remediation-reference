'use strict';
/* jshint node: true */

const http = require('http');
const url = require('url');
const querystring = require('querystring');
const config = require('./config/main');

// import lambda function
const remediationHandler = require('./remediation');

http.createServer(function (req, res) {

  // console.log(req.url);

  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  // console.log("query: " + JSON.stringify(query));

  // data processing
  if (req.method == 'POST') {
    var jsonString = '';

    req.on('data', function (data) {
      jsonString += data;
    });

    req.on('end', function (err, res) {
      if (err) {
        console.error("error parsing input data: " + JSON.stringify(err));
        return;
        // console.log(JSON.parse(jsonString));
      }

      // call lambda
      // console.log(remediationHandler);
      remediationHandler.handler(JSON.parse(jsonString), '', function (err, res) {
        if (err) {
          console.error("error executing local script: " + JSON.stringify(err));
        } else {
          console.info("executing local script finished successfully "); // + JSON.stringify(res));
        }
      });
    });
  } // end req.method == POST


  //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////
  var output;
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('End of request \n');

}).listen(config.localport, config.localhost);

console.log('Server running at ' + config.localhost + ':' + config.localport);



