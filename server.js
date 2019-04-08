const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
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
passport.use(new LocalStrategy((username, password, done)=>{
    User.getUserByUsername(username, (err, user)=>{
        if(err) throw err;
        if(!user){
            return done(null, false, {message: "User not found!"});
        }
        User.comparePassword(password, user.password, (err, isMatch)=>{
            if(err) throw err;
            if(isMatch){
                return done(null, user);
            }
            else{
                return done(null, false, {message: "Wrong password!"});
            }
        })
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
app.post('/register', (req, res)=>{
    console.log(req.body);
    let password = req.body.password;
    let password2 = req.body.password2;

    if(password === password2) {
        let newUser = new User({
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        });
        User.createUser(newUser, (err, user) => {
            if (err) throw err;
            //db.insertOne(user);
            res.send({user: user, code: 12}).end();
        });
    }
    else{
        res.status(500).send("{errors: \"Passwords don't match\")").end();
    }
});

app.post('/login', passport.authenticate('local'), (req, res)=>{
    res.send(req.user);
});

app.get('/user', (req, res)=>{
    res.send(req.user);
});

app.get('logout', (req, res)=>{
    req.logout();
    res.send(null);
});

app.use(express.static( __dirname + '/dist'));

app.get('/', (req, res)=> {
    res.sendFile(__dirname + '/dist/interface.html')
});

app.post('/console', passport.authenticate('local'), (req, res)=>{
    res.send(req.user);
});

app.get('/app', (req, res)=>{
    res.sendFile(__dirname + '/dist/interface.html');
});

app.listen(port, ()=>{
    console.log("Listening on :", port);
});

