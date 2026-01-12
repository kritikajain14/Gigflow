import express from 'express';
import { 
  createGig, 
  getGigs, 
  getMyGigs,
  getGigById
} from '../controllers/gig.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getGigs);
router.post('/', protect, createGig);
router.get('/my-gigs', protect, getMyGigs);
router.get('/:id', getGigById);

export default router;