'use strict';
/* jshint node: true */

const config = require('../config/main');

const ServiceNowUtils = require('./servicenow_utils');
const snowUtils = new ServiceNowUtils(config.snowTenant, config.snowUsername, config.snowToken);


function ServiceNowRemediationAction() {
  console.info("create ServiceNowRemediationAction");
}

ServiceNowRemediationAction.prototype.trigger = function(payload, callback) {
  //trigger service now remediation
  snowUtils.triggerRemediation(payload, function (err, res) {
    if (err) {
      console.error("ServiceNowRemediationAction.prototype.trigger error: " + JSON.stringify(err));
    } 
    return callback(err, res);
  });

}

module.exports = ServiceNowRemediationAction;