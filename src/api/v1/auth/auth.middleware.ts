import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { JwtPayload } from "./auth.types";

export const authMiddleware = (request: Request, response: Response, next: NextFunction) => {
  if (request.method === "OPTIONS") {
      next();
  }

  try {
      const token = request.headers.authorization?.split(' ')[1];

      if (!token) {
          return response.status(403).json({ message: 'Access denied.' });
      }

      next();
  } catch (error) {
      console.log(error)

      return response.status(403).json({ message: 'Access denied.' })
  }
};

export const permissionsMiddlewareCreator = (permissions: number) => {
  return (request: Request, response: Response, next: NextFunction) => {
    if (request.method === "OPTIONS") {
      next();
    }

    try {
      const token = request.headers.authorization?.split(' ')[1] as string;
      const { permissions: userPermissions } = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
      const hasPermissions = permissions & userPermissions;

      if (!hasPermissions) {
        return response.status(403).json({ message: 'Access denied' })
      }

      next();
  } catch (error) {
      console.log(error);

      return response.status(500).json({ message: 'Error while authorization.' });
  }
  };
}