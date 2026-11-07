import express from 'express';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './src/config/config.js';
import { connectDB } from './src/config/db.js';
import { errorHandler } from './src/middlewares/errorHandler.middleware.js';

// Route imports
import authRoutes from './src/routes/auth.routes.js';
import patientRoutes from './src/routes/patient.routes.js';
import appointmentRoutes from './src/routes/appointment.routes.js';
import conversationRoutes from './src/routes/conversation.routes.js';
import billingRoutes from './src/routes/billing.routes.js';
import tenantRoutes from './src/routes/tenant.routes.js';
import webhookRoutes from './src/routes/webhook.routes.js';

const app = express();
const server = http.createServer(app);

// Socket.io for real-time inbox & calendar sync
const io = new SocketServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Attach socket.io to request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Global middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Dental Patient Re-Activation & Hygiene Booking Agent SaaS API',
    pricing: {
      flatBaseMonthlyFee: 600,
      confirmedChairCommission: 20
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/webhooks', webhookRoutes);

// Centralized error handler
app.use(errorHandler);

// Socket.io connection handling
io.on('connection', (socket) => {
  socket.on('join_practice', (practiceId) => {
    socket.join(`practice_${practiceId}`);
    console.log(`[Socket] Client joined practice channel: practice_${practiceId}`);
  });
});

// Start Server
const startServer = async () => {
  await connectDB();
  server.listen(config.port, () => {
    console.log(`🚀 Dental SaaS Backend running at http://localhost:${config.port}`);
    console.log(`💳 Monetization Model: $${config.pricing.baseMonthlyFee}/mo base + $${config.pricing.perChairCommissionFee}/chair commission`);
  });
};

startServer();

export { app, io };