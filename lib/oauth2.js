var util = require('util');
var OAuth2Strategy = require('passport-oauth2');
var InternalOAuthError = require('passport-oauth2').InternalOAuthError;

var profileUrl = 'https://api.linkedin.com/v2/userinfo';

function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL =
    options.authorizationURL ||
    'https://www.linkedin.com/oauth/v2/authorization';
  options.tokenURL =
    options.tokenURL || 'https://www.linkedin.com/oauth/v2/accessToken';
  options.scope = options.scope || ['profile', 'email', 'openid'];

  //By default we want data in JSON
  options.customHeaders = options.customHeaders || { 'x-li-format': 'json' };

  OAuth2Strategy.call(this, options, verify);

  this.options = options;
  this.name = 'linkedin';
  this.profileUrl = profileUrl;
}

util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.userProfile = function (accessToken, done) {
  //LinkedIn uses a custom name for the access_token parameter
  this._oauth2.setAccessTokenName('oauth2_access_token');

  this._oauth2.get(
    this.profileUrl,
    accessToken,
    function (err, body, _res) {
      if (err) {
        return done(
          new InternalOAuthError('failed to fetch user profile', err)
        );
      }

      var profile;

      try {
        profile = parseProfile(body);
      } catch (e) {
        return done(
          new InternalOAuthError('failed to parse profile response', e)
        );
      }

      done(null, profile);
    }.bind(this)
  );
};

Strategy.prototype.authorizationParams = function (options) {
  var params = {};

  // LinkedIn requires state parameter. It will return an error if not set.
  if (options.state) {
    params['state'] = options.state;
  }

  return params;
};

function parseProfile(body) {
  var json = JSON.parse(body);

  return {
    provider: 'linkedin',
    id: json.sub,
    email: json.email,
    givenName: json.given_name,
    familyName: json.family_name,
    displayName: `${json.given_name} ${json.family_name}`,
    picture: json.picture,
    _raw: body,
    _json: json,
  };
}

module.exports = Strategy;
