var fs     = require("fs"),
    jshint = require("jshint").JSHINT,
    color  = require("cli-color"),
    async  = require("async");
    
// Symbols to use in log
var checkmark = "\u2713", // ✓ //
    cross     = "\u2716"; // ✖ //

var logCode = true;

// TODO: Re-do documentation
// Lint single file
function lintFile(filename, options, globals, callback) {
    // Read source from filename
    fs.readFile(filename, "utf-8", function(err, source) {
        // Run JSHint on source
        var pass = jshint(source, options, globals);
        
        if (pass) {
            // If no errors, log OK
            console.log(" " + color.green(checkmark), filename);
        } else {
            // If errors, log filename followed by errors
            console.log(" " + color.red(cross), filename);
            
            // Loop through all errors in file
            for (var i = 0; i < jshint.errors.length; i++) {
                var error = jshint.errors[i];
                
                // Skip if empty error
                if (!error) continue;
    
                // If the source of the error is known, log it and the line it on
                if (error.evidence) {
                    var str = "  " + color.bold("Ln " + error.line) + ": " + color.underline(error.evidence.trim()) + (logCode ? color.yellow(" (" + error.code + ")") : "");
                    console.log(str);
                    
                    // Show an arrow pointing at the error
                    console.log(new Array(error.character + 3).join(" ") + color.red.bold(" ^ "));
                }
                
                // Log the error type
                console.log("     " + color.red.bold(error.reason) + "\n");
            }
        }
        
        // Return the results
        callback(pass);
    });
}

// TODO: Re-do documentation
// Lint multiple files
function lintFiles(files, options, globals, callback) {
    var allPass = true;
    
    // Loop through all the files
    async.forEach(files, function(filename, complete) {
        // Lint each file
        var pass = lintFile(filename, options, globals, function(pass) {
            // Set allPass to false if one file failed
            if (!pass) allPass = false;
            complete();
        });
    }, function(err) {
        // Return the results
        callback(allPass);
    });
}

// Export the function
exports.run = lintFiles;