console.log('@-->starting test runner!!!');
require('coffee-script/register');

var os              = require('os');
var creds           = {};
var chromeOnly      = false;
var capabilities    = JSON.parse(process.env.CAPABILITIES);
var nockRecordingId = JSON.parse(process.env.NOCK_RECORDING_ID);

if (!capabilities) {
  console.log("@-->INFO: CAPABILITIES not found in ENV. Using chrome-only mode!");
  chromeOnly = true;
} else {
  console.log('@-->browser:', capabilities);
}

if (!chromeOnly) {
  creds = process.env;

  if (!creds.SAUCE_USERNAME) {
    throw "@-->ERROR: SAUCE_USERNAME not found in test/config/sauce.json or ENV.";
  }

  if (!creds.SAUCE_ACCESS_KEY) {
    throw "@-->ERROR: SAUCE_ACCESS_KEY not found in test/config/sauce.json or ENV.";
  }
}

if (!process.env.TEST_PORT) {
  throw "@-->ERROR: TEST_PORT not found in test/config/sauce.json or ENV.";
}

if (!process.env.SPECS) {
  throw "@-->ERROR: SPECS not found in ENV.";
}

if (!nockRecordingId) {
  throw "@-->ERROR: NOCK_RECORDING_ID not found in ENV.";
}

exports.config = {
  sauceUser: creds.SAUCE_USERNAME,
  sauceKey:  creds.SAUCE_ACCESS_KEY,
  framework: 'jasmine',

  specs:        JSON.parse(process.env.SPECS),
  capabilities: capabilities,
  chromeOnly:   chromeOnly,
  baseUrl:      'http://localhost:'+process.env.TEST_PORT,

  getPageTimeout:    50000,
  allScriptsTimeout: 50000,

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 50000
  },

  onPrepare: function() {
    global.NOCK_RECORDING_ID = nockRecordingId;
  }
};
