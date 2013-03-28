var util = require('util')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy
  , InternalOAuthError = require('passport-oauth').InternalOAuthError;

function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://www.linkedin.com/uas/oauth2/authorization';
  options.tokenURL = options.tokenURL || 'https://www.linkedin.com/uas/oauth2/accessToken';
  
  //By default we want data in JSON 
  options.customHeaders = options.customHeaders || {"x-li-format":"json"};
  
  OAuth2Strategy.call(this, options, verify);
  this.name = 'linkedin';
}

util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.userProfile = function(accessToken, done) {

  //LinkedIn uses a custom name for the access_token parameter
  this._oauth2.setAccessTokenName("oauth2_access_token");

  this._oauth2.get('https://api.linkedin.com/v1/people/~:(id,first-name,last-name,email-address,picture-url)', accessToken, function (err, body, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }
    
    try {
      var json = JSON.parse(body);
      
      var profile = { provider: 'linkedin' }; 
      
      profile.id = json.id;
      profile.displayName = json.firstName + " " + json.lastName;
      profile.name = { 
                        familyName: json.lastName,
                        givenName: json.firstName
                     };
      profile.emails = [{ value: json.emailAddress }];
      profile._raw = body;
      profile._json = json;

      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
}

Strategy.prototype.authorizationParams = function(options) {
  var params = {};

  // LinkedIn requires state parameter
  if (options.state) {
    params['state'] = options.state;
  }
  return params;
}

module.exports = Strategy;
