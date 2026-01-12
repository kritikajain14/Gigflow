GigFlow is a modern freelancing platform where users can post gigs and freelancers can bid on them.
Users automatically act as clients or freelancers based on their actions.


# Features 
-- Secure authentication using JWT & HttpOnly cookies
-- Dynamic user roles (client ↔ freelancer)
-- Post, browse, search, and filter gigs
-- Bidding system with proposals and pricing
-- Safe hiring using MongoDB transactions
-- Real-time notifications with Socket.io
-- Fully responsive glassmorphism UI

# Tech Stack 
FRONTEND
-- React 
-- Tailwind css 
-- Socket.io client 
-- Framer motion 

BACKEND
-- Node.js, Express.js
-- MongoDb and Mongoose
-- JWT Authentication
-- Socket.io

# API Highlight

-- POST /api/auth/register – Register
-- POST /api/auth/login – Login
-- GET /api/gigs – Get gigs
-- POST /api/gigs – Create gig
-- POST /api/bids – Place bid
-- PATCH /api/bids/:bidId/hire – Hire freelancer

# How It Works
1.Sign Up / Login
Users create an account and securely log in using JWT authentication.
2.Post a Gig (Client)
Any user can post a gig with details, budget, and requirements.
3.Browse & Bid (Freelancer)
Freelancers browse gigs and submit bids with proposals and pricing.
4.Hire Freelancer
Clients review bids and hire a freelancer safely using MongoDB transactions.
5.Real-time Updates
Users receive instant notifications for bids and hiring actions via Socket.io.

#Quick start 
cd backend && npm install && nodemon server.js
cd frontend && npm install && npm run dev