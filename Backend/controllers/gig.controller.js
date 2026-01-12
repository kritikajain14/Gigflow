import mongoose from 'mongoose';
import Gig from '../models/Gig.js';

export const createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;
    
    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user.id
    });

    res.status(201).json({
      success: true,
      gig
    });
  } catch (error) {
    console.error('Create gig error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating gig'
    });
  }
};

export const getGigs = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    
    let query = { status: 'open' };
    
    // Add search functionality
    if (search) {
      query.$text = { $search: search };
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const gigs = await Gig.find(query)
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await Gig.countDocuments(query);
    
    res.json({
      success: true,
      gigs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get gigs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching gigs'
    });
  }
};

export const getMyGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ ownerId: req.user.id })
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      gigs
    });
  } catch (error) {
    console.error('Get my gigs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your gigs'
    });
  }
};

export const getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate('ownerId', 'name email') // adjust field if needed

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      })
    }

    res.status(200).json({
      success: true,
      gig
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching gig'
    })
  }
}
