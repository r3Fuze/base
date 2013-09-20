var conf = require("./server/conf"),
    log  = conf.log;

desc("Lint JavaScript files");
task("lint", function() {
    var lint = require("./server/lib/jake-jshint");
    var files = new jake.FileList();
    
    files.include("**/*.js");
    files.exclude(["node_modules"]);
    
    var pass = lint.run(files.toArray(), conf.lint.options, conf.lint.globals);
    if (!pass) fail("Lint failed");
});

task("default", ["lint"]);