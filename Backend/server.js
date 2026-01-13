import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import gigRoutes from './routes/gig.routes.js';
import bidRoutes from './routes/bid.routes.js';
import { setupSocket } from './socket/socket.js';

dotenv.config({ path: './config/config.env' });

const app = express();
app.set('trust proxy', 1);

const httpServer = createServer(app);

// Allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

// CORS config
const corsOptions = {
  origin: function (origin, callback) {
    console.log('Incoming request from origin:', origin) // debug
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

// Socket.IO
const io = new Server(httpServer, {
  cors: corsOptions
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/bids', bidRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'GigFlow API is running' });
});

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Socket setup
setupSocket(io);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
