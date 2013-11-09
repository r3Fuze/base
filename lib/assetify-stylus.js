var parser = require("assetify/src/plugins/parser"),
    stylus = require("stylus"),
    nib    = require("nib");

exports.stylus = parser.configure("css", [".styl"], function(item, config, ctx, done) {
    stylus(item.src)
        .use(nib())
        .import("nib")
        .set("compress", true)
        .render(function(err, css) {
            item.src = css;
            done();
        });
});