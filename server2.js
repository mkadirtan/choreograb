const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('./models/user');
const path = require('path');


const url = 'mongodb://localhost:27017';
mongoose.connect(url, {useMongoClient: true}).then( ()=>console.log('mongo connected!'),err=>console.log(err));
let db = mongoose.connection;

//bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(cookieSession({
    maxAge: 2*60*60*1000, //2 hours * 60 mins * 60 seconds * 1000 milis
    keys: ['my secret key'],
}));

//Express session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

//Passport init
app.use(passport.initialize());
app.use(passport.session());

//
passport.use(new FacebookStrategy({
    clientID: '2282187148687532',
    clientSecret: '12fa25841331f652b503b755a8958597',
    callbackURL: "http://localhost:3000/auth/facebook/callback"
}, function (accessToken, refreshToken, profile, done){
    console.log(profile);
    User.findByFacebookId(profile.id, function(err, user){
        console.log('user is found!', user, 'user is found!');
        if (err) return done(err);
        if (user) return done(null, user);
        if (!user) {
            User.create({facebook: {
                    id: profile.id,
                    token: accessToken,
                    name: profile.displayName
                }}, function(err, user){
            });
        }
    })
}));

passport.serializeUser((user, done)=>{
    console.log('serialized!');
    done(null, user.id);
});

passport.deserializeUser((id, done)=>{
    console.log('deserialized!');
    User.getUserById(id, (err, user)=>{
        done(err, user)
    })
});

//Endpoint, registration
app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        console.log(req.user);
        console.log('user authenticated!');
        res.redirect('/app');
    }
);

app.use(express.static( __dirname + '/dist'));

app.get('/', (req, res)=> {
    res.sendFile(__dirname + '/dist/interface.html')
});

app.get('/login', (req, res)=>{
    res.sendFile(__dirname + '/dist/facebook.html')
});

app.get('/app', (req, res)=>{
    res.sendFile(__dirname + '/dist/app.html');
});

app.listen(port, ()=>{
    console.log("Listening on :", port);
});

