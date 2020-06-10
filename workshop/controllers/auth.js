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
  const { username, password, repeatPassword } = req.body;
  if (password !== repeatPassword) {
    res.render('register', { errors: { message: 'Passwords don`t match!' } });
    return;
  }
  userModel
    .create({ username, password })
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
