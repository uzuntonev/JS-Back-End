const app = require('express')();
const { port } = require('./config/config');
const dbConnection = require('./config/db');

dbConnection()
  .then(() => {
    require('./config/express')(app);
    require('./config/routes')(app);

    app.use(function (err, req, res, next) {
      console.error(err.stack);
      res.status(500).send('Something went wrong!');
    });
	console.log('DB is set up and running!')
    require('./utils/clearBlackList')();
    app.listen(
      port,
      console.log(`Listening on port ${port}! Now its up to you...`)
    );
  })
  .catch((err) => console.error(err));
