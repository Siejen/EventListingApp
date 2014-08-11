// app.js defines the server logic - how the server responds to the requests

// 1. Start with a basic simple app.js template
// 2. Setup localhost:3000
// 3. Run nodemon to ensure that the app loads on localhost

var bcrypt = require('bcrypt');
var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var passportLocal = require('passport-local');
var LocalStrategy = passportLocal.Strategy;
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var flash = require('connect-flash');
var md5 = require('MD5');
var request = require('request');
var db = require('./models/index.js');
// var methodOvrride = require('method-override');

var app = express();

app.set('view engine', 'ejs');

// app.use(methodOvrride());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
	secret: 'thisismysecretcookie',
	name: 'cookie created by Siejen',
	maxage: 360000 // in milliseconds
}));

app.use( flash() );
app.use( passport.initialize() );
app.use( passport.session() );
	
app.use(express.static(__dirname + '/public'));

// logging
app.use(function(req, res, next){
  console.log(req.method, req.url);
  next();
});

passport.use('user-local', new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, username, password, done){
		// Load hash from your password DB.
		console.log( 'authenticating with user-local:' );
		console.log( '... username: ' + username );
		console.log( '... password: ' + password );

		db.user.find({ where: { username: username }})			
		// 1st username is the key coming from the model file
		// 2nd username is value coming from the form
		.done(function(error,user) {
			if(error){
				console.log(error);
				return done(error, req.flash('loginMessage', 'Oops! Something went wrong.'));
			}
			if(user === null) {
				console.log("... username not found in database");
				return done(null, false, req.flash('loginMessage', 'Username does not exist.'));
			}
			// compareSync is a method in bcrypt
			if(!bcrypt.compareSync(password, user.passwordHash)) {		// "password" comes from the form in clear text and "user.passwordHash" is the hashed password stored in the DB.  Bcrypt hashes the clear text password and compares it against the hashed one store in database.
				console.log("--------------------------------");
				console.log(password);
				console.log(user.passwordHash);
				console.log("--------------------------------");
				//'user.passwordHash' is from the database & 'password' is submitted through the client browser
				return done(null, false, req.flash('loginMessage', 'Invalid Password'));
			}
			// no errors and password match!  This sets up the session.
			done(null, user);		// null ~ no error
		});
}));

passport.serializeUser(function(user, done) {
	console.log("SERIALIZED JUST RAN!");
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	console.log("DESERIALIZATION JUST RAN!");
	// In line 87, the 1st id is the key (and the name of the column in the DB)
	// & 2nd id is the id (sitting in the server) paired with the cookie			
	db.user.find( {where: { id: id }} ).
	done(function(err, user) {
		done(err,user);
	});
});

app.get('/', function(req, res){
	// find all the posts in the database
	// in the future, when that is complete, invoke the callback function
	// pass 2 parameters to or through the callback function: err and posts
	// err would indicate an error had occured
	// posts is an array of individual posts each of which represents a row in the posts table
	db.post.findAll( { include: [db.user]} )		// run a query   // .findAll will always return an array   //  .find would return an object
	.complete(function(err, posts) {	// when the query completes, invoke the callback function using the data returned from the query and being passed as an array in posts
		var info = {
			// 1st posts is key and hoe that template talks to that value, and the 2nd posts is the parameter passed through 
			posts: posts
		};
		if (req.isAuthenticated()) {
			res.render('main-authenticated', info);			
		}
		else {
			res.render('main-unauthenticated', info);			
		}
	});
});

app.get('/signup', function(req, res){
	console.log('get/signup page');
	res.render('user-signup');
});

app.post('/signup', function(req, res){
	console.log( req.body );
	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(req.body.password, salt);	// salting the password, hashing the "password" (user inputted into the form during signup process) and storing it in the variable hash
	var newUserInfo = {
		// keys: model.js
		// values: from the form (req.body.name-of-field)
		organizationName: req.body.organizationName,
		username: req.body.username,
		passwordHash: hash,									// passwordHash will be the result of bcrypt.hashSync
		organizationURL: req.body.organizationURL,
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		email: req.body.email,
		//userId: 1
	};
	// db.user.create(postInfo);
	// res.redirect('/logon');
	db.user.create(newUserInfo)
	.complete(function(err, user) {
		req.login(user, function(err){
			res.redirect('/profile');
		});
	});
});

app.get('/logon', function(req, res){
	console.log('get/logon page');
	res.render('user-logon');
});

app.post('/logon', passport.authenticate('user-local', {
	successRedirect: '/profile',
    failureRedirect: '/logon',
    failureFlash: true 
}));

app.get('/profile', function(req, res){
	if (req.isAuthenticated()) {
		db.user.find({ where: {id: req.user.id}}).complete(function(err, user) {
			db.post.findAll().complete(function(err, posts) {
				var email = req.user.email;
				var trimmedEmail = email.trim();
				var lctEmail = trimmedE
				mail.toLowerCase();
				var hash = md5(lctEmail);
				var URL = "http://www.gravatar.com/avatar/" + hash + "?s=150";
				console.log(URL);
				var info = { 
					user: user, 
					posts: posts, 
					imgurl: URL
				};
				res.render('user-profile', info);
			});
		});
	}
	else {
		res.redirect('/');
	} 
});

app.post('/addevent', function(req, res){
	console.log(req.body);
	var postInfo = {
		eventName: req.body.eventName,
		eventLocation: req.body.eventLocation,
		eventCityAndState: req.body.eventCityAndState,
		eventDate: req.body.eventDate,
		eventTime: req.body.eventTime,
		eventCost: req.body.eventCost,
		eventURL: req.body.eventURL,
		userId: req.user.id
	};
	db.post.create( postInfo )
	.success(function(post){
		// req.user.addPost(post);
		res.redirect('/');
	});
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// app.get('*', function(req,res){
//   res.status(404);
//   res.render('404');
// });

app.listen(process.env.PORT || 3000, function(){
  console.log("LISTENING ON PORT 3000");
});