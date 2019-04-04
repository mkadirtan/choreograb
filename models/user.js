const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let userSchema = mongoose.Schema({
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
    }
});

let User = module.exports = mongoose.model('User', userSchema);

module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser.password, salt, function(err, hash){
            newUser.password = hash;
            newUser.save(callback);
        })
    })
};

module.exports.getUserByUsername = function(username, callback){
    let query = {username: username};
    User.findOne(query, callback);
};

module.exports.getUserById = function(id, callback){
    User.findOne(id, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, (err, isMatch)=>{
        if(err) throw err;
        callback(null, isMatch);
    })
};

