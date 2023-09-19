const should = require('should');
const nock = require('nock');
const Strategy = require('../lib/index').OAuth2Strategy;
const profileExample = require('./profile.json');

nock.disableNetConnect();

describe('LinkedIn Strategy', function () {
  const origin = 'https://api.linkedin.com';

  const profilePath = '/v2/userinfo?oauth2_access_token=whatever';

  it('sanity check', function (done) {
    const options = {
      clientID: 'clientId',
      clientSecret: 'clientSecret',
    };
    const st = new Strategy(options, function () {});

    st.name.should.eql('linkedin');

    const decodedProfilePath = decodeURIComponent(profilePath).replace(
      '?oauth2_access_token=whatever',
      ''
    );

    st.profileUrl.should.eql(`${origin}${decodedProfilePath}`);

    done();
  });

  describe('userProfile(accessToken, done)', function () {
    context('with profile and email scope', function () {
      beforeEach(function () {
        this.scope = nock(origin).get(profilePath).reply(200, profileExample);
      });

      afterEach(function () {
        this.scope.done();
      });

      it('passes id, firstname, lastname and profile picture fields to callback', function (done) {
        const options = {
          clientID: 'clientId',
          clientSecret: 'clientSecret',
          scope: ['profile', 'email', 'openid'],
        };

        const st = new Strategy(options, function () {});

        st.userProfile('whatever', function (err, profile) {
          should.not.exist(err);
          profile.id.should.eql('782bbtaQ');
          profile.givenName.should.eql('John');
          profile.familyName.should.eql('Doe');
          profile.displayName.should.eql('John Doe');
          profile.picture.should.eql(
            'https://media.licdn-ei.com/dms/image/C5F03AQHqK8v7tB1HCQ/profile-displayphoto-shrink_100_100/0/'
          );
          profile.email.should.eql('doe@email.com');

          done();
        });
      });
    });

    context('when error occurs', function () {
      beforeEach(function () {
        this.scope = nock(origin).get(profilePath).reply(500);
      });

      afterEach(function () {
        this.scope.done();
      });

      it('passes error to callback', function (done) {
        const options = {
          clientID: 'clientId',
          clientSecret: 'clientSecret',
          scope: ['profile', 'email', 'openid'],
        };

        const st = new Strategy(options, function () {});

        st.userProfile('whatever', function (err, profile) {
          should.exist(err);
          should.not.exist(profile);
          done();
        });
      });
    });
  });
});
