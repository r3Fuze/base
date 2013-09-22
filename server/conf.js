module.exports = {
    IP:   process.env.IP || "127.0.0.1",
    PORT: process.env.PORT || 3000,
    
    secret: "NOT_SECRET",
    
    lint: {
        globals: {},
        options: {
            bitwise: true,
            camelcase: true,
            curly: false,
            immed: true,
            indent: 4,
            eqeqeq: true,
            trailing: true,
            forin: true,
            newcap: true,
            noarg: true,
            noempty: true,
            nonew: true,
            quotmark: "double",
            undef: true,
            unused: false,
            
            node: true
        }
    },
    
    heroku: {
        gitUrl: "git@heroku.com:fuze-base.git"
    },
    
    // exports
    log: require("logule").init(module)
};