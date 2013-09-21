/* global task:true, desc, jake, fail, complete */

var conf  = require("./server/conf"),
    log   = conf.log,
    color = require("cli-color");


// Keep old task function
var _task = task;

// Override task function
task = function(name, cb) {
    // If callback is an object (default task) use the old task function
    if (typeof cb === "object") return _task(name, cb);
    
    // Create task with old function
    var t = _task(name, cb);
    
    // Override the callback
    t.action = function() {
        // Inject logTask into callback
        logTask(t);
        
        // Call the real callback with the task as 'this'
        cb.call(t);
    };
};


task("default", ["lint", "test"]);

desc("Lint JavaScript files");
task("lint", function() {
    var lint = require("./server/lib/jake-jshint");
    var files = new jake.FileList();
    
    files.include("**/*.js");
    files.exclude(["node_modules"]);
    
    var pass = lint.run(files.toArray(), conf.lint.options, conf.lint.globals);
    if (!pass) fail("Lint failed");
});

desc("Run tests with Mocha");
task("test", function() {
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


function logTask(t) {
    console.log("\n" + color.blue("===== ") + color.bold.underline.yellow(t.description) + color.blue(" ====="));
}