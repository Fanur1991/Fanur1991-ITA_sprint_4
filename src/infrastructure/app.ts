import express, { Express } from 'express';
import taskRoutes from './routes/TaskRouter'
import { corsMiddleware } from './middlewares/corsMiddleware';
import { cacheControlMiddleware } from './middlewares/cacheControlMiddleware';

export const app: Express = express();

app.use(express.json());
app.use(corsMiddleware);
app.use(cacheControlMiddleware);
app.use('/api/v1', taskRoutes);
