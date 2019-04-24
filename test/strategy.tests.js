var assert = require("assert");
var should = require("should");
var nock = require('nock');
var Strategy = require('../lib/index').OAuth2Strategy;

nock.disableNetConnect();

describe('LinkedIn Strategy', function () {
  it('sanity check', function (done) {
    var options = {
      clientID: "clientId",
      clientSecret: "clientSecret"
    };
    var st = new Strategy(options, function () { });

    st.name.should.eql("linkedin");
    st.profileUrl.should.eql('https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))');
    st.emailUrl.should.eql('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))');

    done();
  });

  describe('userProfile(accessToken, done)', function () {
    before(function () {
      nock('https://api.linkedin.com')
        .get('/v2/me?projection=(id%2CfirstName%2ClastName%2CprofilePicture(displayImage~%3AplayableStreams))&oauth2_access_token=whatever')
        .times(2)
        .reply(200, require('./lite-profile.json'));
    });

    context('with r_liteprofile scope', function () {
      it('passes id, firstname, lastname and profile picture fields to callback', function (done) {
        var options = {
          clientID: "clientId",
          clientSecret: "clientSecret"
        };

        var st = new Strategy(options, function () { });

        st.userProfile('whatever', function (err, profile) {
          should.not.exist(err);
          profile.id.should.eql('REDACTED');
          profile.name.givenName.should.eql('Tina');
          profile.name.familyName.should.eql('Belcher');
          profile.displayName.should.eql('Tina Belcher');
          profile.photos.should.eql([{
            value: 'https://media.licdn.com/dms/image/C4D03AQGsitRwG8U8ZQ/profile-displayphoto-shrink_100_100/0?e=1526940000&v=alpha&t=12345'
          }]);
          done();
        });
      });
    });

    context('with r_emailaddress scope', function () {
      before(function () {
        nock('https://api.linkedin.com')
          .get('/v2/emailAddress?q=members&projection=(elements*(handle~))&oauth2_access_token=whatever')
          .reply(200, require('./email-address.json'))
      });

      it('passes also email field to callback', function (done) {
        var options = {
          clientID: "clientId",
          clientSecret: "clientSecret",
          scope: ['r_liteprofile', 'r_emailaddress']
        };

        var st = new Strategy(options, function () { });

        st.userProfile('whatever', function (err, profile) {
          should.not.exist(err);
          profile.id.should.eql('REDACTED');
          profile.emails.should.eql([
            {
              value: 'hsimpson@linkedin.com'
            }
          ]);
          done();
        });
      });
    });

    context('when error occurs', function () {
      before(function () {
        nock('https://api.linkedin.com')
          .get(/v2\/.*/)
          .reply(500)
      });

      it('passes error to callback', function (done) {
        var options = {
          clientID: "clientId",
          clientSecret: "clientSecret",
          scope: ['r_liteprofile', 'r_emailaddress']
        };

        var st = new Strategy(options, function () { });

        st.userProfile('whatever', function (err, profile) {
          should.exist(err);
          should.not.exist(profile);
          done();
        });
      });
    });
  });
});
