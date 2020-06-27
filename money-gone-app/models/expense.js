const mongoose = require('mongoose');
const { String, ObjectId, Number } = mongoose.Schema.Types;

const cubeSchema = new mongoose.Schema({
  merchant: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  total: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 50,
  },
  report: { type: Boolean, default: false },
  user: { type: ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Expense', cubeSchema);
