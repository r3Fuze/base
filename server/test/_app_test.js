/* jshint expr: true */
/* global describe, it, before, after */

var chai   = require("chai"),
    expect = chai.expect;
    
var request = require("superagent"),
    conf    = require("../conf"),
    app     = require("../app");
    
var url = conf.IP + ":" + conf.PORT + "/";
    
describe("App", function() {
    
    before(function(done) {
        app.listen(conf.PORT, conf.IP, done);
    });
    
    after(function(done) {
        app.close(done);
    });

    
    it("should be on the web", function(done) {
        this.slow(500);
        request.get(url, function(res) {
            expect(res).to.exist;
            expect(res.status).to.equal(200);
            
            done();
        });
    });
    
    it("should have a status of 404 when the pages doesn't exist", function(done) {
        this.slow(500);
        request.get(url + "does/not/exist", function(res) {
            expect(res).to.exist;
            expect(res.status).to.equal(404);
            
            done();
        });
    });
    
    it("should have 'Hello World!' on the page", function(done) {
        this.slow(500);
        request.get(url, function(res) {
            expect(res).to.exist;
            expect(res.status).to.equal(200);
            expect(res.text).to.contain("Hello World!");
            
            done();
        });
    });
});