// Initialize newrelic
require("newrelic");

var conf = require("./conf"),
    app  = require("./app"),
    log  = conf.log;


app.listen(conf.PORT, function() {
    log.info("Server_listening_on port %s", conf.PORT);
});