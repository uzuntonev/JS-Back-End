const app = require('express')();
const { port } = require('./config/config');
const dbConnection = require('./config/db');

dbConnection()
  .then(() => {
    require('./config/express')(app);
    require('./config/routes')(app);
    require('./config/errorHandler')(app);
    require('./utils/clearBlackList')()
    app.listen(
      port,
      console.log(`Listening on port ${port}! Now its up to you...`)
    );
  })
  .catch((err) => console.error(err));






  // const { MongoClient } = require('mongodb');
// const client = new MongoClient('mongodb://localhost:27017');
// client.connect(function (err, client) {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   const db = client.db('exam');
//   const collection = db.collection('users');

//  collection.findOne().then(x => console.log(x));
// });

