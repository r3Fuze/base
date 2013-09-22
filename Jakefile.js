/* global task:true, desc, jake, fail, complete */

var conf  = require("./server/conf"),
    app   = require("./server/app"),
    log   = conf.log,
    color = require("cli-color");


/* TODO: Fix so it works with
 * prerequisites and3 async
 * ====================== */
// Keep old task function
var _task = task;

// Override task function
task = function() {
    var args = arguments;
    
    // Create task with old function
    var t = _task.apply(this, args);
    
    // Don't do anything if it's the default task or __root__
    if (t.name === "default" || t.name === "__root__") return _task.apply(this, args);
    
    // Save the old callback
    var _action = t.action;
    
    // Override the callback
    t.action = function() {
        // Inject logTask into callback
        logTask(t);
        
        // Call the old callback with the task as 'this' and the arguments passed by the callback
        _action.apply(t, t.args);
    };
};


task("default", ["lint", "test"]);

desc("Run the app");
task("run", function(port) {
    port = port || conf.PORT;
    app.listen(port, conf.IP, function() {
        // Using \u00A0 instead of a regular space because Cloud9 is a jerk
        // and prints 'Cloud9 Your application is running at ***' when it sees
        // 'Server listening on' in the console.. :(
        console.log(" " + color.green("Server\u00A0listening on %s:%s"), conf.IP, port);
        console.log(" " + color.bold.green("Ctrl+C to exit"));
    });
});

desc("Lint JavaScript files");
task("lint", function() {
    var lint = require("./server/lib/jake-jshint");
    var files = new jake.FileList();
    
    files.include("**/*.js");
    files.exclude(["node_modules"]);
    
    var pass = lint.run(files.toArray(), conf.lint.options, conf.lint.globals, function(pass) {
        if (!pass) fail("Lint failed");
        complete();
    });
}, { async: true });

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
        complete();
    });
}, { async: true });


desc("Testing stuff");
task("wat", function(strict) {
    if (strict === "true") log.info("STRICT");
    else log.info("NOT STRICT");
    
    log.info("Y U NO LOG");
});

function logTask(t) {
    console.log("\n" + color.blue("===== ") + color.bold.underline.yellow(t.description) + color.blue(" ====="));
}