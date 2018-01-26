'use strict';
/* jshint node: true */
var sa = require('superagent');


function DynatraceUtils(tenant, token) {
	//console.info("tentant: " + tenant + ", token: " + token);
	this.dtTenant = tenant;
	this.apiToken = token;
}

DynatraceUtils.prototype.getLoad = function(host, startTime, endTime, callback) {
	var url = this.dtTenant + '/api/v1/timeseries';
	sa.post(url)
		.set('authorization', this.apiToken)
		.set('Content-Type', 'application/json')
		.send({
			startTimestamp: startTime
		})
		.send({
			endTimestamp: endTime
		})
		.send({
			queryMode: "total"
		})
		.send({
			timeseriesId: "com.dynatrace.builtin:host.nic.bytessent"
		})
		.send({
			aggregationType: "SUM"
		})
		.send({
			entities: [host]
		})
		.end(function(error, resp) {
			if (error) {
				callback(error, resp);
			} else {
				var key = Object.keys(resp.body.result.dataPoints)[0];
				var load = resp.body.result.dataPoints[key][0][1];
				callback(null, load);
			}
		});
};

DynatraceUtils.prototype.addComment = function(problemId, comment, callback) {
	var url = this.dtTenant + '/api/v1/problem/details/' + problemId + '/comments';
	sa.post(url)
		.set('authorization', this.apiToken)
		.set('Content-Type', 'application/json')
		.send(comment)
		.end(function(error, resp) {
			return callback(error, resp);
		});
};


DynatraceUtils.prototype.getProblems = function(timeframe, callback) {
	var timeOption="";
	if (timeframe!=null || timeframe!="") {
		timeOption= "?relativeTime=" + timeframe;
	}
	var url = this.dtTenant + '/api/v1/problem/feed/' + timeOption;
	sa.get(url)
		.set('authorization', this.apiToken)
		.set('Content-Type', 'application/json')
		.send()
		.end(function(err, res) {
			return callback(err, res);
		}); 
}

DynatraceUtils.prototype.getProblemDetails = function(problemId, callback) {
  var url = this.dtTenant + '/api/v1/problem/details/' + problemId;
  sa.get(url)
		.set('authorization', this.apiToken)
		.set('Content-Type', 'application/json')
		.send()
		.end(function(err, res) {
			//console.log("DynatraceUtils.prototype.getProblemDetails: " + res.status);
			return callback(err, res);
		});
}

module.exports = DynatraceUtils;