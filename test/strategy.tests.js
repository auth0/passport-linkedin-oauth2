const should = require("should");
const nock = require('nock');
const Strategy = require('../lib/index').OAuth2Strategy;
const liteProfileExample = require('./lite-profile.json');
const basicProfileExample = require('./basic-profile.json');

nock.disableNetConnect();

describe('LinkedIn Strategy', function () {
  const origin = 'https://api.linkedin.com';

  const liteProfilePath = '/v2/me?projection=(id%2CfirstName%2ClastName%2CmaidenName%2CprofilePicture(displayImage~%3AplayableStreams))&oauth2_access_token=whatever';

  const emailPath = '/v2/emailAddress?q=members&projection=(elements*(handle~))&oauth2_access_token=whatever';

  const basicProfilePath = '/v2/me?projection=(id%2CfirstName%2ClastName%2CmaidenName%2CprofilePicture(displayImage~%3AplayableStreams)%2CphoneticFirstName%2CphoneticLastName%2Cheadline%2Clocation%2CindustryId%2Csummary%2Cpositions%2CvanityName%2ClastModified)&oauth2_access_token=whatever';

  it('sanity check', function (done) {
    const options = {
      clientID: "clientId",
      clientSecret: "clientSecret"
    };
    const st = new Strategy(options, function () { });

    st.name.should.eql("linkedin");

    const decodedProfilePath = decodeURIComponent(liteProfilePath).replace('&oauth2_access_token=whatever', '');
    const decodedEmailPath = decodeURIComponent(emailPath).replace('&oauth2_access_token=whatever', '');

    st.profileUrl.should.eql(`${origin}${decodedProfilePath}`);
    st.emailUrl.should.eql(`${origin}${decodedEmailPath}`);

    done();
  });

  describe('userProfile(accessToken, done)', function () {

    context('with r_liteprofile scope', function () {
      beforeEach(function () {
        this.scope = nock(origin)
          .get(liteProfilePath)
          .reply(200, liteProfileExample);
      });

      afterEach(function () {
        this.scope.done();
      });

      it('passes id, firstname, lastname and profile picture fields to callback', function (done) {
        const options = {
          clientID: "clientId",
          clientSecret: "clientSecret"
        };

        const st = new Strategy(options, function () { });

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
      beforeEach(function () {
        this.scope = nock(origin)
          .get(liteProfilePath)
          .reply(200, liteProfileExample)
          .get(emailPath)
          .reply(200, require('./email-address.json'));
      });

      afterEach(function() {
        this.scope.done();
      });

      it('passes also email field to callback', function (done) {
        const options = {
          clientID: "clientId",
          clientSecret: "clientSecret",
          scope: ['r_liteprofile', 'r_emailaddress']
        };

        const st = new Strategy(options, function () { });

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

    context('with r_basicprofile scope', function () {
      beforeEach(function () {
        this.scope = nock(origin)
          .get(basicProfilePath)
          .reply(200, basicProfileExample);
      });

      afterEach(function () {
        this.scope.done();
      });

      it('passes all basic profile fields to callback', function (done) {
        const options = {
          clientID: "clientId",
          clientSecret: "clientSecret",
          scope: ['r_basicprofile']
        };

        const st = new Strategy(options, function () { });

        st.userProfile('whatever', function (err, profile) {
          should.not.exist(err);
          profile.id.should.eql('REDACTED');
          profile.name.givenName.should.eql('Tina');
          profile.name.familyName.should.eql('Belcher');
          profile.displayName.should.eql('Tina Belcher');
          profile.photos.should.eql([{
            value: 'https://media.licdn.com/dms/image/C4D03AQGsitRwG8U8ZQ/profile-displayphoto-shrink_100_100/0?e=1526940000&v=alpha&t=12345'
          }]);

          // TODO: add basic profile fields once we have a valid example.

          done();
        });
      });

      it('should still request basic profile fields when used at the same time as r_liteprofile', function (done) {
        const options = {
          clientID: "clientId",
          clientSecret: "clientSecret",
          scope: ['r_liteprofile', 'r_basicprofile']
        };

        const st = new Strategy(options, function () { });

        st.userProfile('whatever', function (err, profile) {

          // TODO: check one basic profile field, other checks performed
          // by nock in afterEach block.

          done(err);
        });
      });
    });

    context('when error occurs', function () {
      beforeEach(function () {
        this.scope = nock(origin)
          .get(liteProfilePath)
          .reply(500);
      });

      afterEach(function () {
        this.scope.done();
      });

      it('passes error to callback', function (done) {
        const options = {
          clientID: "clientId",
          clientSecret: "clientSecret",
          scope: ['r_liteprofile', 'r_emailaddress']
        };

        const st = new Strategy(options, function () { });

        st.userProfile('whatever', function (err, profile) {
          should.exist(err);
          should.not.exist(profile);
          done();
        });
      });
    });
  });
});
