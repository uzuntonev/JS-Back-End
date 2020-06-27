const { userModel, tokenBlackListModel } = require('../models');
const utils = require('../utils/jwt');
const config = require('../config/config');

function login(req, res) {
  res.render('login');
}

function loginPost(req, res, next) {
  const { email, password } = req.body;
  userModel
    .findOne({ email })
    .then((user) => {
      return Promise.all([user, user ? user.passwordMatch(password) : null]);
    })
    .then(([user, match]) => {
      if (!user || !match) {
        req.flash('error_msg', 'Password or email don`t match');
        res.render('login', {
          errors: { message: 'Password or email don`t match' },
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
  const { email, password, rePassword} = req.body;

  if (!email.match(/[A-Za-z0-9@._-]/g)) {
    res.render('register', { errors: { message: 'Email should be at least 4 characters' } });
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


  userModel
    .create({ email, password })
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
