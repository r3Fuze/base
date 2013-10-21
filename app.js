var express  = require("express"),
    http     = require("http"),
    swig     = require("swig"),
    assetify = require("assetify").instance(),
    
    conf     = require("./conf"),
    log      = conf.log;

var app = express();

app.configure(function() {
    app.set("views", __dirname + "/views");
    app.engine("html", swig.renderFile);
    swig.setDefaults({
        locals: {
            wat: "Test string from node.js"
        }
    });
    app.set("view engine", "html");
    
    // Enable middleware and expose 'assetify' to template
    // TODO: Don't serve bundled assets in development. Makes things easier to debug 
    // Assets must be built with 'jake build' change this?
    assetify(app, express, conf.assetify.assets.bin);
    
    app.use(express.static(__dirname + "/public"));
});


app.get("/", function(req, res) {
    res.send("Hello World! Deploying from Jake!");
});


app.get("/swig", function(req, res) {
    res.render("index", {
        title: "Index!"
    });
});


var server = http.createServer(app);

exports.listen = function(port, callback) {
    server.listen(port, callback);
};

exports.close = function(callback) {
    server.close(callback);
};