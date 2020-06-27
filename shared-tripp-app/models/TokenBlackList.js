const mongoose = require('mongoose');
const { String } = mongoose.Schema.Types;

const tokenBlackList = new mongoose.Schema({
  token: String,
});

module.exports = mongoose.model('tokenBlackList', tokenBlackList);
