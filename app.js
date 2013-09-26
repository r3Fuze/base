var express = require("express"),
    http    = require("http"),
    
    conf    = require("./conf"),
    log     = conf.log;

var app = express();


app.configure(function() {
    app.set("views", __dirname + "/views");
    app.set("view engine", "jade");
    
    app.use(express.static(__dirname + "/public"));
});


app.get("/", function(req, res) {
    res.send("Hello World! Deploying from Jake!");
});


app.get("/jade-test", function(req, res) {
    res.render("jade-test", { title:"Jade Test" });
});


var server = http.createServer(app);

exports.listen = function(port, callback) {
    server.listen(port, callback);
};

exports.close = function(callback) {
    server.close(callback);
};