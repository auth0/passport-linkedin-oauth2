var util = require('util'),
   _ = require('underscore')
  , OAuth2Strategy = require('passport-oauth2')
  , InternalOAuthError = require('passport-oauth2').InternalOAuthError;

function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://www.linkedin.com/oauth/v2/authorization';
  options.tokenURL = options.tokenURL || 'https://www.linkedin.com/oauth/v2/accessToken';
  options.scope = options.scope || ['r_liteprofile'];
  options.profileFields = options.profileFields || null;

  //By default we want data in JSON
  options.customHeaders = options.customHeaders || {"x-li-format":"json"};

  OAuth2Strategy.call(this, options, verify);

  this.options = options;
  this.name = 'linkedin';
  this.profileUrl = 'https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))';
  this.emailUrl = 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))';
}

util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.userProfile = function(accessToken, done) {
  //LinkedIn uses a custom name for the access_token parameter
  this._oauth2.setAccessTokenName("oauth2_access_token");

  this._oauth2.get(this.profileUrl, accessToken, function (err, body, res) {
    try {
      if (err) {
        throw new InternalOAuthError('failed to fetch user profile', err)
      }

      var json = JSON.parse(body);

      var profile = { provider: 'linkedin' };

      profile.id = json.id;

      var firstName = json.firstName.localized[Object.keys(json.firstName.localized)[0]];
      var lastName = json.lastName.localized[Object.keys(json.lastName.localized)[0]];

      profile.name = {
        givenName: firstName,
        familyName: lastName
      };

      profile.displayName = firstName + ' ' + lastName;

      if (
        json.profilePicture &&
        json.profilePicture['displayImage~'] &&
        json.profilePicture['displayImage~'].elements &&
        json.profilePicture['displayImage~'].elements.length > 0
      ) {
        profile.photos = json.profilePicture['displayImage~'].elements.reduce(function (memo, el) {
          if (el && el.identifiers && el.identifiers.length > 0) {
            memo.push({ value: el.identifiers[0].identifier }); // Keep the first pic for now
          }
          return memo;
        }, []);
      }

      profile._profileRaw = body;
      profile._profileJson = json;

      if (!this.options.scope.includes('r_emailaddress')) {
        return done(null, profile);
      }

      this._oauth2.get(this.emailUrl, accessToken, function (err, body, res) {
        try {
          if (err) {
            throw new InternalOAuthError('failed to fetch user email', err);
          }

          var json = JSON.parse(body);

          if (
            json.elements &&
            json.elements.length > 0
          ) {
            profile.emails = json.elements.reduce(function (memo, el) {
              if (el['handle~'] && el['handle~'].emailAddress) {
                memo.push({
                  value: el['handle~'].emailAddress
                });
              }
              return memo;
            }, []);
          }

          profile._emailRaw = body;
          profile._emailJson = json;

          done(null, profile);
        } catch (e) {
          console.log(e);
          done(e);
        }
      }.bind(this));
    } catch(e) {
      done(e);
    }
  }.bind(this));
}




Strategy.prototype.authorizationParams = function(options) {

  var params = {};

  // LinkedIn requires state parameter. It will return an error if not set.
  if (options.state) {
    params['state'] = options.state;
  }
  return params;
}




module.exports = Strategy;
