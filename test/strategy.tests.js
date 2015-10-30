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
    st.profileUrl.should.eql('https://api.linkedin.com/v1/people/~:(id,'+ 
        'first-name,'+ 
        'last-name,'+ 
        'picture-url,'+ 
        'picture-urls::(original),'+
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
        'public-profile-url)');
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
      'picture-urls::(original),'+
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
      'public-profile-url,'+
      'email-address)');
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
      'picture-urls::(original),'+
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
            profileFields: [ 'id', 'first-name', 'last-name']
          };

        var st = new Strategy(options, function(){});
        st.name.should.eql("linkedin");
        st.profileUrl.should.eql('https://api.linkedin.com/v1/people/~:(id,first-name,last-name)');
        done();
    });


    it('init with r_emailaddress scope', function (done) {      
        var options = {
            clientID: "clientId",
            clientSecret: "clientSecret",
            scope: ['r_emailaddress'],
            profileFields: [ 'id', 'first-name', 'last-name']
          };

        var st = new Strategy(options, function(){});
        st.name.should.eql("linkedin");
        st.profileUrl.should.eql('https://api.linkedin.com/v1/people/~:(id,first-name,last-name)');
        done();
    });


    it('test all fields with r_basicprofile and r_fullprofile', function (done) {      
        var options = {
            clientID: "clientId",
            clientSecret: "clientSecret",
            scope: ['r_fullprofile']
          };

        var st = new Strategy(options, function(){});
        st.name.should.eql("linkedin");
        st.profileUrl.should.eql('https://api.linkedin.com/v1/people/~:(id,'+ 
          'first-name,'+ 
          'last-name,'+ 
          'picture-url,'+ 
          'picture-urls::(original),'+
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
          'public-profile-url,'+
          'last-modified-timestamp,'+
          'proposal-comments,'+
          'associations,'+
          'interests,'+ 
          'publications,'+
          'patents,'+
          'languages,'+
          'skills,'+
          'certifications,'+
          'educations,'+
          'courses,'+
          'volunteer,'+
          'three-current-positions,'+
          'three-past-positions,'+
          'num-recommenders,'+
          'recommendations-received,'+
          'mfeed-rss-url,'+
          'following,'+
          'job-bookmarks,'+
          'suggestions,'+
          'date-of-birth,'+
          'member-url-resources:(name,url),'+
          'related-profile-views,'+
          'honors-awards)');
         done();
    });
});