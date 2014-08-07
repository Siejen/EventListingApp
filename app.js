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

app.get('/', function(req, res){
	// find all the posts in the database
	// in the future, when that is complete, invoke the callback function
	// pass 2 parameters to or through the callback function: err and posts
	// err would indicate an error had occured
	// posts is an array of individual posts each of which represents a row in the posts table
	db.post.findAll()					// run a query   // .findAll will always return an array   //  .find would return an object
	.complete(function(err, posts) {	// when the query completes, invoke the callback function using the data returned from the query and being passed as an array in posts
		var info = {
			posts: posts
		};
		res.render('main-unauthenticated', info);
	});
});

app.get('/signup', function(req, res){
	console.log('get/signup page');
	res.render('user-signup');
});

app.post('/signup', function(req, res){
	console.log( req.body );
	var postInfo = {
		// keys: model.js
		// values: from the form (req.body.name-of-field)
		organizationName: req.body.organizationName,
		username: req.body.username,
		passwordHash: req.body.passwordHash,
		organizationURL: req.body.organizationURL,
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		email: req.body.email
	};
	db.user.create(req.body);
	res.redirect('logon');
});

app.get('/logon', function(req, res){
	console.log('get/logon page');
	res.render('user-logon');
});

app.post('/logon', function(req, res){
	res.redirect('profile');
});

app.get('/profile', function(req, res){
	db.user.find({ where: {id: 1}}).complete(function(err, user) {
		db.post.findAll().complete(function(err, posts) {
			var email = "siejenyin@gmail.com";
			var trimmedEmail = email.trim();
			var lctEmail = trimmedEmail.toLowerCase();
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
		userId: 1
	};
	db.post.create( postInfo )
	.success(function(post){
		// req.user.addPost(post);
		res.redirect('/');
	});
});

// app.get('/student/submitfist/:id', function(req,res){
// 	if(req.isAuthenticated() && req.user.dataValues.isStudent ){
// 		db.student.find({ where: {id: req.user.id }}).complete(function(err, student) {
// 			var info = {
// 				student:  student,
// 				surveyId: req.params.id
// 			};
// 			res.render('student/student-response', info);
// 		});
// 	}
// 	else {
// 		res.redirect('/');	
// 	}	
// });

// app.post('/student/submitfist', function(req,res){
// 	if(req.isAuthenticated() && req.user.dataValues.isStudent ){	
// 		console.log(req.body);
// 		var fistInfo = {
// 			ranking: req.body.ranking,
// 			comment: req.body.comment,
// 			surveyId: req.body.surveyId,
// 			studentId: req.user.id
// 		};
// 		db.fist.create( fistInfo )
// 		.success(function(fist){
// 			req.user.addFist(fist);
// 			res.redirect('view');
// 		});

// 	}
// 	else {
// 		res.redirect('/');	
// 	}	
// });



app.listen(3000, function(){
  console.log("LISTENING ON PORT 3000");
});