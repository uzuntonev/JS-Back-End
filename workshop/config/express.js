const express = require('express');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const path = require('path');

module.exports = (app) => {
  app.engine(
    'hbs',
    exphbs({
      extname: 'hbs',
      allowedProtoProperties: true,
      partialsDir: path.resolve('views/partials'),
    })
  );
  app.set('view engine', 'hbs');

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(express.static(path.resolve('static')));

  app.use(cookieParser());
};
