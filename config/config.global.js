var config = {};

config.monitoringInterval = 5*60*1000;
config.threshold = 5000000;
config.servicesNormal = 5;
config.servicesHigh = 10;
config.apiToken = '';
config.cluster = '';
config.environment = '';
config.monitoredHost = '';
config.marathonHost = '';
config.pluginServiceHost = '';

config.pollingInterval='10';
config.problemTimeframe = 'week';
config.localhost = '127.0.0.1';
config.localport = '1337';

module.exports = config;