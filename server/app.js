var app     = require("express")(),
    http    = require("http"),
    
    dimsum  = require("dimsum"),
    
    conf    = require("./conf"),
    log     = conf.log;


app.configure(function() {
    dimsum.configure({ flavor: "latin" });
});


app.get("/", function(req, res) {
    res.send("Hello World! Deploying from Jake!");
});


app.get("/api/lorem/:len", function(req, res) {
    res.send(dimsum(req.params.len));
});


var server = http.createServer(app);

exports.listen = function(port, callback) {
    server.listen(port, callback);
};

exports.close = function(callback) {
    server.close(callback);
};