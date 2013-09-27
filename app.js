var express = require("express"),
    http    = require("http"),
    swig    = require("swig"),
    
    conf    = require("./conf"),
    log     = conf.log;

var app = express();


app.configure(function() {
    app.set("views", __dirname + "/views");
    app.engine("html", swig.renderFile);
    app.set("view engine", "html");
    
    app.use(express.static(__dirname + "/public"));
});


app.get("/", function(req, res) {
    res.send("Hello World! Deploying from Jake!");
});


app.get("/swig", function(req, res) {
    res.render("index");
});


var server = http.createServer(app);

exports.listen = function(port, callback) {
    server.listen(port, callback);
};

exports.close = function(callback) {
    server.close(callback);
};