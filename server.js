const express = require('express');
let app = false;
process.argv.forEach(arg=>{if(arg==="-hot"){app = require('./serverHotModule').app;}});
if(!app){app = express();}
const port = 3000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('./models/user');

const url = 'mongodb://localhost:27011117';
mongoose.connect(url, {useMongoClient: true}).then( ()=>console.log('mongo connected!'),err=>console.log(err));
let db = mongoose.connection;

//cookie middleware
app.use(cookieParser());
app.use(cookieSession({
    keys: ['fucking keys']
}));

//body middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Express session
app.use(session({
    secret: 'secret',
    saveUninitialized: false,
    resave: false,
    cookie: {secure: false}
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
                if (err) return done(err);
                if (user) return done(null, user);
            });
        }
    })
}));

passport.serializeUser((user, done)=>{
    console.log('serialized!');
    done(null, user.id);
});

passport.deserializeUser((id, done)=>{
    //console.log('deserialized!');
    User.getUserById(id, (err, user)=>{
        done(err, user);
    })

});

//Endpoint, registration
app.get('/auth/facebook', passport.authenticate('facebook', {session: false}));

app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/app');
    }
);

app.use(express.static( __dirname + '/dist'));

app.get('/', (req, res)=> {
    res.sendFile(__dirname + '/dist/interface.html')
});

app.get('/trial-page', (req, res)=> {
    res.sendFile(__dirname + '/dist/interface.html')
});

app.get('/login', (req, res)=>{
    res.sendFile(__dirname + '/dist/facebook.html')
});

app.get('/app', (req, res)=>{
    res.sendFile(__dirname + '/dist/app.html');
});

app.post('/getUserInformation', (req,res)=>{
    console.log('requested');
    User.getUserById(req.user.id, (err, user)=>{
        res.send(user.facebook.name)
    })
});

app.listen(port, ()=>{
    console.log("Listening on :", port);
});

