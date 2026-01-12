import mongoose from 'mongoose';
import Bid from '../models/Bid.js';
import Gig from '../models/Gig.js';

export const createBid = async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();
    
    const { gigId, message, price , deliveryTime, revisions } = req.body;
    
    // Check if gig exists and is open
    const gig = await Gig.findById(gigId).session(session);
    if (!gig) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }
    
    if (gig.status !== 'open') {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'This gig is no longer accepting bids'
      });
    }
    
    // Check if user owns the gig
    if (gig.ownerId.toString() === req.user.id) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'You cannot bid on your own gig'
      });
    }
    
    // Check for existing bid
    const existingBid = await Bid.findOne({
      gigId,
      freelancerId: req.user.id
    }).session(session);
    
    if (existingBid) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'You have already bid on this gig'
      });
    }
    
    // Create bid
    const bid = await Bid.create([{
      gigId,
      freelancerId: req.user.id,
      message,
      price,
      deliveryTime: deliveryTime || 7,
      revisions: revisions || 1
    }], { session });
    
    await session.commitTransaction();

    
// 🔔 SEND NOTIFICATION TO GIG OWNER
req.io.to(gig.ownerId.toString()).emit('notification', {
  message: `You received a new bid on "${gig.title}"`,
  gigId: gig._id,
  bidId: bid[0]._id
});
    
    res.status(201).json({
      success: true,
      bid: bid[0]
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Create bid error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already bid on this gig'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating bid'
    });
  } finally {
    session.endSession();
  }
};

export const getGigBids = async (req, res) => {
  try {
    const { gigId } = req.params;
    
    // Check if gig exists and user is owner
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }
    
    if (gig.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these bids'
      });
    }
    
    const bids = await Bid.find({ gigId })
      .populate('freelancerId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      bids
    });
  } catch (error) {
    console.error('Get gig bids error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bids'
    });
  }
};

export const hireFreelancer = async (req, res) => {
  const session = await mongoose.startSession();
  let bid;

  try {
    session.startTransaction();

    const { bidId } = req.params;

    bid = await Bid.findById(bidId)
      .populate('gigId')
      .session(session);

    if (!bid) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: 'Bid not found' });
    }

    if (bid.gigId.ownerId.toString() !== req.user.id) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: 'Not authorized to hire for this gig'
      });
    }

    if (bid.gigId.status !== 'open') {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Gig is no longer open for hiring'
      });
    }

    bid.gigId.status = 'assigned';
    await bid.gigId.save({ session });

    bid.status = 'hired';
    await bid.save({ session });

    await Bid.updateMany(
      {
        gigId: bid.gigId._id,
        _id: { $ne: bidId },
        status: 'pending'
      },
      { status: 'rejected' },
      { session }
    );

    await session.commitTransaction();

  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    console.error('Hire freelancer error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error hiring freelancer'
    });

  } finally {
    session.endSession();
  }

  // 🔥 OUTSIDE TRANSACTION

  const updatedBid = await Bid.findById(bid._id)
    .populate('freelancerId', 'name email')
    .populate('gigId');

  req.io.to(bid.freelancerId.toString()).emit('bid-hired', {
    gigTitle: bid.gigId.title,
    message: `Congratulations! You have been hired for "${bid.gigId.title}"`
  });

  res.json({
    success: true,
    bid: updatedBid,
    message: 'Freelancer hired successfully'
  });
};


export const getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ freelancerId: req.user.id })
      .populate({
        path: 'gigId',
        populate: {
          path: 'ownerId',
          select: 'name email'
        }
      })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      bids
    });
  } catch (error) {
    console.error('Get my bids error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your bids'
    });
  }
};