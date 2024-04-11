import express, { Express, NextFunction, Request, Response } from 'express';
import expressBasicAuth from 'express-basic-auth';
import taskRoutes from './routes/TaskRouter';
import cors from 'cors';

export const app: Express = express();

app.use(express.json());

app.use((_req: Request, res: Response, next: NextFunction) => {
  res.header('Cache-Control', 'no-cache');
  next();
});

const corsOptions = {
  origin: '*',
  methods: 'GET, POST, PUT, DELETE, OPTIONS',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
};

app.use(cors(corsOptions));

app.use(
  expressBasicAuth({
    users: { user: '12345' },
    unauthorizedResponse: 'Unauthorized',
  })
);
app.use('/api/v1', taskRoutes);
