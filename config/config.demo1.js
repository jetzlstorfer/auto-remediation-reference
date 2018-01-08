var config = require('./config.global');

config.apiToken = '';
config.cluster = '';
config.environment = '';
config.monitoredHost = '';
config.marathonHost = 'https://localhost';
config.pluginServiceHost = 'http://localhost:8091';

config.useremail = '';
config.commentContext = 'Lambda Auto-Remediation Demo';

config.pollingInterval = '7'; // seconds
config.problemTimeframe = '6hours'; //Allowed values are hour, 2hours, 6hours, day, week, and month;


config.snowTenant = '';
config.snowUsername = '';
config.snowToken = '';

config.snmp = {
	managerIp: "127.0.0.1", // change to IP Address of SNMP Trap Receiver if not localhost
	trapPort: 162
};

module.exports = config;