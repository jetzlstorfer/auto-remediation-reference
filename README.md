# Auto-remediation framework

This project shows how the Dynatrace problem notification integration and the Dynatrace API can be leveraged to trigger remediation actions provided by different providers, e.g., Ansible Tower, ServiceNow.
Therefore, this script acts as a hub and reveives the Dynatrace problem as an input, fetches additional problem data via the Dynatrace API, classifies the problem and then triggers a suitable remediation action (which has to be pre-configured). Along the script execution, all relevant steps are reported as comments directly to Dynatrace. Thus, all triggered actions can be seen at one central place directly when accessing the problem in the Dynatrace web interface. 

Please note that this script serves more as a reference implementation to show the basic capabilities and to demo a sample remediation workflow, but has to be tailored to the concrete needs in specific environments. 

## Configuration
Configuration is stored in files under the config directory. You can either modify `config.global.js` or you can set up different configuration files by creating copies of `config.global.js` and naming them `config.MYCUSTOMCONFIG.js`. You can then decide which config to use by specifying it via the NODE_ENV environment variable, e.g., `SET NODE_ENV=MYCUSTOMCONFIG`

## Build
- run `npm install` to download all needed dependencies
<!-- - TODO: tests can be started running `npm test` -->

## Run local
### via lambda-local module
- execute local lambda call: `.\node_modules\.bin\lambda-local -l remediation.js -h handler -e test\events\remediation-rootcause.js -t 7` (first run `npm install` to download all needed dependencies)
### via native node process (as http server)
- set environment variable NODE_ENV needed for determining correct configuration file, e.g., `SET NODE_ENV=demo1` then run `node index-local.js`
- execute local without lambda: `node index-local.js` starts the webserver on 127.0.0.1:1337 waiting for requests, send request with problem details as POST payload  to trigger remediation
### via native node process (as polling server asking periodically checking for new problems)
- to come

## Deploy & Run as AWS Lambda
- run 'gradle plan' to see what will be deployed
- run 'gradle apply' to deploy to AWS
- Troubleshooting: add --info or --stacktrace option to gradle to get more insights

## Deploy & Run as Azure Functions App
- 



