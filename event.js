'use strict';
/* jshint node: true */

function Event(eventToProcess) {
	this.event = eventToProcess;
	this.pid = eventToProcess.PID;
	this.state = eventToProcess.State;
	this.problemTitle = eventToProcess.ProblemTitle;
	this.isOpen = eventToProcess.State === "OPEN";
	this.tags = "";
	if (eventToProcess.Tags != null) {
		this.tags = eventToProcess.Tags.split(",");
	}
	this.problemDetails = eventToProcess.ProblemDetails;
	this.problemImpact = eventToProcess.ProblemImpact;
	this.problemUrl = eventToProcess.ProblemURL;
	this.impactedEntities = eventToProcess.ImpactedEntities;
	if (this.impactedEntities == null || this.impactedEntities == "" || this.impactedEntities.length == 0) {
		this.impactedEntities = eventToProcess.ImpactedEntity;
	}
}


Event.prototype.isOpen = function () {
	return this.event.State === "OPEN";
}

Event.prototype.hasApplication = function (appName) {
	return this.hasEntity('APPLICATION', appName);
}

Event.prototype.hasService = function (serviceName) {
	return this.hasEntity('SERVICE', serviceName);
}

Event.prototype.hasProcess = function (processName) {
	return this.hasEntity('PROCESS_GROUP_INSTANCE', processName);
}

Event.prototype.hasEntity = function (type, name) {
	if (!this.event.ImpactedEntities) {
		return false;
	}
	for (var i = 0; i < this.event.ImpactedEntities.length; ++i) {
		var entry = this.event.ImpactedEntities[i];
		if ((entry.type === type) && (entry.name === name)) {
			return true;
		}
	}
	return false;
}

Event.prototype.getProblemId = function () {
	return this.event.PID;
}


// Event.prototype.parseEvent = function () {
// 	var parsedEvent = {
// 		pid: this.getProblemId(),
// 		problemTitle: this.event.ProblemTitle,
// 		state: this.event.State,
// 		isOpen: this.isOpen(),
// 	};

// 	return parsedEvent;
// }

Event.prototype.toString = function () {
	return this.toString(false);
}

Event.prototype.toString = function (withDetails) {
	var msg = "Problem " + this.pid +
		"\n ProblemTitle: " + this.problemTitle +
		"\n State: " + this.state +
		"\n Tags: " + JSON.stringify(this.tags) +
		"\n ProblemImpact: " + this.problemImpact +
		"\n ImpactedEntities: " + JSON.stringify(this.impactedEntities);
	if (withDetails) {
		msg += "\n ProblemDetails: " + this.problemDetails;
	}
	return msg;
}


module.exports = Event;