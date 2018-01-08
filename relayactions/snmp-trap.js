'use strict';
/* jshint node: true */

const config = require('../config/main');

const SnmpUtils = require('./snmp-utils');
const snmpUtils = new SnmpUtils(config.snmp.managerIp, config.snmp.trapPort);


function SnmpTrapV1Action() {
  console.info("create SnmpTrapV1Action");
}

SnmpTrapV1Action.prototype.trigger = function(payload, callback) {
  // send SNMP Trap
  snmpUtils.triggerRelay(payload, function (err, res) {
    if (err) {
      console.error("SnmpTrapV1Action.prototype.trigger error: " + JSON.stringify(err));
    } 
    return callback(err, res);
  });

}

module.exports = SnmpTrapV1Action;