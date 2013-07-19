module.exports = function(karma) {
  config = require(__dirname + '/karma-shared.conf.js').shared;
  config.files = config.files.concat([
    //test files
    './test/unit/**/*.spec.js'
  ]);
  karma.configure(config);
};
