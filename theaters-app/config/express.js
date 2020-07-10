const express = require('express');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');

module.exports = (app) => {
  // View Engine setup
  app.engine(
    'hbs',
    exphbs({
      extname: 'hbs',
      allowedProtoProperties: true,
      partialsDir: path.resolve('views/partials'),
    })
  );
  app.set('view engine', 'hbs');

  // Express session setup
  app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true,
    })
  );

  // Connect flash
  app.use(flash());

  // Global variables
  app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
  });

  // Body parser setup
  app.use(express.urlencoded({ extended: false }));

  // Static files setup
  app.use(express.static(path.resolve('static')));

  //Cookie Parser setup
  app.use(cookieParser());
};
