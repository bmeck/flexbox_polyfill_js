//Test framework
var jasmine=require('jasmine-node');
for(var key in jasmine) {
  global[key] = jasmine[key];
}

var $ = require('jquery');

//What we're testing
require("./flexbox_polyfill.js")

jasmine.executeSpecsInFolder(__dirname + '/specs', function(runner, log){
    process.exit(runner.results().failedCount?1:0);
}, true, true);