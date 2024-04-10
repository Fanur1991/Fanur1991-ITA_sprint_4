import { Request, Response, NextFunction } from 'express';

export const cacheControlMiddleware = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  res.setHeader('Cache-Control', 'no-cache'); //browsers or clients cannot cache the response
  next();
};
