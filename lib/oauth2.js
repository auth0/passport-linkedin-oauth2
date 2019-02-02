var util = require('util')
var OAuth2Strategy = require('passport-oauth2')
var InternalOAuthError = require('passport-oauth2').InternalOAuthError;

var liteProfileUrl = 'https://api.linkedin.com/v2/me?projection=(' +
  'id,' +
  'firstName,' +
  'lastName,' +
  'maidenName,' +
  'profilePicture(displayImage~:playableStreams)' +
  ')';

// Most of these fields are only available for members of partner programs.
var basicProfileUrl = 'https://api.linkedin.com/v2/me?projection=(' +
  'id,' +
  'firstName,' +
  'lastName,' +
  'maidenName,' +
  'profilePicture(displayImage~:playableStreams),' +
  'phoneticFirstName,' +
  'phoneticLastName,' +
  'headline,' +
  'location,' +
  'industryId,' +
  'summary,' +
  'positions,' +
  'vanityName,' +
  'lastModified' +
  ')';

function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://www.linkedin.com/oauth/v2/authorization';
  options.tokenURL = options.tokenURL || 'https://www.linkedin.com/oauth/v2/accessToken';
  options.scope = options.scope || ['r_liteprofile'];

  //By default we want data in JSON
  options.customHeaders = options.customHeaders || {"x-li-format":"json"};

  OAuth2Strategy.call(this, options, verify);

  this.options = options;
  this.name = 'linkedin';
  this.profileUrl = options.scope.indexOf('r_basicprofile') !== -1 ?
    basicProfileUrl : liteProfileUrl;
  this.emailUrl = 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))';
}

util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.userProfile = function(accessToken, done) {
  //LinkedIn uses a custom name for the access_token parameter
  this._oauth2.setAccessTokenName("oauth2_access_token");

  this._oauth2.get(this.profileUrl, accessToken, function (err, body, res) {
    if (err) {
      return done(new InternalOAuthError('failed to fetch user profile', err));
    }

    var profile;

    try {
      profile = parseProfile(body);
    } catch(e) {
      return done(new InternalOAuthError('failed to parse profile response', e));
    }

    if (!this.options.scope.includes('r_emailaddress')) {
      return done(null, profile);
    }

    this._oauth2.get(this.emailUrl, accessToken, function (err, body, res) {
      if (err) {
        return done(new InternalOAuthError('failed to fetch user email', err));
      }

      try {
        addEmails(profile, body);
      } catch(e) {
        return done(new InternalOAuthError('failed to parse email response', e));
      }

      return done(null, profile);
    }.bind(this));

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

function getName(nameObj) {
  var locale = nameObj.preferredLocale.language + '_' + nameObj.preferredLocale.country;
  return nameObj.localized[locale];
}

function getProfilePictures(profilePictureObj) {
  // This is the format we used to return in the past.
  var result = [];

  if(!profilePictureObj) {
    // Picture is optional.
    return result;
  }

  try {
    profilePictureObj['displayImage~'].elements.forEach(function(pic) {
      // We keep only public profile pictures.
      if(pic.authorizationMethod !== 'PUBLIC') {
        return;
      }

      // This should not happen, but...
      if(pic.identifiers.length === 0) {
        return;
      }

      var url = pic.identifiers[0].identifier;

      result.push({ value: url });
    });
  } catch(e) {
    // Profile picture object changed format?
    return result;
  }

  return result;
}

function parseProfile(body) {
  var json = JSON.parse(body);

  var profile = { provider: 'linkedin' };

  profile.id = json.id;

  profile.name = {
    givenName: getName(json.firstName),
    familyName: getName(json.lastName)
  };

  profile.displayName = profile.name.givenName + ' ' + profile.name.familyName;

  profile.photos = getProfilePictures(json.profilePicture);

  profile._raw = body;
  profile._json = json;

  return profile;
}

function addEmails(profile, body) {
  var json = JSON.parse(body);

  if(json.elements && json.elements.length > 0) {
    profile.emails = json.elements.reduce(function (acc, el) {
      if (el['handle~'] && el['handle~'].emailAddress) {
        acc.push({
          value: el['handle~'].emailAddress
        });
      }
      return acc;
    }, []);
  }

  profile._emailRaw = body;
  profile._emailJson = json;
}

module.exports = Strategy;
