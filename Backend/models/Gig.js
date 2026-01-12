import mongoose from 'mongoose';

const gigSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    minlength: [20, 'Description must be at least 20 characters'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  budget: {
    type: Number,
    required: [true, 'Please provide a budget'],
    min: [1, 'Budget must be at least $1']
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'assigned'],
    default: 'open'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for search functionality
gigSchema.index({ title: 'text', description: 'text' });

// Virtual for bid count
gigSchema.virtual('bidCount', {
  ref: 'Bid',
  localField: '_id',
  foreignField: 'gigId',
  count: true
});

gigSchema.set('toJSON', { virtuals: true });
gigSchema.set('toObject', { virtuals: true });

export default mongoose.model('Gig', gigSchema);