const mongoose = require('mongoose');
const { String, Number, ObjectId } = mongoose.Schema.Types;
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  expenses: [
    {
      type: ObjectId,
      ref: 'Expense',
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
