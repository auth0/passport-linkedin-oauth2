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
  this.name = 'linkedin';
  this.profileUrl = 'https://api.linkedin.com/v2/me?projection=(' + this._convertScopeToUserProfileFields(options.scope, options.profileFields) + ')';
}

util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.userProfile = function(accessToken, done) {

  //LinkedIn uses a custom name for the access_token parameter
  this._oauth2.setAccessTokenName("oauth2_access_token");
   
  if (this.emailUrl) {
     var self = this
     this._oauth2.get(this.emailUrl, accessToken, function (err, body, res) {
        if (err) { return done(new InternalOAuthError('failed to fetch user email', err)); }
          
        try {
           var json = JSON.parse(body);
           var email = json.emailAddress;
           
           self._fetchAsyncProfile(accessToken, done, email);
           
        } catch(e) {
           done(e);
        }
     });
   } else  {
      this._fetchAsyncProfile(accessToken, done);
   }
};

Strategy.prototype._fetchAsyncProfile = function(accessToken, done, email) {
   this._oauth2.get(this.profileUrl, accessToken, function (err, body, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }
      
    try {
      var json = JSON.parse(body);

      var profile = { provider: 'linkedin' };

      profile.id = json.id;
      profile.displayName = json.formattedName;
      profile.name = {
                        familyName: json.lastName,
                        givenName:  json.firstName
                     };
      profile.emails = [{ value: email || json.emailAddress }];
      profile.photos = [];
      if (json.pictureUrl) {
          profile.photos.push({ value: json.pictureUrl });
      }
      profile._raw = body;
      profile._json = json;

      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
};


Strategy.prototype._convertScopeToUserProfileFields = function(scope, profileFields) {
  var self = this;
  var map = {
    'r_liteprofile':   [
      'id',
      'firstName',
      'lastName',
      'profilePicture(displayImage~:playableStreams)'
    ],
  };
  var r_emailaddress = 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))';

  var fields = [];

  // To obtain pre-defined field mappings
  if(Array.isArray(scope) && profileFields === null)
  {
    if(scope.indexOf('r_liteprofile') === -1){
      scope.unshift('r_liteprofile');
    }
     
    if(scope.indexOf('r_emailaddress') !== -1){
      self.emailUrl = r_emailaddress
    }

    scope.forEach(function(f) {
      if (typeof map[f] === 'undefined') return;

      if (Array.isArray(map[f])) {
        Array.prototype.push.apply(fields, map[f]);
      } else {
        fields.push(map[f]);
      }
    });
  }else if (Array.isArray(profileFields)){
    fields = profileFields;
  }

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
