import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import jobOrderRouter from './routes/jobOrderRoutes.js';
import aiRouter from './routes/aiAssistantRoutes.js';
import settingsRouter from './routes/settingsRoutes.js';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174'
]

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

connectDB();

const port = process.env.PORT || 2709;

// API endpoints
app.get('/', (req, res) => { res.send('API connected.'); });
app.use('/api/joborder', jobOrderRouter);
app.use('/api/ai', aiRouter);
app.use('/api/settings', settingsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});