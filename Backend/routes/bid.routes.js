import express from 'express';
import { 
  createBid, 
  getGigBids, 
  hireFreelancer, 
  getMyBids 
} from '../controllers/bid.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, createBid);
router.get('/my-bids', protect, getMyBids);
router.get('/:gigId', protect, getGigBids);
router.patch('/:bidId/hire', protect, hireFreelancer);

export default router;