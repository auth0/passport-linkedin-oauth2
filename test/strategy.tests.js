var assert = require("assert");
var should = require("should");
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
    st.profileUrl.should.eql('https://api.linkedin.com/v1/people/~:(id,'+ 
      'first-name,'+ 
      'last-name,'+ 
      'picture-url,'+ 
      'formatted-name,'+
      'maiden-name,'+
      'phonetic-first-name,'+
      'phonetic-last-name,'+
      'formatted-phonetic-name,'+
      'headline,'+
      'location:(name,country:(code)),'+
      'industry,'+
      'distance,'+
      'relation-to-viewer:(distance,connections),'+
      'current-share,'+
      'num-connections,'+
      'num-connections-capped,'+
      'summary,'+
      'specialties,'+
      'positions,'+
      'site-standard-profile-request,'+
      'api-standard-profile-request:(headers,url),'+
      'public-profile-url,email-address)');
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
     st.profileUrl.should.eql('https://api.linkedin.com/v1/people/~:(id,'+ 
      'first-name,'+ 
      'last-name,'+ 
      'picture-url,'+ 
      'formatted-name,'+
      'maiden-name,'+
      'phonetic-first-name,'+
      'phonetic-last-name,'+
      'formatted-phonetic-name,'+
      'headline,'+
      'location:(name,country:(code)),'+
      'industry,'+
      'distance,'+
      'relation-to-viewer:(distance,connections),'+
      'current-share,'+
      'num-connections,'+
      'num-connections-capped,'+
      'summary,'+
      'specialties,'+
      'positions,'+
      'site-standard-profile-request,'+
      'api-standard-profile-request:(headers,url),'+
      'public-profile-url,email-address)');
     done();
    });


  it('init with custom parameters', function (done) {
      
    var options = {
        clientID: "clientId",
        clientSecret: "clientSecret",
        scope: {'r_basicprofile': [ 'id', 'first-name', 'last-name']}
      };

    var st = new Strategy(options, function(){});
    st.name.should.eql("linkedin");
    st.profileUrl.should.eql('https://api.linkedin.com/v1/people/~:(id,first-name,last-name)');
    done();
    });

    it('init with r_fullprofile custom parameters', function (done) {
      
        var options = {
            clientID: "clientId",
            clientSecret: "clientSecret",
            scope: {'r_fullprofile': [ 'id', 'first-name', 'last-name','first-proposal-comments']}
          };

        var st = new Strategy(options, function(){});
        st.name.should.eql("linkedin");
        st.profileUrl.should.eql('https://api.linkedin.com/v1/people/~:(id,first-name,last-name,first-proposal-comments)');
        done();
    });


    it('init with r_fullprofile scope used but only r_basicprofile fields specified', function (done) {
      
        var options = {
            clientID: "clientId",
            clientSecret: "clientSecret",
            scope: {'r_fullprofile': [ 'id', 'first-name', 'last-name']}
          };

        var st = new Strategy(options, function(){});
        st.name.should.eql("linkedin");
        st.profileUrl.should.eql('https://api.linkedin.com/v1/people/~:(id,first-name,last-name)');
        done();
    });
});