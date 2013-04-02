var util = require('util')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy
  , InternalOAuthError = require('passport-oauth').InternalOAuthError;

function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://www.linkedin.com/uas/oauth2/authorization';
  options.tokenURL = options.tokenURL || 'https://www.linkedin.com/uas/oauth2/accessToken';
  options.scope = options.scope || ['r_basicprofile'];

  //By default we want data in JSON 
  options.customHeaders = options.customHeaders || {"x-li-format":"json"};
  
  OAuth2Strategy.call(this, options, verify);
  this.name = 'linkedin';
  this.profileUrl = 'https://api.linkedin.com/v1/people/~:(' + this._convertScopeToUserProfileFields(options.scope) + ')';
}

util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.userProfile = function(accessToken, done) {

  //LinkedIn uses a custom name for the access_token parameter
  this._oauth2.setAccessTokenName("oauth2_access_token");

  this._oauth2.get(this.profileUrl, accessToken, function (err, body, res) {
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

Strategy.prototype._convertScopeToUserProfileFields = function(scope) {

  var map = {
    'r_basicprofile':   ['id', 'first-name', 'last-name', 'picture-url', 'formatted-name'],
    'r_emailaddress':   'email-address'
  };

  var fields = [];

  if( scope.indexOf('r_basicprofile') === -1 )
  {
    scope.unshift('r_basicprofile');
  }

  scope.forEach(function(f) {
    if (typeof map[f] === 'undefined') return;

    if (Array.isArray(map[f])) {
      Array.prototype.push.apply(fields, map[f]);
    } else {
      fields.push(map[f]);
    }
  });

  return fields.join(',');
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
