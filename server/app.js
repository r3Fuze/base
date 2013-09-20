var express = require("express"),
    http    = require("http"),
    
    conf    = require("./conf"),
    log     = conf.log;

var app = express();

app.get("/", function(req, res) {
    log.info("sent response");
    res.send("Hello World!");
});

var server = http.createServer(app);

exports.listen = function(port, ip, callback) {
    server.listen(port, ip, callback);
};

exports.close = function(callback) {
    server.close(callback);  
};