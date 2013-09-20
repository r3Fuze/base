module.exports = {
    IP:   process.env.IP || "127.0.0.1",
    PORT: process.env.PORT || 3000,
    
    secret: "NOT_SECRET",
    
    lint: {
        globals: {},
        options: {
            bitwise: true,
            camelcase: true,
            immed: true,
            indent: 4,
            eqeqeq: true,
            trailing: true,
            node: true
        }
    },
    
    // exports
    log: require("logule").init(module)
};