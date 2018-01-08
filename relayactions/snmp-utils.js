'use strict';
/* jshint node: true */
var snmp = require ("net-snmp");

function SnmpUtils(managerIp, trapPort) {
	this.managerIp = managerIp;
	this.trapPort = trapPort;
}

SnmpUtils.prototype.triggerRelay = function(payload, callback) {
	var options = {
		port: this.trapPort,
		retries: 1,
		timeout: 5000,
		transport: "udp4",
		trapPort: 162,
		version: snmp.Version1
	};
	var snmpTrapOID = "1.3.6.1.6.3.1.1.4.1.0";
	var sysDescr = "1.3.6.1.2.1.1.1.0";
	var dynaTraceTrapNotification = "1.3.6.1.4.1.31094.0";
	var dynaTraceIncidentStart = dynaTraceTrapNotification + ".1";
	var dynaTraceIncidentEnd = dynaTraceTrapNotification + ".2";

	var dynaTraceIncident = "1.3.6.1.4.1.31094.1";
	var dynaTraceIncidentName = dynaTraceIncident + ".1";
	var dynaTraceIncidentMessage = dynaTraceIncident + ".2";


	var varbinds = [
		{
			oid: snmpTrapOID,
			type: snmp.ObjectType.OID,
			value: dynaTraceIncidentStart
		},
		{
			oid: sysDescr,
			type: snmp.ObjectType.OctetString,
			value: "dynaTrace Trap"
		},
		{
			oid: dynaTraceIncidentName,
			type: snmp.ObjectType.OctetString,
			value: payload.displayName
		},
		{
			oid: dynaTraceIncidentMessage,
			type: snmp.ObjectType.OctetString,
			value: payload.message
		}
	];

	var session = snmp.createSession (this.managerIp, "public", options);
	session.trap(snmp.TrapType.EnterpriseSpecific, varbinds, function (error) {
		if (error)
			console.error (error);
		return callback(error, "SNMP Trap sent to " + this.managerIp);
	});	
}


module.exports = SnmpUtils;