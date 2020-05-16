const mongoose = require('mongoose')
const { String, ObjectId } = mongoose.Schema.Types;

const accessorySchema = new mongoose.Schema({
name:{
    type: String,
    required: true,
},
description: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 200,
  },
  imageUrl:{
    type: String,
    required: true,
    validate: {
      validator: (v) => v.startsWith('http'),
      message: 'imageUrl must be valid link'
    }
  },
  cubes: [{ type: ObjectId, ref: 'Cube' }]

})

module.exports = mongoose.model('Accessory', accessorySchema)