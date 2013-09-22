var express = require("express"),
    http    = require("http"),
    
    conf    = require("./conf"),
    log     = conf.log;

var app = express();



app.get("/", function(req, res) {
    res.send("Hello World! Deploying from Jake and desktop.. More changes on desktop");
});


var server = http.createServer(app);
// , ip
exports.listen = function(port, callback) {
    server.listen(port, callback);
};

exports.close = function(callback) {
    server.close(callback);
};