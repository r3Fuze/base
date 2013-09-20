module.exports = {
    IP:   process.env.IP || "127.0.0.1",
    PORT: process.env.PORT || 3000,
    
    secret: "NOT_SECRET",
    
    // exports
    log: require("logule").init(module)
};