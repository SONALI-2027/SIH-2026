import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { Server as SocketIOServer } from 'socket.io';
import healthRouter from './routes/health';
import reportsRouter from './routes/reports';
import incidentsRouter from './routes/incidents';
import allocationsRouter from './routes/allocations';
import resourcesRouter from './routes/resources';
import { setupSocket } from './socket';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: '*' },
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Store io in app locals
app.set('io', io);

// Routes
app.use('/api/health', healthRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/incidents', incidentsRouter);
app.use('/api/allocations', allocationsRouter);
app.use('/api/resources', resourcesRouter);

setupSocket(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('🔌 Socket.IO attached');
});