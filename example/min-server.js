var express = require('express')
  , passport = require('passport')
  , LinkedinStrategy = require('../lib').Strategy;

// API Access link for creating client ID and secret:
// https://www.linkedin.com/secure/developer
var LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
var LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
var CALLBACK_URL = process.env.CALLBACK_URL || 'http://localhost:3000/auth/linkedin/callback';

// Use the LinkedinStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Linkedin
//   profile), and invoke a callback with a user object.
passport.use(new LinkedinStrategy({
    clientID:     LINKEDIN_CLIENT_ID,
    clientSecret: LINKEDIN_CLIENT_SECRET,
    callbackURL:  CALLBACK_URL,
    scope:        ['r_liteprofile', 'r_emailaddress']
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      // To keep the example simple, the user's Linkedin profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Linkedin account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

var app = express();

// configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.logger());
app.use(express.cookieParser());
app.use(express.urlencoded());
app.use(express.json());
app.use(app.router);
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

// GET /auth/linkedin
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Linkedin authentication will involve
//   redirecting the user to linkedin.com.  After authorization, Linkedin
//   will redirect the user back to this application at /auth/linkedin/callback
app.get('/auth/linkedin',
  passport.authenticate('linkedin', { session: false }),
  function(req, res){
    // The request will be redirected to Linkedin for authentication, so this
    // function will not be called.
  });

// GET /auth/linkedin/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/linkedin/callback',
  passport.authenticate('linkedin', { session: false, failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

var http = require('http');

http.createServer(app).listen(3000);

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}
