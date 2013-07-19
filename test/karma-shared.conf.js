var shared = {};
shared.plugins = [
  'karma-mocha',
  'karma-ng-scenario',
  'karma-chrome-launcher',
  'karma-firefox-launcher',
  'karma-safari-launcher',
  'karma-ng-scenario'
];

shared.frameworks = ['mocha'];
shared.basePath  = '../';
shared.singleRun = false
shared.autoWatch = true
shared.colors    = true

shared.reporters = ['progress'];
shared.browsers = ['Chrome'];
shared.proxies = {
  '/': 'http://localhost:8000'
};

shared.files = [
  './test/mocha.conf.js',

  //App-specific Code
  'build/earth.js',
  'libs/threejsLibs.js',

  //Test-Specific Code
  './node_modules/chai/chai.js',
  './test/lib/chai-should.js',
  './test/lib/chai-expect.js',
  './test/unit/JsonDataPointHelper.js'
];

exports.shared = shared;
