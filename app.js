var express  = require("express"),
    http     = require("http"),
    stylus   = require("stylus"),
    swig     = require("swig"),
    assetify = require("assetify").instance(),
    nib      = require("nib"),
    
    conf     = require("./conf"),
    log      = conf.log;

var app = express();

app.configure(function() {
    app.set("views", __dirname + "/views");
    app.engine("html", swig.renderFile);
    app.set("view engine", "html");
    
    // TODO: Explain this shit
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    
    // TODO: Clean this up
    app.locals = {
        app: {
            dev: conf.dev
        },
        wat: "Test string from node.js"
    };
    
    // TODO: Document
    app.use(app.router);
    
    // TODO: Document
    // Use stylus middleware if we are not using assetify
    if (conf.dev) {
        app.use(stylus.middleware({
            src: __dirname + "/public/styl",
            dest: __dirname + "/public/css/",
            compile: function(str, path) {
                return stylus(str)
                    .set("filename", path)
                    .set("compress", true)
                    .use(nib())
                    .import("nib");
            }
        }));
    }
    
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