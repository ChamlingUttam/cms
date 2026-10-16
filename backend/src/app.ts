import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import adminAuthRouter from './routes/adminAuth';

const app = express();

app.use(express.json());
app.use('/api/admin', adminAuthRouter);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
