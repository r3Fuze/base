/* global task, desc, jake, fail, complete */

var conf = require("./server/conf"),
    log  = conf.log,
    color  = require("cli-color");



// Document this later
/*var _task = task;
task = function(name, description, cb) {
    if (arguments.length !== 3) {
        _task(name, description);
        return;
    }

    var callback = function() {
        begin(description);
        cb();
    };
    
    desc(description);
    _task(name, callback);
};*/


task("default", ["lint", "test"]);

desc("Lint JavaScript files");
task("lint", function() {
    begin(this);
    var lint = require("./server/lib/jake-jshint");
    var files = new jake.FileList();
    
    files.include("**/*.js");
    files.exclude(["node_modules"]);
    
    var pass = lint.run(files.toArray(), conf.lint.options, conf.lint.globals);
    if (!pass) fail("Lint failed");
});

desc("Run tests with Mocha");
task("test", function() {
    begin(this);
    var MochaTest = require("mocha");
    var mocha = new MochaTest({ reporter: "spec", ui: "bdd" });
    var files = new jake.FileList();
    
    files.include("./server/test/_*_test.js");
    
    files.forEach(function(file) {
        mocha.addFile(file);
    });
    
    mocha.run(function(failures) {
        if (failures) fail("Mocha test failed");
    });
});


function begin(test) {
    console.log("\n" + color.blue("===== ") + color.bold.underline.yellow(test.description) + color.blue(" ====="));
}