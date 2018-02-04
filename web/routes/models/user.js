var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String
    }

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    // return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    return password;
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    // return bcrypt.compareSync(password, this.local.password);
    if (password === this.local.password) {
      return true;
    }
    return false;
};

// create the model for users and expose it to our app
module.exports = { model: mongoose.model('UserInfo', userSchema), schema: userSchema }
