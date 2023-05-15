const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const taskSchema = new mongoose.Schema({
  taskname: {
     type: String,
     required: true,
     unique: true
     },

  description: { 
    type: String, 
    required: true,
    unique: true
     },

  userId: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },

  dueDate: {
     type: Date,
     required: true,
     unique: true
    },

  priorityLevel: { 
    type: Number, 
    required: true
    },

  category: {
        type: String,
        required: true
    },

},{ timestamps: true });

module.exports = mongoose.model('Task', taskSchema);