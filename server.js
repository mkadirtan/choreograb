const express = require('express');
const app = expressgit();
const port = 3000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const path = require('path');


const url = 'mongodb://localhost:27017';
mongoose.connect(url, {useMongoClient: true});
let db = mongoose.connection;

//bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

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
    done(null, user.id);
});

passport.deserializeUser((id, done)=>{
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
            res.send(user).end();
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

app.use('/dist', express.static( __dirname + '/dist'));
app.use('/interface', express.static(__dirname + '/interface'));

app.get('/', (req, res)=> {
    console.log('asd');
    res.sendFile(__dirname + '/interface/index.html')
});

app.listen(port, ()=>{
    console.log("Listening on :", port);
});

