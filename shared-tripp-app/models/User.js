const mongoose = require('mongoose');
const { String, Number, ObjectId } = mongoose.Schema.Types;
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  trips: [
    {
      type: ObjectId,
      ref: 'Trip',
    },
  ],
});

userSchema.methods = {
  passwordMatch: function (password) {
    return bcrypt.compare(password, this.password);
  },
};

userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(this.password, salt, (err, hash) => {
        if (err) {
          next(err);
          return;
        }
        this.password = hash;
        next();
      });
    });
  }
});

module.exports = mongoose.model('User', userSchema);
