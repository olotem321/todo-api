const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      unique:true,
      validate: {
        validator: value => validator.isEmail(value),
        message: '{VALUE} is not a valid email'
      }
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    tokens: [{
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }]
  },{
    usePushEach: true
  }
);

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id:user._id.toHexString(), access}, 'abc123');

  user.tokens.push({
    access, token
  });

  return user.save().then(() => {
    return token;
  });
};

UserSchema.statics.findByToken = function(token){
  var User = this;
  var decoded;
  try{
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });

};

UserSchema.statics.findByCredentials = function (email, password){
  var User = this;

  return User.findOne({email}).then((res) => {
    if(!res){
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, res.password, (err, result) => {
        if(result){
          resolve(res);
        }else{
          reject();
        }
      });
    });

  });

};

UserSchema.pre('save', function(next) {
  var user = this;
  if(user.isModified('password')){

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
          user.password = hash;
          next();
      });
    });

  }else{
    next();
  }
});

var User = mongoose.model('Users', UserSchema);

module.exports = {
  User
}
