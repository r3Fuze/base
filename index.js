var conf = require("./server/conf"),
    app  = require("./server/app"),
    log  = conf.log;

    

app.listen(conf.PORT, function() {
    log.info("Server_listening on port %s", conf.PORT);
});