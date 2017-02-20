var util = require('util'),
   _ = require('underscore')
  , OAuth2Strategy = require('passport-oauth2')
  , InternalOAuthError = require('passport-oauth2').InternalOAuthError;

function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://www.linkedin.com/oauth/v2/authorization';
  options.tokenURL = options.tokenURL || 'https://www.linkedin.com/oauth/v2/accessToken';
  options.scope = options.scope || ['r_basicprofile'];
  options.profileFields = options.profileFields || null;

  //By default we want data in JSON
  options.customHeaders = options.customHeaders || {"x-li-format":"json"};

  OAuth2Strategy.call(this, options, verify);
  this.name = 'linkedin';
  this.profileUrl = 'https://api.linkedin.com/v1/people/~:(' + this._convertScopeToUserProfileFields(options.scope, options.profileFields) + ')';
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
      profile.displayName = json.formattedName;
      profile.name = {
                        familyName: json.lastName,
                        givenName:  json.firstName
                     };
      profile.emails = [{ value: json.emailAddress }];
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
}




Strategy.prototype._convertScopeToUserProfileFields = function(scope, profileFields) {
  var self = this;
  var map = {
    'r_basicprofile':   [
      'id',
      'first-name',
      'last-name',
      'picture-url',
      'picture-urls::(original)',
      'formatted-name',
      'maiden-name',
      'phonetic-first-name',
      'phonetic-last-name',
      'formatted-phonetic-name',
      'headline',
      'location:(name,country:(code))',
      'industry',
      'distance',
      'relation-to-viewer:(distance,connections)',
      'current-share',
      'num-connections',
      'num-connections-capped',
      'summary',
      'specialties',
      'positions',
      'site-standard-profile-request',
      'api-standard-profile-request:(headers,url)',
      'public-profile-url'
    ],
    'r_emailaddress':   ['email-address'],
    'r_fullprofile':   [
      'last-modified-timestamp',
      'proposal-comments',
      'associations',
      'interests',
      'publications',
      'patents',
      'languages',
      'skills',
      'certifications',
      'educations',
      'courses',
      'volunteer',
      'three-current-positions',
      'three-past-positions',
      'num-recommenders',
      'recommendations-received',
      'mfeed-rss-url',
      'following',
      'job-bookmarks',
      'suggestions',
      'date-of-birth',
      'member-url-resources:(name,url)',
      'related-profile-views',
      'honors-awards'
    ]
  };

  var fields = [];

  // To obtain pre-defined field mappings
  if(Array.isArray(scope) && profileFields === null)
  {
    if(scope.indexOf('r_basicprofile') === -1){
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
