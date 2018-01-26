'use strict';
/* jshint node: true */
const sa = require('superagent');

function ServiceNowUtils(tenant, username, token) {
	this.tenant = tenant;
	this.username = username;
	this.token = "Basic " + token;
	this.url = "https://" + this.tenant + ".service-now.com/api/now/table/em_event";
}

ServiceNowUtils.prototype.triggerRemediation = function(payload, callback) {
	var req = sa.post(this.url)
	.set('authorization', this.token)
	.set('Content-Type', 'application/json')
	.timeout({
    response: 5000,  // Wait 5 seconds for the server to start sending,
    deadline: 60000, // but allow 1 minute for the file to finish loading.
  })
	.send( 
		payload
	);

	req.end(function(error, resp) {
		if (error) {
			console.error("error triggering servicenow: " + JSON.stringify(error));
		}
		return callback(error, resp);
	});
}


module.exports = ServiceNowUtils;