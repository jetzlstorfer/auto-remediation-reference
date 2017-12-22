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
	.send( 
		payload
	);

	req.end(function(error, resp) {
		// if (error) {
		// 	console.log("error: " + JSON.stringify(error));
		// }
		return callback(error, resp);
	});
}


module.exports = ServiceNowUtils;