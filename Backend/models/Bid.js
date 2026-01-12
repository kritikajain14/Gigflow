import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
  gigId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
    required: true
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: [true, 'Please provide a message'],
    minlength: [10, 'Message must be at least 10 characters'],
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide your bid price'],
    min: [1, 'Bid price must be at least $1']
  },
  status: {
    type: String,
    enum: ['pending', 'hired', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to prevent duplicate bids
bidSchema.index({ gigId: 1, freelancerId: 1 }, { unique: true });

export default mongoose.model('Bid', bidSchema);