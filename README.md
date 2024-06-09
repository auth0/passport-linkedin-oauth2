A simple [Passport](http://passportjs.org/) strategy for LinkedIn OAuth2 that works with lite profile.

## Install

npm install passport-linkedin-oauth2

## Usage

### Register the strategy

### 1. Example for "Share on LinkedIn"
```javascript
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

passport.use(
  new LinkedInStrategy(
    {
      clientID: LINKEDIN_KEY,
      clientSecret: LINKEDIN_SECRET,
      callbackURL: 'http://127.0.0.1:3000/auth/linkedin/callback',
      scope: ['email', 'profile', 'openid'],
    },
    function (accessToken, refreshToken, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {
        // To keep the example simple, the user's LinkedIn profile is returned to
        // represent the logged-in user. In a typical application, you would want
        // to associate the LinkedIn account with a user record in your database,
        // and return that user instead.
        return done(null, profile);
      });
    }
  )
);
```

### 2. Exmample for "Community Management API"
```javascript
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

passport.use(
  new LinkedInStrategy(
    {
      clientID: LINKEDIN_KEY,
      clientSecret: LINKEDIN_SECRET,
      callbackURL: 'http://127.0.0.1:3000/auth/linkedin/callback',
      scope: ['r_basicprofile'], // 'profile', 'openid' scope will not work for "Community Management API"
    },
    function (accessToken, refreshToken, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {
        // To keep the example simple, the user's LinkedIn profile is returned to
        // represent the logged-in user. In a typical application, you would want
        // to associate the LinkedIn account with a user record in your database,
        // and return that user instead.
        return done(null, profile);
      });
    }
  )
);
```

and then authenticate as:

```javascript
app.get(
  '/auth/linkedin',
  passport.authenticate('linkedin', { state: 'SOME STATE' }),
  function (req, res) {
    // The request will be redirected to LinkedIn for authentication, so this
    // function will not be called.
  }
);
```

the login callback:

```javascript
app.get(
  '/auth/linkedin/callback',
  passport.authenticate('linkedin', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
);
```

See [this](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2) for details on LinkedIn API.

## Auto-handle `state` param

The `state` param is used to prevent CSRF attacks, and is [required by the LinkedIn API](https://developer.linkedin.com/documents/authentication). You can ask Passport to handle the sending and validating of the `state` parameter by passing `state: true` as an option to the strategy:

```javascript
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

passport.use(
  new LinkedInStrategy(
    {
      clientID: LINKEDIN_KEY,
      clientSecret: LINKEDIN_SECRET,
      callbackURL: 'http://127.0.0.1:3000/auth/linkedin/callback',
      scope: ['email', 'profile', 'openid'],
      state: true,
    },
    function (accessToken, refreshToken, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {
        // To keep the example simple, the user's LinkedIn profile is returned to
        // represent the logged-in user. In a typical application, you would want
        // to associate the LinkedIn account with a user record in your database,
        // and return that user instead.
        return done(null, profile);
      });
    }
  )
);
```

and then authenticate as:

```javascript
app.get(
  '/auth/linkedin',
  passport.authenticate('linkedin'),
  function (req, res) {
    // The request will be redirected to LinkedIn for authentication, so this
    // function will not be called.
  }
);
```

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Auth0](auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
