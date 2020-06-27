const { userModel, tokenBlackListModel } = require('../models');
const utils = require('../utils/jwt');
const config = require('../config/config');

function login(req, res) {
  res.render('login');
}

function loginPost(req, res, next) {
  const { username, password } = req.body;
  userModel
    .findOne({ username })
    .then((user) => {
      return Promise.all([user, user ? user.passwordMatch(password) : null]);
    })
    .then(([user, match]) => {
      if (!user || !match) {
        req.flash('error_msg', 'Password or username don`t match');
        res.render('login', {
          errors: { message: 'Password or username don`t match' },
        });
        return;
      }
      const token = utils.createToke({ id: user._id });
      req.flash('success_msg', 'You are log in successfully');
      res.cookie(config.cookieName, token).redirect('/');
    }).catch(next);
}

function register(req, res) {
  res.render('register');
}

function registerPost(req, res, next) {
  const { username, password, rePassword, amount} = req.body;
  if (username.length < 4 || !username.match(/[A-Za-z0-9]/g)) {
    res.render('register', { errors: { message: 'Username should be at least 4 characters' } });
    return;
  }
  if (password.length < 4) {
    res.render('register', { errors: { message: 'Password should be at least 8 characters' } });
    return;
  }
  if (password !== rePassword) {
    res.render('register', { errors: { message: 'Passwords don`t match!' } });
    return;
  }
  if (amount < 0) {
    res.render('register', { errors: { message: 'Amount should be positive number' } });
    return;
  }
  

  userModel
    .create({ username, password, amount })
    .then(() => {
      req.flash('success_msg', 'You are register successfully');
      res.redirect('login');
    })
    .catch((err) => {
      if ((err.name === 'MongoError' && err.code === 11000)) {
        res.render('register', {
          errors: { message: 'User already taken!' },
        });
        return;
      }
      next(err);
    });
}

function logout(req, res, next) {
  const token = req.cookies[config.cookieName];
  tokenBlackListModel.create({ token }).then(() => {
    req.flash('success_msg', 'You are logged out');
    res.clearCookie(config.cookieName).redirect('/');
  }).catch(next);;
}

module.exports = {
  login,
  loginPost,
  register,
  registerPost,
  logout,
};
