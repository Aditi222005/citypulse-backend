const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['roads', 'water', 'electricity', 'sanitation', 'garbage'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'emergency'],
    default: 'medium',
  },
  media: [ // An array to store multiple image/video URLs
    {
      type: String, 
    },
  ],
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // This links the issue to a user
  },
  contactName: {
    type: String,
    trim: true,
  },
  contactPhone: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['reported', 'in_progress', 'resolved'],
    default: 'reported',
  },
}, { timestamps: true });

const Issue = mongoose.model('Issue', issueSchema);
module.exports = Issue;