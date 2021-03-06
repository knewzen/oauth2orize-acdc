var chai = require('chai')
  , expect = require('chai').expect
  , acdc = require('../../lib/exchange/jwt-acdc');


describe('exchange.jwt-acdc', function() {
  
  it('should be unnamed', function() {
    expect(acdc(function(){}).name).to.equal('');
  });
  
  it('should throw if constructed without a issue callback', function() {
    expect(function() {
      acdc();
    }).to.throw(TypeError, 'oauth2orize.acdc exchange requires an issue callback');
  });
  
  describe('issuing an access token', function() {
    var response, err;

    before(function(done) {
      function issue(client, assertion, done) {
        if (client.id !== '1') { return done(new Error('incorrect client argument')); }
        if (assertion !== 'eyJ') { return done(new Error('incorrect code argument')); }
        
        return done(null, 's3cr1t');
      }
      
      chai.connect.use(acdc(issue))
        .req(function(req) {
          req.user = { id: '1', name: 'OAuth Client' };
          req.body = { assertion: 'eyJ', code_verifier: 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk' };
        })
        .end(function(res) {
          response = res;
          done();
        })
        .dispatch();
    });
    
    it('should respond with headers', function() {
      expect(response.getHeader('Content-Type')).to.equal('application/json');
      expect(response.getHeader('Cache-Control')).to.equal('no-store');
      expect(response.getHeader('Pragma')).to.equal('no-cache');
    });
    
    it('should respond with body', function() {
      expect(response.body).to.equal('{"access_token":"s3cr1t","token_type":"Bearer"}');
    });
  });
  
  describe('issuing an access token and refresh token', function() {
    var response, err;

    before(function(done) {
      function issue(client, assertion, done) {
        if (client.id !== '1') { return done(new Error('incorrect client argument')); }
        if (assertion !== 'eyJ') { return done(new Error('incorrect code argument')); }
        
        return done(null, 's3cr1t', 'getANotehr');
      }
      
      chai.connect.use(acdc(issue))
        .req(function(req) {
          req.user = { id: '1', name: 'OAuth Client' };
          req.body = { assertion: 'eyJ', code_verifier: 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk' };
        })
        .end(function(res) {
          response = res;
          done();
        })
        .dispatch();
    });
    
    it('should respond with headers', function() {
      expect(response.getHeader('Content-Type')).to.equal('application/json');
      expect(response.getHeader('Cache-Control')).to.equal('no-store');
      expect(response.getHeader('Pragma')).to.equal('no-cache');
    });
    
    it('should respond with body', function() {
      expect(response.body).to.equal('{"access_token":"s3cr1t","refresh_token":"getANotehr","token_type":"Bearer"}');
    });
  });
  
  describe('issuing an access token and params', function() {
    var response, err;

    before(function(done) {
      function issue(client, assertion, done) {
        if (client.id !== '1') { return done(new Error('incorrect client argument')); }
        if (assertion !== 'eyJ') { return done(new Error('incorrect code argument')); }
        
        return done(null, 's3cr1t', { 'expires_in': 3600 });
      }
      
      chai.connect.use(acdc(issue))
        .req(function(req) {
          req.user = { id: '1', name: 'OAuth Client' };
          req.body = { assertion: 'eyJ', code_verifier: 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk' };
        })
        .end(function(res) {
          response = res;
          done();
        })
        .dispatch();
    });
    
    it('should respond with headers', function() {
      expect(response.getHeader('Content-Type')).to.equal('application/json');
      expect(response.getHeader('Cache-Control')).to.equal('no-store');
      expect(response.getHeader('Pragma')).to.equal('no-cache');
    });
    
    it('should respond with body', function() {
      expect(response.body).to.equal('{"access_token":"s3cr1t","expires_in":3600,"token_type":"Bearer"}');
    });
  });
  
  describe('issuing an access token, null refresh token, and params', function() {
    var response, err;

    before(function(done) {
      function issue(client, assertion, done) {
        if (client.id !== '1') { return done(new Error('incorrect client argument')); }
        if (assertion !== 'eyJ') { return done(new Error('incorrect code argument')); }
        
        return done(null, 's3cr1t', null, { 'expires_in': 3600 });
      }
      
      chai.connect.use(acdc(issue))
        .req(function(req) {
          req.user = { id: '1', name: 'OAuth Client' };
          req.body = { assertion: 'eyJ', code_verifier: 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk' };
        })
        .end(function(res) {
          response = res;
          done();
        })
        .dispatch();
    });
    
    it('should respond with headers', function() {
      expect(response.getHeader('Content-Type')).to.equal('application/json');
      expect(response.getHeader('Cache-Control')).to.equal('no-store');
      expect(response.getHeader('Pragma')).to.equal('no-cache');
    });
    
    it('should respond with body', function() {
      expect(response.body).to.equal('{"access_token":"s3cr1t","expires_in":3600,"token_type":"Bearer"}');
    });
  });
  
  describe('issuing an access token, refresh token, and params with token_type', function() {
    var response, err;

    before(function(done) {
      function issue(client, assertion, done) {
        if (client.id !== '1') { return done(new Error('incorrect client argument')); }
        if (assertion !== 'eyJ') { return done(new Error('incorrect code argument')); }
        
        return done(null, 's3cr1t', 'blahblag', { 'token_type': 'foo', 'expires_in': 3600 });
      }
      
      chai.connect.use(acdc(issue))
        .req(function(req) {
          req.user = { id: '1', name: 'OAuth Client' };
          req.body = { assertion: 'eyJ', code_verifier: 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk' };
        })
        .end(function(res) {
          response = res;
          done();
        })
        .dispatch();
    });
    
    it('should respond with headers', function() {
      expect(response.getHeader('Content-Type')).to.equal('application/json');
      expect(response.getHeader('Cache-Control')).to.equal('no-store');
      expect(response.getHeader('Pragma')).to.equal('no-cache');
    });
    
    it('should respond with body', function() {
      expect(response.body).to.equal('{"access_token":"s3cr1t","refresh_token":"blahblag","token_type":"foo","expires_in":3600}');
    });
  });
  
  describe('issuing an access token based on verifier', function() {
    var response, err;

    before(function(done) {
      function issue(client, assertion, verifier, done) {
        if (client.id !== '1') { return done(new Error('incorrect client argument')); }
        if (assertion !== 'eyJ') { return done(new Error('incorrect code argument')); }
        if (verifier !== 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk') { return done(new Error('incorrect verifier argument')); }
        
        return done(null, 's3cr1t');
      }
      
      chai.connect.use(acdc(issue))
        .req(function(req) {
          req.user = { id: '1', name: 'OAuth Client' };
          req.body = { assertion: 'eyJ', code_verifier: 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk' };
        })
        .end(function(res) {
          response = res;
          done();
        })
        .dispatch();
    });
    
    it('should respond with headers', function() {
      expect(response.getHeader('Content-Type')).to.equal('application/json');
      expect(response.getHeader('Cache-Control')).to.equal('no-store');
      expect(response.getHeader('Pragma')).to.equal('no-cache');
    });
    
    it('should respond with body', function() {
      expect(response.body).to.equal('{"access_token":"s3cr1t","token_type":"Bearer"}');
    });
  });
  
  describe('issuing an access token based on misspelled verifier', function() {
    var response, err;

    before(function(done) {
      function issue(client, assertion, verifier, done) {
        if (client.id !== '1') { return done(new Error('incorrect client argument')); }
        if (assertion !== 'eyJ') { return done(new Error('incorrect code argument')); }
        if (verifier !== 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk') { return done(new Error('incorrect verifier argument')); }
        
        return done(null, 's3cr1t');
      }
      
      chai.connect.use(acdc(issue))
        .req(function(req) {
          req.user = { id: '1', name: 'OAuth Client' };
          req.body = { assertion: 'eyJ', code_verifyer: 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk' };
        })
        .end(function(res) {
          response = res;
          done();
        })
        .dispatch();
    });
    
    it('should respond with headers', function() {
      expect(response.getHeader('Content-Type')).to.equal('application/json');
      expect(response.getHeader('Cache-Control')).to.equal('no-store');
      expect(response.getHeader('Pragma')).to.equal('no-cache');
    });
    
    it('should respond with body', function() {
      expect(response.body).to.equal('{"access_token":"s3cr1t","token_type":"Bearer"}');
    });
  });
  
  describe('issuing an access token based on verifier and body', function() {
    var response, err;

    before(function(done) {
      function issue(client, assertion, verifier, body, done) {
        if (client.id !== '1') { return done(new Error('incorrect client argument')); }
        if (assertion !== 'eyJ') { return done(new Error('incorrect code argument')); }
        if (verifier !== 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk') { return done(new Error('incorrect verifier argument')); }
        if (body.foo !== 'bar') { return done(new Error('incorrect body argument')); }
        
        return done(null, 's3cr1t');
      }
      
      chai.connect.use(acdc(issue))
        .req(function(req) {
          req.user = { id: '1', name: 'OAuth Client' };
          req.body = { assertion: 'eyJ', code_verifier: 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk', foo: 'bar' };
        })
        .end(function(res) {
          response = res;
          done();
        })
        .dispatch();
    });
    
    it('should respond with headers', function() {
      expect(response.getHeader('Content-Type')).to.equal('application/json');
      expect(response.getHeader('Cache-Control')).to.equal('no-store');
      expect(response.getHeader('Pragma')).to.equal('no-cache');
    });
    
    it('should respond with body', function() {
      expect(response.body).to.equal('{"access_token":"s3cr1t","token_type":"Bearer"}');
    });
  });
  
  describe('issuing an access token based on verifier, body, and authInfo', function() {
    var response, err;

    before(function(done) {
      function issue(client, assertion, verifier, body, authInfo, done) {
        if (client.id !== '1') { return done(new Error('incorrect client argument')); }
        if (assertion !== 'eyJ') { return done(new Error('incorrect code argument')); }
        if (verifier !== 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk') { return done(new Error('incorrect verifier argument')); }
        if (body.foo !== 'bar') { return done(new Error('incorrect body argument')); }
        if (authInfo.ip !== '127.0.0.1') { return done(new Error('incorrect authInfo argument')); }
        
        return done(null, 's3cr1t');
      }
      
      chai.connect.use(acdc(issue))
        .req(function(req) {
          req.user = { id: '1', name: 'OAuth Client' };
          req.body = { assertion: 'eyJ', code_verifier: 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk', foo: 'bar' };
          req.authInfo = { ip: '127.0.0.1' };
        })
        .end(function(res) {
          response = res;
          done();
        })
        .dispatch();
    });
    
    it('should respond with headers', function() {
      expect(response.getHeader('Content-Type')).to.equal('application/json');
      expect(response.getHeader('Cache-Control')).to.equal('no-store');
      expect(response.getHeader('Pragma')).to.equal('no-cache');
    });
    
    it('should respond with body', function() {
      expect(response.body).to.equal('{"access_token":"s3cr1t","token_type":"Bearer"}');
    });
  });
  
  describe('not issuing an access token', function() {
    var response, err;

    before(function(done) {
      function issue(client, assertion, done) {
        return done(null, false);
      }
      
      chai.connect.use(acdc(issue))
        .req(function(req) {
          req.user = { id: '1', name: 'OAuth Client' };
          req.body = { assertion: 'eyJ', code_verifier: 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk' };
        })
        .next(function(e) {
          err = e;
          done();
        })
        .dispatch();
    });
    
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.constructor.name).to.equal('TokenError');
      expect(err.message).to.equal('Invalid authorization cross domain code');
      expect(err.code).to.equal('invalid_grant');
      expect(err.status).to.equal(403);
    });
  });
  
  describe('handling a request in which body has not been parsed', function() {
    var response, err;

    before(function(done) {
      function issue(client, assertion, done) {
        return done(new Error('something is horribly wrong'));
      }
      
      chai.connect.use(acdc(issue))
        .req(function(req) {
          req.user = { id: '1', name: 'OAuth Client' };
        })
        .next(function(e) {
          err = e;
          done();
        })
        .dispatch();
    });
    
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.equal('OAuth2orize requires body parsing. Did you forget app.use(express.bodyParser())?');
    });
  });
  
  describe('handling a request without assertion parameter', function() {
    var response, err;

    before(function(done) {
      function issue(client, assertion, done) {
        return done(null, '.ignore');
      }
      
      chai.connect.use(acdc(issue))
        .req(function(req) {
          req.user = { id: '1', name: 'OAuth Client' };
          req.body = { code_verifier: 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk' };
        })
        .next(function(e) {
          err = e;
          done();
        })
        .dispatch();
    });
    
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.constructor.name).to.equal('TokenError');
      expect(err.message).to.equal('Missing required parameter: assertion');
      expect(err.code).to.equal('invalid_request');
      expect(err.status).to.equal(400);
    });
  });
  
  describe('encountering an error while issuing an access token', function() {
    var response, err;

    before(function(done) {
      function issue(client, assertion, done) {
        return done(new Error('something is wrong'));
      }
      
      chai.connect.use(acdc(issue))
        .req(function(req) {
          req.user = { id: '1', name: 'OAuth Client' };
          req.body = { assertion: 'eyJ', code_verifier: 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk' };
        })
        .next(function(e) {
          err = e;
          done();
        })
        .dispatch();
    });
    
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.equal('something is wrong');
    });
  });
  
  describe('encountering an exception while issuing an access token', function() {
    var response, err;

    before(function(done) {
      function issue(client, assertion, done) {
        throw new Error('something is horribly wrong');
      }
      
      chai.connect.use(acdc(issue))
        .req(function(req) {
          req.user = { id: '1', name: 'OAuth Client' };
          req.body = { assertion: 'eyJ', code_verifier: 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk' };
        })
        .next(function(e) {
          err = e;
          done();
        })
        .dispatch();
    });
    
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.equal('something is horribly wrong');
    });
  });
  
  describe('options', function() {
    
    describe('userProperty', function() {
      
      describe('issuing an access token', function() {
        var response, err;

        before(function(done) {
          function issue(client, assertion, done) {
            if (client.id !== '1') { return done(new Error('incorrect client argument')); }
            if (assertion !== 'eyJ') { return done(new Error('incorrect code argument')); }
        
            return done(null, 's3cr1t');
          }
      
          chai.connect.use(acdc({ userProperty: 'client' }, issue))
            .req(function(req) {
              req.client = { id: '1', name: 'OAuth Client' };
              req.body = { assertion: 'eyJ', code_verifier: 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk' };
            })
            .end(function(res) {
              response = res;
              done();
            })
            .dispatch();
        });
    
        it('should respond with headers', function() {
          expect(response.getHeader('Content-Type')).to.equal('application/json');
          expect(response.getHeader('Cache-Control')).to.equal('no-store');
          expect(response.getHeader('Pragma')).to.equal('no-cache');
        });
    
        it('should respond with body', function() {
          expect(response.body).to.equal('{"access_token":"s3cr1t","token_type":"Bearer"}');
        });
      });
      
    }); // userProperty
    
  }); // options
  
});
