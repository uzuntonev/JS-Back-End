const { index, notFound } = require('../controllers/play');
const auth = require('../middlewares/auth');

module.exports = (app) => {
  app.get('/', auth(false), index);

  app.use(auth(false), require('../routes/user'));
  app.use(require('../routes/play'));

  app.get('*', notFound);
};
