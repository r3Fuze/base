/* global task:true, desc, jake, fail, complete */

var conf  = require("./server/conf"),
    app   = require("./server/app"),
    log   = conf.log,
    color = require("cli-color"),
    fs    = require("fs"),
    async = require("async"),
    S     = require("string");
    

S.extendPrototype();


/* TODO: Fix so it works with
 * prerequisites and async
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
    port = +port || conf.PORT;
    app.listen(port, function() {
        // Using \u00A0 instead of a regular space because Cloud9 is a jerk
        // and prints 'Cloud9 Your application is running at ***' when it sees
        // 'Server_listening_on' in the console.. :(
        // I also had to change the above line so it won't print when I 'cat Jakefile.js'
        // I submitted a bug report so hopefully this will get fixed soon..
        console.log(" " + color.green("Server\u00A0listening on port %s"), port);
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


// TODO: Document this?
desc("Find TODO: in files");
task("todo", function(len) {
    var files = new jake.FileList();
    files.include("**/*.js");
    files.exclude("node_modules");
    
    var total = 0;
    
    async.forEach(files.toArray(), function(filename, asyncDone) {
        fs.readFile(filename, "utf-8", function(err, data) {
            if (err) throw err;
            var lines = data.split("\n");
            
            lines.forEach(function(line, i) {
                line = line.collapseWhitespace();
                if (line.contains("TODO:") && (line.startsWith("//") || line.startsWith("/*"))) {
                    total++;
                    len = +len || 3;
                    console.log(color.yellow.bold(" Ln " + i) + ": " + color.underline(filename));
                    console.log("   " + line);
                    for (var j = 0; j < len; j++) {
                        console.log("   " + lines[i + j + 1] + (j + 1 === len ? "\n\n" : ""));
                    }
                }
            });
            asyncDone();
        });
    }, function(err) {
        if (err) throw err;
        console.log(color.yellow.bold("TODO: total: " + total));
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