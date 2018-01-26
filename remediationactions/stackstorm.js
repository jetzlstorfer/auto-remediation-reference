'use strict';
/* jshint node: true */
const sa = require('superagent');

function StackStormRemediationAction(url, token) {
	this.url = url;
	this.token = token;
	console.info("create StackStormRemediationAction");
}



StackStormRemediationAction.prototype.restart = function (payload, callback) {
	//trigger st2 remediation
	var req = sa.post(this.url + 'apache-start')
		.set('St2-Api-Key', this.token)
		.set('Content-Type', 'application/json')
		.send(
		payload
		);

	req.end(function (error, resp) {
		// if (error) {
		// 	console.log("error: " + JSON.stringify(error));
		// }
		return callback(error, resp);
	});

}

module.exports = StackStormRemediationAction;