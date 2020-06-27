const cron = require('node-cron');
const { tokenBlackListModel } = require('../models');

module.exports = () => {
  return cron.schedule('* * 10 * *', () => {
    tokenBlackListModel.deleteMany().then(data => {
        console.log(data);
        console.log('Token black list was clear!');
    })
  });
};
