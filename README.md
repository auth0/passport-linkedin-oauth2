A simple [Passport](http://passportjs.org/) strategy for LinkedIn OAuth2.

## Install

	npm install passport-linkedin-oauth2

## Usage

Register the strategy

~~~javascript
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

passport.use(new LinkedInStrategy({
    	  clientID: LINKEDIN_KEY,
    	  clientSecret: LINKEDIN_SECRET,
    	  callbackURL: "http://127.0.0.1:3000/auth/linkedin/callback"
    	  scope: ['r_emailaddress', 'r_basicprofile'],
  		}, function(accessToken, refreshToken, profile, done) {
	    	// asynchronous verification, for effect...
		    process.nextTick(function () {
		      // To keep the example simple, the user's Google profile is returned to
		      // represent the logged-in user.  In a typical application, you would want
		      // to associate the Google account with a user record in your database,
		      // and return that user instead.
		      return done(null, profile);
		    });
	  		}
		));
~~~

and then authenticate as:

~~~javascript
app.get('/auth/linkedin',
                passport.authenticate('linkedin', { state: 'SOME STATE'  }),
		  function(req, res){
		    // The request will be redirected to LinkedIn for authentication, so this
		    // function will not be called.
		  });

~~~

the login callback:

~~~javascript
app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
   successRedirect: '/',
   failureRedirect: '/login'
}));
~~~

See [this](http://developer.linkedin.com/) for details on LinkedIn API.

## License

MIT - 2013 - AUTH0
