var env = process.env.NODE_ENV || 'global';
var cfg = require('./config.' + env);

cfg.clusterUrl = process.env.CLUSTER || cfg.cluster;
cfg.environment = process.env.ENV || cfg.environment;
cfg.monitoredHost = process.env.MONITORED_HOST || cfg.monitoredHost;
cfg.marathonUrl = process.env.MARATHON_URL || cfg.marathonUrl;
cfg.marathonUser = process.env.MARATHON_USER || cfg.marathonUser;
cfg.marathonPass = process.env.MARATHON_PASSWORD || cfg.marathonPass;
cfg.pluginServiceUrl = process.env.PLUGIN_SERVICE || cfg.pluginServiceUrl;
cfg.apiToken = process.env.API_TOKEN || cfg.apiToken;
cfg.monitoringInterval = process.env.MONITORING_INTERVAL || cfg.monitoringInterval;
cfg.threshold = process.env.LOAD_THRESHOLD || cfg.threshold;
cfg.servicesNormal = process.env.SERVICES_NORMAL || cfg.servicesNormal;
cfg.servicesHigh = process.env.SERVICES_HIGH || cfg.servicesHigh;

if (cfg.clusterUrl == '' || cfg.clusterUrl == undefined) {
  console.error("incorrect configuration - please double check or set correct environment variables");
  process.exit(1);
}

module.exports = cfg;