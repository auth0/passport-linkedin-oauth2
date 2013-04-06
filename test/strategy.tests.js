var Strategy = require('../lib/index').OAuth2Strategy;

describe.only('LinkedIn Strategy', function () {

  it('init with basic profile', function (done) {
      
    var options = {
        clientID: "clientId",
        clientSecret: "clientSecret"
      };

    var st = new Strategy(options, function(){});
    st.name.should.eql("linkedin");
    st.profileUrl.should.eql('https://api.linkedin.com/v1/people/~:(id,first-name,last-name,picture-url,formatted-name)');
    done();
    });
  
  it('init with email scope', function (done) {
      
    var options = {
        clientID: "clientId",
        clientSecret: "clientSecret",
        scope: ['r_emailaddress']
      };

    var st = new Strategy(options, function(){});
    st.name.should.eql("linkedin");
    st.profileUrl.should.eql('https://api.linkedin.com/v1/people/~:(id,first-name,last-name,picture-url,formatted-name,email-address)');
    done();
    });


  it('init with profile and email scope', function (done) {
      
    var options = {
        clientID: "clientId",
        clientSecret: "clientSecret",
        scope: ['r_basicprofile', 'r_emailaddress']
      };

    var st = new Strategy(options, function(){});
    st.name.should.eql("linkedin");
    st.profileUrl.should.eql('https://api.linkedin.com/v1/people/~:(id,first-name,last-name,picture-url,formatted-name,email-address)');
    done();
    });
});