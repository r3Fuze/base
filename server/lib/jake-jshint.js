var fs     = require("fs"),
    jshint = require("jshint").JSHINT,
    color  = require("cli-color");
    
// Symbols to use in log
var checkmark = "\u2714", // ✔ //
    cross     = "\u2718"; // ✘ //


// Lint single file
function lintFile(filename, options, globals) {
    // Read source from filename
    var source = fs.readFileSync(filename, "utf-8");
    
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
                console.log(" " + color.bold("Ln " + error.line) + ": " + color.underline(error.evidence.trim()) + color.yellow(" (" + error.code + ")"));
            }
            
            // Log the error type
            console.log("     " + color.red.bold(error.reason) + "\n");
        }
    }
    
    // Return the results
    return pass;
}

// Lint multiple files
function lintFiles(files, options, globals) {
    var allPass = true;
    
    // Loop through all the files
    files.forEach(function(filename) {
        // Lint each file
        var pass = lintFile(filename, options, globals);
        
        // Set allPass to false if one file failed
        if (!pass) allPass = false;
    });
    
    // Return the results
    return allPass;
}

// Export the function
exports.run = lintFiles;