var express = require("express"),
    http    = require("http"),
    
    conf    = require("./conf"),
    log     = conf.log;

var app = express();

app.configure(function() {

});

app.get("/", function(req, res) {
    res.send("Hello World! Deploying from Jake!");
});

app.get("/api/date/:fn", function(req, res) {
    var date = new Date();
    res.send(date[req.params.fn]());
});


var server = http.createServer(app);

exports.listen = function(port, callback) {
    server.listen(port, callback);
};

exports.close = function(callback) {
    server.close(callback);
};