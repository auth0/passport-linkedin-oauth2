var assert = require("assert");
var should = require("should");
var sinon = require("sinon");
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

  describe('user profile', function() {
    const testProfile = {
      id: 'test',
      formattedName: 'formatted test name',
      lastName: 'lastname',
      firstName: 'firstname',
      emailAddress: 'test@test.com',
      pictureUrl: 'https://some.url.com/picture.jpg'
    };

    const jsonBody = JSON.stringify(testProfile);

    function createStrategy(extraOptions) {
      const result = {};

      const options = Object.assign({
        clientID: "clientId",
        clientSecret: "clientSecret"
      }, extraOptions);

      result.strategy = new Strategy(options, () => {});
      result.getStub = sinon.stub(result.strategy._oauth2, 'get');

      return result;
    }

    it('gets a user profile', function(done) {
      const { strategy, getStub } = createStrategy();

      getStub.callsArgWith(2, null, jsonBody);

      strategy.userProfile('token', (err, profile) => {
        should.not.exist(err);
        should.exist(profile);
        profile.id.should.equal(testProfile.id);
        profile.displayName.should.equal(testProfile.formattedName);
        profile.name.familyName.should.equal(testProfile.lastName);
        profile.name.givenName.should.equal(testProfile.firstName);
        profile.emails.should.be.an.Array().of.length(1);
        profile.emails[0].value.should.equal(testProfile.emailAddress);
        profile.photos.should.be.an.Array().of.length(1);
        profile.photos[0].value.should.equal(testProfile.pictureUrl);
        getStub.calledOnce.should.be.true();

        done();
      });
    });

    it('gets a user profile with missing fields', function(done) {
      const { strategy, getStub } = createStrategy();

      const newTestProfile = Object.assign({}, testProfile);
      delete newTestProfile.formattedName;

      getStub.callsArgWith(2, null, JSON.stringify(newTestProfile));

      strategy.userProfile('token', (err, profile) => {
        should.not.exist(err);
        should.exist(profile);
        profile.id.should.equal(testProfile.id);
        should.not.exist(profile.displayName);
        profile.name.familyName.should.equal(testProfile.lastName);
        profile.name.givenName.should.equal(testProfile.firstName);
        profile.emails.should.be.an.Array().of.length(1);
        profile.emails[0].value.should.equal(testProfile.emailAddress);
        profile.photos.should.be.an.Array().of.length(1);
        profile.photos[0].value.should.equal(testProfile.pictureUrl);
        getStub.calledOnce.should.be.true();

        done();
      });
    });

    it('fails when user profile URL response body is not JSON', function(done) {
      const { strategy, getStub } = createStrategy();

      getStub.callsArgWith(2, null, 'not json');

      strategy.userProfile('token', (err, profile) => {
        should.exist(err);
        err.should.be.an.Error();
        should.not.exist(profile);
        getStub.calledOnce.should.be.true();

        done();
      });
    });

    it('fails to get profile once when public profile URL fails with no public-profile-url field', function(done) {
      const { strategy, getStub } = createStrategy({ scope: 'r_emailaddress' });

      getStub.callsArgWith(2, new Error('test'));

      strategy.userProfile('token', (err, profile) => {
        should.exist(err);
        err.should.be.an.Error().with.property('message', 'failed to fetch user profile');
        getStub.calledOnce.should.be.true();
        getStub.firstCall.args[0].should.not.match(/public-profile-url/);

        done();
      });
    });

    it('fails to get profile twice when public profile URL fails with public-profile-url field', function(done) {
      const { strategy, getStub } = createStrategy();

      getStub.callsArgWith(2, new Error('test'));

      strategy.userProfile('token', (err, profile) => {
        should.exist(err);
        err.should.be.an.Error().with.property('message', 'failed to fetch user profile');
        getStub.calledTwice.should.be.true();

        const firstUrl = getStub.firstCall.args[0];
        const secondUrl = getStub.secondCall.args[0];

        firstUrl.should.match(/public-profile-url/);
        secondUrl.should.not.match(/public-profile-url/);

        let url = firstUrl.replace('public-profile-url', '');
        url = url.replace(',)', ')');
        url = url.replace('(,', '(');
        url = url.replace(',,', ',');
        url.should.equal(secondUrl);

        done();
      });
    });

    it('gets profile correctly after first failure with public-profile-url field', function(done) {
      const { strategy, getStub } = createStrategy();

      getStub.onFirstCall().callsArgWith(2, new Error('test'));
      getStub.onSecondCall().callsArgWith(2, null, jsonBody);

      strategy.userProfile('token', (err, profile) => {
        should.not.exist(err);
        should.exist(profile);

        getStub.calledTwice.should.be.true();
        getStub.firstCall.args[0].should.match(/public-profile-url/);
        getStub.secondCall.args[0].should.not.match(/public-profile-url/);

        profile.id.should.equal(testProfile.id);
        profile.displayName.should.equal(testProfile.formattedName);
        profile.name.familyName.should.equal(testProfile.lastName);
        profile.name.givenName.should.equal(testProfile.firstName);
        profile.emails.should.be.an.Array().of.length(1);
        profile.emails[0].value.should.equal(testProfile.emailAddress);
        profile.photos.should.be.an.Array().of.length(1);
        profile.photos[0].value.should.equal(testProfile.pictureUrl);

        done();
      });
    });

    // See: https://github.com/auth0/passport-linkedin-oauth2/pull/70
    it('it calls callback only once when get profile fails the first time', function(done) {
      const { strategy, getStub } = createStrategy();

      getStub.onFirstCall().callsArgWith(2, new Error('test'));
      getStub.onSecondCall().callsArgWith(2, null, jsonBody);

      strategy.userProfile('token', (err, profile) => {
        done();
      });
    });

  });
});
