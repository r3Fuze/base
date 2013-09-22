var conf = require("./server/conf"),
    app  = require("./server/app"),
    log  = conf.log;

    

app.listen(conf.PORT, conf.IP, function() {
    log.info("Server_listening on %s:%s", conf.IP, conf.PORT);
});