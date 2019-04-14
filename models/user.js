const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
});

let User = module.exports = mongoose.model('User', UserSchema);

/*module.exports.createUser = function(newUser){
    console.log('creating new user?');
    if(newUser.password){
        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(newUser.password, salt, function(err, hash){
                newUser.password = hash;
            })
        })
    }
};*/

module.exports.getUserByUsername = function(username, callback){
    let query = {username: username};
    User.findOne(query, callback);
};

module.exports.findByFacebookId = function(facebookId, callback){
    console.log('looking for user?')
    User.findOne({'facebook.id': facebookId}, callback);
};

module.exports.getUserById = function(id, callback){
    User.findOne({_id: id}, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, (err, isMatch)=>{
        if(err) throw err;
        callback(null, isMatch);
    })
};

