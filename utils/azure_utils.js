'use strict';
/* jshint node: true */


function AzureUtils() { };

AzureUtils.prototype.checkAzureEnvironment = function (context) {
  if (process.env['AzureWebJobsStorage'] != undefined) {
    context.log.info('Azure Environment detected.');

    console.log = function (msg) {
      context.log(msg);
    }
    console.info = function (msg) {
      context.log.info(msg);
    }
    console.warn = function (msg) {
      context.log.warn(msg);
    }
    console.error = function (msg) {
      context.log.error(msg);
    }
  }
}

module.exports = AzureUtils;