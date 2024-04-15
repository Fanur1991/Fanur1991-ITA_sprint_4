// Import necessary modules.
import express, { Express, NextFunction, Request, Response } from 'express';
import expressBasicAuth from 'express-basic-auth'; // Module for basic authentication.
import taskRoutes from '../routes/TaskRouter'; // Import routes for task management.
import cors from 'cors'; // Module to enable CORS.

export const app: Express = express(); // Create an Express application.

app.use(express.json()); // Enable Express to parse JSON bodies.

// Middleware to disable caching by setting Cache-Control header.
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.header('Cache-Control', 'no-cache');
  next(); // Pass control to the next middleware function.
});

// Define options for CORS middleware.
const corsOptions = {
  origin: '*', // Allow all origins.
  methods: 'GET, POST, PUT, DELETE, OPTIONS', // Allowed methods.
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept', // Allowed headers.
};

app.use(cors(corsOptions)); // Apply CORS middleware with the defined options.

// Apply basic authentication middleware.
app.use(
  expressBasicAuth({
    users: { user: '12345' }, // Define users and their passwords.
    unauthorizedResponse: 'Unauthorized', // Custom message for unauthorized access.
  })
);
app.use('/api', taskRoutes); // Mount task management routes at the '/api' base path.
