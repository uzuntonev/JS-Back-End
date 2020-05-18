const mongoose = require('mongoose');
const { String, ObjectId } = mongoose.Schema.Types;

const cubeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 200,
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: (v) => v.startsWith('http'),
      message: 'imageUrl must be valid link',
    },
  },
  difficultyLevel: {
    type: String,
    required: true,
  },
  accessories: [{ type: ObjectId, ref: 'Accessory' }],
  creatorId: { type: ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Cube', cubeSchema);
