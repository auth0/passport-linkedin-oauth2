passport-linkedin-oauth2
========================

A simple [Passport](http://passportjs.org/) strategy for LinkedIn OAuth2.

---


	passport.use(new LinkedInStrategy({
    				clientID: LINKEDIN_KEY,
    				clientSecret: LINKEDIN_SECRET,
    				callbackURL: "http://127.0.0.1:3000/auth/linkedin/callback"
  					},
				  function(accessToken, refreshToken, profile, done) {
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


	app.get('/auth/linkedin',
  			passport.authenticate('linkedin', { scope: ['r_emailaddress',
                                                        'r_basicprofile'],
                                                state: "SOME STATE"  }),
			  function(req, res){
			    // The request will be redirected to LinkedIn for authentication, so this
			    // function will not be called.
			  });

---

See [this](http://developer.linkedin.com/) for details on LinkedIn API.